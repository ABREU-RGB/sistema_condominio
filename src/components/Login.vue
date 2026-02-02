<template>
  <div class="login-container">
    <div class="login-content">
      <div class="glass-card">
        <div class="login-header">
          <h1>Conjunto B <span class="highlight">Canaima</span></h1>
          <p>Bienvenido al sistema de gestión del condominio</p>
        </div>

        <el-form 
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          label-position="top" 
          class="login-form"
          @submit.prevent="submitForm"
        >
          <el-form-item label="Usuario" prop="usuario">
            <el-input 
              v-model="loginForm.usuario" 
              placeholder="Ingresa tu usuario" 
              size="large"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item label="Contraseña" prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="Ingresa tu contraseña" 
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <div class="actions">
            <el-checkbox v-model="loginForm.remember">Recordarme</el-checkbox>
            <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <el-button 
            type="primary" 
            class="login-btn" 
            size="large" 
            :loading="loading"
            @click="submitForm"
          >
            INGRESAR
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['login'])

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  usuario: '',
  password: '',
  remember: false
})

const rules = reactive({
  usuario: [
    { required: true, message: 'El usuario es obligatorio', trigger: 'blur' },
    { min: 3, message: 'El usuario debe tener al menos 3 caracteres', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'La contraseña es obligatoria', trigger: 'blur' },
    { min: 4, message: 'La contraseña debe tener al menos 4 caracteres', trigger: 'blur' }
  ]
})

const submitForm = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      
      // Simulamos validación asíncrona
      setTimeout(() => {
        loading.value = false
        
        // Verificación de credenciales (Hardcoded por solicitud)
        if (loginForm.usuario === 'admin@gmail.com' && loginForm.password === '1234') {
          ElMessage.success('¡Bienvenido Administrador!')
          emit('login')
        } else {
          ElMessage.error('Usuario o contraseña incorrectos')
        }
      }, 1000)
    } else {
      ElMessage.error('Por favor completa los campos requeridos.')
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Fondo elegante oscuro con imagen de fondo sutil si se desea, o gradiente */
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  position: relative;
  overflow: hidden;
}

/* Círculos decorativos de fondo para dar profundidad */
.login-container::before {
  content: '';
  position: absolute;
  top: -10%;
  right: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(42,138,129,0.4) 0%, rgba(0,0,0,0) 70%);
  border-radius: 50%;
}

.login-container::after {
  content: '';
  position: absolute;
  bottom: -10%;
  left: -5%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(27,79,88,0.4) 0%, rgba(0,0,0,0) 70%);
  border-radius: 50%;
}

.glass-card {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px); /* Efecto Glassmorphism */
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  color: white;
  z-index: 10;
  position: relative;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 28px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 1px;
}

.highlight {
  color: #4db6ac; /* Un tono teal brillante */
}

.login-header p {
  color: #ccc;
  margin-top: 5px;
  font-size: 14px;
}

/* Personalización de Inputs de Element Plus para el modo oscuro/glass */
:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

:deep(.el-input__inner) {
  color: white;
}



:deep(.el-form-item__label) {
  color: #eee !important;
}

:deep(.el-form-item__error) {
  color: #ff6b6b; /* Color de error visible en fondo oscuro */
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
}

:deep(.el-checkbox__label) {
  color: #ccc !important;
}

.forgot-link {
  color: #4db6ac;
  text-decoration: none;
  transition: 0.3s;
}

.forgot-link:hover {
  text-decoration: underline;
  color: white;
}

.login-btn {
  width: 100%;
  background: var(--user-gradient); /* Usando el gradiente del usuario */
  border: none;
  font-weight: 600;
  letter-spacing: 1px;
  transition: transform 0.2s;
}

.login-btn:hover {
  transform: scale(1.02);
  background: linear-gradient(90deg, #2a8a81 0%, #1b4f58 100%);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 480px) {
  .glass-card {
    width: 90%;
    max-width: 350px;
    padding: 30px 20px;
  }
  
  .login-header h1 {
    font-size: 22px;
  }
  
  .login-header p {
    font-size: 12px;
  }
  
  .actions {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .login-container::before,
  .login-container::after {
    display: none; /* Ocultar círculos decorativos en móvil */
  }
}

@media (max-width: 768px) {
  .glass-card {
    width: 85%;
    max-width: 400px;
  }
}
</style>
