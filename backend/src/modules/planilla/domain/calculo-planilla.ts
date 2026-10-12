/**
 * Planilla según la normativa laboral peruana vigente en octubre de 2026.
 * Funciones puras: no leen la base de datos ni Express.
 *
 * - Horas extra: D.S. 007-2002-TR. Valor hora = remuneración ordinaria / 30 / 8.
 *   Las dos primeras horas del día se pagan al 125 % y las siguientes al 135 %.
 * - Descanso o feriado sin sustitutorio: sobretasa del 100 % (el día ya está en el sueldo mensual).
 * - Asignación familiar: Ley 25129, 10 % de la RMV, una por trabajador.
 * - AFP: aporte 10 % + prima de seguro + comisión por flujo, hasta la remuneración máxima asegurable.
 *   La comisión sobre saldo no sale del sueldo. ONP: 13 % (D.L. 19990), sin ese tope.
 * - Gratificación: Ley 27735, un sueldo computable por semestre (meses/6) y sin pensión.
 *   Bonificación extraordinaria Ley 30334: 9 % , o 6,75 % si está en EPS.
 * - CTS: T.U.O. D.S. 001-97-TR. (básico + asignación + un sexto de la gratificación) × tiempo / 12.
 *   Es un depósito, no un pago de sueldo.
 * - Quinta categoría: proyección de remuneración estable (12 sueldos + 2 gratificaciones),
 *   menos 7 UIT y menos el aporte obligatorio a la pensión. Tramos del impuesto a la renta.
 *   La bonificación extraordinaria no integra la renta de quinta.
 */
import type { Configuracion } from '../../configuracion/domain/configuracion.ts';
import type { Empleado } from '../../empleados/domain/empleado.ts';
import type { EntradaCalculo, ResultadoCalculo } from './pago.ts';

const DIAS_MES = 30;
const HORAS_DIA = 8;

export const redondear = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

const porcentaje = (base: number, tasa: number): number => redondear(base * (tasa / 100));

/** Tramos de quinta categoría, en UIT: 8 %, 14 %, 17 %, 20 % y 30 %. */
const TRAMOS_QUINTA: ReadonlyArray<{ hasta: number; tasa: number }> = [
  { hasta: 5, tasa: 0.08 },
  { hasta: 20, tasa: 0.14 },
  { hasta: 35, tasa: 0.17 },
  { hasta: 45, tasa: 0.2 },
  { hasta: Infinity, tasa: 0.3 },
];

export function asignacionFamiliarDe(tieneHijos: boolean, config: Configuracion): number {
  return tieneHijos ? redondear(config.rmv * 0.1) : 0;
}

/** Remuneración ordinaria mensual / 240. */
export function valorHoraOrdinaria(remuneracionOrdinaria: number): number {
  return redondear(remuneracionOrdinaria / DIAS_MES / HORAS_DIA);
}

function impuestoAnual(baseImponible: number, uit: number): number {
  if (baseImponible <= 0) return 0;
  let impuesto = 0;
  let limiteInferior = 0;
  for (const tramo of TRAMOS_QUINTA) {
    const limiteSuperior = tramo.hasta * uit;
    if (baseImponible > limiteInferior) {
      impuesto += (Math.min(baseImponible, limiteSuperior) - limiteInferior) * tramo.tasa;
    }
    limiteInferior = limiteSuperior;
  }
  return impuesto;
}

/**
 * Retención mensual para una remuneración ordinaria estable.
 * Proyecta 12 remuneraciones + 2 gratificaciones y reparte el impuesto anual en 12.
 * Descuenta el aporte que va al fondo (10 % AFP u ONP); la prima y la comisión no son deducibles.
 */
export function calcularQuintaMensual(remuneracionOrdinaria: number, aporteMensualDeducible: number, config: Configuracion): number {
  const rentaAnual = remuneracionOrdinaria * 12 + remuneracionOrdinaria * 2;
  const baseImponible = rentaAnual - 7 * config.uit - aporteMensualDeducible * 12;
  return redondear(impuestoAnual(baseImponible, config.uit) / 12);
}

interface Pension {
  tasa: number;
  aporte: number;
  prima: number;
  comision: number;
  total: number;
  deducible: number;
}

function pensionDe(base: number, regimen: EntradaCalculo['regimen'], config: Configuracion): Pension {
  if (base <= 0) return { tasa: 0, aporte: 0, prima: 0, comision: 0, total: 0, deducible: 0 };
  if (regimen === 'ONP') {
    const total = porcentaje(base, config.tasaOnp);
    return { tasa: config.tasaOnp, aporte: 0, prima: 0, comision: 0, total, deducible: total };
  }
  const asegurable = Math.min(base, config.remuneracionMaximaAsegurable);
  const aporte = porcentaje(asegurable, config.aporteAfpPct);
  const prima = porcentaje(asegurable, config.primaSeguroPct);
  const comision = config.tipoComisionAfp === 'flujo' ? porcentaje(asegurable, config.comisionFlujoPct) : 0;
  const tasa = config.aporteAfpPct + config.primaSeguroPct + (config.tipoComisionAfp === 'flujo' ? config.comisionFlujoPct : 0);
  return { tasa, aporte, prima, comision, total: redondear(aporte + prima + comision), deducible: aporte };
}

