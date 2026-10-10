import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { ToastService } from '../../../core/notifications/toast.service';
import { FiltroPagos, Pago } from './pago.model';
import { PagosApi } from './pagos.api';

/** Estado del historial de boletas (provisto a nivel de ruta). */
@Injectable()
export class BoletasStore {
  private readonly api = inject(PagosApi);
  private readonly toast = inject(ToastService);

  readonly filtros = signal<FiltroPagos>({});
  readonly items = signal<Pago[]>([]);
  readonly cargando = signal(false);
  readonly seleccionada = signal<Pago | null>(null);

  private readonly version = signal(0);
  private readonly consulta = computed(() => ({ filtros: this.filtros(), version: this.version() }));

  constructor() {
    toObservable(this.consulta)
      .pipe(
        tap(() => this.cargando.set(true)),
        switchMap(({ filtros }) => this.api.listar(filtros).pipe(catchError(() => of<Pago[]>([])))),
        takeUntilDestroyed(),
      )
      .subscribe((lista) => {
        this.items.set(lista);
        this.cargando.set(false);
        const actual = this.seleccionada();
        if (actual && !lista.some((p) => p.id === actual.id)) this.seleccionada.set(null);
      });
  }

  filtrar(filtros: FiltroPagos): void {
    this.filtros.set(filtros);
  }

  seleccionar(pago: Pago | null): void {
    this.seleccionada.set(pago);
  }

  eliminar(pago: Pago): Observable<void> {
    return this.api.eliminar(pago.id).pipe(
      tap(() => {
        this.toast.exito('Boleta eliminada.');
        this.version.update((v) => v + 1);
      }),
    );
  }
}
