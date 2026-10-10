import { ChangeDetectionStrategy, Component, inject, input, viewChild } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { EmpleadoFiltrosComponent } from '../components/empleado-filtros.component';
import { EmpleadoFormComponent } from '../components/empleado-form.component';
import { EmpleadoListaComponent } from '../components/empleado-lista.component';
import { Empleado, EmpleadoDto } from '../data-access/empleado.model';
import { EmpleadosStore } from '../data-access/empleados.store';

/** Página «inteligente»: orquesta el store y los componentes de presentación. */
@Component({
  selector: 'app-empleados-page',
  imports: [PageHeaderComponent, EmpleadoFormComponent, EmpleadoFiltrosComponent, EmpleadoListaComponent],
  templateUrl: './empleados.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadosPage {
  protected readonly store = inject(EmpleadosStore);
  /** Query param ?regimen=AFP|ONP (lo enlaza withComponentInputBinding). */
  readonly regimen = input<string>();
  private readonly formulario = viewChild(EmpleadoFormComponent);

  protected guardar(dto: EmpleadoDto): void {
    this.store.guardar(dto).subscribe({ next: () => this.formulario()?.limpiar() });
  }

  protected eliminar(e: Empleado): void {
    if (confirm(`¿Eliminar a ${e.nombre}? Sus boletas emitidas se conservan.`)) this.store.eliminar(e).subscribe();
  }
}
