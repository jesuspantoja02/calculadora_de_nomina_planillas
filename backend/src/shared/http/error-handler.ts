import type { ErrorRequestHandler, RequestHandler } from 'express';
import { z } from 'zod';
import { AppError } from '../errors/app-error.ts';

export const noEncontradoHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { code: 'RUTA_NO_ENCONTRADA', message: 'La ruta solicitada no existe.' } });
};

/**
 * Manejador central de errores. Nunca devuelve stack traces ni mensajes internos al cliente:
 * el detalle de los errores inesperados solo se registra en el servidor.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDACION',
        message: 'Los datos enviados no son válidos.',
        details: err.issues.map((i) => ({ campo: i.path.join('.') || '(raíz)', mensaje: i.message })),
      },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
    return;
  }

  // Errores 4xx del parser JSON (JSON malformado, cuerpo demasiado grande, etc.)
  const e = err as { status?: unknown; type?: unknown };
  if (typeof e.status === 'number' && e.status >= 400 && e.status < 500) {
    const message = e.type === 'entity.too.large' ? 'El cuerpo de la petición es demasiado grande.' : 'Solicitud inválida.';
    res.status(e.status).json({ error: { code: 'SOLICITUD_INVALIDA', message } });
    return;
  }

  console.error('[error no controlado]', err);
  res.status(500).json({ error: { code: 'ERROR_INTERNO', message: 'Ocurrió un error interno. Inténtalo más tarde.' } });
};
