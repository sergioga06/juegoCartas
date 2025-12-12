// ARCHIVO PRINCIPAL: Punto de entrada de la aplicación Vue

import { createApp } from 'vue'          // Crea la aplicación Vue
import { createPinia } from 'pinia'      // Sistema de gestión de estado (aunque no lo usamos mucho)
import App from './App.vue'              // Componente raíz

// Creamos la instancia de la aplicación
const app = createApp(App)

// Registramos Pinia (para el estado global si lo necesitamos)
app.use(createPinia())

// Montamos la aplicación en el elemento HTML con id "app" (en index.html)
app.mount('#app')
