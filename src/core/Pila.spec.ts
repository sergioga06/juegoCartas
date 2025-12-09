// src/core/Pila.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Pila } from './Pila';

describe('Clase Pila', () => {
  let pila: Pila<number>;

  beforeEach(() => {
    pila = new Pila<number>();
  });

  // 1. Probar que push y pop siguen el orden LIFO [cite: 243]
  it('debe seguir el orden LIFO (Last In, First Out)', () => {
    pila.push(1);
    pila.push(2);
    pila.push(3);
    // El último en entrar (3) debe ser el primero en salir
    expect(pila.pop()).toBe(3);
    expect(pila.pop()).toBe(2);
    expect(pila.pop()).toBe(1);
  });

  // 2. Probar que peek devuelve el elemento superior sin eliminarlo [cite: 244]
  it('peek debe devolver el elemento superior sin eliminarlo', () => {
    pila.push(10);
    expect(pila.peek()).toBe(10);
    expect(pila.size()).toBe(1); // El tamaño sigue igual
  });

  // 3. Probar que isEmpty y size funcionan correctamente [cite: 245]
  it('isEmpty y size deben funcionar correctamente', () => {
    expect(pila.isEmpty()).toBe(true);
    expect(pila.size()).toBe(0);

    pila.push(5);
    expect(pila.isEmpty()).toBe(false);
    expect(pila.size()).toBe(1);
  });
});