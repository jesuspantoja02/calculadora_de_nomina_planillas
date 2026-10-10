import { Pipe, PipeTransform } from '@angular/core';

/** "12345678" -> "12****78" */
@Pipe({ name: 'enmascararDni' })
export class EnmascararDniPipe implements PipeTransform {
  transform(dni: string | null | undefined): string {
    const v = dni ?? '';
    return v.length === 8 ? `${v.slice(0, 2)}****${v.slice(-2)}` : v;
  }
}
