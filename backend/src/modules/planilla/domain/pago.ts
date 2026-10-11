import type { Regimen } from '../../empleados/domain/empleado.ts';

export type Modalidad = 'Mensual' | 'Quincena' | 'Gratificacion' | 'CTS';

export interface EntradaCalculo {
  sueldoBase: number;
  regimen: Regimen;
  tieneHijos: boolean;
  modalidad: Modalidad;
  /** Horas del mes que están dentro de las dos primeras de cada día (recargo 25 %). */
  horasExtra25: number;
  /** Horas del mes a partir de la tercera de cada día (recargo 35 %). */
  horasExtra35: number;
  /** Horas en día de descanso o feriado, sin descanso sustitutorio (sobretasa 100 %). */
  horasDescanso: number;
  minutosTardanza: number;
  diasFalta: number;
  /** Meses completos del semestre (gratificación o CTS). */
  mesesComputables: number;
  /** Días de un mes incompleto. Solo CTS. */
  diasComputables: number;
  /** Si está en EPS, la bonificación extraordinaria es el 75 % de la tasa de EsSalud (6,75 % si EsSalud es 9 %). */
  afiliadoEps: boolean;
}

export interface ResultadoCalculo {
  modalidad: Modalidad;
  sueldoBase: number;
  asignacionFamiliar: number;
  horasExtra: number;
  horasExtra25: number;
  horasExtra35: number;
  horasDescanso: number;
  valorHora: number;
  pagoHoras25: number;
  pagoHoras35: number;
  pagoDescanso: number;
  ingresoExtra: number;
  minutosTardanza: number;
  descuentoTardanza: number;
  diasFalta: number;
  descuentoFalta: number;
  /** Suma de tardanzas y faltas. Las boletas antiguas guardaban aquí un monto libre. */
  tardanzas: number;
  gratificacion: number;
  bonificacionExtraordinaria: number;
  mesesComputables: number;
  diasComputables: number;
  remuneracionComputable: number;
  cts: number;
  bruto: number;
  adelanto: number;
  tasaPension: number;
  aporteAfp: number;
  primaSeguro: number;
  comisionAfp: number;
  pension: number;
  quintaCategoria: number;
  essaludEmpleador: number;
  totalDescuentos: number;
  neto: number;
}

/** Boleta calculada (vista previa o ya emitida). */
export interface Boleta extends ResultadoCalculo {
  empleadoId: string;
  dni: string;
  nombre: string;
  cargo: string;
  regimen: Regimen;
  fechaPago: string; // YYYY-MM-DD
  empresaNombre: string;
  empresaRuc: string;
}

export interface Pago extends Boleta {
  id: string;
  creadoEn: string;
}

export interface FiltroPagos {
  fecha?: string | undefined;
  q?: string | undefined;
}
