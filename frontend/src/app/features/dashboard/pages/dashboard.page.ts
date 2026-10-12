import { CurrencyPipe, NgStyle, PercentPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { InicialesPipe } from '../../../shared/pipes/iniciales.pipe';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { DashboardApi } from '../data-access/dashboard.api';
import { ResumenDashboard } from '../data-access/dashboard.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [NgStyle, RouterLink, CurrencyPipe, PercentPipe, TitleCasePipe, InicialesPipe, PageHeaderComponent],
  templateUrl: './dashboard.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly api = inject(DashboardApi);

  protected readonly resumen = signal<ResumenDashboard | null>(null);
  protected readonly proporciones = computed(() => {
    const r = this.resumen();
    const bruto = r?.totales.bruto ?? 0;
    if (!r || bruto <= 0) return { descuentos: 0, neto: 0 };
    return { descuentos: (r.totales.descuentos / bruto) * 100, neto: (r.totales.neto / bruto) * 100 };
  });

  constructor() {
    this.api.resumen().pipe(takeUntilDestroyed()).subscribe((r) => this.resumen.set(r));
  }
}
