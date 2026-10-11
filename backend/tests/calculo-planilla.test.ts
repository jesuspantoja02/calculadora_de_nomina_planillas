import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularPago, calcularQuintaMensual, estimarMensual } from '../src/modules/planilla/domain/calculo-planilla.ts';
import { CONFIG_POR_DEFECTO } from '../src/modules/configuracion/domain/configuracion.ts';
import type { EntradaCalculo } from '../src/modules/planilla/domain/pago.ts';

const cfg = { ...CONFIG_POR_DEFECTO };
const base: EntradaCalculo = {
  sueldoBase: 3000,
  regimen: 'AFP',
  tieneHijos: false,
  modalidad: 'Mensual',
  horasExtra25: 0,
  horasExtra35: 0,
  horasDescanso: 0,
  minutosTardanza: 0,
  diasFalta: 0,
  mesesComputables: 6,
  diasComputables: 0,
  afiliadoEps: false,
};

test('Quincena: adelanto según la política de la empresa, sin descuentos de ley', () => {
  const r = calcularPago({ ...base, modalidad: 'Quincena', horasExtra25: 10, diasFalta: 2 }, cfg);
  assert.equal(r.neto, 1200);
  assert.equal(r.totalDescuentos, 0);
  assert.equal(r.ingresoExtra, 0);
});

test('Fin de mes: hora ordinaria = sueldo / 240; 25 % y 35 %; AFP desglosada con tope', () => {
  const r = calcularPago({ ...base, horasExtra25: 2, horasExtra35: 1, minutosTardanza: 60 }, cfg);
  assert.equal(r.valorHora, 12.5);
  assert.equal(r.pagoHoras25, 31.25);
  assert.equal(r.pagoHoras35, 16.88);
  assert.equal(r.ingresoExtra, 48.13);
  assert.equal(r.descuentoTardanza, 12.5);
  assert.equal(r.bruto, 3048.13);
  assert.equal(r.adelanto, 1200);
  // Base de pensión = 3048.13 - 12.50 = 3035.63
  assert.equal(r.aporteAfp, 303.56);
  assert.equal(r.primaSeguro, 41.59);
  assert.equal(r.comisionAfp, 47.05);
  assert.equal(r.pension, 392.2);
  assert.equal(r.quintaCategoria, 0);
  assert.equal(r.essaludEmpleador, 273.21);
  assert.equal(r.neto, 1443.43);
});

test('Fin de mes con ONP (13 %), sin tope', () => {
  const r = calcularPago({ ...base, regimen: 'ONP' }, cfg);
  assert.equal(r.pension, 390);
  assert.equal(r.aporteAfp, 0);
  assert.equal(r.neto, 1410);
});

test('La AFP no aporta ni cobra prima por encima de la remuneración máxima asegurable', () => {
  const r = calcularPago({ ...base, sueldoBase: 20_000 }, cfg);
  assert.equal(r.aporteAfp, 1273.27);
  assert.equal(r.primaSeguro, 174.44);
  assert.equal(r.comisionAfp, 197.36);
  assert.equal(r.pension, 1645.07);
});

test('La comisión sobre saldo no se descuenta del sueldo', () => {
  const r = calcularPago(base, { ...cfg, tipoComisionAfp: 'saldo' });
  assert.equal(r.comisionAfp, 0);
  assert.equal(r.pension, 341.1);
});

test('Asignación familiar: 10 % de la RMV, solo si tiene hijos', () => {
  const sin = calcularPago(base, cfg);
  const con = calcularPago({ ...base, tieneHijos: true }, cfg);
  assert.equal(sin.asignacionFamiliar, 0);
  assert.equal(con.asignacionFamiliar, 123);
  assert.equal(con.bruto, 3123);
});

test('Una falta descuenta un treintavo y reduce la base de pensión', () => {
  const r = calcularPago({ ...base, diasFalta: 1 }, cfg);
  assert.equal(r.descuentoFalta, 100);
  assert.equal(r.aporteAfp, 290);
});

test('Gratificación de semestre completo + bonificación 9 %, sin pensión', () => {
  const r = calcularPago({ ...base, modalidad: 'Gratificacion' }, cfg);
  assert.equal(r.gratificacion, 3000);
  assert.equal(r.bonificacionExtraordinaria, 270);
  assert.equal(r.pension, 0);
  assert.equal(r.neto, 3270);
  const parcial = calcularPago({ ...base, modalidad: 'Gratificacion', mesesComputables: 3 }, cfg);
  assert.equal(parcial.gratificacion, 1500);
  assert.equal(parcial.bonificacionExtraordinaria, 135);
});

test('En EPS la bonificación extraordinaria es el 75 % de EsSalud', () => {
  const r = calcularPago({ ...base, modalidad: 'Gratificacion', afiliadoEps: true }, cfg);
  assert.equal(r.bonificacionExtraordinaria, 202.5);
  assert.equal(r.neto, 3202.5);
});

test('CTS de semestre completo: (sueldo + un sexto de la gratificación) / 2', () => {
  const r = calcularPago({ ...base, modalidad: 'CTS' }, cfg);
  assert.equal(r.remuneracionComputable, 3500);
  assert.equal(r.cts, 1750);
  assert.equal(r.pension, 0);
  const conDias = calcularPago({ ...base, modalidad: 'CTS', diasComputables: 15 }, cfg);
  assert.equal(conDias.cts, 1895.83);
});

test('5ta categoría: 7 UIT, tramos y aporte deducible', () => {
  assert.equal(calcularQuintaMensual(2000, 200, cfg), 0);
  assert.equal(calcularQuintaMensual(5000, 500, cfg), 170);
  assert.equal(calcularQuintaMensual(5000, 650, cfg), 158);
  const r = calcularPago({ ...base, sueldoBase: 5000, regimen: 'ONP' }, cfg);
  assert.equal(r.quintaCategoria, 158);
});

test('El neto nunca es negativo', () => {
  const r = calcularPago({ ...base, diasFalta: 31 }, cfg);
  assert.equal(r.neto, 0);
});

test('La estimación mensual no descuenta EsSalud al trabajador', () => {
  const e = estimarMensual({ sueldoBase: 2000, regimen: 'AFP', tieneHijos: false }, cfg);
  assert.equal(e.bruto, 2000);
  assert.equal(e.pension, 258.4);
  assert.equal(e.essaludEmpleador, 180);
  assert.equal(e.quintaCategoria, 0);
  assert.equal(e.neto, 1741.6);
});
