import { randomUUID } from 'node:crypto';
import { noEncontrado } from '../../../shared/errors/app-error.ts';
import type { Empleado, FiltroEmpleados } from '../domain/empleado.ts';
import type { EmpleadoRepository } from '../domain/empleado.repository.ts';
import type { EmpleadoDto } from './empleado.dto.ts';

export class EmpleadoService {
  #repo: EmpleadoRepository;

  constructor(repo: EmpleadoRepository) {
    this.#repo = repo;
  }

  listar(filtro: FiltroEmpleados): Promise<Empleado[]> {
    return this.#repo.listar(filtro);
  }

  async obtener(id: string): Promise<Empleado> {
    const empleado = await this.#repo.buscarPorId(id);
    if (!empleado) throw noEncontrado('Empleado');
    return empleado;
  }

  async crear(dto: EmpleadoDto): Promise<Empleado> {
    const ahora = new Date().toISOString();
    const empleado: Empleado = { id: randomUUID(), ...dto, creadoEn: ahora, actualizadoEn: ahora };
    await this.#repo.guardar(empleado);
    return empleado;
  }

  async actualizar(id: string, dto: EmpleadoDto): Promise<Empleado> {
    const actual = await this.obtener(id);
    const actualizado: Empleado = { ...actual, ...dto, actualizadoEn: new Date().toISOString() };
    await this.#repo.guardar(actualizado);
    return actualizado;
  }

  async eliminar(id: string): Promise<void> {
    if (!(await this.#repo.eliminar(id))) throw noEncontrado('Empleado');
  }
}
