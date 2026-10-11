import { entradaValida, filtrarEntrada } from './formularios';

describe('entrada de campos', () => {
  it('el DNI solo admite hasta 8 dígitos', () => {
    expect(filtrarEntrada('dni', '12ab3456789')).toBe('12345678');
    expect(entradaValida('dni', '12345678')).toBe(true);
    expect(entradaValida('dni', '123456789')).toBe(false);
  });

  it('el nombre rechaza números y símbolos', () => {
    expect(filtrarEntrada('nombre', 'Ana2 Pérez!')).toBe('Ana Pérez');
    expect(entradaValida('nombre', '3Ana')).toBe(false);
  });

  it('un decimal no pasa del máximo ni de los decimales', () => {
    expect(filtrarEntrada('decimal', '12,345', { max: 100, decimales: 2 })).toBe('12.34');
    expect(filtrarEntrada('decimal', '250', { max: 100 })).toBe('25');
    expect(entradaValida('entero', '31', { max: 31 })).toBe(true);
    expect(entradaValida('entero', '32', { max: 31 })).toBe(false);
    expect(entradaValida('entero', '0', { min: 1 })).toBe(false);
  });
});
