import { Router } from 'express';
import type { DashboardService } from '../application/dashboard.service.ts';

export function crearDashboardRouter(servicio: DashboardService): Router {
  const router = Router();
  router.get('/dashboard', async (_req, res) => {
    res.json({ data: await servicio.resumen() });
  });
  return router;
}
