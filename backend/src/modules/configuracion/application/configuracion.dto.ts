import { z } from 'zod';
import { sanitizarTexto } from '../../../shared/utils/sanitize.ts';

const soles = (max: number) => z.number().finite().min(0).max(max);
const porcentaje = z.number().finite().min(0).max(100);

export const configuracionSchema = z.strictObject({
  tasaAfp: porcentaje,
  tasaOnp: porcentaje,
  tasaSalud: porcentaje,
  tasaImpuesto: porcentaje,
  valorHoraExtra: soles(10_000),
  adelantoQuincenalPct: porcentaje,
  asignacionFamiliar: soles(10_000),
  bonificacionExtraordinariaPct: porcentaje,
  uit: z.number().finite().positive().max(100_000),
  aplicarQuintaCategoria: z.boolean(),
  empresaNombre: z
    .string()
    .transform(sanitizarTexto)
    .pipe(z.string().regex(/^[\p{L}\p{N} .,&'-]{2,60}$/u, 'Nombre de empresa inválido (2 a 60 caracteres).')),
  empresaRuc: z.string().regex(/^\d{11}$/, 'El RUC debe tener 11 dígitos.'),
});
export type ConfiguracionDto = z.infer<typeof configuracionSchema>;
