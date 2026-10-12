import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toast-stack no-print" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast-item" [class.ok]="t.tipo === 'ok'" [class.error]="t.tipo === 'error'" role="status">
          <span>{{ t.texto }}</span>
          <button type="button" aria-label="Cerrar aviso" (click)="toast.cerrar(t.id)">✕</button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  protected readonly toast = inject(ToastService);
}
