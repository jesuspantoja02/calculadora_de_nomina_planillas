import { Regimen } from '../../../shared/models/tipos';

export type Modalidad = 'Mensual' | 'Quincena' | 'Gratificacion';

export interface PagoDto {
  empleadoId: string;
  fechaPago: string;
  modalidad: Modalidad;
  horasExtra: number;
  tardanzas: number;
  mesesComputables: number;
}

export interface FiltroPagos {
  fecha?: string;
  q?: string;
}

/** Boleta calculada (vista previa o ya emitida). */
export interface Boleta {
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
  empleadoId: string;
  dni: string;
  nombre: string;
  cargo: string;
  regimen: Regimen;
  fechaPago: string;
  empresaNombre: string;
  empresaRuc: string;
}

export interface Pago extends Boleta {
  id: string;
  creadoEn: string;
}
