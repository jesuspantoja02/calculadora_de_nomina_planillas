import { test } from 'node:test';
import assert from 'node:assert/strict';
import { empleadoSchema } from '../src/modules/empleados/application/empleado.dto.ts';
import { pagoSchema } from '../src/modules/planilla/application/pago.dto.ts';

const dto = { dni: '12345678', nombre: 'Juan Perez', cargo: 'Analista', sueldoBase: 3000, regimen: 'AFP', tieneHijos: false } as const;

test('Validación (Zod): rechaza DNI inválido, campos extra y sanitiza el nombre', () => {
  assert.equal(empleadoSchema.safeParse({ ...dto, dni: '123' }).success, false);
  assert.equal(empleadoSchema.safeParse({ ...dto, extra: 1 }).success, false);
  assert.equal(empleadoSchema.safeParse({ ...dto, nombre: '<script>' }).success, false);
  const ok = empleadoSchema.parse({ ...dto, nombre: '  Ana   Lopez ' });
  assert.equal(ok.nombre, 'Ana Lopez');
});


test('Validación (Zod): pagos', () => {
  const base = { empleadoId: crypto.randomUUID(), fechaPago: '2026-10-31', modalidad: 'Mensual' };
  assert.equal(pagoSchema.safeParse(base).success, true);
  assert.equal(pagoSchema.safeParse({ ...base, fechaPago: '31/10/2026' }).success, false);
  assert.equal(pagoSchema.safeParse({ ...base, horasExtra25: -1 }).success, false);
  assert.equal(pagoSchema.safeParse({ ...base, modalidad: 'CTS', diasComputables: 31 }).success, false);
  assert.equal(pagoSchema.safeParse({ ...base, modalidad: 'Otra' }).success, false);
});
