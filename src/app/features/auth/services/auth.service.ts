import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { AuthenticatedUser, LoginCredentials, LoginResponse } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly accessToken = signal<string | null>(null);

  readonly currentUser = signal<AuthenticatedUser | null>(null);
  readonly isEligibleToPlay = computed(() => this.currentUser()?.isEligibleToPlay ?? false);

  login(credentials: LoginCredentials): Observable<AuthenticatedUser> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap((response) => this.accessToken.set(response.accessToken)),
      switchMap(() => this.http.get<AuthenticatedUser>('/api/auth/me')),
      tap((user) => this.currentUser.set(user)),
    );
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }
}
