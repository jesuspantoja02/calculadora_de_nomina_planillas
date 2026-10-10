import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url.token';
import { ApiResponse } from '../../../shared/models/tipos';
import { ResumenDashboard } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/dashboard`;

  resumen(): Observable<ResumenDashboard> {
    return this.http.get<ApiResponse<ResumenDashboard>>(this.url).pipe(map((r) => r.data));
  }
}
