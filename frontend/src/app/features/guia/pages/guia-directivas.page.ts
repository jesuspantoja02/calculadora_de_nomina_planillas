import { NgClass, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';

type EstadoPlanilla = 'borrador' | 'aprobada' | 'pagada';

/**
 * Guía didáctica de directivas de la Unidad 2.
 *
 * Aquí se usan a propósito las directivas clásicas *ngIf, *ngFor y [ngSwitch] porque son las que
 * pide el temario. Desde Angular 20 están marcadas como "deprecated" a favor del control flow
 * integrado (@if, @for, @switch), que es el que se usa en el resto de la aplicación.
 * Si una versión futura de Angular las elimina, borra este componente y su ruta en app.routes.ts.
 */
@Component({
  selector: 'app-guia-directivas-page',
  imports: [NgClass, NgStyle, NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, TitleCasePipe, PageHeaderComponent],
  templateUrl: './guia-directivas.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuiaDirectivasPage {
  protected readonly estados: EstadoPlanilla[] = ['borrador', 'aprobada', 'pagada'];
  protected readonly estado = signal<EstadoPlanilla>('borrador');
  protected readonly tamanio = signal(16);

  protected readonly conceptos = [
    { nombre: 'Sueldo básico', tipo: 'ingreso' },
    { nombre: 'Horas extra', tipo: 'ingreso' },
    { nombre: 'AFP / ONP', tipo: 'descuento' },
    { nombre: 'Tardanzas / faltas', tipo: 'descuento' },
  ];
}
