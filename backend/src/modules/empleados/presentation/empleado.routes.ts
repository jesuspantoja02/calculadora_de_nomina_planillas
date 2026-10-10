import { Router } from 'express';
import type { EmpleadoService } from '../application/empleado.service.ts';
import { crearEmpleadoController } from './empleado.controller.ts';

export function crearEmpleadoRouter(servicio: EmpleadoService): Router {
  const c = crearEmpleadoController(servicio);
  const router = Router();
  router.get('/', c.listar);
  router.get('/:id', c.obtener);
  router.post('/', c.crear);
  router.put('/:id', c.actualizar);
  router.delete('/:id', c.eliminar);
  return router;
}
