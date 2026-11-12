import { Component, computed, inject, signal } from '@angular/core';
import { GameContentService } from '../services/game-content.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css',
})
export class SelectionComponent {
  protected readonly games = inject(GameContentService).getAvailableGames();
  protected readonly selectedGameId = signal<string | null>(null);
  protected readonly selectedGame = computed(
    () => this.games.find((game) => game.id === this.selectedGameId()) ?? null,
  );

  protected selectGame(gameId: string): void {
    this.selectedGameId.set(gameId);
  }
}
