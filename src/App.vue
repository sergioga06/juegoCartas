<script setup lang="ts">
// Importamos tu componente del juego
import JuegoCartas from './components/JuegoCartas.vue';
</script>

<template>
  <main>
    <JuegoCartas />
  </main>
</template>

<style>
/* Estilos globales básicos para limpiar la pantalla */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #f4f4f4;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>