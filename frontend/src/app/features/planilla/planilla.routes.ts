import { Routes } from '@angular/router';
import { BoletasStore } from './data-access/boletas.store';

export const PLANILLA_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'procesar-pago' },
  {
    path: 'procesar-pago',
    title: 'Procesar pago · Nómina',
    loadComponent: () => import('./pages/procesar-pago.page').then((m) => m.ProcesarPagoPage),
  },
  {
    path: 'boletas',
    title: 'Boletas · Nómina',
    providers: [BoletasStore],
    loadComponent: () => import('./pages/boletas.page').then((m) => m.BoletasPage),
  },
];
