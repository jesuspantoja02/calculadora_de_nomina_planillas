import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { EnmascararDniPipe } from '../../../shared/pipes/enmascarar-dni.pipe';
import { IconComponent } from '../../../shared/ui/icon.component';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { BoletaComponent } from '../components/boleta.component';
import { Pago } from '../data-access/pago.model';
import { BoletasStore } from '../data-access/boletas.store';
import { ModalidadLabelPipe } from '../pipes/modalidad-label.pipe';

@Component({
  selector: 'app-boletas-page',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, EnmascararDniPipe, ModalidadLabelPipe, PageHeaderComponent, BoletaComponent, IconComponent],
  templateUrl: './boletas.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoletasPage {
  protected readonly store = inject(BoletasStore);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly filtros = this.fb.group({
    fecha: [''],
    q: ['', Validators.maxLength(60)],
  });

  constructor() {
    this.filtros.valueChanges
      .pipe(startWith(this.filtros.getRawValue()), debounceTime(250), takeUntilDestroyed())
      .subscribe((v) => this.store.filtrar({ ...(v.fecha ? { fecha: v.fecha } : {}), ...(v.q ? { q: v.q } : {}) }));
  }

  protected eliminar(p: Pago): void {
    if (confirm(`¿Eliminar la boleta de ${p.nombre}?`)) this.store.eliminar(p).subscribe();
  }

  protected limpiar(): void {
    this.filtros.reset({ fecha: '', q: '' });
  }
}
