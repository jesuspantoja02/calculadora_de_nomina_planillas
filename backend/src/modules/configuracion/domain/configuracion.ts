export interface Configuracion {
  tasaAfp: number; // %
  tasaOnp: number; // %
  tasaSalud: number; // % (EsSalud)
  tasaImpuesto: number; // % (estimación plana del dashboard, igual que la Unidad 1)
  valorHoraExtra: number; // S/ por hora
  adelantoQuincenalPct: number; // % del sueldo básico
  asignacionFamiliar: number; // S/ mensuales (10 % de la RMV)
  bonificacionExtraordinariaPct: number; // % sobre la gratificación
  uit: number; // S/
  aplicarQuintaCategoria: boolean;
  empresaNombre: string;
  empresaRuc: string;
}

export const CONFIG_POR_DEFECTO: Readonly<Configuracion> = Object.freeze({
  tasaAfp: 12,
  tasaOnp: 13,
  tasaSalud: 9,
  tasaImpuesto: 5,
  valorHoraExtra: 10,
  adelantoQuincenalPct: 40,
  asignacionFamiliar: 113, // 10 % de la RMV vigente (S/ 1 130)
  bonificacionExtraordinariaPct: 9,
  uit: 5500, // UIT 2026
  aplicarQuintaCategoria: false,
  empresaNombre: 'Mi Empresa S.A.C.',
  empresaRuc: '20123456789',
});
