export type TipoComisionAfp = 'flujo' | 'saldo';

/**
 * Parámetros de planilla. Las tasas de AFP son las publicadas por la SBS
 * para el devengue de octubre de 2026 (comisión por flujo de Integra como referencia).
 * La comisión sobre saldo no se descuenta del sueldo: se cobra al fondo.
 */
export interface Configuracion {
  aporteAfpPct: number;
  primaSeguroPct: number;
  comisionFlujoPct: number;
  tipoComisionAfp: TipoComisionAfp;
  /** Tope de remuneración asegurable (SBS, devengue octubre 2026). */
  remuneracionMaximaAsegurable: number;
  tasaOnp: number;
  /** EsSalud a cargo del empleador. La bonificación de gratificación usa esta tasa, o el 75 % si el trabajador está en EPS. */
  tasaEssalud: number;
  /** Remuneración mínima vital vigente desde el 1 de octubre de 2026 (D.S. 015-2026-TR). */
  rmv: number;
  uit: number;
  /** Política de la empresa. La ley no fija un porcentaje de adelanto. */
  adelantoQuincenalPct: number;
  aplicarQuintaCategoria: boolean;
  empresaNombre: string;
  empresaRuc: string;
}

export const CONFIG_POR_DEFECTO: Readonly<Configuracion> = Object.freeze({
  aporteAfpPct: 10,
  primaSeguroPct: 1.37,
  comisionFlujoPct: 1.55,
  tipoComisionAfp: 'flujo',
  remuneracionMaximaAsegurable: 12_732.7,
  tasaOnp: 13,
  tasaEssalud: 9,
  rmv: 1230,
  uit: 5500,
  adelantoQuincenalPct: 40,
  aplicarQuintaCategoria: true,
  empresaNombre: 'Mi Empresa S.A.C.',
  empresaRuc: '20123456789',
});
