import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, InjectionToken, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

export interface Game {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
}

export interface GameContentSource {
  getAvailableGames(): Observable<readonly Game[]>;
  getGameById(id: string): Observable<Game | undefined>;
}

export const GAME_CONTENT_SOURCE = new InjectionToken<GameContentSource>('GAME_CONTENT_SOURCE');

@Injectable({ providedIn: 'root' })
export class GameContentService implements GameContentSource {
  private readonly http = inject(HttpClient);

  getAvailableGames(): Observable<readonly Game[]> {
    return this.http.get<readonly Game[]>('/api/games');
  }

  getGameById(id: string): Observable<Game | undefined> {
    return this.http.get<Game>(`/api/games/${encodeURIComponent(id)}`).pipe(
      catchError((error: unknown) =>
        error instanceof HttpErrorResponse && error.status === 404
          ? of(undefined)
          : throwError(() => error),
      ),
    );
  }
}
