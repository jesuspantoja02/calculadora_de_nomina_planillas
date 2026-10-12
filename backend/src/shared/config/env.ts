import { z } from 'zod';

const esquema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CORS_ORIGINS: z.string().default('http://localhost:4200'),
  DATABASE_FILE: z.string().default('data/nomina.db'),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(300),
});

const resultado = esquema.safeParse(process.env);
if (!resultado.success) {
  console.error('Variables de entorno inválidas:\n' + z.prettifyError(resultado.error));
  process.exit(1);
}

export const env = resultado.data;
export const origenesPermitidos = env.CORS_ORIGINS.split(',')
  .map((o) => o.trim())
  .filter(Boolean);
