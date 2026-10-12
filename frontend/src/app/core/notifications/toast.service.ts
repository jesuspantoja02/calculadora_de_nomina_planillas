import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  tipo: 'ok' | 'error';
  texto: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private siguienteId = 0;
  readonly toasts = signal<Toast[]>([]);

  exito(texto: string): void {
    this.agregar('ok', texto);
  }

  error(texto: string): void {
    this.agregar('error', texto);
  }

  cerrar(id: number): void {
    this.toasts.update((lista) => lista.filter((t) => t.id !== id));
  }

  private agregar(tipo: Toast['tipo'], texto: string): void {
    const id = ++this.siguienteId;
    this.toasts.update((lista) => [...lista, { id, tipo, texto }]);
    setTimeout(() => this.cerrar(id), 5000);
  }
}
