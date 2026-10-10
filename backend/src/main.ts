import { resolve } from 'node:path';
import { crearApp } from './app.ts';
import { construirServicios } from './container.ts';
import { env, origenesPermitidos } from './shared/config/env.ts';
import { abrirBaseDatos } from './shared/infrastructure/sqlite/database.ts';

const db = abrirBaseDatos(resolve(env.DATABASE_FILE));
const app = crearApp({
  servicios: construirServicios(db),
  origenesPermitidos,
  limiteRequests: env.RATE_LIMIT_MAX,
  registrarAccesos: env.NODE_ENV !== 'test',
});

const servidor = app.listen(env.PORT, () => {
  console.log(`API de nómina escuchando en http://localhost:${env.PORT}/api/v1 (${env.NODE_ENV})`);
});

const apagar = (senal: string) => {
  console.log(`${senal} recibido, cerrando servidor...`);
  servidor.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000).unref();
};
process.on('SIGINT', () => apagar('SIGINT'));
process.on('SIGTERM', () => apagar('SIGTERM'));
process.on('unhandledRejection', (motivo) => console.error('[unhandledRejection]', motivo));
