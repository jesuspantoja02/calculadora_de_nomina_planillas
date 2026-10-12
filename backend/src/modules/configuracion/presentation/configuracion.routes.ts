import { Router } from 'express';
import type { ConfiguracionService } from '../application/configuracion.service.ts';
import { crearConfiguracionController } from './configuracion.controller.ts';

export function crearConfiguracionRouter(servicio: ConfiguracionService): Router {
  const c = crearConfiguracionController(servicio);
  const router = Router();
  router.get('/configuracion', c.obtener);
  router.put('/configuracion', c.actualizar);
  router.delete('/datos', c.reiniciarDatos);
  return router;
}
