import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirServicios } from '../src/container.ts';
import { abrirBaseDatos } from '../src/shared/infrastructure/sqlite/database.ts';
import { AppError } from '../src/shared/errors/app-error.ts';
import { sanitizarTexto } from '../src/shared/utils/sanitize.ts';
import { escaparLike } from '../src/shared/utils/like.ts';

const nuevo = () => {
  const db = abrirBaseDatos(':memory:');
  return { db, s: construirServicios(db) };
};
const dto = { dni: '12345678', nombre: 'Juan Perez', cargo: 'Analista', sueldoBase: 3000, regimen: 'AFP', tieneHijos: false } as const;
const esError = (status: number) => (e: unknown) => e instanceof AppError && e.status === status;

test('CRUD de empleados, filtros y DNI duplicado (409)', async () => {
  const { s } = nuevo();
  const e = await s.empleados.crear({ ...dto });
  await assert.rejects(s.empleados.crear({ ...dto }), esError(409));
  const act = await s.empleados.actualizar(e.id, { ...dto, sueldoBase: 3500 });
  assert.equal(act.sueldoBase, 3500);
  assert.equal(act.creadoEn, e.creadoEn);
  assert.equal((await s.empleados.listar({ min: 3400 })).length, 1);
  assert.equal((await s.empleados.listar({ regimen: 'ONP' })).length, 0);
  assert.equal((await s.empleados.listar({ cargo: 'Analista' })).length, 1);
  await s.empleados.eliminar(e.id);
  await assert.rejects(s.empleados.obtener(e.id), esError(404));
  await assert.rejects(s.empleados.eliminar(e.id), esError(404));
});

test('Actualizar con el DNI de otro empleado devuelve 409', async () => {
  const { s } = nuevo();
  await s.empleados.crear({ ...dto });
  const otro = await s.empleados.crear({ ...dto, dni: '87654321', nombre: 'Otra Persona' });
  await assert.rejects(s.empleados.actualizar(otro.id, { ...dto, nombre: 'Otra Persona' }), esError(409));
});

test('Emitir boleta guarda una fotografía; búsqueda y dashboard', async () => {
  const { s } = nuevo();
  const e = await s.empleados.crear({ ...dto });
  const p = await s.pagos.emitir({ empleadoId: e.id, fechaPago: '2026-10-31', modalidad: 'Mensual', horasExtra: 5, tardanzas: 20, mesesComputables: 6 });
  assert.equal(p.neto, 1464);
  await s.empleados.eliminar(e.id); // la boleta se conserva
  assert.equal((await s.pagos.obtener(p.id)).nombre, 'Juan Perez');
  assert.equal((await s.pagos.listar({ q: 'PEREZ' })).length, 1);
  assert.equal((await s.pagos.listar({ q: '%' })).length, 0); // el comodín se busca literal
  assert.equal((await s.pagos.listar({ fecha: '2026-01-01' })).length, 0);
  const r = await s.dashboard.resumen();
  assert.equal(r.totalBoletas, 1);
  assert.equal(r.totalEmpleados, 0);
});

test('Simular no guarda y usa la configuración vigente', async () => {
  const { s } = nuevo();
  const e = await s.empleados.crear({ ...dto });
  const cfg = await s.configuracion.obtener();
  await s.configuracion.actualizar({ ...cfg, tasaAfp: 10 });
  const b = await s.pagos.simular({ empleadoId: e.id, fechaPago: '2026-10-31', modalidad: 'Mensual', horasExtra: 0, tardanzas: 0, mesesComputables: 6 });
  assert.equal(b.pension, 300);
  assert.equal((await s.pagos.listar({})).length, 0);
});

test('Dashboard: totales, régimen y extremos', async () => {
  const { s } = nuevo();
  await s.empleados.crear({ ...dto, sueldoBase: 2000 });
  await s.empleados.crear({ ...dto, dni: '87654321', nombre: 'Rosa Diaz', sueldoBase: 4000, regimen: 'ONP' });
  const r = await s.dashboard.resumen();
  assert.equal(r.totales.bruto, 6000);
  assert.deepEqual(r.regimen, { afp: 50, onp: 50 });
  assert.equal(r.mayorSueldo?.nombre, 'Rosa Diaz');
  assert.equal(r.menorSueldo?.sueldoBase, 2000);
});

test('Reiniciar datos borra empleados y boletas pero conserva la configuración', async () => {
  const { s } = nuevo();
  const e = await s.empleados.crear({ ...dto });
  await s.pagos.emitir({ empleadoId: e.id, fechaPago: '2026-10-31', modalidad: 'Quincena', horasExtra: 0, tardanzas: 0, mesesComputables: 6 });
  const cfg = await s.configuracion.obtener();
  await s.configuracion.actualizar({ ...cfg, empresaNombre: 'Acme SAC' });
  await s.configuracion.reiniciarDatos();
  assert.equal((await s.empleados.listar({})).length, 0);
  assert.equal((await s.pagos.listar({})).length, 0);
  assert.equal((await s.configuracion.obtener()).empresaNombre, 'Acme SAC');
});

test('Los datos persisten en disco entre aperturas y las migraciones son idempotentes', async () => {
  const { mkdtemp, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const dir = await mkdtemp(join(tmpdir(), 'nomina-'));
  const ruta = join(dir, 'x.db');
  const a = abrirBaseDatos(ruta);
  await construirServicios(a).empleados.crear({ ...dto });
  a.close();
  const b = abrirBaseDatos(ruta);
  assert.equal((await construirServicios(b).empleados.listar({})).length, 1);
  b.close();
  await rm(dir, { recursive: true });
});

test('sanitizarTexto y escaparLike', () => {
  assert.equal(sanitizarTexto('  <b>Ana</b>\u0000   Lopez `x` '), 'bAna/b Lopez x');
  assert.equal(escaparLike('50%_a\\'), '50\\%\\_a\\\\');
});
