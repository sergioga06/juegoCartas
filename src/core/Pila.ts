// CLASE PILA: Estructura de datos tipo "pila" (LIFO - Last In First Out)
// Las pilas funcionan como un montón: el último en entrar es el primero en salir
// Ideal para representar mazos de cartas y montones de descarte

export class Pila<T> {
  // Array privado para almacenar los elementos de la pila
  // <T> significa que puede ser cualquier tipo (genérico)
  private elementos: T[] = [];

  /**
   * PUSH: Añade un elemento a la cima de la pila
   * @param elemento - El elemento a añadir
   */
  push(elemento: T): void {
    this.elementos.push(elemento);
  }

  /**
   * POP: Saca y devuelve el elemento superior
   * @returns El elemento de la cima, o undefined si está vacía
   */
  pop(): T | undefined {
    return this.elementos.pop();
  }

  /**
   * PEEK: Ve el elemento de la cima SIN sacarlo
   * Útil para ver qué carta está visible sin quitarla
   * @returns El elemento de la cima, o undefined si está vacía
   */
  peek(): T | undefined {
    return this.elementos[this.elementos.length - 1];
  }

  /**
   * SIZE: Devuelve cuántos elementos hay en la pila
   * @returns Número de elementos
   */
  size(): number {
    return this.elementos.length;
  }

  /**
   * ISEMPTY: Comprueba si la pila está vacía
   * @returns true si no hay elementos, false si hay al menos uno
   */
  isEmpty(): boolean {
    return this.elementos.length === 0;
  }

  /**
   * GETELEMENTOS: Devuelve una COPIA de todos los elementos
   * Se usa para mostrar en la UI sin que se modifique el original
   * @returns Array con copia de todos los elementos
   */
  getElementos(): T[] {
    return [...this.elementos];  // El [...] crea una copia, no una referencia
  }
}