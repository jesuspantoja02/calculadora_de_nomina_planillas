import type { Empleado, FiltroEmpleados } from './empleado.ts';

/** Puerto de salida: la capa de aplicación depende de esta interfaz, no de la base de datos. */
export interface EmpleadoRepository {
  listar(filtro: FiltroEmpleados): Promise<Empleado[]>;
  buscarPorId(id: string): Promise<Empleado | null>;
  /** Inserta o actualiza. Lanza AppError 409 si el DNI ya existe en otro empleado. */
  guardar(empleado: Empleado): Promise<void>;
  eliminar(id: string): Promise<boolean>;
}
