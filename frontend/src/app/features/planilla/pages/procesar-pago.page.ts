import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, finalize, of, switchMap } from 'rxjs';
import { ToastService } from '../../../core/notifications/toast.service';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { Empleado } from '../../empleados/data-access/empleado.model';
import { EmpleadosApi } from '../../empleados/data-access/empleados.api';
import { BoletaComponent } from '../components/boleta.component';
import { PagoFormComponent } from '../components/pago-form.component';
import { Boleta, PagoDto } from '../data-access/pago.model';
import { PagosApi } from '../data-access/pagos.api';

@Component({
  selector: 'app-procesar-pago-page',
  imports: [PageHeaderComponent, PagoFormComponent, BoletaComponent],
  templateUrl: './procesar-pago.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcesarPagoPage {
  private readonly empleadosApi = inject(EmpleadosApi);
  private readonly pagosApi = inject(PagosApi);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly vista$ = new Subject<PagoDto | null>();
  private readonly formulario = viewChild(PagoFormComponent);

  protected readonly empleados = signal<Empleado[]>([]);
  protected readonly vistaPrevia = signal<Boleta | null>(null);
  protected readonly emitida = signal<Boleta | null>(null);
  protected readonly guardando = signal(false);

  constructor() {
    this.empleadosApi.listar().pipe(takeUntilDestroyed()).subscribe((lista) => this.empleados.set(lista));

    // POST /pagos/simular en cada cambio válido del formulario (switchMap descarta respuestas obsoletas)
    this.vista$
      .pipe(
        switchMap((dto) => (dto ? this.pagosApi.simular(dto).pipe(catchError(() => of(null))) : of(null))),
        takeUntilDestroyed(),
      )
      .subscribe((b) => this.vistaPrevia.set(b));
  }

  protected previsualizar(dto: PagoDto | null): void {
    if (this.emitida()) return; // tras emitir, se mantiene la boleta hasta pulsar «Nuevo pago»
    this.vista$.next(dto);
  }

  protected emitir(dto: PagoDto): void {
    this.guardando.set(true);
    this.pagosApi
      .emitir(dto)
      .pipe(
        finalize(() => this.guardando.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((pago) => {
        this.emitida.set(pago);
        this.toast.exito(`Boleta emitida para ${pago.nombre}.`);
      });
  }

  protected nuevoPago(): void {
    this.emitida.set(null);
    this.vistaPrevia.set(null);
    this.formulario()?.limpiar();
  }
}
