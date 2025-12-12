<script setup lang="ts">
// ===== COMPONENTE JUEGOCARTAS.VUE =====
// Este es el componente principal que muestra la interfaz visual del juego

import { onMounted } from 'vue';                    // Hook de Vue: se ejecuta cuando el componente se carga
import { useJuego } from '@/composables/useJuego';  // Importamos la lógica del juego
import type { Palo } from '@/types/cards';          // Importamos el tipo para TypeScript

// ===== OBTENER LA LÓGICA DEL JUEGO =====
// Destructuring: cogemos solo lo que necesitamos de useJuego
const {
  iniciarJuego,                  // Función para empezar una partida
  robarCarta,                    // Función para coger una carta del mazo
  jugarCarta,                    // Función para jugar una carta de la mano
  manoJugador,                   // Array reactivo con las cartas del jugador
  cartaSuperiorDescarte,         // La carta visible del descarte
  cartasEnMazo                   // Número de cartas que quedan en el mazo
} = useJuego();

// ===== FUNCIONES AUXILIARES DE INTERFAZ =====

/**
 * Determina si un palo es de color rojo
 * (Usado para pintar el texto rojo en la UI)
 * @param palo - El palo de la carta
 * @returns true si es Corazones o Diamantes
 */
const esRojo = (palo: Palo) => palo === 'Corazones' || palo === 'Diamantes';

/**
 * Convierte el nombre del palo a su símbolo Unicode
 * Hace las cartas más legibles y bonitas
 * @param palo - El nombre del palo
 * @returns El símbolo del palo (♥ ♦ ♠ ♣)
 */
const obtenerSimbolo = (palo: Palo) => {
  switch(palo) {
    case 'Corazones': return '♥';    // Rojo
    case 'Diamantes': return '♦';    // Rojo
    case 'Picas': return '♠';        // Negro
    case 'Tréboles': return '♣';     // Negro
  }
};

// ===== CICLO DE VIDA =====
// Este hook se ejecuta cuando el componente está completamente cargado
// Es el momento perfecto para empezar una partida nueva
onMounted(() => {
  iniciarJuego();
});
</script>

<template>
  <!-- CONTENEDOR PRINCIPAL: El tapete de juego verde -->
  <div class="tablero-juego">
    <h1 class="titulo">Juego de Cartas: El Último Descarte</h1>
    
    <!-- ===== MESA CENTRAL ===== -->
    <!-- Aquí están el mazo y el descarte frente a frente -->
    <div class="mesa-central">
      
      <!-- SECCIÓN IZQUIERDA: El Mazo (cartas para robar) -->
      <div class="zona-pila">
        <h3>Mazo ({{ cartasEnMazo }})</h3>  <!-- Muestra cuántas cartas quedan -->
        
        <!-- La carta reverso: el dorso del mazo -->
        <div class="carta reverso" @click="robarCarta">
          <div class="patron"></div>  <!-- Patrón decorativo azul -->
        </div>
        
        <!-- Botón para robar una carta -->
        <button class="btn-accion" @click="robarCarta">Robar Carta</button>
      </div>

      <!-- SECCIÓN DERECHA: El Descarte (la carta que se ve) -->
      <div class="zona-pila">
        <h3>Descarte</h3>
        
        <!-- Si hay una carta en el descarte, la mostramos -->
        <div v-if="cartaSuperiorDescarte" 
             class="carta" 
             :class="{ 'rojo': esRojo(cartaSuperiorDescarte.palo) }">
          <!-- Esquina superior izquierda: valor de la carta -->
          <span class="valor-esquina">{{ cartaSuperiorDescarte.valor }}</span>
          
          <!-- Centro: el símbolo del palo (grande) -->
          <span class="palo-central">{{ obtenerSimbolo(cartaSuperiorDescarte.palo) }}</span>
          
          <!-- Esquina inferior derecha: valor invertido (como en cartas reales) -->
          <span class="valor-esquina invertido">{{ cartaSuperiorDescarte.valor }}</span>
        </div>
        
        <!-- Si no hay carta en el descarte (caso extraño), mostramos un hueco -->
        <div v-else class="hueco-vacio">Vacío</div>
      </div>
    </div>

    <!-- ===== LA MANO DEL JUGADOR ===== -->
    <!-- Las cartas que el jugador puede jugar -->
    <div class="zona-mano">
      <h3>Tu Mano</h3>
      
      <!-- Flex container: distribuye las cartas en fila -->
      <div class="mano-flex">
  <div 
    v-for="(carta, index) in manoJugador"
    :key="index"
    class="carta jugable"
    :class="{ 'rojo': esRojo(carta.palo) }"
    @click="jugarCarta(carta)"
  >
    <span class="valor-esquina">{{ carta.valor }}</span>
    <span class="palo-central">{{ obtenerSimbolo(carta.palo) }}</span>
    <span class="valor-esquina invertido">{{ carta.valor }}</span>
  </div>
</div>
      
      <!-- Mensaje de victoria si no quedan cartas -->
      <p v-if="manoJugador.length === 0" class="mensaje-victoria">¡Has ganado!</p>
    </div>
  </div>
</template>

<style scoped>
/* ===== ESTILOS PRINCIPALES ===== */

/**
 * TABLERO-JUEGO: El contenedor principal
 * - Fondo verde oscuro (como un tapete de casino)
 * - Ocupa toda la pantalla (min-height: 100vh)
 * - Centra todo el contenido
 */
