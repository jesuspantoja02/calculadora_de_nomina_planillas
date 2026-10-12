import { CurrencyPipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EnmascararDniPipe } from '../../../shared/pipes/enmascarar-dni.pipe';
import { InicialesPipe } from '../../../shared/pipes/iniciales.pipe';
import { IconComponent } from '../../../shared/ui/icon.component';
import { Empleado } from '../data-access/empleado.model';

@Component({
  selector: 'app-empleado-lista',
  imports: [NgClass, CurrencyPipe, TitleCasePipe, InicialesPipe, EnmascararDniPipe, IconComponent],
  template: `
    @if (cargando()) {
      <p class="empty">Cargando…</p>
    } @else {
      @for (e of items(); track e.id) {
        <div class="row-item" [class.selected]="e.id === editandoId()">
          <span class="avatar" aria-hidden="true">{{ e.nombre | iniciales }}</span>
          <div class="flex-grow-1 min-w-0">
            <div class="fw-semibold text-truncate">{{ e.nombre | titlecase }}</div>
            <small class="text-secondary">{{ e.cargo }} · DNI {{ e.dni | enmascararDni }}</small>
          </div>
          <div class="text-end">
            <div class="fw-semibold">{{ e.sueldoBase | currency: 'PEN' : 'symbol' : '1.2-2' }}</div>
            <span class="badge" [ngClass]="e.regimen === 'AFP' ? 'text-bg-info' : 'text-bg-warning'">{{ e.regimen }}</span>
            @if (e.tieneHijos) {
              <span class="badge text-bg-secondary ms-1">Hijos</span>
            }
          </div>
          <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-outline-primary" [attr.aria-label]="'Editar ' + e.nombre" (click)="editar.emit(e)">
              <app-icon nombre="edit" />
            </button>
            <button type="button" class="btn btn-outline-danger" [attr.aria-label]="'Eliminar ' + e.nombre" (click)="eliminar.emit(e)">
              <app-icon nombre="trash" />
            </button>
          </div>
        </div>
      } @empty {
        <p class="empty">No hay empleados que coincidan. Registra el primero con el formulario.</p>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoListaComponent {
  readonly items = input.required<Empleado[]>();
  readonly cargando = input(false);
  readonly editandoId = input<string | null>(null);
  readonly editar = output<Empleado>();
  readonly eliminar = output<Empleado>();
}
