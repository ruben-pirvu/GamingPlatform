import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LaunchService } from './launch.service';

describe('LaunchService', () => {
  let service: LaunchService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LaunchService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(LaunchService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('sends the selected game to the authenticated eligibility endpoint', () => {
    let result: unknown;
    service.checkEligibility('solar-spins').subscribe((response) => (result = response));

    const request = httpTestingController.expectOne('/api/launch/eligibility-check');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ gameId: 'solar-spins' });
    request.flush({ isEligible: true, message: 'Game ready to load.' });

    expect(result).toEqual({ isEligible: true, message: 'Game ready to load.' });
  });
});
