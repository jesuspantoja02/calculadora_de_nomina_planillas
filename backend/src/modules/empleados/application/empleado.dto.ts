import { z } from 'zod';
import { CARGOS } from '../../../shared/config/catalogos.ts';
import { sanitizarTexto } from '../../../shared/utils/sanitize.ts';

export const idSchema = z.uuid({ message: 'El id debe ser un UUID válido.' });

export const empleadoSchema = z.strictObject({
  dni: z.string().regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos.'),
  nombre: z
    .string()
    .transform(sanitizarTexto)
    .pipe(z.string().regex(/^[\p{L}][\p{L} .'-]{2,59}$/u, 'El nombre solo admite letras (3 a 60 caracteres).')),
  cargo: z.enum(CARGOS),
  sueldoBase: z.number().finite().positive('El sueldo debe ser mayor que 0.').max(1_000_000),
  regimen: z.enum(['AFP', 'ONP']),
  tieneHijos: z.boolean().default(false),
});
export type EmpleadoDto = z.infer<typeof empleadoSchema>;

export const filtroEmpleadosSchema = z.strictObject({
  cargo: z.string().max(40).optional(),
  regimen: z.enum(['AFP', 'ONP']).optional(),
  min: z.coerce.number().min(0).optional(),
  max: z.coerce.number().min(0).optional(),
});
