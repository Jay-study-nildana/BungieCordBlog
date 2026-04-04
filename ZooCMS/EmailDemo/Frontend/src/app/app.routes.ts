import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/email',
    pathMatch: 'full', // Default route
  },
  {
    path: 'email',
    loadComponent: () =>
      import('./components/email-form/email-form.component').then(
        (m) => m.EmailFormComponent
      ), // Lazy-load the EmailFormComponent
  },
  {
    path: '**',
    redirectTo: '/email', // Redirect invalid routes to email
  },
];