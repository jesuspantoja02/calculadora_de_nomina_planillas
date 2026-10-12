import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastService } from '../../../core/notifications/toast.service';
import { EntradaDirective } from '../../../shared/ui/entrada.directive';
import { claseValidacion } from '../../../shared/validators/formularios';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { ConfiguracionApi } from '../data-access/configuracion.api';
import { Configuracion, TipoComisionAfp } from '../data-access/configuracion.model';

const pct = (): [number, ValidatorFn[]] => [0, [Validators.required, Validators.min(0), Validators.max(100)]];
const soles = (): [number, ValidatorFn[]] => [0, [Validators.required, Validators.min(0)]];

@Component({
  selector: 'app-configuracion-page',
  imports: [ReactiveFormsModule, NgClass, PageHeaderComponent, EntradaDirective],
  templateUrl: './configuracion.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(ConfiguracionApi);
  private readonly toast = inject(ToastService);

  protected readonly claseValidacion = claseValidacion;
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.group({
    empresaNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    empresaRuc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    aporteAfpPct: pct(),
    primaSeguroPct: pct(),
    comisionFlujoPct: pct(),
    tipoComisionAfp: ['flujo' as TipoComisionAfp, Validators.required],
    remuneracionMaximaAsegurable: soles(),
    tasaOnp: pct(),
    tasaEssalud: pct(),
    rmv: soles(),
    uit: [5500, [Validators.required, Validators.min(1)]],
    adelantoQuincenalPct: pct(),
    aplicarQuintaCategoria: [true],
  });

  constructor() {
    this.api.obtener().pipe(takeUntilDestroyed()).subscribe((c) => this.form.setValue(c));
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const n = (valor: number | string) => Number(valor);
    const config: Configuracion = {
      empresaNombre: v.empresaNombre,
      empresaRuc: v.empresaRuc,
      aporteAfpPct: n(v.aporteAfpPct),
      primaSeguroPct: n(v.primaSeguroPct),
      comisionFlujoPct: n(v.comisionFlujoPct),
      tipoComisionAfp: v.tipoComisionAfp,
      remuneracionMaximaAsegurable: n(v.remuneracionMaximaAsegurable),
      tasaOnp: n(v.tasaOnp),
      tasaEssalud: n(v.tasaEssalud),
      rmv: n(v.rmv),
      uit: n(v.uit),
      adelantoQuincenalPct: n(v.adelantoQuincenalPct),
      aplicarQuintaCategoria: v.aplicarQuintaCategoria,
    };
    this.guardando.set(true);
    this.api
      .actualizar(config)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe(() => this.toast.exito('Configuración guardada.'));
  }

  protected reiniciar(): void {
    if (!confirm('Esto borrará todos los empleados y boletas guardadas. ¿Continuar?')) return;
    this.api.reiniciarDatos().subscribe(() => this.toast.exito('Datos borrados.'));
  }
}
