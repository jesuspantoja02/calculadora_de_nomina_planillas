import { z } from 'zod';

export const pagoSchema = z.strictObject({
  empleadoId: z.uuid(),
  fechaPago: z.iso.date(),
  modalidad: z.enum(['Mensual', 'Quincena', 'Gratificacion']),
  horasExtra: z.number().finite().min(0).max(300).default(0),
  tardanzas: z.number().finite().min(0).max(1_000_000).default(0),
  mesesComputables: z.number().int().min(1).max(6).default(6),
});
export type PagoDto = z.infer<typeof pagoSchema>;

export const filtroPagosSchema = z.strictObject({
  fecha: z.iso.date().optional(),
  q: z.string().max(60).optional(),
});
