import { z } from 'zod';

const horas = z.number().finite().min(0).max(200).default(0);

export const pagoSchema = z.strictObject({
  empleadoId: z.uuid(),
  fechaPago: z.iso.date(),
  modalidad: z.enum(['Mensual', 'Quincena', 'Gratificacion', 'CTS']),
  horasExtra25: horas,
  horasExtra35: horas,
  horasDescanso: horas,
  minutosTardanza: z.number().finite().min(0).max(20_000).default(0),
  diasFalta: z.number().finite().min(0).max(31).default(0),
  mesesComputables: z.number().int().min(0).max(6).default(6),
  diasComputables: z.number().int().min(0).max(30).default(0),
  afiliadoEps: z.boolean().default(false),
});
export type PagoDto = z.infer<typeof pagoSchema>;

export const filtroPagosSchema = z.strictObject({
  fecha: z.iso.date().optional(),
  q: z.string().max(60).optional(),
});
