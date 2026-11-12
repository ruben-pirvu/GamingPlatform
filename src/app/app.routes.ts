import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
