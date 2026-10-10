import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { ToastService } from '../../../core/notifications/toast.service';
import { Empleado, EmpleadoDto, FiltroEmpleados } from './empleado.model';
import { EmpleadosApi } from './empleados.api';

/**
 * Estado de la funcionalidad «Empleados» con signals.
 * Se provee a nivel de ruta (empleados.routes.ts), por lo que vive solo mientras se usa la pantalla.
 */
@Injectable()
export class EmpleadosStore {
  private readonly api = inject(EmpleadosApi);
  private readonly toast = inject(ToastService);

  readonly filtros = signal<FiltroEmpleados>({});
  readonly items = signal<Empleado[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  /** Empleado cargado en el formulario para edición (null = alta). */
  readonly editando = signal<Empleado | null>(null);

  private readonly version = signal(0);
  private readonly consulta = computed(() => ({ filtros: this.filtros(), version: this.version() }));

  constructor() {
    // Cada cambio de filtros o recarga lanza GET /empleados; switchMap cancela la petición anterior.
    toObservable(this.consulta)
      .pipe(
        tap(() => this.cargando.set(true)),
        switchMap(({ filtros }) => this.api.listar(filtros).pipe(catchError(() => of<Empleado[]>([])))),
        takeUntilDestroyed(),
      )
      .subscribe((lista) => {
        this.items.set(lista);
        this.cargando.set(false);
      });
  }

  filtrar(filtros: FiltroEmpleados): void {
    this.filtros.set(filtros);
  }

  editar(empleado: Empleado | null): void {
    this.editando.set(empleado);
  }

  guardar(dto: EmpleadoDto): Observable<Empleado> {
    const actual = this.editando();
    const peticion$ = actual ? this.api.actualizar(actual.id, dto) : this.api.crear(dto);
    this.guardando.set(true);
    return peticion$.pipe(
      tap((e) => {
        this.toast.exito(actual ? `Empleado «${e.nombre}» actualizado.` : `Empleado «${e.nombre}» registrado.`);
        this.editando.set(null);
        this.refrescar();
      }),
      finalize(() => this.guardando.set(false)),
    );
  }

  eliminar(empleado: Empleado): Observable<void> {
    return this.api.eliminar(empleado.id).pipe(
      tap(() => {
        this.toast.exito('Empleado eliminado.');
        if (this.editando()?.id === empleado.id) this.editando.set(null);
        this.refrescar();
      }),
    );
  }

  private refrescar(): void {
    this.version.update((v) => v + 1);
  }
}
