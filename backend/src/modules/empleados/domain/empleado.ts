export type Regimen = 'AFP' | 'ONP';

export interface Empleado {
  id: string;
  dni: string;
  nombre: string;
  cargo: string;
  sueldoBase: number;
  regimen: Regimen;
  tieneHijos: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface FiltroEmpleados {
  cargo?: string | undefined;
  regimen?: Regimen | undefined;
  min?: number | undefined;
  max?: number | undefined;
}
