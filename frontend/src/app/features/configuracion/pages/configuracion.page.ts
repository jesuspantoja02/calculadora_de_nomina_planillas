import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastService } from '../../../core/notifications/toast.service';
import { claseValidacion } from '../../../shared/validators/formularios';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { ConfiguracionApi } from '../data-access/configuracion.api';
import { Configuracion } from '../data-access/configuracion.model';

const pct = (): [number, ValidatorFn[]] => [0, [Validators.required, Validators.min(0), Validators.max(100)]];
const soles = (): [number, ValidatorFn[]] => [0, [Validators.required, Validators.min(0)]];

@Component({
  selector: 'app-configuracion-page',
  imports: [ReactiveFormsModule, NgClass, PageHeaderComponent],
  templateUrl: './configuracion.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(ConfiguracionApi);
  private readonly toast = inject(ToastService);

  protected readonly claseValidacion = claseValidacion;
  protected readonly guardando = signal(false);

  protected readonly tasas: { id: keyof Configuracion; etiqueta: string }[] = [
    { id: 'tasaAfp', etiqueta: 'AFP' },
    { id: 'tasaOnp', etiqueta: 'ONP' },
    { id: 'tasaSalud', etiqueta: 'EsSalud' },
    { id: 'tasaImpuesto', etiqueta: 'Impuesto (estimación del dashboard)' },
    { id: 'adelantoQuincenalPct', etiqueta: 'Adelanto quincenal' },
    { id: 'bonificacionExtraordinariaPct', etiqueta: 'Bonificación extraordinaria' },
  ];

  protected readonly form = this.fb.group({
    empresaNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    empresaRuc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    tasaAfp: pct(),
    tasaOnp: pct(),
    tasaSalud: pct(),
    tasaImpuesto: pct(),
    adelantoQuincenalPct: pct(),
    bonificacionExtraordinariaPct: pct(),
    valorHoraExtra: soles(),
    asignacionFamiliar: soles(),
    uit: [5500, [Validators.required, Validators.min(1)]],
    aplicarQuintaCategoria: [false],
  });

  constructor() {
    this.api.obtener().pipe(takeUntilDestroyed()).subscribe((c) => this.form.setValue(c));
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.api
      .actualizar(this.form.getRawValue() satisfies Configuracion)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe(() => this.toast.exito('Configuración guardada.'));
  }

  protected reiniciar(): void {
    if (!confirm('Esto borrará todos los empleados y boletas guardadas. ¿Continuar?')) return;
    this.api.reiniciarDatos().subscribe(() => this.toast.exito('Datos borrados.'));
  }
}
