import { resolve } from 'node:path';
import { construirServicios } from '../src/container.ts';
import { abrirBaseDatos } from '../src/shared/infrastructure/sqlite/database.ts';

const db = abrirBaseDatos(resolve(process.env['DATABASE_FILE'] ?? 'data/nomina.db'));
const servicios = construirServicios(db);

const demo = [
  { dni: '70123456', nombre: 'Ana Torres Quispe', cargo: 'Desarrollador', sueldoBase: 4500, regimen: 'AFP', tieneHijos: true },
  { dni: '45871236', nombre: 'Luis Ramos Huamán', cargo: 'Almacenero', sueldoBase: 1500, regimen: 'ONP', tieneHijos: false },
  { dni: '72654381', nombre: 'Carla Vega Soto', cargo: 'Analista', sueldoBase: 3200, regimen: 'AFP', tieneHijos: false },
] as const;

for (const e of demo) {
  try {
    await servicios.empleados.crear({ ...e });
    console.log(`+ ${e.nombre}`);
  } catch (error) {
    console.log(`= ${e.nombre} (${(error as Error).message})`);
  }
}
db.close();
