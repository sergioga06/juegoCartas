// TIPOS: Definiciones de datos para las cartas

/**
 * Palo: Los cuatro palos de una baraja de póquer
 * - Picas (♠) y Tréboles (♣) = Negros
 * - Corazones (♥) y Diamantes (♦) = Rojos
 */
export type Palo = 'Picas' | 'Corazones' | 'Tréboles' | 'Diamantes';

/**
 * Valor: Los 13 valores posibles en una baraja
 * - Números del 2 al 10
 * - Figuras: J (Jack), Q (Queen), K (King), A (Ace/As)
 */
export type Valor = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';