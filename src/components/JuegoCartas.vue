<script setup lang="ts">
import { onMounted } from 'vue';
import { useJuego } from '@/composables/useJuego';
import type { Palo } from '@/types/cards';

const {
  iniciarJuego,
  robarCarta,
  jugarCarta,
  manoJugador,
  cartaSuperiorDescarte,
  cartasEnMazo
} = useJuego();

// Función visual: Devuelve true si el palo es rojo
const esRojo = (palo: Palo) => palo === 'Corazones' || palo === 'Diamantes';

// Función visual: Devuelve el símbolo del palo para que quede bonito
const obtenerSimbolo = (palo: Palo) => {
  switch(palo) {
    case 'Corazones': return '♥';
    case 'Diamantes': return '♦';
    case 'Picas': return '♠';
    case 'Tréboles': return '♣';
  }
};

onMounted(() => {
  iniciarJuego();
});
</script>

<template>
  <div class="tablero-juego">
    <h1 class="titulo">Juego de Cartas: El Último Descarte</h1>
    
    <div class="mesa-central">
      
      <div class="zona-pila">
        <h3>Mazo ({{ cartasEnMazo }})</h3>
        <div class="carta reverso" @click="robarCarta">
          <div class="patron"></div>
        </div>
        <button class="btn-accion" @click="robarCarta">Robar Carta</button>
      </div>

      <div class="zona-pila">
        <h3>Descarte</h3>
        <div v-if="cartaSuperiorDescarte" class="carta" :class="{ 'rojo': esRojo(cartaSuperiorDescarte.palo) }">
          <span class="valor-esquina">{{ cartaSuperiorDescarte.valor }}</span>
          <span class="palo-central">{{ obtenerSimbolo(cartaSuperiorDescarte.palo) }}</span>
          <span class="valor-esquina invertido">{{ cartaSuperiorDescarte.valor }}</span>
        </div>
        <div v-else class="hueco-vacio">Vacío</div>
      </div>
    </div>

    <div class="zona-mano">
      <h3>Tu Mano</h3>
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
      <p v-if="manoJugador.length === 0" class="mensaje-victoria">¡Has ganado!</p>
    </div>
  </div>
</template>

<style scoped>
/* Fondo general tipo "Tapete de Casino" */
.tablero-juego {
  background-color: #2e7d32; /* Verde oscuro */
  min-height: 100vh;
  padding: 20px;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); margin-bottom: 30px; }

/* Distribución de la mesa */
.mesa-central {
  display: flex;
  gap: 60px;
  margin-bottom: 40px;
}

.zona-pila {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

/* ESTILOS DE LA CARTA (La parte visual importante) */
.carta {
  width: 100px;
  height: 140px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 3px 8px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  color: black; /* Color por defecto (Picas/Tréboles) */
  font-weight: bold;
  position: relative;
  transition: transform 0.2s;
}

/* Estilos específicos para cartas rojas */
.carta.rojo {
  color: #d32f2f; /* Rojo oscuro */
}

/* Carta reverso (Mazo) */
.carta.reverso {
  background: #1565c0; /* Azul */
  cursor: pointer;
  border: 2px solid white;
}
.carta.reverso .patron {
  width: 100%; height: 100%;
  background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 10px, transparent 10px, transparent 20px);
}

/* Carta en mano (Interactiva) */
.carta.jugable { cursor: pointer; }
.carta.jugable:hover { transform: translateY(-15px); box-shadow: 0 10px 15px rgba(0,0,0,0.4); }

/* Detalles dentro de la carta */
.valor-esquina { font-size: 1.2rem; }
.valor-esquina.invertido { transform: rotate(180deg); }
.palo-central { font-size: 2.5rem; align-self: center; }

/* Hueco vacío */
.hueco-vacio {
  width: 100px; height: 140px;
  border: 2px dashed rgba(255,255,255,0.5);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5);
}

.zona-mano {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mano-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.btn-accion {
  padding: 8px 16px;
  background-color: #ffca28;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
}
.btn-accion:hover { background-color: #ffb300; }
</style>