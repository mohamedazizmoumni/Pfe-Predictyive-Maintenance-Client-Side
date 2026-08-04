import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    // Back-compat alias for old links/bookmarks pointing at /home from when
    // this lived inside the main app's router.
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'features',
    loadComponent: () =>
      import('./pages/landing/features/features.component').then((m) => m.FeaturesComponent),
  },
  {
    path: 'how-it-works',
    loadComponent: () =>
      import('./pages/landing/how-it-works/how-it-works.component').then((m) => m.HowItWorksComponent),
  },
  {
    path: 'demo',
    loadComponent: () =>
      import('./pages/landing/demo/demo.component').then((m) => m.DemoComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/landing/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
