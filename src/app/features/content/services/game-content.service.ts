import { InjectionToken, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

export interface Game {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
}

export interface GameContentSource {
  getAvailableGames(): Observable<readonly Game[]>;
  getGameById(id: string): Observable<Game | undefined>;
}

export const GAME_CONTENT_SOURCE = new InjectionToken<GameContentSource>('GAME_CONTENT_SOURCE');

@Injectable({ providedIn: 'root' })
export class GameContentService implements GameContentSource {
  private readonly games: readonly Game[] = [
    {
      id: 'solar-spins',
      title: 'Solar Spins',
      category: 'Slots',
      description: 'Chase bright symbols across a cosmic reel.',
    },
    {
      id: 'dragons-hoard',
      title: "Dragon's Hoard",
      category: 'Adventure',
      description: 'Explore a legendary cavern filled with treasure.',
    },
    {
      id: 'moonlit-mahjong',
      title: 'Moonlit Mahjong',
      category: 'Puzzle',
      description: 'Match ancient tiles beneath a quiet night sky.',
    },
    {
      id: 'deep-sea-dash',
      title: 'Deep Sea Dash',
      category: 'Arcade',
      description: 'Dive into a vibrant underwater challenge.',
    },
    {
      id: 'lucky-lanterns',
      title: 'Lucky Lanterns',
      category: 'Slots',
      description: 'Light the way with colorful festival symbols.',
    },
    {
      id: 'pixel-racers',
      title: 'Pixel Racers',
      category: 'Racing',
      description: 'Race through a neon-soaked retro world.',
    },
    {
      id: 'wildwood-quest',
      title: 'Wildwood Quest',
      category: 'Adventure',
      description: 'Find hidden wonders in an enchanted forest.',
    },
  ];

  getAvailableGames(): Observable<readonly Game[]> {
    return of(this.games);
  }

  getGameById(id: string): Observable<Game | undefined> {
    return this.getAvailableGames().pipe(map((games) => games.find((game) => game.id === id)));
  }
}
