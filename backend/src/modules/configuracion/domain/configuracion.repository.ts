import type { Configuracion } from './configuracion.ts';

export interface ConfiguracionRepository {
  obtener(): Promise<Configuracion>;
  guardar(config: Configuracion): Promise<void>;
}

/** Operaciones de mantenimiento que afectan a varios módulos y deben ser atómicas. */
export interface MantenimientoRepository {
  borrarDatosOperativos(): Promise<void>;
}
