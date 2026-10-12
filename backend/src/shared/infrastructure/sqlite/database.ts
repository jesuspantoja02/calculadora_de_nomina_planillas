import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { MIGRACIONES } from './migraciones.ts';

export type Db = DatabaseSync;

/** Abre (o crea) la base de datos y aplica las migraciones pendientes. Usa ':memory:' en pruebas. */
export function abrirBaseDatos(ruta: string): Db {
  if (ruta !== ':memory:') mkdirSync(dirname(ruta), { recursive: true });
  const db = new DatabaseSync(ruta);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  migrar(db);
  return db;
}

function migrar(db: Db): void {
  const { user_version } = db.prepare('PRAGMA user_version').get() as { user_version: number };
  MIGRACIONES.forEach((sql, i) => {
    const version = i + 1;
    if (version <= user_version) return;
    enTransaccion(db, () => {
      db.exec(sql);
      db.exec(`PRAGMA user_version = ${version}`);
    });
  });
}

export function enTransaccion<T>(db: Db, fn: () => T): T {
  db.exec('BEGIN');
  try {
    const resultado = fn();
    db.exec('COMMIT');
    return resultado;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export const esViolacionUnique = (error: unknown): boolean =>
  error instanceof Error && error.message.includes('UNIQUE constraint failed');