.tablero-juego {
  background-color: #2e7d32; /* Verde oscuro */
  min-height: 100vh;        /* Altura mínima = altura de la pantalla */
  padding: 20px;            /* Espacio interior */
  color: white;             /* Texto blanco */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
  /* Flexbox: centra verticalmente y distribuye */
  display: flex;
  flex-direction: column;    /* Los elementos van de arriba a abajo */
  align-items: center;       /* Centra horizontalmente */
}

/* Título con sombra para mejor legibilidad */
.titulo { 
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5); 
  margin-bottom: 30px; 
}

/**
 * MESA-CENTRAL: El área con el mazo y el descarte
 * Distribuye los dos montones lado a lado con espacio entre ellos
 */
.mesa-central {
  display: flex;      /* Coloca los elementos lado a lado */
  gap: 60px;          /* Espacio entre el mazo y el descarte */
  margin-bottom: 40px;
}

/**
 * ZONA-PILA: Contenedor para mazo y descarte
 * Agrupa la pila de cartas y el botón debajo
 */
.zona-pila {
  display: flex;
  flex-direction: column;  /* Los elementos van verticales */
  align-items: center;
  gap: 10px;              /* Espacio entre la carta y el botón */
}

/* ===== ESTILOS DE LAS CARTAS ===== */

/**
 * CARTA: Los estilos base para cualquier carta
 * Todas las cartas tienen el mismo tamaño y apariencia
 */
.carta {
  width: 100px;           /* Ancho de una carta estándar */
  height: 140px;          /* Alto (proporcional al ancho) */
  background-color: white;
  border-radius: 10px;    /* Esquinas redondeadas */
  
  /* Sombra para efecto 3D */
  box-shadow: 3px 3px 8px rgba(0,0,0,0.3);
  
  /* Flexbox: distribuye el contenido dentro de la carta */
  display: flex;
  flex-direction: column;
  justify-content: space-between;  /* Separa el valor superior e inferior */
  
  padding: 10px;
  box-sizing: border-box;  /* El padding se incluye en el tamaño total */
  
  color: black; /* Color por defecto para Picas y Tréboles (negros) */
  font-weight: bold;
  position: relative;
  transition: transform 0.2s;  /* Animación suave al mover */
}

/**
 * CARTA.ROJO: Variante para cartas rojas (Corazones y Diamantes)
 * Solo cambia el color del texto
 */
.carta.rojo {
  color: #d32f2f; /* Rojo oscuro */
}

/**
 * CARTA.REVERSO: Estilo para la parte trasera del mazo
 * Es azul con un patrón decorativo
 */
.carta.reverso {
  background: #1565c0; /* Azul */
  cursor: pointer;
  border: 2px solid white;
}

/* El patrón diagonal dentro del reverso */
.carta.reverso .patron {
  width: 100%; 
  height: 100%;
  background-image: repeating-linear-gradient(
    45deg, 
    rgba(255,255,255,0.1) 0px, 
    rgba(255,255,255,0.1) 10px, 
    transparent 10px, 
    transparent 20px
  );
}

/**
 * CARTA.JUGABLE: Cartas en la mano del jugador
 * Tienen efectos interactivos (hover, etc.)
 */
.carta.jugable { 
  cursor: pointer; 
}

/* Efecto al pasar el ratón sobre una carta de la mano */
.carta.jugable:hover { 
  transform: translateY(-15px);  /* Sube 15px */
  box-shadow: 0 10px 15px rgba(0,0,0,0.4);  /* Sombra más marcada */
}

/* ===== DETALLES DENTRO DE LA CARTA ===== */

/* El valor en las esquinas */
.valor-esquina { 
  font-size: 1.2rem; 
}

/* La esquina inferior está invertida (180º) */
.valor-esquina.invertido { 
  transform: rotate(180deg); 
}

/* El palo en el centro (grande) */
.palo-central { 
  font-size: 2.5rem; 
  align-self: center;  /* Centra horizontalmente */
}

/* ===== ESTADO VACÍO ===== */

/**
 * HUECO-VACIO: Se muestra si no hay cartas en el descarte
 * (No debería pasar en el juego normal)
 */
.hueco-vacio {
  width: 100px; 
  height: 140px;
  border: 2px dashed rgba(255,255,255,0.5);  /* Borde punteado */
  border-radius: 10px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
}

/* ===== ZONA DE LA MANO ===== */

/**
 * ZONA-MANO: Contenedor para todas las cartas del jugador
 * Ocupa todo el ancho disponible
 */
.zona-mano {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/**
 * MANO-FLEX: Distribuye las cartas del jugador en una fila flexible
 * Si hay muchas cartas, se envuelven en varias líneas
 */
.mano-flex {
  display: flex;
  flex-wrap: wrap;       /* Las cartas se envuelven si no caben */
  justify-content: center; /* Centra las cartas */
  gap: 15px;             /* Espacio entre cartas */
}

/* ===== BOTÓN DE ACCIÓN ===== */

/**
 * BTN-ACCION: El botón "Robar Carta"
 * Estilo amarillo y legible
 */
.btn-accion {
  padding: 8px 16px;
  background-color: #ffca28;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
}

/* Efecto al pasar el ratón sobre el botón */
.btn-accion:hover { 
  background-color: #ffb300;  /* Amarillo más oscuro */
}

/* ===== MENSAJE DE VICTORIA ===== */

.mensaje-victoria {
  font-size: 1.5rem;
  color: #ffca28;
  font-weight: bold;
  margin-top: 20px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>