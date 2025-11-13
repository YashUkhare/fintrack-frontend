import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [loginGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component')
      .then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions.component')
          .then(m => m.TransactionsComponent)
      },
      {
        path: 'budgets',
        loadComponent: () => import('./features/budgets/budgets.component')
          .then(m => m.BudgetsComponent)
      },
      {
        path: 'goals',
        loadComponent: () => import('./features/goals/goals.component')
          .then(m => m.GoalsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component')
          .then(m => m.CategoriesComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component')
          .then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];