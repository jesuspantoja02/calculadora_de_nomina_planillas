import type { ConfiguracionRepository } from '../../configuracion/domain/configuracion.repository.ts';
import type { Empleado } from '../../empleados/domain/empleado.ts';
import type { EmpleadoRepository } from '../../empleados/domain/empleado.repository.ts';
import { estimarMensual, redondear } from '../../planilla/domain/calculo-planilla.ts';
import type { PagoRepository } from '../../planilla/domain/pago.repository.ts';

export type EmpleadoConNeto = Empleado & { neto: number };

export interface ResumenDashboard {
  totalEmpleados: number;
  totalBoletas: number;
  totales: { bruto: number; descuentos: number; neto: number };
  regimen: { afp: number; onp: number }; // porcentajes
  mayorSueldo: EmpleadoConNeto | null;
  menorSueldo: EmpleadoConNeto | null;
}

export class DashboardService {
  #empleados: EmpleadoRepository;
  #pagos: PagoRepository;
  #config: ConfiguracionRepository;

  constructor(empleados: EmpleadoRepository, pagos: PagoRepository, config: ConfiguracionRepository) {
    this.#empleados = empleados;
    this.#pagos = pagos;
    this.#config = config;
  }

  async resumen(): Promise<ResumenDashboard> {
    const [empleados, config, totalBoletas] = await Promise.all([
      this.#empleados.listar({}),
      this.#config.obtener(),
      this.#pagos.contar(),
    ]);
    const filas = empleados.map((e) => ({ ...e, ...estimarMensual(e, config) }));
    const total = filas.length;
    const afp = filas.filter((f) => f.regimen === 'AFP').length;
    const suma = (fn: (f: (typeof filas)[number]) => number) => redondear(filas.reduce((a, f) => a + fn(f), 0));

    const aEmpleadoConNeto = (f: (typeof filas)[number]): EmpleadoConNeto => {
      const { pension: _p, salud: _s, impuesto: _i, total: _t, ...resto } = f;
      return resto;
    };
    const ordenados = [...filas].sort((a, b) => b.neto - a.neto);
    const mayor = ordenados[0];
    const menor = ordenados[ordenados.length - 1];

    return {
      totalEmpleados: total,
      totalBoletas,
      totales: { bruto: suma((f) => f.sueldoBase), descuentos: suma((f) => f.total), neto: suma((f) => f.neto) },
      regimen:
        total === 0
          ? { afp: 0, onp: 0 }
          : { afp: Math.round((afp / total) * 100), onp: Math.round(((total - afp) / total) * 100) },
      mayorSueldo: mayor ? aEmpleadoConNeto(mayor) : null,
      menorSueldo: menor ? aEmpleadoConNeto(menor) : null,
    };
  }
}
