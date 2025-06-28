import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/browse/browse.component').then(a => a.BrowseComponent) },
  { path: '**', redirectTo: '' }
];