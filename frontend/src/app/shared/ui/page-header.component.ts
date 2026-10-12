import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-head">
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h1>{{ titulo() }}</h1>
      @if (descripcion()) {
        <p class="lede">{{ descripcion() }}</p>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descripcion = input<string>('');
}
