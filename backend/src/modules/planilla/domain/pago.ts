import type { Regimen } from '../../empleados/domain/empleado.ts';

export type Modalidad = 'Mensual' | 'Quincena' | 'Gratificacion';

export interface EntradaCalculo {
  sueldoBase: number;
  regimen: Regimen;
  tieneHijos: boolean;
  modalidad: Modalidad;
  horasExtra: number;
  tardanzas: number; // S/ a descontar
  mesesComputables: number; // 1..6, solo gratificación
}

export interface ResultadoCalculo {
  modalidad: Modalidad;
  sueldoBase: number;
  asignacionFamiliar: number;
  horasExtra: number;
  ingresoExtra: number;
  gratificacion: number;
  bonificacionExtraordinaria: number;
  bruto: number;
  adelanto: number;
  tasaPension: number;
  pension: number;
  tardanzas: number;
  quintaCategoria: number;
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
