import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const DNI_REGEX = /^\d{8}$/;
export const NOMBRE_REGEX = /^[\p{L}][\p{L} .'-]{2,59}$/u;

export const dniValidator: ValidatorFn = Validators.pattern(DNI_REGEX);
export const nombreValidator: ValidatorFn = Validators.pattern(NOMBRE_REGEX);

/** Validador de grupo: el mínimo no puede superar al máximo. */
export const rangoSalarialValidator: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const min = grupo.get('min')?.value as number | null;
  const max = grupo.get('max')?.value as number | null;
  return min !== null && max !== null && min > max ? { rangoInvalido: true } : null;
};

/** Ayuda para las plantillas: clases de Bootstrap según el estado del control. */
export function claseValidacion(control: AbstractControl): Record<string, boolean> {
  return {
    'is-invalid': control.invalid && (control.touched || control.dirty),
    'is-valid': control.valid && control.dirty,
  };
}
