import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { GAME_CONTENT_SOURCE, Game } from '../services/game-content.service';
import { ContentLaunchComponent } from '../../launch/components/content-launch.component';
import { AgeCheckState } from './age-check-status.component';
import { GameSelectionModalComponent } from './game-selection-modal.component';

@Component({
  imports: [ContentLaunchComponent, GameSelectionModalComponent],
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css',
})
export class SelectionComponent {
  private readonly contentSource = inject(GAME_CONTENT_SOURCE);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly games = signal<readonly Game[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly selectedGameId = signal<string | null>(null);
  protected readonly preflightState = signal<AgeCheckState | null>(null);
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
    if (this.preflightState() !== null) {
      return;
    }

    this.selectedGameId.set(gameId);
  }

  protected closeGameModal(): void {
    if (this.preflightState() === null) {
      this.selectedGameId.set(null);
    }
  }

  protected checkAgeAndLaunch(): void {
    const game = this.selectedGame();
    if (!game || this.preflightState() !== null) {
      return;
    }

    this.preflightState.set('checking');
    timer(700)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const user = this.authService.currentUser();
        if (user?.isEligibleToPlay && user.isOfLegalAge) {
          this.preflightState.set('ready');
          timer(900)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.isLaunching.set(true));
          return;
        }

        this.preflightState.set('denied');
        timer(500)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.selectedGameId.set(null);
            this.preflightState.set(null);
          });
      });
  }
}
