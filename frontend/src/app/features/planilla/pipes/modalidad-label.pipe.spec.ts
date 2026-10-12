import { ModalidadLabelPipe } from './modalidad-label.pipe';

describe('ModalidadLabelPipe', () => {
  it('devuelve una etiqueta legible', () => {
    const pipe = new ModalidadLabelPipe();
    expect(pipe.transform('Quincena')).toBe('Adelanto quincenal');
    expect(pipe.transform('Gratificacion')).toBe('Gratificación');
    expect(pipe.transform('CTS')).toBe('CTS');
  });
});
