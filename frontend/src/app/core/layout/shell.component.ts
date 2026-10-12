import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/ui/icon.component';
import { SidebarComponent } from './sidebar.component';

/** Estructura general: barra lateral + área de contenido (router-outlet). */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarComponent, IconComponent],
  template: `
    <div class="shell">
      <button type="button" class="menu-btn no-print" aria-label="Abrir menú" (click)="menuAbierto.set(true)">
        <app-icon nombre="menu" [tamano]="20" />
      </button>
      <div class="sidebar-backdrop no-print" [class.abierto]="menuAbierto()" (click)="menuAbierto.set(false)"></div>

      <app-sidebar class="sidebar no-print" [class.abierto]="menuAbierto()" (navegar)="menuAbierto.set(false)" />

      <main class="main">
        <div class="view"><router-outlet /></div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  protected readonly menuAbierto = signal(false);
}
