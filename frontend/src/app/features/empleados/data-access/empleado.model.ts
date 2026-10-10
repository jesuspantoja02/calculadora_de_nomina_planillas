import { Regimen } from '../../../shared/models/tipos';

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

export type EmpleadoDto = Pick<Empleado, 'dni' | 'nombre' | 'cargo' | 'sueldoBase' | 'regimen' | 'tieneHijos'>;

export interface FiltroEmpleados {
  cargo?: string;
  regimen?: Regimen;
  min?: number;
  max?: number;
}
