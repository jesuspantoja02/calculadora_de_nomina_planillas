import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../notifications/toast.service';

interface CuerpoError {
  error?: { message?: string; details?: { campo: string; mensaje: string }[] };
}

function mensajeDe(err: HttpErrorResponse): string {
  if (err.status === 0) return 'No se pudo conectar con el servidor. ¿Está encendido el backend?';
  const cuerpo = err.error as CuerpoError | null;
  const detalles = cuerpo?.error?.details;
  if (Array.isArray(detalles) && detalles.length > 0) {
    return detalles.map((d) => `${d.campo}: ${d.mensaje}`).join(' · ');
  }
  return cuerpo?.error?.message ?? `Error inesperado (${err.status}).`;
}

/** Interceptor funcional: muestra un aviso con el error del servidor y lo vuelve a lanzar. */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      toast.error(mensajeDe(err));
      return throwError(() => err);
    }),
  );
};
