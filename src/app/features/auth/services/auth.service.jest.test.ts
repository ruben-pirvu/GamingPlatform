import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthenticatedUser } from './auth.models';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('stores the login token and uses it to fetch the current user', () => {
    const expectedUser = { id: 'player-1', username: 'demo', isEligibleToPlay: true };
    let receivedUser: AuthenticatedUser | null = null;

    authService.login({ username: 'demo', password: 'DemoPass123!' }).subscribe((user) => {
      receivedUser = user;
    });

    const loginRequest = httpTestingController.expectOne('/api/auth/login');
    expect(loginRequest.request.method).toBe('POST');
    loginRequest.flush({
      accessToken: 'test-token',
      expiresAt: '2026-11-12T18:00:00Z',
      user: expectedUser,
    });

    const currentUserRequest = httpTestingController.expectOne('/api/auth/me');
    expect(currentUserRequest.request.headers.get('Authorization')).toBe('Bearer test-token');
    currentUserRequest.flush(expectedUser);

    expect(receivedUser).toEqual(expectedUser);
    expect(authService.currentUser()).toEqual(expectedUser);
    expect(authService.isEligibleToPlay()).toBe(true);
  });
});
