import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CARGOS, Regimen } from '../../../shared/models/tipos';
import { claseValidacion, dniValidator, nombreValidator } from '../../../shared/validators/formularios';
import { Empleado, EmpleadoDto } from '../data-access/empleado.model';

/** Componente de presentación: no conoce HTTP ni el store, solo recibe datos y emite eventos. */
@Component({
  selector: 'app-empleado-form',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './empleado-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly empleado = input<Empleado | null>(null);
  readonly guardando = input(false);
  readonly guardar = output<EmpleadoDto>();
  readonly cancelar = output<void>();

  protected readonly cargos = CARGOS;
  protected readonly claseValidacion = claseValidacion;

  protected readonly form = this.fb.group({
    dni: ['', [Validators.required, dniValidator]],
    nombre: ['', [Validators.required, nombreValidator]],
    cargo: ['', Validators.required],
    sueldoBase: [null as number | null, [Validators.required, Validators.min(0.01), Validators.max(1_000_000)]],
    regimen: ['' as Regimen | '', Validators.required],
    tieneHijos: [false],
  });

  constructor() {
    effect(() => {
      const e = this.empleado();
      if (e) {
        this.form.setValue({ dni: e.dni, nombre: e.nombre, cargo: e.cargo, sueldoBase: e.sueldoBase, regimen: e.regimen, tieneHijos: e.tieneHijos });
      } else {
        this.limpiar();
      }
    });
  }

  limpiar(): void {
    this.form.reset({ dni: '', nombre: '', cargo: '', sueldoBase: null, regimen: '', tieneHijos: false });
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.guardar.emit({
      dni: v.dni,
      nombre: v.nombre,
      cargo: v.cargo,
      sueldoBase: Number(v.sueldoBase),
      regimen: v.regimen as Regimen,
      tieneHijos: v.tieneHijos,
    });
  }
}
