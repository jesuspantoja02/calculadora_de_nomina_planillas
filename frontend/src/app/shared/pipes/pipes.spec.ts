import { EnmascararDniPipe } from './enmascarar-dni.pipe';
import { InicialesPipe } from './iniciales.pipe';

describe('Pipes compartidos', () => {
  it('iniciales toma las dos primeras palabras', () => {
    expect(new InicialesPipe().transform('ana torres quispe')).toBe('AT');
    expect(new InicialesPipe().transform(null)).toBe('');
  });

  it('enmascararDni oculta los dígitos centrales', () => {
    expect(new EnmascararDniPipe().transform('12345678')).toBe('12****78');
    expect(new EnmascararDniPipe().transform('123')).toBe('123');
  });
});
