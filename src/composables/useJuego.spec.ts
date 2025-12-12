import { describe, it, expect, vi } from 'vitest';
import { useJuego } from './useJuego';
import { Carta } from '@/core/Carta';

describe('useJuego Composable', () => {
    vi.stubGlobal('alert', vi.fn());
  
  // 1. Test de Inicio
  it('Test de Inicio: Mazo 44, Mano 7, Descarte 1', () => {
    const { iniciarJuego, manoJugador, cartasEnMazo, cartaSuperiorDescarte } = useJuego();
    
    iniciarJuego();

    expect(cartasEnMazo.value).toBe(44); // 52 - 7 - 1
    expect(manoJugador.value.length).toBe(7);
    expect(cartaSuperiorDescarte.value).toBeDefined();
  });

  // 2. Test de Jugada Válida
  it('Test de Jugada Válida: Mueve carta de mano a descarte', () => {
    const { manoJugador, descarte, jugarCarta } = useJuego();
    
    // Forzamos el escenario: Descarte tiene 7 de Corazones
    descarte.value.push(new Carta('Corazones', '7'));
    
    // Jugador tiene 7 de Picas 
    const miCarta = new Carta('Picas', '7');
    manoJugador.value = [miCarta];

    jugarCarta(miCarta);

    // Verificaciones
    expect(manoJugador.value.length).toBe(0); // el mazo se vacía
    expect(descarte.value.peek()).toBe(miCarta); // La carta está en el descarte
  });

  // 3. Test de Jugada Inválida 
  it('Test de Jugada Inválida: El estado no cambia', () => {
    const { manoJugador, descarte, jugarCarta } = useJuego();
    
    // Escenario: Descarte 7 Corazones
    descarte.value.push(new Carta('Corazones', '7'));
    
    // Jugador intenta jugar Rey de Picas 
    const miCarta = new Carta('Picas', 'K');
    manoJugador.value = [miCarta];

    jugarCarta(miCarta);

    // Verificaciones
    expect(manoJugador.value.length).toBe(1); // Sigue en la mano
    expect(descarte.value.peek()?.valor).toBe('7'); // El descarte no ha cambiado
  });

  // 4. Test de Reconstitución de Mazo 
  it('Test de Reconstitución: Rellena mazo desde descarte si mazo vacío', () => {
    const { robarCarta, cartasEnMazo, descarte, manoJugador } = useJuego();

    // 1. Vaciamos el mazo manualmente para el test
    while (cartasEnMazo.value > 0) {
        // Necesitamos acceder al mazo interno si no lo exportamos, 
        // pero como usamos el composable, podemos forzarlo robando todo
        // Ojo: esto podría tardar. Mejor simular estado:
        // Como 'mazo' no se exporta directamente en el return original,
        // dependemos de que 'robarCarta' active la lógica cuando esté vacío.
        // Pero para el test, vamos a asumir que podemos vaciarlo robando todo:
        // TRUCO: Si no exportaste 'mazo', tendrás que editar useJuego para exportarlo 
        // o robar 52 veces. *Asumiremos que robamos hasta vaciar*:
    }
    // Para simplificar y no cambiar tu código, usaremos 'descarte' que sí se suele exportar
    // o forzamos el estado a través de la interfaz pública si es posible.
    
    // *NOTA: Para que este test sea fácil, te recomiendo añadir 'mazo' al return de useJuego 
    // en tu código, al menos temporalmente. Si no, lo simulamos así:*
    
    // FORMA RÁPIDA: Creamos un descarte con 5 cartas y mazo a 0.
    // (Esto requiere que edites useJuego.ts para devolver 'mazo' en el return)
    // Si no quieres editar useJuego, robamos hasta que de error:
    
    // Vamos a suponer que has añadido 'mazo' al return de useJuego.ts para testear.
    // Si no, el test es:
    /*
      iniciarJuego();
      // Robar las 44 cartas
      for(let i=0; i<44; i++) robarCarta(); 
      expect(cartasEnMazo.value).toBe(0);
      
      // Ahora el descarte tiene muchas cartas (las iniciales + jugadas).
      // Aseguramos que haya cartas en descarte.
      descarte.value.push(new Carta('Oros', '2')); 
      descarte.value.push(new Carta('Oros', '3')); 

      // Robamos una más -> Debería disparar reconstitución
      robarCarta();
      
      expect(cartasEnMazo.value).toBeGreaterThan(0); // El mazo se ha rellenado
    */
   
    // IMPLEMENTACIÓN PRÁCTICA (Copia esto):
    const { iniciarJuego } = useJuego();
    iniciarJuego();
    
    // Vaciamos el mazo robando todo
    let seguridad = 0;
    while(cartasEnMazo.value > 0 && seguridad < 100) {
        robarCarta();
        seguridad++;
    }
    
    // Añadimos cartas al descarte para que tenga "gasolina" para reciclar
    descarte.value.push(new Carta('Picas', 'A'));
    descarte.value.push(new Carta('Picas', '2'));
    descarte.value.push(new Carta('Picas', '3'));

    const cartasEnDescarteAntes = descarte.value.size();

    // Acción: Robar carta con mazo vacío
    robarCarta();

    // Comprobación
    // El mazo ya no debería ser 0 (se ha recauchutado)
    expect(cartasEnMazo.value).toBeGreaterThan(0);
    // El descarte debería tener solo 1 carta (la cima) o menos que antes
    expect(descarte.value.size()).toBeLessThan(cartasEnDescarteAntes);
  });
});