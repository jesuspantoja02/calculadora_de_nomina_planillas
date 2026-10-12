/**
 * Sanitización de texto libre: normaliza Unicode, elimina caracteres de control y
 * los símbolos < > ` que sirven para inyectar HTML, y colapsa espacios.
 * (Angular además escapa todo lo que se interpola en las plantillas.)
 */
export function sanitizarTexto(valor: string): string {
  return valor
    .normalize('NFC')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
