import { Component, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthenticatedLayoutComponent } from '../components/authenticated-layout.component';
import { AuthenticatedUser } from './auth.models';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

@Component({ standalone: true, template: 'Login page' })
class LoginPageComponent {}

@Component({ standalone: true, template: 'Protected page' })
class ProtectedPageComponent {}

describe('authGuard', () => {
  let harness: RouterTestingHarness;
  let currentUser: WritableSignal<AuthenticatedUser | null>;
  let accessToken: string | null;
  let logoutCalled: boolean;

  const authorizedUser: AuthenticatedUser = {
    id: 'player-1',
    username: 'demo',
    isEligibleToPlay: true,
    isOfLegalAge: true,
    walletBalance: 125.5,
    country: 'US',
  };

  beforeEach(async () => {
    currentUser = signal<AuthenticatedUser | null>(null);
    accessToken = null;
    logoutCalled = false;

    await TestBed.configureTestingModule({
      imports: [
        AuthenticatedLayoutComponent,
        LoginPageComponent,
        ProtectedPageComponent,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            currentUser,
            getAccessToken: () => accessToken,
            logout: () => {
              logoutCalled = true;
              currentUser.set(null);
              accessToken = null;
            },
          },
        },
        provideRouter([
          { path: 'login', component: LoginPageComponent },
          {
            path: '',
            component: AuthenticatedLayoutComponent,
            canActivateChild: [authGuard],
            children: [{ path: 'games', component: ProtectedPageComponent }],
          },
        ]),
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  it('redirects logged-out users to login', async () => {
    await harness.navigateByUrl('/games');

    expect(TestBed.inject(Router).url).toBe('/login');
  });

  it('redirects users who are not eligible to login', async () => {
    currentUser.set({ ...authorizedUser, isEligibleToPlay: false });
    accessToken = 'test-token';

    await harness.navigateByUrl('/games');

    expect(TestBed.inject(Router).url).toBe('/login');
  });

  it('redirects users who are not of legal age to login', async () => {
    currentUser.set({ ...authorizedUser, isOfLegalAge: false });
    accessToken = 'test-token';

    await harness.navigateByUrl('/games');

    expect(TestBed.inject(Router).url).toBe('/login');
  });

  it('allows an eligible authenticated user and displays their username', async () => {
    currentUser.set(authorizedUser);
    accessToken = 'test-token';

    await harness.navigateByUrl('/games');

    expect(TestBed.inject(Router).url).toBe('/games');
    expect(harness.fixture.nativeElement.textContent).toContain('demo');
  });

  it('logs out and returns to login', async () => {
    currentUser.set(authorizedUser);
    accessToken = 'test-token';
    await harness.navigateByUrl('/games');

    const logoutButton = harness.fixture.nativeElement.querySelector(
      '.logout-button',
    ) as HTMLButtonElement;
    logoutButton.click();
    await harness.fixture.whenStable();

    expect(logoutCalled).toBe(true);
    expect(TestBed.inject(Router).url).toBe('/login');
  });
});
