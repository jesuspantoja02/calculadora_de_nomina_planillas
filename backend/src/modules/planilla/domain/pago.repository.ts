import type { FiltroPagos, Pago } from './pago.ts';

export interface PagoRepository {
  listar(filtro: FiltroPagos): Promise<Pago[]>;
  buscarPorId(id: string): Promise<Pago | null>;
  guardar(pago: Pago): Promise<void>;
  eliminar(id: string): Promise<boolean>;
  contar(): Promise<number>;
}
