/** Escapa los comodines de LIKE (% _ \) para que el texto del usuario se busque literalmente. */
export const escaparLike = (texto: string): string => texto.replace(/[\\%_]/g, '\\$&');
