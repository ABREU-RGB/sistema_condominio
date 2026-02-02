<template>
  <div class="layout-container">
    <!-- Overlay para móvil -->
    <div 
      v-if="sidebarOpen" 
      class="sidebar-overlay" 
      @click="sidebarOpen = false"
    ></div>

      <!-- Sidebar Mejorado -->
    <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="logo-area">
        <div class="logo-icon">🏢</div>
        <h2>Conjunto B Canaima</h2>
      </div>
      <nav class="sidebar-nav">

        <ul>
          <li :class="{ active: currentView === 'dashboard' }" @click="navigateTo('dashboard')">
            <el-icon><Monitor /></el-icon> Dashboard
          </li>
          
          <div class="menu-divider">
            <span>Gestión Principal</span>
          </div>
          
          <li :class="{ active: currentView === 'propietarios' }" @click="navigateTo('propietarios')">
            <el-icon><User /></el-icon> Propietarios
          </li>
          <li :class="{ active: currentView === 'propiedades' }" @click="navigateTo('propiedades')">
            <el-icon><House /></el-icon> Casas
          </li>
          
          <div class="menu-divider">
            <span>Finanzas</span>
          </div>
          
          <li :class="{ active: currentView === 'recibos' }" @click="navigateTo('recibos')">
            <el-icon><Ticket /></el-icon> Recibos
          </li>
          <li :class="{ active: currentView === 'gastos' }" @click="navigateTo('gastos')">
            <el-icon><CreditCard /></el-icon> Gastos
          </li>
          <li :class="{ active: currentView === 'cuotas' }" @click="navigateTo('cuotas')">
            <el-icon><Calendar /></el-icon> Cuotas
          </li>
          
          <li class="logout" @click="$emit('logout')">
            <el-icon><SwitchButton /></el-icon> Cerrar Sesión
          </li>
        </ul>
      </nav>
      
      <!-- Versión en el sidebar -->
      <div class="sidebar-footer">
        <small>v1.0 - Sistema Ejecutivo</small>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header con el COLOR solicitado -->
      <header class="top-header">
        <div class="header-left">
          <!-- Botón Hamburguesa (solo visible en móvil) -->
          <button class="hamburger-btn" @click="sidebarOpen = !sidebarOpen">
            <el-icon :size="24"><Fold v-if="sidebarOpen" /><Expand v-else /></el-icon>
          </button>
          <h3>{{ pageTitle }}</h3>
        </div>
        <div class="header-right">
          <div class="user-profile">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span class="user-name">Administrador</span>
          </div>
        </div>
      </header>

      <!-- Scrollable Content con transiciones -->
      <main class="content-body">
        <transition name="slide-fade" mode="out-in">
          
          <!-- VISTA DASHBOARD -->
          <div v-if="currentView === 'dashboard'" key="dashboard">
            <!-- Widgets de Resumen -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="icon-box green">
                  <el-icon><Wallet /></el-icon>
                </div>
                <div class="stat-info">
                  <p>Ingresos Mes</p>
                  <h4>$ 1,250.00</h4>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="icon-box orange">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="stat-info">
                  <p>Por Cobrar</p>
                  <h4>$ 450.00</h4>
                </div>
              </div>

              <div class="stat-card">
                <div class="icon-box blue">
                  <el-icon><House /></el-icon>
                </div>
                <div class="stat-info">
                  <p>Total Unidades</p>
                  <h4>84</h4>
                </div>
              </div>

              <div class="stat-card">
                <div class="icon-box purple">
                  <el-icon><User /></el-icon>
                </div>
                <div class="stat-info">
                  <p>Propietarios</p>
                  <h4>78</h4>
                </div>
              </div>
            </div>


          </div>

          <!-- VISTA PROPIETARIOS -->
          <div v-else-if="currentView === 'propietarios'" key="propietarios">
            <TablaPropietarios />
          </div>

          <!-- VISTA PROPIEDADES (CASAS) -->
          <div v-else-if="currentView === 'propiedades'" key="propiedades">
            <TablaCasas />
          </div>

          <!-- VISTA RECIBOS -->
          <div v-else-if="currentView === 'recibos'" key="recibos">
            <TablaRecibos />
          </div>

          <!-- VISTA GASTOS -->
          <div v-else-if="currentView === 'gastos'" key="gastos">
            <TablaGastos />
          </div>

          <!-- VISTA CUOTAS -->
          <div v-else-if="currentView === 'cuotas'" key="cuotas">
            <TablaCuotas />
          </div>

        </transition>
      </main>

      <!-- Footer con el COLOR solicitado -->
      <footer class="footer">
        <p>&copy; 2026 Asoc. Civil Conjunto B Canaima - Versión Ejecutiva 1.0</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Monitor, House, User, SwitchButton, Wallet, Warning, Fold, Expand,
  Ticket, CreditCard, Calendar
} from '@element-plus/icons-vue'
import TablaRecibos from './TablaRecibos.vue'
import TablaPropietarios from './TablaPropietarios.vue'
import TablaCasas from './TablaCasas.vue'
import TablaGastos from './TablaGastos.vue'
import TablaCuotas from './TablaCuotas.vue'

