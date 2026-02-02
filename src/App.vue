<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

// Estado simple de sesión
const isLoggedIn = ref(false)

const handleLogin = () => {
  // Aquí iría la lógica real de autenticación
  isLoggedIn.value = true
}

const handleLogout = () => {
  isLoggedIn.value = false
}
</script>

<template>
  <!-- Transición suave entre vistas -->
  <transition name="fade" mode="out-in">
    <Login v-if="!isLoggedIn" @login="handleLogin" />
    <Home v-else @logout="handleLogout" />
  </transition>
</template>

<style>
/* Animación de transición global */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
