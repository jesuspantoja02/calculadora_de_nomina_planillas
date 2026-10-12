import { enTransaccion, type Db } from '../../../shared/infrastructure/sqlite/database.ts';
import { CONFIG_POR_DEFECTO, type Configuracion } from '../domain/configuracion.ts';
import type { ConfiguracionRepository, MantenimientoRepository } from '../domain/configuracion.repository.ts';

export class SqliteConfiguracionRepository implements ConfiguracionRepository, MantenimientoRepository {
  #db: Db;

  constructor(db: Db) {
    this.#db = db;
  }

  async obtener(): Promise<Configuracion> {
    const fila = this.#db.prepare('SELECT datos FROM configuracion WHERE id = 1').get() as unknown as
      | { datos: string }
      | undefined;
    const guardada = fila ? (JSON.parse(fila.datos) as Partial<Configuracion>) : {};
    const config = { ...CONFIG_POR_DEFECTO };
    for (const clave of Object.keys(config) as (keyof Configuracion)[]) {
      const valor = guardada[clave];
      if (valor !== undefined) config[clave] = valor as never;
    }
    return config;
  }

  async guardar(config: Configuracion): Promise<void> {
    this.#db
      .prepare(
        `INSERT INTO configuracion (id, datos) VALUES (1, ?)
         ON CONFLICT(id) DO UPDATE SET datos = excluded.datos`,
      )
      .run(JSON.stringify(config));
  }

  async borrarDatosOperativos(): Promise<void> {
    enTransaccion(this.#db, () => {
      this.#db.exec('DELETE FROM pagos');
      this.#db.exec('DELETE FROM empleados');
    });
  }
}
