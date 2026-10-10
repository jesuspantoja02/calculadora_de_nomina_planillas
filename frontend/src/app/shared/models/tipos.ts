export const CARGOS = ['Desarrollador', 'Diseñador', 'Analista', 'Almacenero', 'Supervisor', 'Administrativo'] as const;
export type Regimen = 'AFP' | 'ONP';

export interface ApiResponse<T> {
  data: T;
}
