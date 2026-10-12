import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ShellComponent } from './core/layout/shell.component';
import { ToastContainerComponent } from './core/notifications/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [ShellComponent, ToastContainerComponent],
  template: `
    <app-shell />
    <app-toast-container />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
