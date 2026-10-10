import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularPago, calcularQuintaMensual, estimarMensual } from '../src/modules/planilla/domain/calculo-planilla.ts';
import { CONFIG_POR_DEFECTO } from '../src/modules/configuracion/domain/configuracion.ts';
import type { EntradaCalculo } from '../src/modules/planilla/domain/pago.ts';

const cfg = { ...CONFIG_POR_DEFECTO };
const base: EntradaCalculo = {
  sueldoBase: 3000, regimen: 'AFP', tieneHijos: false,
  modalidad: 'Mensual', horasExtra: 0, tardanzas: 0, mesesComputables: 6,
};

test('Quincena: 40 % del básico, sin descuentos de ley', () => {
  const r = calcularPago({ ...base, modalidad: 'Quincena', horasExtra: 10, tardanzas: 50 }, cfg);
  assert.equal(r.neto, 1200);
  assert.equal(r.totalDescuentos, 0);
  assert.equal(r.ingresoExtra, 0);
});

test('Fin de mes (regla de las PPT): bruto = básico + HE; neto = bruto - adelanto - AFP - tardanzas', () => {
  const r = calcularPago({ ...base, horasExtra: 5, tardanzas: 20 }, cfg);
  assert.equal(r.ingresoExtra, 50);
  assert.equal(r.bruto, 3050);
  assert.equal(r.adelanto, 1200);
  assert.equal(r.pension, 366); // 12 % de 3050
  assert.equal(r.totalDescuentos, 1586);
  assert.equal(r.neto, 1464);
});

test('Fin de mes con ONP (13 %)', () => {
  const r = calcularPago({ ...base, regimen: 'ONP' }, cfg);
  assert.equal(r.pension, 390);
  assert.equal(r.neto, 1410);
});

test('Asignación familiar solo si tiene hijos', () => {
  const sin = calcularPago(base, cfg);
  const con = calcularPago({ ...base, tieneHijos: true }, cfg);
  assert.equal(sin.asignacionFamiliar, 0);
  assert.equal(con.asignacionFamiliar, 113);
  assert.equal(con.bruto, 3113);
});

test('Gratificación: 1 sueldo computable + 9 % de bonificación extraordinaria', () => {
  const r = calcularPago({ ...base, modalidad: 'Gratificacion' }, cfg);
  assert.equal(r.gratificacion, 3000);
  assert.equal(r.bonificacionExtraordinaria, 270);
  assert.equal(r.neto, 3270);
  const parcial = calcularPago({ ...base, modalidad: 'Gratificacion', mesesComputables: 3 }, cfg);
  assert.equal(parcial.gratificacion, 1500);
});

test('5ta categoría: exento hasta 7 UIT y tramos progresivos', () => {
  assert.equal(calcularQuintaMensual(2000, cfg), 0);
  // 5000 -> anual 70 900; base 32 400 -> 2 200 + 686 = 2 886; /12 = 240.5
  assert.equal(calcularQuintaMensual(5000, cfg), 240.5);
  const r = calcularPago({ ...base, sueldoBase: 5000, regimen: 'ONP' }, { ...cfg, aplicarQuintaCategoria: true });
  assert.equal(r.quintaCategoria, 240.5);
});

test('El neto nunca es negativo', () => {
  const r = calcularPago({ ...base, tardanzas: 99999 }, cfg);
  assert.equal(r.neto, 0);
});

test('Estimación mensual idéntica a la Unidad 1', () => {
  const e = estimarMensual({ sueldoBase: 2000, regimen: 'AFP' }, cfg);
  assert.deepEqual(e, { pension: 240, salud: 180, impuesto: 100, total: 520, neto: 1480 });
});
