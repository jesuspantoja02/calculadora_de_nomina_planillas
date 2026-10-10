/**
 * Reglas de negocio de planillas (funciones puras, sin I/O).
 *
 * Reglas heredadas de la Unidad 1 (sección 5 de las especificaciones):
 *  - Adelanto quincenal: 40 % del sueldo básico, sin descuentos de ley, sin horas extra ni tardanzas.
 *  - Fin de mes: Bruto = Sueldo básico + Horas extra.
 *      Neto = Bruto - Adelanto quincenal (40 %) - AFP/ONP - Tardanzas/Faltas.
 *
 * Extensiones de la Unidad 2 (no alteran lo anterior mientras estén en su valor por defecto):
 *  - Asignación familiar: se suma al bruto solo si el empleado tiene hijos.
 *  - Gratificación (julio/diciembre): 1 sueldo computable + bonificación extraordinaria (9 %).
 *  - Retención de 5ta categoría: solo si `aplicarQuintaCategoria` está activo en la configuración.
 */
import type { Configuracion } from '../../configuracion/domain/configuracion.ts';
import type { Empleado } from '../../empleados/domain/empleado.ts';
import type { EntradaCalculo, ResultadoCalculo } from './pago.ts';

export const redondear = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

/** Tramos de 5ta categoría (en UIT): hasta 5 → 8 %, 5-20 → 14 %, 20-35 → 17 %, 35-45 → 20 %, más de 45 → 30 %. */
const TRAMOS_QUINTA: ReadonlyArray<{ hasta: number; tasa: number }> = [
  { hasta: 5, tasa: 0.08 },
  { hasta: 20, tasa: 0.14 },
  { hasta: 35, tasa: 0.17 },
  { hasta: 45, tasa: 0.2 },
  { hasta: Infinity, tasa: 0.3 },
];

/**
 * Retención mensual de 5ta categoría (método simplificado, meses de enero a marzo):
 * proyección anual = 12 remuneraciones + 2 gratificaciones + 2 bonificaciones extraordinarias,
 * menos 7 UIT, aplicando los tramos progresivos; retención mensual = impuesto anual / 12.
 */
export function calcularQuintaMensual(remuneracionMensual: number, config: Configuracion): number {
  const bonif = config.bonificacionExtraordinariaPct / 100;
  const anual = remuneracionMensual * 12 + remuneracionMensual * 2 * (1 + bonif);
  const baseImponible = anual - 7 * config.uit;
  if (baseImponible <= 0) return 0;

  let impuesto = 0;
  let limiteInferior = 0;
  for (const tramo of TRAMOS_QUINTA) {
    const limiteSuperior = tramo.hasta * config.uit;
    if (baseImponible > limiteInferior) {
      impuesto += (Math.min(baseImponible, limiteSuperior) - limiteInferior) * tramo.tasa;
    }
    limiteInferior = limiteSuperior;
  }
  return redondear(impuesto / 12);
}

export function calcularPago(entrada: EntradaCalculo, config: Configuracion): ResultadoCalculo {
  const sueldoBase = entrada.sueldoBase;
  const asignacionFamiliar = entrada.tieneHijos ? config.asignacionFamiliar : 0;
  const tasaPension = entrada.regimen === 'AFP' ? config.tasaAfp : config.tasaOnp;

  const base: ResultadoCalculo = {
    modalidad: entrada.modalidad,
    sueldoBase,
    asignacionFamiliar: 0,
    horasExtra: 0,
    ingresoExtra: 0,
    gratificacion: 0,
    bonificacionExtraordinaria: 0,
    bruto: sueldoBase,
    adelanto: 0,
    tasaPension,
    pension: 0,
    tardanzas: 0,
    quintaCategoria: 0,
    totalDescuentos: 0,
    neto: 0,
  };

  if (entrada.modalidad === 'Quincena') {
    return { ...base, neto: redondear(sueldoBase * (config.adelantoQuincenalPct / 100)) };
  }

  if (entrada.modalidad === 'Gratificacion') {
    const computable = sueldoBase + asignacionFamiliar;
    const gratificacion = redondear((computable * entrada.mesesComputables) / 6);
    const bonificacionExtraordinaria = redondear(gratificacion * (config.bonificacionExtraordinariaPct / 100));
    const bruto = redondear(gratificacion + bonificacionExtraordinaria);
    return { ...base, asignacionFamiliar, gratificacion, bonificacionExtraordinaria, bruto, neto: bruto };
  }

  // Mensual (fin de mes)
  const ingresoExtra = redondear(entrada.horasExtra * config.valorHoraExtra);
  const bruto = redondear(sueldoBase + asignacionFamiliar + ingresoExtra);
  const adelanto = redondear(sueldoBase * (config.adelantoQuincenalPct / 100));
  const pension = redondear(bruto * (tasaPension / 100));
  const tardanzas = redondear(entrada.tardanzas);
  const quintaCategoria = config.aplicarQuintaCategoria
    ? calcularQuintaMensual(sueldoBase + asignacionFamiliar, config)
    : 0;
  const totalDescuentos = redondear(adelanto + pension + tardanzas + quintaCategoria);
  const neto = Math.max(0, redondear(bruto - totalDescuentos));

  return {
    ...base,
    asignacionFamiliar,
    horasExtra: entrada.horasExtra,
    ingresoExtra,
    bruto,
    adelanto,
    pension,
    tardanzas,
    quintaCategoria,
    totalDescuentos,
    neto,
  };
}

/** Estimación mensual por empleado usada en la lista y el dashboard (misma fórmula de la Unidad 1). */
export function estimarMensual(emp: Pick<Empleado, 'sueldoBase' | 'regimen'>, config: Configuracion) {
  const tasaPension = emp.regimen === 'AFP' ? config.tasaAfp : config.tasaOnp;
  const pension = redondear(emp.sueldoBase * (tasaPension / 100));
  const salud = redondear(emp.sueldoBase * (config.tasaSalud / 100));
  const impuesto = redondear(emp.sueldoBase * (config.tasaImpuesto / 100));
  const total = redondear(pension + salud + impuesto);
  const neto = Math.max(0, redondear(emp.sueldoBase - total));
  return { pension, salud, impuesto, total, neto };
}
