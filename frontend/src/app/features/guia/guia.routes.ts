import { Routes } from '@angular/router';

export const GUIA_ROUTES: Routes = [
  {
    path: 'directivas',
    title: 'Guía de directivas · Nómina',
    loadComponent: () => import('./pages/guia-directivas.page').then((m) => m.GuiaDirectivasPage),
  },
];
