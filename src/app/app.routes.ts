import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'compras',
        loadComponent: () => import('./compras/compras.page').then(m => m.ComprasPage),
      },
      {
        path: 'search',
        loadComponent: () => import('./search/search.page').then(m => m.SearchPage),
      },
      {
        path: '',
        redirectTo: 'compras',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
