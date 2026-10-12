import type { Request, Response } from 'express';
import { empleadoSchema, filtroEmpleadosSchema, idSchema } from '../application/empleado.dto.ts';
import type { EmpleadoService } from '../application/empleado.service.ts';

export function crearEmpleadoController(servicio: EmpleadoService) {
  return {
    listar: async (req: Request, res: Response) => {
      res.json({ data: await servicio.listar(filtroEmpleadosSchema.parse(req.query)) });
    },
    obtener: async (req: Request, res: Response) => {
      res.json({ data: await servicio.obtener(idSchema.parse(req.params['id'])) });
    },
    crear: async (req: Request, res: Response) => {
      res.status(201).json({ data: await servicio.crear(empleadoSchema.parse(req.body)) });
    },
    actualizar: async (req: Request, res: Response) => {
      const id = idSchema.parse(req.params['id']);
      res.json({ data: await servicio.actualizar(id, empleadoSchema.parse(req.body)) });
    },
    eliminar: async (req: Request, res: Response) => {
      await servicio.eliminar(idSchema.parse(req.params['id']));
      res.status(204).end();
    },
  };
}
