// COMPOSABLE USELUEGO: Lógica principal del juego
// Un "composable" es una función Vue que encapsula lógica reutilizable

import { ref, computed } from 'vue';      // Herramientas de Vue
import { Pila } from '@/core/Pila';       // Estructura de datos para pilas
import { Carta } from '@/core/Carta';     // Clase de carta
import type { Palo, Valor } from '@/types/cards';  // Tipos

export function useJuego() {
  // ===== ESTADOS REACTIVOS =====
  // "ref" hace que Vue reaccione a cambios en estas variables
  const mazo = ref(new Pila<Carta>());              // Pila de cartas para robar
  const descarte = ref(new Pila<Carta>());          // Montón de descarte (cartas jugadas)
  const manoJugador = ref<Carta[]>([]);             // Array de cartas del jugador

  // Arrays para generar la baraja completa
  const palos: Palo[] = ['Picas', 'Corazones', 'Tréboles', 'Diamantes'];
  const valores: Valor[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  // ===== FUNCIÓN AUXILIAR: BARAJAR =====
  /**
   * Baraja un array de cartas usando el algoritmo de Fisher-Yates
   * (mezcla aleatoria garantizada)
   * @param array - El array de cartas a barajar
   * @returns El mismo array pero mezclado
   */
  const barajarArray = (array: Carta[]) => {
    // Empezamos de atrás hacia adelante
    for (let i = array.length - 1; i > 0; i--) {
      // Elegimos un índice aleatorio
      const j = Math.floor(Math.random() * (i + 1));
      
      // Guardamos referencias temporales
      const temp = array[i];
      const randomItem = array[j];

      // Verificamos explícitamente que existan (para TypeScript estricto)
      if (temp && randomItem) {
        // Intercambiamos las cartas
        array[i] = randomItem;
        array[j] = temp;
      }
    }
    return array;
  };

  // ===== FUNCIÓN: INICIAR JUEGO =====
  /**
   * Crea una baraja completa, la baraja, y reparte cartas iniciales
   */
  function iniciarJuego() {
    // Paso 1: Crear las 52 cartas (4 palos × 13 valores)
    let cartas: Carta[] = [];
    palos.forEach(p => valores.forEach(v => cartas.push(new Carta(p, v))));
    
    // Paso 2: Barajar la baraja
    cartas = barajarArray(cartas);
    
    // Paso 3: Llenar el mazo principal con las cartas barajadas
    mazo.value = new Pila<Carta>();
    cartas.forEach(c => mazo.value.push(c));
    
    // Paso 4: Limpiar la mano del jugador y el descarte
    manoJugador.value = [];
    descarte.value = new Pila<Carta>();

    // Paso 5: Repartir 7 cartas iniciales
    for (let i = 0; i < 7; i++) {
      const c = mazo.value.pop();
      if (c) { 
        manoJugador.value.push(c);
      }
    }

    // Paso 6: Poner una carta inicial en el descarte (la que se ve)
    const cartaInicial = mazo.value.pop();
    if (cartaInicial) { 
      descarte.value.push(cartaInicial);
    }
  }

  // ===== FUNCIÓN: RECONSTITUIR MAZO =====
  /**
   * Cuando se acaban las cartas del mazo, cogemos las del descarte,
   * las barajamos (excepto la superior), y las metemos en el mazo
   */
  function reconstituirMazo() {
    // Si queda 1 o menos cartas, no hay nada que reciclar
    if (descarte.value.size() <= 1) return;

    // Guardamos la carta superior (la que se VE actualmente)
    const cartaCima = descarte.value.pop(); 
    const cartasParaReciclar: Carta[] = [];

    // Sacamos TODAS las demás del descarte
    while (!descarte.value.isEmpty()) {
      const c = descarte.value.pop();
      if (c) { 
        cartasParaReciclar.push(c);
      }
    }

    // Las barajamos y las metemos en el mazo principal
    barajarArray(cartasParaReciclar).forEach(c => mazo.value.push(c));
    
    // Volvemos a poner la carta de la cima en el descarte
    if (cartaCima) { 
      descarte.value.push(cartaCima);
    }
  }

  // ===== FUNCIÓN: ROBAR CARTA =====
  /**
   * El jugador roba una carta del mazo
   * Si el mazo está vacío, primero reconstituye desde el descarte
   */
  function robarCarta() {
    // Si no hay cartas en el mazo, reciclamos el descarte
    if (mazo.value.isEmpty()) {
      reconstituirMazo();
    }

    // Sacamos una carta del mazo
    const carta = mazo.value.pop();
    
    // Si hay carta, la añadimos a la mano
    if (carta) { 
      manoJugador.value.push(carta);
    } else {
      // Si aún así no hay cartas, hay un problema
      if (descarte.value.size() > 1) {
          console.warn("Error inesperado: deberían quedar cartas.");
      }
    }
  }

  // ===== FUNCIÓN: JUGAR CARTA =====
  /**
   * El jugador intenta jugar una carta
   * Solo es válida si coincide el palo O el valor con la superior del descarte
   * @param cartaAJugar - La carta que quiere jugar
   */
  function jugarCarta(cartaAJugar: Carta) {
    // Obtenemos la carta visible del descarte
    const cartaSuperior = descarte.value.peek();
    
    // Comprobamos si la carta es jugable
    if (cartaSuperior && cartaAJugar.esJugableSobre(cartaSuperior)) {
      
      // IMPORTANTE: Comparamos propiedades (palo y valor) no objetos
      // Esto es necesario por cómo Vue maneja los Proxies reactivos
      manoJugador.value = manoJugador.value.filter(c => 
        !(c.palo === cartaAJugar.palo && c.valor === cartaAJugar.valor)
      );
      
      // Ponemos la carta en el descarte
      descarte.value.push(cartaAJugar);
      
      // Si no le quedan cartas al jugador, ¡gana!
      if (manoJugador.value.length === 0) {
        alert("¡Has ganado! Fin del juego.");
      }
    } else {
      // Si no es jugable, avisamos
      alert("Movimiento no válido. Comprueba palo o valor.");
    }
  }

  // ===== DEVOLUCIÓN =====
  // Exportamos funciones y estados "reactivos" para que Vue los vea
  return {
    // Funciones
    iniciarJuego,
    robarCarta,
    jugarCarta,
    
    // Estados (referencias)
    manoJugador,
    descarte,
    mazo,
    
    // Valores computados (se actualizan automáticamente)
    cartaSuperiorDescarte: computed(() => descarte.value.peek()),      // La carta visible
    cartasEnMazo: computed(() => mazo.value.size())                     // Cuántas quedan por robar
  };
}