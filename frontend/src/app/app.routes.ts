import { Routes } from '@angular/router';

/**
 * Cada funcionalidad define sus propias rutas (features/<x>/<x>.routes.ts) y se carga bajo demanda.
 * Para agregar un módulo nuevo basta con crear su carpeta en features/ y registrar una línea aquí.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'empleados' },
  { path: 'empleados', loadChildren: () => import('./features/empleados/empleados.routes').then((m) => m.EMPLEADOS_ROUTES) },
  { path: 'planilla', loadChildren: () => import('./features/planilla/planilla.routes').then((m) => m.PLANILLA_ROUTES) },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES) },
  { path: 'configuracion', loadChildren: () => import('./features/configuracion/configuracion.routes').then((m) => m.CONFIGURACION_ROUTES) },
  {
    path: '**',
    title: 'No encontrada · Nómina',
    loadComponent: () => import('./core/pages/not-found.page').then((m) => m.NotFoundPage),
  },
];
