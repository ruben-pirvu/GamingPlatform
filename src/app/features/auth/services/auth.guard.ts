import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const user = authService.currentUser();

  if (
    authService.getAccessToken() &&
    user?.isEligibleToPlay &&
    user.isOfLegalAge
  ) {
    return true;
  }

  return inject(Router).parseUrl('/login');
};
