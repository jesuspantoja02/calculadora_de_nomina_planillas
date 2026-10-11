import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const DNI_REGEX = /^\d{8}$/;
export const NOMBRE_REGEX = /^[\p{L}][\p{L} .'-]{2,59}$/u;

export const dniValidator: ValidatorFn = Validators.pattern(DNI_REGEX);
export const nombreValidator: ValidatorFn = Validators.pattern(NOMBRE_REGEX);

const aNumero = (valor: unknown): number | null => {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
};

/** Validador de grupo: el mínimo no puede superar al máximo. */
export const rangoSalarialValidator: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const min = aNumero(grupo.get('min')?.value);
  const max = aNumero(grupo.get('max')?.value);
  return min !== null && max !== null && min > max ? { rangoInvalido: true } : null;
};

export type TipoEntrada = 'dni' | 'ruc' | 'nombre' | 'empresa' | 'busqueda' | 'decimal' | 'entero';

export interface LimitesEntrada {
  max?: number;
  decimales?: number;
  min?: number;
}

const TEXTO: Record<'nombre' | 'empresa' | 'busqueda', RegExp> = {
  nombre: /^$|^[\p{L}][\p{L} .'-]*$/u,
  empresa: /^$|^[\p{L}\p{N}][\p{L}\p{N} .,&'-]*$/u,
  busqueda: /^[\p{L}\p{N} ]*$/u,
};

/** Vacío se permite mientras se escribe. El resto tiene que coincidir con el campo. */
export function entradaValida(tipo: TipoEntrada, valor: string, limites: LimitesEntrada = {}): boolean {
  if (valor === '') return true;
  if (tipo === 'dni') return /^\d{1,8}$/.test(valor);
  if (tipo === 'ruc') return /^\d{1,11}$/.test(valor);
  if (tipo === 'nombre' || tipo === 'empresa' || tipo === 'busqueda') {
    return valor.length <= 60 && TEXTO[tipo].test(valor);
  }
  const decimales = limites.decimales ?? (tipo === 'entero' ? 0 : 2);
  const patron = decimales === 0 ? /^\d+$/ : new RegExp(`^\\d+(\\.\\d{0,${decimales}})?$|^\\d+\\.$`);
  if (!patron.test(valor) || valor === '.') return false;
  if (valor.endsWith('.')) return true;
  const n = Number(valor);
  if (!Number.isFinite(n)) return false;
  if (limites.min !== undefined && n < limites.min) return false;
  if (limites.max !== undefined && n > limites.max) return false;
  return true;
}

/** Conserva solo los caracteres que el campo acepta, en el orden escrito. */
export function filtrarEntrada(tipo: TipoEntrada, valor: string, limites: LimitesEntrada = {}): string {
  let out = '';
  for (const ch of valor.replace(/,/g, '.')) {
    const next = out + ch;
    if (entradaValida(tipo, next, limites)) out = next;
  }
  return out;
}

/** Ayuda para las plantillas: clases de Bootstrap según el estado del control. */
export function claseValidacion(control: AbstractControl): Record<string, boolean> {
  return {
    'is-invalid': control.invalid && (control.touched || control.dirty),
    'is-valid': control.valid && control.dirty,
  };
}
