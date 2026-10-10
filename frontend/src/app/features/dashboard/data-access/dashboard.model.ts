import { Empleado } from '../../empleados/data-access/empleado.model';

export type EmpleadoConNeto = Empleado & { neto: number };

export interface ResumenDashboard {
  totalEmpleados: number;
  totalBoletas: number;
  totales: { bruto: number; descuentos: number; neto: number };
  regimen: { afp: number; onp: number };
  mayorSueldo: EmpleadoConNeto | null;
  menorSueldo: EmpleadoConNeto | null;
}
