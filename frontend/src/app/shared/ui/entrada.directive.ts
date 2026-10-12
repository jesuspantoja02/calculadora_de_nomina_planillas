import { Directive, ElementRef, inject, input } from '@angular/core';
import { TipoEntrada, entradaValida, filtrarEntrada } from '../validators/formularios';

/**
 * Impide escribir o pegar un valor que no corresponde al campo.
 * La coma decimal se acepta y se guarda como punto.
 */
@Directive({
  selector: 'input[appEntrada]',
  host: {
    '(beforeinput)': 'bloquear($event)',
    '(input)': 'limpiar()',
  },
})
export class EntradaDirective {
  readonly tipo = input.required<TipoEntrada>({ alias: 'appEntrada' });
  readonly entradaMax = input<number | undefined>(undefined);
  readonly entradaMin = input<number | undefined>(undefined);
  readonly entradaDecimales = input<number | undefined>(undefined);

  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  protected bloquear(event: InputEvent): void {
    if (event.inputType.startsWith('delete') || event.inputType === 'historyUndo' || event.inputType === 'historyRedo') return;
    if (event.data == null) return;

    const data = event.data.replace(/,/g, '.');
    const next = this.propuesto(data);
    if (entradaValida(this.tipo(), next, this.limites())) {
      if (data !== event.data) {
        event.preventDefault();
        this.escribir(next);
      }
      return;
    }

    event.preventDefault();
    if (event.inputType === 'insertFromPaste' || event.inputType === 'insertFromDrop') {
      this.escribir(filtrarEntrada(this.tipo(), next, this.limites()));
    }
  }

  /** Cubre autocompletado y cualquier vía que no pase por beforeinput. */
  protected limpiar(): void {
    const el = this.el.nativeElement;
    const limpio = filtrarEntrada(this.tipo(), el.value, this.limites());
    if (limpio !== el.value) this.escribir(limpio);
  }

  private limites() {
    return { max: this.entradaMax(), min: this.entradaMin(), decimales: this.entradaDecimales() };
  }

  private propuesto(data: string): string {
    const el = this.el.nativeElement;
    let start = el.value.length;
    let end = start;
    try {
      if (el.selectionStart != null) {
        start = el.selectionStart;
        end = el.selectionEnd ?? start;
      }
    } catch {
      // type="number" no expone la selección en algunos navegadores.
    }
    return el.value.slice(0, start) + data + el.value.slice(end);
  }

  private escribir(valor: string): void {
    const el = this.el.nativeElement;
    el.value = valor;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
