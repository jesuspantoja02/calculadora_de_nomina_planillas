import { Regimen } from '../../../shared/models/tipos';

export type Modalidad = 'Mensual' | 'Quincena' | 'Gratificacion' | 'CTS';

export interface PagoDto {
  empleadoId: string;
  fechaPago: string;
  modalidad: Modalidad;
  horasExtra25: number;
  horasExtra35: number;
  horasDescanso: number;
  minutosTardanza: number;
  diasFalta: number;
  mesesComputables: number;
  diasComputables: number;
  afiliadoEps: boolean;
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
