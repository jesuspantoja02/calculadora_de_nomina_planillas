export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const noEncontrado = (recurso: string) => new AppError(404, 'NO_ENCONTRADO', `${recurso} no encontrado.`);
export const conflicto = (code: string, mensaje: string) => new AppError(409, code, mensaje);
