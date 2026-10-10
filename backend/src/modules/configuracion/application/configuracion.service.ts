import type { Configuracion } from '../domain/configuracion.ts';
import type { ConfiguracionRepository, MantenimientoRepository } from '../domain/configuracion.repository.ts';
import type { ConfiguracionDto } from './configuracion.dto.ts';

export class ConfiguracionService {
  #repo: ConfiguracionRepository;
  #mantenimiento: MantenimientoRepository;

  constructor(repo: ConfiguracionRepository, mantenimiento: MantenimientoRepository) {
    this.#repo = repo;
    this.#mantenimiento = mantenimiento;
  }

  obtener(): Promise<Configuracion> {
    return this.#repo.obtener();
  }

  async actualizar(dto: ConfiguracionDto): Promise<Configuracion> {
    const config: Configuracion = { ...dto };
    await this.#repo.guardar(config);
    return config;
  }

  /** Borra empleados y boletas (la configuración se conserva). */
  reiniciarDatos(): Promise<void> {
    return this.#mantenimiento.borrarDatosOperativos();
  }
}
