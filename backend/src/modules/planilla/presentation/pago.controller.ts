import type { Request, Response } from 'express';
import { idSchema } from '../../empleados/application/empleado.dto.ts';
import { filtroPagosSchema, pagoSchema } from '../application/pago.dto.ts';
import type { PagoService } from '../application/pago.service.ts';

export function crearPagoController(servicio: PagoService) {
  return {
    listar: async (req: Request, res: Response) => {
      res.json({ data: await servicio.listar(filtroPagosSchema.parse(req.query)) });
    },
    obtener: async (req: Request, res: Response) => {
      res.json({ data: await servicio.obtener(idSchema.parse(req.params['id'])) });
    },
    simular: async (req: Request, res: Response) => {
      res.json({ data: await servicio.simular(pagoSchema.parse(req.body)) });
    },
    emitir: async (req: Request, res: Response) => {
      res.status(201).json({ data: await servicio.emitir(pagoSchema.parse(req.body)) });
    },
    eliminar: async (req: Request, res: Response) => {
      await servicio.eliminar(idSchema.parse(req.params['id']));
      res.status(204).end();
    },
  };
}
