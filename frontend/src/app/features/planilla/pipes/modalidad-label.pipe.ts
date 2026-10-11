import { Pipe, PipeTransform } from '@angular/core';
import { Modalidad } from '../data-access/pago.model';

const ETIQUETAS: Record<Modalidad, string> = {
  Mensual: 'Pago fin de mes',
  Quincena: 'Adelanto quincenal',
  Gratificacion: 'Gratificación',
  CTS: 'CTS',
};

@Pipe({ name: 'modalidadLabel' })
export class ModalidadLabelPipe implements PipeTransform {
  transform(valor: Modalidad): string {
    return ETIQUETAS[valor] ?? valor;
  }
}
