import { CurrencyPipe, DatePipe, PercentPipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, inject, input } from '@angular/core';
import { EnmascararDniPipe } from '../../../shared/pipes/enmascarar-dni.pipe';
import { InicialesPipe } from '../../../shared/pipes/iniciales.pipe';
import { IconComponent } from '../../../shared/ui/icon.component';
import { Boleta } from '../data-access/pago.model';
import { ModalidadLabelPipe } from '../pipes/modalidad-label.pipe';

@Component({
  selector: 'app-boleta',
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, PercentPipe, InicialesPipe, EnmascararDniPipe, ModalidadLabelPipe, IconComponent],
  templateUrl: './boleta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoletaComponent {
  readonly boleta = input.required<Boleta>();
  readonly mostrarImprimir = input(true);
  private readonly document = inject(DOCUMENT);

  protected imprimir(): void {
    this.document.defaultView?.print();
  }
}
