export type TipoComisionAfp = 'flujo' | 'saldo';

export interface Configuracion {
  aporteAfpPct: number;
  primaSeguroPct: number;
  comisionFlujoPct: number;
  tipoComisionAfp: TipoComisionAfp;
  remuneracionMaximaAsegurable: number;
  tasaOnp: number;
  tasaEssalud: number;
  rmv: number;
  uit: number;
  adelantoQuincenalPct: number;
  aplicarQuintaCategoria: boolean;
  empresaNombre: string;
  empresaRuc: string;
}
