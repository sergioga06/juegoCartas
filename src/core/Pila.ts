// src/core/Pila.ts
export class Pila<T> {
  // Array privado para almacenar los elementos [cite: 136]
  private elementos: T[] = [];

  // Añadir elemento a la cima [cite: 137]
  push(elemento: T): void {
    this.elementos.push(elemento);
  }

  // Sacar elemento de la cima [cite: 138]
  pop(): T | undefined {
    return this.elementos.pop();
  }

  // Ver el elemento de la cima sin sacarlo [cite: 139]
  peek(): T | undefined {
    return this.elementos[this.elementos.length - 1];
  }

  // Tamaño de la pila [cite: 140]
  size(): number {
    return this.elementos.length;
  }

  // Comprobar si está vacía [cite: 141]
  isEmpty(): boolean {
    return this.elementos.length === 0;
  }

  // Obtener copia de los elementos (útil para la UI) [cite: 142]
  getElementos(): T[] {
    return [...this.elementos];
  }
}