defineEmits(['logout'])

// Estado de navegación
const currentView = ref('dashboard')

// Estado del sidebar (para móvil)
const sidebarOpen = ref(false)

// Navegar y cerrar sidebar en móvil
const navigateTo = (view) => {
  currentView.value = view
  sidebarOpen.value = false // Cerrar sidebar en móvil después de navegar
}

// Título dinámico
const pageTitle = computed(() => {
  switch(currentView.value) {
    case 'dashboard': return 'Dashboard General';
    case 'propietarios': return 'Directorio de Propietarios';
    case 'casas': return 'Número de casa';
    case 'recibos': return 'Control de Pagos y Recibos';
    case 'gastos': return 'Registro de Gastos';
    case 'cuotas': return 'Configuración de Cuotas';
    default: return 'Asociación Civil Conjunto B Canaima';
  }
})
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background-color: var(--bg-custom);
  position: relative;
}

/* --- Overlay para móvil --- */
.sidebar-overlay {
  display: none;
}

/* --- Sidebar Mejorado --- */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 100;
}

.logo-area {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  background: rgba(0,0,0,0.1);
}

.logo-icon {
  font-size: 28px;
}

.logo-area h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 15px 0;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-divider {
  padding: 15px 25px 8px;
  color: rgba(255,255,255,0.4);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.sidebar-nav li {
  padding: 14px 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.25s ease;
  font-weight: 500;
  font-size: 14px;
  border-left: 3px solid transparent;
}

.sidebar-nav li:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
  border-left-color: rgba(255,255,255,0.3);
}

.sidebar-nav li.active {
  background: var(--user-gradient);
  color: white;
  border-left-color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.sidebar-nav li.logout {
  margin-top: 20px;
  color: #ff6b6b;
  border-top: 1px solid rgba(255,255,255,0.05);
  padding-top: 20px;
}

.sidebar-nav li.logout:hover {
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff4949;
  border-left-color: #ff4949;
}

.sidebar-footer {
  padding: 15px;
  text-align: center;
  color: rgba(255,255,255,0.3);
  border-top: 1px solid rgba(255,255,255,0.05);
}

/* --- Main Structure --- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- Header --- */
.top-header {
  height: 60px;
  background: var(--user-gradient); 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h3 {
  margin: 0;
  font-weight: 500;
}

/* Botón Hamburguesa - Oculto en desktop */
.hamburger-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

/* --- Body --- */
.content-body {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  background: #f5f7fa;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.icon-box.green { background: #e1f3d8; color: #67c23a; }
.icon-box.orange { background: #faecd8; color: #e6a23c; }
.icon-box.blue { background: #d9ecff; color: #409eff; }
.icon-box.purple { background: #e8d9f3; color: #9b59b6; }

.stat-info p { margin: 0; color: #909399; font-size: 14px; }
.stat-info h4 { margin: 5px 0 0; font-size: 20px; color: #303133; }

.table-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  overflow: hidden; 
}

/* --- Footer --- */
.footer {
  height: 40px;
  background: var(--user-gradient); 
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255,255,255,0.8);
  font-size: 12px;
}

/* --- Transiciones de vista --- */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* ========== RESPONSIVE ========== */

/* Tablet */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
  
  .content-body {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

/* Móvil */
@media (max-width: 768px) {
  /* Overlay visible en móvil cuando sidebar está abierto */
  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
  
  /* Sidebar oculto por defecto, se desliza desde la izquierda */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
  }
  
  .sidebar.sidebar-open {
    transform: translateX(0);
  }
  
  /* Mostrar botón hamburguesa */
  .hamburger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Ajustes de header */
  .top-header {
    padding: 0 15px;
  }
  
  .header-left h3 {
    font-size: 16px;
  }
  
  /* Ocultar nombre de usuario en móvil */
  .user-name {
    display: none;
  }
  
  /* Ajustes de contenido */
  .content-body {
    padding: 15px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .footer {
    font-size: 10px;
    padding: 0 10px;
  }
  
  .footer p {
    text-align: center;
  }
}

/* Móvil pequeño */
@media (max-width: 480px) {
  .header-left h3 {
    font-size: 14px;
  }
  
  .icon-box {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .stat-info h4 {
    font-size: 18px;
  }
}
</style>