function vacio(entrada: EntradaCalculo, asignacion: number): ResultadoCalculo {
  return {
    modalidad: entrada.modalidad,
    sueldoBase: entrada.sueldoBase,
    asignacionFamiliar: asignacion,
    horasExtra: 0,
    horasExtra25: 0,
    horasExtra35: 0,
    horasDescanso: 0,
    valorHora: 0,
    pagoHoras25: 0,
    pagoHoras35: 0,
    pagoDescanso: 0,
    ingresoExtra: 0,
    minutosTardanza: 0,
    descuentoTardanza: 0,
    diasFalta: 0,
    descuentoFalta: 0,
    tardanzas: 0,
    gratificacion: 0,
    bonificacionExtraordinaria: 0,
    mesesComputables: entrada.mesesComputables,
    diasComputables: entrada.diasComputables,
    remuneracionComputable: 0,
    cts: 0,
    bruto: 0,
    adelanto: 0,
    tasaPension: 0,
    aporteAfp: 0,
    primaSeguro: 0,
    comisionAfp: 0,
    pension: 0,
    quintaCategoria: 0,
    essaludEmpleador: 0,
    totalDescuentos: 0,
    neto: 0,
  };
}

export function calcularPago(entrada: EntradaCalculo, config: Configuracion): ResultadoCalculo {
  const asignacion = asignacionFamiliarDe(entrada.tieneHijos, config);
  const ordinaria = redondear(entrada.sueldoBase + asignacion);
  const base = vacio(entrada, asignacion);

  if (entrada.modalidad === 'Quincena') {
    const neto = porcentaje(entrada.sueldoBase, config.adelantoQuincenalPct);
    return { ...base, bruto: entrada.sueldoBase, neto };
  }

  if (entrada.modalidad === 'Gratificacion') {
    const gratificacion = redondear((ordinaria * entrada.mesesComputables) / 6);
    const tasaBonificacion = entrada.afiliadoEps ? config.tasaEssalud * 0.75 : config.tasaEssalud;
    const bonificacionExtraordinaria = porcentaje(gratificacion, tasaBonificacion);
    const bruto = redondear(gratificacion + bonificacionExtraordinaria);
    return { ...base, gratificacion, bonificacionExtraordinaria, bruto, neto: bruto };
  }

  if (entrada.modalidad === 'CTS') {
    const gratificacionSemestre = redondear((ordinaria * entrada.mesesComputables) / 6);
    const remuneracionComputable = redondear(ordinaria + gratificacionSemestre / 6);
    const porMeses = redondear((remuneracionComputable * entrada.mesesComputables) / 12);
    const porDias = redondear((remuneracionComputable * entrada.diasComputables) / 360);
    const cts = redondear(porMeses + porDias);
    return { ...base, gratificacion: gratificacionSemestre, remuneracionComputable, cts, bruto: cts, neto: cts };
  }

  const valorHora = valorHoraOrdinaria(ordinaria);
  const pagoHoras25 = redondear(valorHora * 1.25 * entrada.horasExtra25);
  const pagoHoras35 = redondear(valorHora * 1.35 * entrada.horasExtra35);
  const pagoDescanso = redondear(valorHora * entrada.horasDescanso);
  const ingresoExtra = redondear(pagoHoras25 + pagoHoras35 + pagoDescanso);
  const descuentoTardanza = redondear((ordinaria / DIAS_MES / HORAS_DIA / 60) * entrada.minutosTardanza);
  const descuentoFalta = redondear((ordinaria / DIAS_MES) * entrada.diasFalta);
  const tardanzas = redondear(descuentoTardanza + descuentoFalta);
  const bruto = redondear(ordinaria + ingresoExtra);
  const basePension = Math.max(0, redondear(bruto - tardanzas));
  const pension = pensionDe(basePension, entrada.regimen, config);
  const adelanto = porcentaje(entrada.sueldoBase, config.adelantoQuincenalPct);
  const quintaCategoria = config.aplicarQuintaCategoria
    ? calcularQuintaMensual(ordinaria, pensionDe(ordinaria, entrada.regimen, config).deducible, config)
    : 0;
  const essaludEmpleador = porcentaje(basePension, config.tasaEssalud);
  const totalDescuentos = redondear(adelanto + pension.total + tardanzas + quintaCategoria);

  return {
    ...base,
    horasExtra: redondear(entrada.horasExtra25 + entrada.horasExtra35 + entrada.horasDescanso),
    horasExtra25: entrada.horasExtra25,
    horasExtra35: entrada.horasExtra35,
    horasDescanso: entrada.horasDescanso,
    valorHora,
    pagoHoras25,
    pagoHoras35,
    pagoDescanso,
    ingresoExtra,
    minutosTardanza: entrada.minutosTardanza,
    descuentoTardanza,
    diasFalta: entrada.diasFalta,
    descuentoFalta,
    tardanzas,
    bruto,
    adelanto,
    tasaPension: pension.tasa,
    aporteAfp: pension.aporte,
    primaSeguro: pension.prima,
    comisionAfp: pension.comision,
    pension: pension.total,
    quintaCategoria,
    essaludEmpleador,
    totalDescuentos,
    neto: Math.max(0, redondear(bruto - totalDescuentos)),
  };
}

/** Neto de un mes sin horas extra, faltas ni adelanto. EsSalud queda como costo del empleador. */
export function estimarMensual(emp: Pick<Empleado, 'sueldoBase' | 'regimen' | 'tieneHijos'>, config: Configuracion) {
  const asignacionFamiliar = asignacionFamiliarDe(emp.tieneHijos, config);
  const bruto = redondear(emp.sueldoBase + asignacionFamiliar);
  const pension = pensionDe(bruto, emp.regimen, config);
  const quintaCategoria = config.aplicarQuintaCategoria
    ? calcularQuintaMensual(bruto, pension.deducible, config)
    : 0;
  const essaludEmpleador = porcentaje(bruto, config.tasaEssalud);
  const total = redondear(pension.total + quintaCategoria);
  return {
    asignacionFamiliar,
    bruto,
    pension: pension.total,
    quintaCategoria,
    essaludEmpleador,
    total,
    neto: Math.max(0, redondear(bruto - total)),
  };
}
