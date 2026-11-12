import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GameContentService } from './game-content.service';

describe('GameContentService', () => {
  let service: GameContentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameContentService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(GameContentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('loads the game catalog from the API', () => {
    let games: readonly { id: string; title: string }[] = [];

    service.getAvailableGames().subscribe((result) => (games = result));

    const request = httpTestingController.expectOne('/api/games');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 'solar-spins', title: 'Solar Spins' }]);

    expect(games[0].id).toBe('solar-spins');
  });

  it('maps a missing game response to undefined', () => {
    let game: unknown;

    service.getGameById('missing').subscribe((result) => (game = result));

    const request = httpTestingController.expectOne('/api/games/missing');
    request.flush({}, { status: 404, statusText: 'Not Found' });

    expect(game).toBeUndefined();
  });
});
