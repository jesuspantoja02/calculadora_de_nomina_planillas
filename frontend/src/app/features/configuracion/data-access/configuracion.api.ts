import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url.token';
import { ApiResponse } from '../../../shared/models/tipos';
import { Configuracion } from './configuracion.model';

@Injectable({ providedIn: 'root' })
export class ConfiguracionApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  obtener(): Observable<Configuracion> {
    return this.http.get<ApiResponse<Configuracion>>(`${this.base}/configuracion`).pipe(map((r) => r.data));
  }

  actualizar(config: Configuracion): Observable<Configuracion> {
    return this.http.put<ApiResponse<Configuracion>>(`${this.base}/configuracion`, config).pipe(map((r) => r.data));
  }

  reiniciarDatos(): Observable<void> {
    return this.http.delete<void>(`${this.base}/datos`);
  }
}
