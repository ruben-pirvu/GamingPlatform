import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login.component';
import { SelectionComponent } from './features/content/components/selection.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'games', component: SelectionComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
