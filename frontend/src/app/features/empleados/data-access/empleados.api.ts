import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url.token';
import { ApiResponse } from '../../../shared/models/tipos';
import { Empleado, EmpleadoDto, FiltroEmpleados } from './empleado.model';

/** Acceso HTTP a /empleados. No contiene estado: eso es responsabilidad del store. */
@Injectable({ providedIn: 'root' })
export class EmpleadosApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/empleados`;

  listar(filtro: FiltroEmpleados = {}): Observable<Empleado[]> {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtro)) {
      if (valor !== undefined && valor !== null && valor !== '') params = params.set(clave, String(valor));
    }
    return this.http.get<ApiResponse<Empleado[]>>(this.url, { params }).pipe(map((r) => r.data));
  }

  crear(dto: EmpleadoDto): Observable<Empleado> {
    return this.http.post<ApiResponse<Empleado>>(this.url, dto).pipe(map((r) => r.data));
  }

  actualizar(id: string, dto: EmpleadoDto): Observable<Empleado> {
    return this.http.put<ApiResponse<Empleado>>(`${this.url}/${id}`, dto).pipe(map((r) => r.data));
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
