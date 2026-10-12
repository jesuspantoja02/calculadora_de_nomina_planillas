import { Routes } from '@angular/router';
import { EmpleadosStore } from './data-access/empleados.store';

export const EMPLEADOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Empleados · Nómina',
    providers: [EmpleadosStore],
    loadComponent: () => import('./pages/empleados.page').then((m) => m.EmpleadosPage),
  },
];
