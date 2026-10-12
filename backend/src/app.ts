import cors from 'cors';
import express, { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import type { Servicios } from './container.ts';
import { crearConfiguracionRouter } from './modules/configuracion/presentation/configuracion.routes.ts';
import { crearDashboardRouter } from './modules/dashboard/presentation/dashboard.routes.ts';
import { crearEmpleadoRouter } from './modules/empleados/presentation/empleado.routes.ts';
import { crearPagoRouter } from './modules/planilla/presentation/pago.routes.ts';
import { errorHandler, noEncontradoHandler } from './shared/http/error-handler.ts';

export interface OpcionesApp {
  servicios: Servicios;
  origenesPermitidos: string[];
  limiteRequests: number;
  registrarAccesos?: boolean;
}

export function crearApp({ servicios, origenesPermitidos, limiteRequests, registrarAccesos = false }: OpcionesApp) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet()); // CSP, HSTS, X-Content-Type-Options, X-Frame-Options, etc.
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || origenesPermitidos.includes(origin)),
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type'],
      maxAge: 600,
    }),
  );
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: limiteRequests, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use(express.json({ limit: '10kb' }));

  if (registrarAccesos) {
    // Log de accesos sin query string (puede contener nombres o DNI).
    app.use((req, res, next) => {
      const inicio = performance.now();
      res.on('finish', () => {
        console.log(JSON.stringify({ metodo: req.method, ruta: req.originalUrl.split('?')[0], estado: res.statusCode, ms: Math.round(performance.now() - inicio) }));
      });
      next();
    });
  }

  const v1 = Router();
  v1.get('/health', (_req, res) => {
    res.json({ data: { estado: 'ok', hora: new Date().toISOString() } });
  });
  v1.use('/empleados', crearEmpleadoRouter(servicios.empleados));
  v1.use('/pagos', crearPagoRouter(servicios.pagos));
  v1.use(crearConfiguracionRouter(servicios.configuracion));
  v1.use(crearDashboardRouter(servicios.dashboard));
  app.use('/api/v1', v1);

  app.use(noEncontradoHandler);
  app.use(errorHandler);
  return app;
}
