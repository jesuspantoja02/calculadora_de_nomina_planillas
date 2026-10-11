import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, NombreIcono } from '../../shared/ui/icon.component';

interface ItemNav {
  ruta: string;
  etiqueta: string;
  icono: NombreIcono;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="brand">
      <span class="brand-mark" aria-hidden="true"><app-icon nombre="chart" [tamano]="20" /></span>
      <span class="brand-text">
        <span class="brand-name">Nómina</span>
        <span class="brand-sub">Gestión de planillas</span>
      </span>
    </div>

    <nav class="nav" aria-label="Navegación principal">
      <p class="nav-label">Operación</p>
      @for (item of operacion; track item.ruta) {
        <a class="nav-item" [routerLink]="item.ruta" routerLinkActive="active" (click)="navegar.emit()">
          <span class="nav-icon"><app-icon [nombre]="item.icono" /></span>{{ item.etiqueta }}
        </a>
      }
      <p class="nav-label">Sistema</p>
      @for (item of sistema; track item.ruta) {
        <a class="nav-item" [routerLink]="item.ruta" routerLinkActive="active" (click)="navegar.emit()">
          <span class="nav-icon"><app-icon [nombre]="item.icono" /></span>{{ item.etiqueta }}
        </a>
      }
    </nav>

    <div class="sidebar-foot"><span class="sidebar-dot"></span>Nómina v2.0</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly navegar = output<void>();

  protected readonly operacion: ItemNav[] = [
    { ruta: '/empleados', etiqueta: 'Empleados', icono: 'users' },
    { ruta: '/planilla/procesar-pago', etiqueta: 'Procesar pago', icono: 'wallet' },
    { ruta: '/planilla/boletas', etiqueta: 'Boletas de pago', icono: 'file' },
    { ruta: '/dashboard', etiqueta: 'Dashboard', icono: 'chart' },
  ];
  protected readonly sistema: ItemNav[] = [
    { ruta: '/configuracion', etiqueta: 'Configuración', icono: 'sliders' },
  ];
}
