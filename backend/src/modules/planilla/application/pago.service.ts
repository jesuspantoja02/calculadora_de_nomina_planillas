import { randomUUID } from 'node:crypto';
import { noEncontrado } from '../../../shared/errors/app-error.ts';
import type { ConfiguracionRepository } from '../../configuracion/domain/configuracion.repository.ts';
import type { Empleado } from '../../empleados/domain/empleado.ts';
import type { EmpleadoRepository } from '../../empleados/domain/empleado.repository.ts';
import type { Configuracion } from '../../configuracion/domain/configuracion.ts';
import { calcularPago } from '../domain/calculo-planilla.ts';
import type { Boleta, FiltroPagos, Pago } from '../domain/pago.ts';
import type { PagoRepository } from '../domain/pago.repository.ts';
import type { PagoDto } from './pago.dto.ts';

function armarBoleta(emp: Empleado, dto: PagoDto, config: Configuracion): Boleta {
  const resultado = calcularPago(
    {
      sueldoBase: emp.sueldoBase,
      regimen: emp.regimen,
      tieneHijos: emp.tieneHijos,
      modalidad: dto.modalidad,
      horasExtra25: dto.horasExtra25,
      horasExtra35: dto.horasExtra35,
      horasDescanso: dto.horasDescanso,
      minutosTardanza: dto.minutosTardanza,
      diasFalta: dto.diasFalta,
      mesesComputables: dto.mesesComputables,
      diasComputables: dto.diasComputables,
      afiliadoEps: dto.afiliadoEps,
    },
    config,
  );
  return {
    ...resultado,
    empleadoId: emp.id,
    dni: emp.dni,
    nombre: emp.nombre,
    cargo: emp.cargo,
    regimen: emp.regimen,
    fechaPago: dto.fechaPago,
    empresaNombre: config.empresaNombre,
    empresaRuc: config.empresaRuc,
  };
}

export class PagoService {
  #pagos: PagoRepository;
  #empleados: EmpleadoRepository;
  #config: ConfiguracionRepository;

  constructor(pagos: PagoRepository, empleados: EmpleadoRepository, config: ConfiguracionRepository) {
    this.#pagos = pagos;
    this.#empleados = empleados;
    this.#config = config;
  }

  listar(filtro: FiltroPagos): Promise<Pago[]> {
    return this.#pagos.listar(filtro);
  }

  async obtener(id: string): Promise<Pago> {
    const pago = await this.#pagos.buscarPorId(id);
    if (!pago) throw noEncontrado('Boleta');
    return pago;
  }

  /** Calcula sin guardar (vista previa). */
  async simular(dto: PagoDto): Promise<Boleta> {
    const empleado = await this.#empleados.buscarPorId(dto.empleadoId);
    if (!empleado) throw noEncontrado('Empleado');
    return armarBoleta(empleado, dto, await this.#config.obtener());
  }

  /** Calcula y emite la boleta: queda como fotografía aunque luego cambien tasas o datos del empleado. */
  async emitir(dto: PagoDto): Promise<Pago> {
    const boleta = await this.simular(dto);
    const pago: Pago = { id: randomUUID(), creadoEn: new Date().toISOString(), ...boleta };
    await this.#pagos.guardar(pago);
    return pago;
  }

  async eliminar(id: string): Promise<void> {
    if (!(await this.#pagos.eliminar(id))) throw noEncontrado('Boleta');
  }
}
