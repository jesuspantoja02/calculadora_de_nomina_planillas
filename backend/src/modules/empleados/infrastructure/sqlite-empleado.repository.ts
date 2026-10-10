import { conflicto } from '../../../shared/errors/app-error.ts';
import { esViolacionUnique, type Db } from '../../../shared/infrastructure/sqlite/database.ts';
import type { Empleado, FiltroEmpleados, Regimen } from '../domain/empleado.ts';
import type { EmpleadoRepository } from '../domain/empleado.repository.ts';

interface Fila {
  id: string;
  dni: string;
  nombre: string;
  cargo: string;
  sueldo_base: number;
  regimen: string;
  tiene_hijos: number;
  creado_en: string;
  actualizado_en: string;
}

const aEmpleado = (f: Fila): Empleado => ({
  id: f.id,
  dni: f.dni,
  nombre: f.nombre,
  cargo: f.cargo,
  sueldoBase: f.sueldo_base,
  regimen: f.regimen as Regimen,
  tieneHijos: f.tiene_hijos === 1,
  creadoEn: f.creado_en,
  actualizadoEn: f.actualizado_en,
});

export class SqliteEmpleadoRepository implements EmpleadoRepository {
  #db: Db;

  constructor(db: Db) {
    this.#db = db;
  }

  async listar(f: FiltroEmpleados): Promise<Empleado[]> {
    const condiciones: string[] = [];
    const params: (string | number)[] = [];
    if (f.cargo) { condiciones.push('cargo = ?'); params.push(f.cargo); }
    if (f.regimen) { condiciones.push('regimen = ?'); params.push(f.regimen); }
    if (f.min !== undefined) { condiciones.push('sueldo_base >= ?'); params.push(f.min); }
    if (f.max !== undefined) { condiciones.push('sueldo_base <= ?'); params.push(f.max); }
    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
    const filas = this.#db
      .prepare(`SELECT * FROM empleados ${where} ORDER BY nombre COLLATE NOCASE`)
      .all(...params) as unknown as Fila[];
    return filas.map(aEmpleado);
  }

  async buscarPorId(id: string): Promise<Empleado | null> {
    const fila = this.#db.prepare('SELECT * FROM empleados WHERE id = ?').get(id) as unknown as Fila | undefined;
    return fila ? aEmpleado(fila) : null;
  }

  async guardar(e: Empleado): Promise<void> {
    try {
      this.#db
        .prepare(
          `INSERT INTO empleados (id, dni, nombre, cargo, sueldo_base, regimen, tiene_hijos, creado_en, actualizado_en)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             dni = excluded.dni, nombre = excluded.nombre, cargo = excluded.cargo,
             sueldo_base = excluded.sueldo_base, regimen = excluded.regimen,
             tiene_hijos = excluded.tiene_hijos, actualizado_en = excluded.actualizado_en`,
        )
        .run(e.id, e.dni, e.nombre, e.cargo, e.sueldoBase, e.regimen, e.tieneHijos ? 1 : 0, e.creadoEn, e.actualizadoEn);
    } catch (error) {
      if (esViolacionUnique(error)) throw conflicto('DNI_DUPLICADO', 'Ya existe un empleado registrado con este DNI.');
      throw error;
    }
  }

  async eliminar(id: string): Promise<boolean> {
    return Number(this.#db.prepare('DELETE FROM empleados WHERE id = ?').run(id).changes) > 0;
  }
}
