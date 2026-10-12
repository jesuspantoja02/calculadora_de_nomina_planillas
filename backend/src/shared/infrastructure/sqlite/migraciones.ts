/**
 * Migraciones versionadas. El índice + 1 es la versión (PRAGMA user_version).
 * Para evolucionar el esquema, AGREGA un elemento nuevo; nunca edites uno ya publicado.
 */
export const MIGRACIONES: readonly string[] = [
  `
  CREATE TABLE empleados (
    id             TEXT PRIMARY KEY,
    dni            TEXT NOT NULL UNIQUE,
    nombre         TEXT NOT NULL,
    cargo          TEXT NOT NULL,
    sueldo_base    REAL NOT NULL CHECK (sueldo_base > 0),
    regimen        TEXT NOT NULL CHECK (regimen IN ('AFP', 'ONP')),
    tiene_hijos    INTEGER NOT NULL DEFAULT 0 CHECK (tiene_hijos IN (0, 1)),
    creado_en      TEXT NOT NULL,
    actualizado_en TEXT NOT NULL
  );
  CREATE INDEX idx_empleados_cargo ON empleados (cargo);

  -- Cada boleta es una "fotografía": no depende de que el empleado siga existiendo.
  CREATE TABLE pagos (
    id          TEXT PRIMARY KEY,
    empleado_id TEXT NOT NULL,
    dni         TEXT NOT NULL,
    nombre      TEXT NOT NULL,
    fecha_pago  TEXT NOT NULL,
    creado_en   TEXT NOT NULL,
    datos       TEXT NOT NULL
  );
  CREATE INDEX idx_pagos_fecha ON pagos (fecha_pago);
  CREATE INDEX idx_pagos_creado ON pagos (creado_en);

  CREATE TABLE configuracion (
    id    INTEGER PRIMARY KEY CHECK (id = 1),
    datos TEXT NOT NULL
  );
  `,
];
