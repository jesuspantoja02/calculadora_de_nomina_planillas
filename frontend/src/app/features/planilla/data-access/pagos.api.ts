import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url.token';
import { ApiResponse } from '../../../shared/models/tipos';
import { Boleta, FiltroPagos, Pago, PagoDto } from './pago.model';

@Injectable({ providedIn: 'root' })
export class PagosApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/pagos`;

  listar(filtro: FiltroPagos = {}): Observable<Pago[]> {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtro)) {
      if (valor) params = params.set(clave, valor);
    }
    return this.http.get<ApiResponse<Pago[]>>(this.url, { params }).pipe(map((r) => r.data));
  }

  /** Calcula sin guardar (vista previa). */
  simular(dto: PagoDto): Observable<Boleta> {
    return this.http.post<ApiResponse<Boleta>>(`${this.url}/simular`, dto).pipe(map((r) => r.data));
  }

  emitir(dto: PagoDto): Observable<Pago> {
    return this.http.post<ApiResponse<Pago>>(this.url, dto).pipe(map((r) => r.data));
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
