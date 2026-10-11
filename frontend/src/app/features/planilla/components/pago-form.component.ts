import { CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { EntradaDirective } from '../../../shared/ui/entrada.directive';
import { claseValidacion } from '../../../shared/validators/formularios';
import { Empleado } from '../../empleados/data-access/empleado.model';
import { Modalidad, PagoDto } from '../data-access/pago.model';

const hoy = (): string => new Date().toISOString().slice(0, 10);

@Component({
  selector: 'app-pago-form',
  imports: [ReactiveFormsModule, NgClass, CurrencyPipe, EntradaDirective],
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
    horasExtra25: [0, [Validators.required, Validators.min(0), Validators.max(200)]],
    horasExtra35: [0, [Validators.required, Validators.min(0), Validators.max(200)]],
    horasDescanso: [0, [Validators.required, Validators.min(0), Validators.max(200)]],
    minutosTardanza: [0, [Validators.required, Validators.min(0), Validators.max(20_000)]],
    diasFalta: [0, [Validators.required, Validators.min(0), Validators.max(31)]],
    mesesComputables: [6, [Validators.required, Validators.min(0), Validators.max(6)]],
    diasComputables: [0, [Validators.required, Validators.min(0), Validators.max(30)]],
    afiliadoEps: [false],
  });
  protected readonly modalidad = toSignal(this.form.controls.modalidad.valueChanges, { initialValue: 'Mensual' as Modalidad });

  constructor() {
    this.form.valueChanges
      .pipe(startWith(this.form.getRawValue()), debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.previsualizar.emit(this.form.valid ? this.dto() : null));
  }

  limpiar(): void {
    this.form.reset({
      empleadoId: '',
      fechaPago: hoy(),
      modalidad: 'Mensual',
      horasExtra25: 0,
      horasExtra35: 0,
      horasDescanso: 0,
      minutosTardanza: 0,
      diasFalta: 0,
      mesesComputables: 6,
      diasComputables: 0,
      afiliadoEps: false,
    });
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
      horasExtra25: Number(v.horasExtra25),
      horasExtra35: Number(v.horasExtra35),
      horasDescanso: Number(v.horasDescanso),
      minutosTardanza: Number(v.minutosTardanza),
      diasFalta: Number(v.diasFalta),
      mesesComputables: Number(v.mesesComputables),
      diasComputables: Number(v.diasComputables),
      afiliadoEps: v.afiliadoEps,
    };
  }
}
