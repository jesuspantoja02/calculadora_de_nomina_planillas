import { Router } from 'express';
import type { PagoService } from '../application/pago.service.ts';
import { crearPagoController } from './pago.controller.ts';

export function crearPagoRouter(servicio: PagoService): Router {
  const c = crearPagoController(servicio);
  const router = Router();
  router.get('/', c.listar);
  router.post('/simular', c.simular); // antes de '/:id'
  router.get('/:id', c.obtener);
  router.post('/', c.emitir);
  router.delete('/:id', c.eliminar);
  return router;
}
