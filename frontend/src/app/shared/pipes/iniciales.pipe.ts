import { Pipe, PipeTransform } from '@angular/core';

/** "Ana Torres Quispe" -> "AT" */
@Pipe({ name: 'iniciales' })
export class InicialesPipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    return (valor ?? '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  }
}
