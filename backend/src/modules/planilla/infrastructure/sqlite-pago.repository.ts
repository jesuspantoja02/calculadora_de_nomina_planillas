import type { Db } from '../../../shared/infrastructure/sqlite/database.ts';
import { escaparLike } from '../../../shared/utils/like.ts';
import type { FiltroPagos, Pago } from '../domain/pago.ts';
import type { PagoRepository } from '../domain/pago.repository.ts';

interface Fila {
  datos: string;
}

const aPago = (f: Fila): Pago => JSON.parse(f.datos) as Pago;

export class SqlitePagoRepository implements PagoRepository {
  #db: Db;

  constructor(db: Db) {
    this.#db = db;
  }

  async listar(f: FiltroPagos): Promise<Pago[]> {
    const condiciones: string[] = [];
    const params: string[] = [];
    if (f.fecha) { condiciones.push('fecha_pago = ?'); params.push(f.fecha); }
    const q = f.q?.trim().toLowerCase();
    if (q) {
      condiciones.push(`(LOWER(nombre) LIKE ? ESCAPE '\\' OR dni LIKE ? ESCAPE '\\')`);
      params.push(`%${escaparLike(q)}%`, `%${escaparLike(q)}%`);
    }
    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
    const filas = this.#db
      .prepare(`SELECT datos FROM pagos ${where} ORDER BY creado_en DESC, rowid DESC`)
      .all(...params) as unknown as Fila[];
    return filas.map(aPago);
  }

  async buscarPorId(id: string): Promise<Pago | null> {
    const fila = this.#db.prepare('SELECT datos FROM pagos WHERE id = ?').get(id) as unknown as Fila | undefined;
    return fila ? aPago(fila) : null;
  }

  async guardar(p: Pago): Promise<void> {
    this.#db
      .prepare('INSERT INTO pagos (id, empleado_id, dni, nombre, fecha_pago, creado_en, datos) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(p.id, p.empleadoId, p.dni, p.nombre, p.fechaPago, p.creadoEn, JSON.stringify(p));
  }

  async eliminar(id: string): Promise<boolean> {
    return Number(this.#db.prepare('DELETE FROM pagos WHERE id = ?').run(id).changes) > 0;
  }

  async contar(): Promise<number> {
    const fila = this.#db.prepare('SELECT COUNT(*) AS total FROM pagos').get() as unknown as { total: number };
    return Number(fila.total);
  }
}
