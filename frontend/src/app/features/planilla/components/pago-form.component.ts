import { CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { claseValidacion } from '../../../shared/validators/formularios';
import { Empleado } from '../../empleados/data-access/empleado.model';
import { Modalidad, PagoDto } from '../data-access/pago.model';

const hoy = (): string => new Date().toISOString().slice(0, 10);

@Component({
  selector: 'app-pago-form',
  imports: [ReactiveFormsModule, NgClass, CurrencyPipe],
  templateUrl: './pago-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagoFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly empleados = input.required<Empleado[]>();
  readonly guardando = input(false);
  /** Emite el DTO cuando el formulario es válido (o null si no lo es) para refrescar la vista previa. */
  readonly previsualizar = output<PagoDto | null>();
  readonly emitir = output<PagoDto>();

  protected readonly claseValidacion = claseValidacion;
  protected readonly form = this.fb.group({
    empleadoId: ['', Validators.required],
    fechaPago: [hoy(), Validators.required],
    modalidad: ['Mensual' as Modalidad, Validators.required],
    horasExtra: [0, [Validators.required, Validators.min(0), Validators.max(300)]],
    tardanzas: [0, [Validators.required, Validators.min(0)]],
    mesesComputables: [6, [Validators.required, Validators.min(1), Validators.max(6)]],
  });
  protected readonly modalidad = toSignal(this.form.controls.modalidad.valueChanges, { initialValue: 'Mensual' as Modalidad });

  constructor() {
    this.form.valueChanges
      .pipe(startWith(this.form.getRawValue()), debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.previsualizar.emit(this.form.valid ? this.dto() : null));
  }

  limpiar(): void {
    this.form.reset({ empleadoId: '', fechaPago: hoy(), modalidad: 'Mensual', horasExtra: 0, tardanzas: 0, mesesComputables: 6 });
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.emitir.emit(this.dto());
  }

  private dto(): PagoDto {
    const v = this.form.getRawValue();
    return {
      empleadoId: v.empleadoId,
      fechaPago: v.fechaPago,
      modalidad: v.modalidad,
      horasExtra: Number(v.horasExtra),
      tardanzas: Number(v.tardanzas),
      mesesComputables: Number(v.mesesComputables),
    };
  }
}
