import type { Request, Response } from 'express';
import { configuracionSchema } from '../application/configuracion.dto.ts';
import type { ConfiguracionService } from '../application/configuracion.service.ts';

export function crearConfiguracionController(servicio: ConfiguracionService) {
  return {
    obtener: async (_req: Request, res: Response) => {
      res.json({ data: await servicio.obtener() });
    },
    actualizar: async (req: Request, res: Response) => {
      res.json({ data: await servicio.actualizar(configuracionSchema.parse(req.body)) });
    },
    reiniciarDatos: async (_req: Request, res: Response) => {
      await servicio.reiniciarDatos();
      res.status(204).end();
    },
  };
}
