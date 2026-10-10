/**
 * Raíz de composición: único lugar donde se conectan puertos con adaptadores.
 * Para cambiar de base de datos solo hay que reemplazar las clases Sqlite* por otras
 * que implementen los mismos puertos (domain/*.repository.ts).
 */
import type { Db } from './shared/infrastructure/sqlite/database.ts';
import { ConfiguracionService } from './modules/configuracion/application/configuracion.service.ts';
import { SqliteConfiguracionRepository } from './modules/configuracion/infrastructure/sqlite-configuracion.repository.ts';
import { DashboardService } from './modules/dashboard/application/dashboard.service.ts';
import { EmpleadoService } from './modules/empleados/application/empleado.service.ts';
import { SqliteEmpleadoRepository } from './modules/empleados/infrastructure/sqlite-empleado.repository.ts';
import { PagoService } from './modules/planilla/application/pago.service.ts';
import { SqlitePagoRepository } from './modules/planilla/infrastructure/sqlite-pago.repository.ts';

export function construirServicios(db: Db) {
  const empleados = new SqliteEmpleadoRepository(db);
  const pagos = new SqlitePagoRepository(db);
  const configuracion = new SqliteConfiguracionRepository(db); // implementa configuración + mantenimiento

  return {
    empleados: new EmpleadoService(empleados),
    pagos: new PagoService(pagos, empleados, configuracion),
    configuracion: new ConfiguracionService(configuracion, configuracion),
    dashboard: new DashboardService(empleados, pagos, configuracion),
  };
}
export type Servicios = ReturnType<typeof construirServicios>;
