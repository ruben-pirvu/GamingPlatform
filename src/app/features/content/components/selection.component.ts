import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { GAME_CONTENT_SOURCE, Game } from '../services/game-content.service';
import { ContentLaunchComponent } from '../../launch/components/content-launch.component';
import { LaunchService } from '../../launch/services/launch.service';
import { EligibilityCheckState } from './eligibility-check-status.component';
import { GameSelectionModalComponent } from './game-selection-modal.component';

@Component({
  imports: [ContentLaunchComponent, GameSelectionModalComponent],
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css',
})
export class SelectionComponent {
  private readonly contentSource = inject(GAME_CONTENT_SOURCE);
  private readonly launchService = inject(LaunchService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly games = signal<readonly Game[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly selectedGameId = signal<string | null>(null);
  protected readonly eligibilityCheckState = signal<EligibilityCheckState | null>(null);
  protected readonly eligibilityCheckMessage = signal<string | null>(null);
  protected readonly isLaunching = signal(false);
  protected readonly selectedGame = computed(
    () => this.games().find((game) => game.id === this.selectedGameId()) ?? null,
  );

  constructor() {
    this.contentSource
      .getAvailableGames()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (games) => {
          this.games.set(games);
          this.isLoading.set(false);
        },
        error: () => {
          this.loadError.set('Games could not be loaded. Please try again later.');
          this.isLoading.set(false);
        },
      });
  }

  protected selectGame(gameId: string): void {
    if (this.eligibilityCheckState() !== null) {
      return;
    }

    this.selectedGameId.set(gameId);
    this.eligibilityCheckMessage.set(null);
  }

  protected closeGameModal(): void {
    if (this.eligibilityCheckState() === null) {
      this.selectedGameId.set(null);
    }
  }

  protected checkEligibility(): void {
    const game = this.selectedGame();
    if (!game || this.eligibilityCheckState() !== null) {
      return;
    }

    this.eligibilityCheckState.set('checking');
    this.launchService
      .checkEligibility(game.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!response.isEligible) {
            this.denyEligibilityCheck(response.message);
            return;
          }

          this.eligibilityCheckState.set('ready');
          timer(900)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.isLaunching.set(true));
        },
        error: () => this.denyEligibilityCheck('Unable to verify eligibility right now.'),
      });
  }

  private denyEligibilityCheck(message: string): void {
    this.eligibilityCheckMessage.set(message);
    this.eligibilityCheckState.set('denied');
    timer(1500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.selectedGameId.set(null);
        this.eligibilityCheckState.set(null);
        this.eligibilityCheckMessage.set(null);
      });
  }
}
