<script setup lang="ts">
// APP.VUE: Componente raíz de la aplicación
// Este es el componente "padre" que solo contiene otro componente (JuegoCartas)

// Importamos el componente principal del juego
import JuegoCartas from './components/JuegoCartas.vue';
</script>

<template>
  <!-- El contenedor principal de la app -->
  <!-- Solo renderiza el componente JuegoCartas -->
  <main>
    <JuegoCartas />
  </main>
</template>

<style>
/* ===== ESTILOS GLOBALES ===== */

/**
 * BODY: Estilos del documento HTML completo
 * Elimina los márgenes y rellenos por defecto del navegador
 */
body {
  margin: 0;                    /* Sin margen */
  padding: 0;                   /* Sin relleno */
  font-family: sans-serif;      /* Fuente limpia y moderna */
  background-color: #f4f4f4;    /* Gris claro (aunque se cubre con el de JuegoCartas) */
}

/**
 * MAIN: El contenedor principal
 * Centra el contenido verticalmente en la pantalla
 */
main {
  display: flex;                /* Usa flexbox para centar */
  justify-content: center;      /* Centra horizontalmente */
  align-items: center;          /* Centra verticalmente */
  min-height: 100vh;            /* Ocupa toda la altura de la pantalla */
}
</style>