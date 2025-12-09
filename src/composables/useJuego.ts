// src/composables/useJuego.ts
import { ref, computed } from 'vue';
import { Pila } from '@/core/Pila';
import { Carta } from '@/core/Carta';
import type { Palo, Valor } from '@/types/cards';

export function useJuego() {
  const mazo = ref(new Pila<Carta>());
  const descarte = ref(new Pila<Carta>());
  const manoJugador = ref<Carta[]>([]);

  const palos: Palo[] = ['Picas', 'Corazones', 'Tréboles', 'Diamantes'];
  const valores: Valor[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  // CAMBIO: Lógica de barajar corregida para TypeScript estricto
  const barajarArray = (array: Carta[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      
      // Guardamos referencias temporales
      const temp = array[i];
      const randomItem = array[j];

      // Verificamos explícitamente que existan antes de intercambiar
      // Esto elimina el error "undefined is not assignable to Carta"
      if (temp && randomItem) {
        array[i] = randomItem;
        array[j] = temp;
      }
    }
    return array;
  };

  function iniciarJuego() {
    let cartas: Carta[] = [];
    palos.forEach(p => valores.forEach(v => cartas.push(new Carta(p, v))));
    
    // Barajar
    cartas = barajarArray(cartas);
    
    // Llenar mazo
    mazo.value = new Pila<Carta>();
    cartas.forEach(c => mazo.value.push(c));
    
    // Reiniciar estados
    manoJugador.value = [];
    descarte.value = new Pila<Carta>();

    // Repartir 7 cartas
    for (let i = 0; i < 7; i++) {
      const c = mazo.value.pop();
      if (c) { 
        manoJugador.value.push(c);
      }
    }

    // Carta inicial al descarte
    const cartaInicial = mazo.value.pop();
    if (cartaInicial) { 
      descarte.value.push(cartaInicial);
    }
  }

  function reconstituirMazo() {
    // Si hay 1 o menos cartas, no podemos barajar nada para hacer un nuevo mazo
    if (descarte.value.size() <= 1) return;

    // Guardamos la carta superior (la que se ve)
    const cartaCima = descarte.value.pop(); 
    const cartasParaReciclar: Carta[] = [];

    // Sacamos todas las demás del descarte
    while (!descarte.value.isEmpty()) {
      const c = descarte.value.pop();
      if (c) { 
        cartasParaReciclar.push(c);
      }
    }

    // Las barajamos y las metemos en el mazo de robo
    barajarArray(cartasParaReciclar).forEach(c => mazo.value.push(c));
    
    // Volvemos a poner la carta cima en el descarte
    if (cartaCima) { 
      descarte.value.push(cartaCima);
    }
  }

  function robarCarta() {
    if (mazo.value.isEmpty()) {
      reconstituirMazo();
    }

    const carta = mazo.value.pop();
    
    if (carta) { 
      manoJugador.value.push(carta);
    } else {
      // Evitamos alertas molestas si realmente se acabó el juego
      if (descarte.value.size() > 1) {
          console.warn("Error inesperado: deberían quedar cartas.");
      }
    }
  }

 function jugarCarta(cartaAJugar: Carta) {
    const cartaSuperior = descarte.value.peek();
    
    if (cartaSuperior && cartaAJugar.esJugableSobre(cartaSuperior)) {
      
      // --- CAMBIO AQUÍ ---
      // En vez de comparar objetos (c !== cartaAJugar), comparamos sus valores únicos.
      // Esto soluciona el problema de los Proxies de Vue en los tests.
      manoJugador.value = manoJugador.value.filter(c => 
        !(c.palo === cartaAJugar.palo && c.valor === cartaAJugar.valor)
      );
      // -------------------
      
      descarte.value.push(cartaAJugar);
      
      if (manoJugador.value.length === 0) {
        alert("¡Has ganado! Fin del juego.");
      }
    } else {
      alert("Movimiento no válido. Comprueba palo o valor.");
    }
  }

  return {
    iniciarJuego,
    robarCarta,
    jugarCarta,
    manoJugador,
    descarte,
    mazo,
    cartaSuperiorDescarte: computed(() => descarte.value.peek()),
    cartasEnMazo: computed(() => mazo.value.size())
  };
}