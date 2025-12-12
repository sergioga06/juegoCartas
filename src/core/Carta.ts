// CLASE CARTA: Representa una carta individual de la baraja

import type { Palo, Valor } from '@/types/cards';

export class Carta {
  /**
   * Constructor: Crea una carta con un palo y un valor
   * @param palo - El palo de la carta (Picas, Corazones, Tréboles, Diamantes)
   * @param valor - El valor de la carta (2-10, J, Q, K, A)
   */
  constructor(public palo: Palo, public valor: Valor) {}

  /**
   * Getter: Devuelve el nombre legible de la carta
   * Ejemplo: "5 de Corazones", "K de Picas"
   */
  get nombre(): string {
    return `${this.valor} de ${this.palo}`;
  }

  /**
   * Comprueba si esta carta es jugable sobre otra
   * Las reglas: Una carta es jugable si:
   * - Tiene el MISMO palo, O
   * - Tiene el MISMO valor
   * 
   * @param otraCarta - La carta sobre la que queremos jugar
   * @returns true si se puede jugar, false si no
   */
  esJugableSobre(otraCarta: Carta): boolean {
    return this.palo === otraCarta.palo || this.valor === otraCarta.valor;
  }
}