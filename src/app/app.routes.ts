import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login.component';
import { SelectionComponent } from './features/content/components/selection.component';
import { authGuard } from './features/auth/services/auth.guard';
import { AuthenticatedLayoutComponent } from './features/auth/components/authenticated-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      { path: 'games', component: SelectionComponent },
      { path: '', pathMatch: 'full', redirectTo: 'games' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
