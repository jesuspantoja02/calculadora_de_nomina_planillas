import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, PageHeaderComponent],
  template: `
    <app-page-header eyebrow="Error 404" titulo="Página no encontrada" descripcion="La ruta que buscas no existe o fue movida." />
    <a class="btn btn-primary" routerLink="/empleados">Volver al inicio</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
