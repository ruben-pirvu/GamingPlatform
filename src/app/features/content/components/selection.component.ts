import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GAME_CONTENT_SOURCE, Game } from '../services/game-content.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css',
})
export class SelectionComponent {
  private readonly contentSource = inject(GAME_CONTENT_SOURCE);
  protected readonly games = signal<readonly Game[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly selectedGameId = signal<string | null>(null);
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
    this.selectedGameId.set(gameId);
  }
}
