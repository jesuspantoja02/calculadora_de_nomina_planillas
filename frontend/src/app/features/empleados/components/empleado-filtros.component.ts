import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, filter, startWith } from 'rxjs';
import { CARGOS, Regimen } from '../../../shared/models/tipos';
import { rangoSalarialValidator } from '../../../shared/validators/formularios';
import { FiltroEmpleados } from '../data-access/empleado.model';

@Component({
  selector: 'app-empleado-filtros',
  imports: [ReactiveFormsModule, NgClass],
  template: `
    <form class="row g-2 mb-3" [formGroup]="form">
      <div class="col-6 col-md-3">
        <select class="form-select form-select-sm" formControlName="cargo" aria-label="Filtrar por cargo">
          <option value="">Todos los cargos</option>
          @for (c of cargos; track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select>
      </div>
      <div class="col-6 col-md-3">
        <select class="form-select form-select-sm" formControlName="regimen" aria-label="Filtrar por régimen">
          <option value="">AFP y ONP</option>
          <option value="AFP">Solo AFP</option>
          <option value="ONP">Solo ONP</option>
        </select>
      </div>
      <div class="col-4 col-md-2">
        <input type="number" class="form-control form-control-sm" placeholder="Mín" formControlName="min" aria-label="Sueldo mínimo"
               [ngClass]="{ 'is-invalid': form.hasError('rangoInvalido') }">
      </div>
      <div class="col-4 col-md-2">
        <input type="number" class="form-control form-control-sm" placeholder="Máx" formControlName="max" aria-label="Sueldo máximo"
               [ngClass]="{ 'is-invalid': form.hasError('rangoInvalido') }">
      </div>
      <div class="col-4 col-md-2">
        <button type="button" class="btn btn-sm btn-outline-secondary w-100" (click)="limpiar()">Limpiar</button>
      </div>
      @if (form.hasError('rangoInvalido')) {
        <div class="invalid-msg">El mínimo no puede ser mayor que el máximo.</div>
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoFiltrosComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  /** Régimen que llega desde la URL (?regimen=AFP). */
  readonly regimenInicial = input<string | undefined>();
  readonly cambio = output<FiltroEmpleados>();

  protected readonly cargos = CARGOS;
  protected readonly form = this.fb.group(
    {
      cargo: [''],
      regimen: ['' as Regimen | ''],
      min: [null as number | null, Validators.min(0)],
      max: [null as number | null, Validators.min(0)],
    },
    { validators: rangoSalarialValidator },
  );

  constructor() {
    effect(() => {
      const r = this.regimenInicial();
      if (r === 'AFP' || r === 'ONP') this.form.controls.regimen.setValue(r);
    });

    this.form.valueChanges
      .pipe(
        startWith(this.form.getRawValue()),
        debounceTime(250),
        filter(() => this.form.valid),
        takeUntilDestroyed(),
      )
      .subscribe((v) => {
        const f: FiltroEmpleados = {};
        if (v.cargo) f.cargo = v.cargo;
        if (v.regimen) f.regimen = v.regimen;
        if (v.min !== null && v.min !== undefined) f.min = v.min;
        if (v.max !== null && v.max !== undefined) f.max = v.max;
        this.cambio.emit(f);
      });
  }

  protected limpiar(): void {
    this.form.reset({ cargo: '', regimen: '', min: null, max: null });
  }
}
