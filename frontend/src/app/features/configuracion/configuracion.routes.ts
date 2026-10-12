import { Routes } from '@angular/router';

export const CONFIGURACION_ROUTES: Routes = [
  {
    path: '',
    title: 'Configuración · Nómina',
    loadComponent: () => import('./pages/configuracion.page').then((m) => m.ConfiguracionPage),
  },
];
