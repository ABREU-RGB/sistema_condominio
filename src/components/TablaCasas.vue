<template>
  <div class="contenedor-tabla">
    
    <div class="header-acciones">
      <h2>Casas</h2>
      <el-button type="primary" size="large" @click="abrirDialogoNuevo">
        <el-icon><Plus /></el-icon> Nueva Casa
      </el-button>
    </div>

    <el-card shadow="hover">
      <el-table :data="listaCasas" style="width: 100%" border stripe size="large">
        
        <el-table-column prop="numero_casa" label="NÚMERO DE CASA" width="180" sortable>
          <template #default="scope">
             <el-tag effect="dark" type="success" size="large">{{ scope.row.numero_casa }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="propietario_cedula" label="CÉDULA PROPIETARIO" width="180">
          <template #default="scope">
            <el-tag type="info">{{ scope.row.propietario_cedula }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="propietario_nombre" label="NOMBRE PROPIETARIO" min-width="200">
          <template #default="scope">
            <strong>{{ scope.row.propietario_nombre || 'Sin asignar' }}</strong>
          </template>
        </el-table-column>

        <el-table-column label="ACCIONES" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" plain @click="editarCasa(scope.row)">
              Editar
            </el-button>
            <el-button size="small" type="danger" plain @click="confirmarEliminar(scope.row)">
              Eliminar
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- Diálogo Nueva/Editar Casa -->
    <el-dialog 
      v-model="mostrarDialogo" 
      :title="modoEdicion ? 'Editar Casa' : 'Nueva Casa'" 
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="casaForm" label-position="top">
        <el-form-item label="Número de Casa" required>
          <el-input 
            v-model="casaForm.numero_casa" 
            placeholder="Ej: A-52, PB-01"
            :disabled="modoEdicion"
          />
        </el-form-item>

        <el-form-item label="Propietario" required>
          <el-select 
            v-model="casaForm.propietario_cedula" 
            placeholder="Seleccione propietario" 
            style="width: 100%"
            filterable
          >
            <el-option 
              v-for="prop in listaPropietarios" 
              :key="prop.cedula" 
              :label="`${prop.nombre_completo} (${prop.cedula})`" 
              :value="prop.cedula" 
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarDialogo = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarCasa" :loading="guardando">
          {{ modoEdicion ? 'Actualizar' : 'Guardar' }}
        </el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { casasApi, propietariosApi } from '../services/api'

// Datos
const listaCasas = ref([])
const listaPropietarios = ref([])
const mostrarDialogo = ref(false)
const modoEdicion = ref(false)
const guardando = ref(false)
const numeroCasaOriginal = ref('')

const casaForm = ref({
  numero_casa: '',
  propietario_cedula: ''
})

// Métodos
const cargarCasas = async () => {
  try {
    listaCasas.value = await casasApi.getAll()
  } catch (error) {
    console.error('Error al cargar casas:', error)
    ElMessage.error('Error al cargar las casas')
  }
}

const cargarPropietarios = async () => {
  try {
    listaPropietarios.value = await propietariosApi.getAll()
  } catch (error) {
    console.error('Error al cargar propietarios:', error)
  }
}

const abrirDialogoNuevo = () => {
  modoEdicion.value = false
  numeroCasaOriginal.value = ''
  casaForm.value = {
    numero_casa: '',
    propietario_cedula: ''
  }
  mostrarDialogo.value = true
}

const editarCasa = (casa) => {
  modoEdicion.value = true
  numeroCasaOriginal.value = casa.numero_casa
  casaForm.value = {
    numero_casa: casa.numero_casa,
    propietario_cedula: casa.propietario_cedula
  }
  mostrarDialogo.value = true
}

const guardarCasa = async () => {
  if (!casaForm.value.numero_casa || !casaForm.value.propietario_cedula) {
    ElMessage.warning('Número de casa y propietario son obligatorios')
    return
  }

  guardando.value = true
  try {
    if (modoEdicion.value) {
      await casasApi.update(numeroCasaOriginal.value, casaForm.value)
      ElMessage.success('Casa actualizada')
    } else {
      await casasApi.create(casaForm.value)
      ElMessage.success('Casa creada exitosamente')
    }
    mostrarDialogo.value = false
    await cargarCasas()
  } catch (error) {
    ElMessage.error(error.message || 'Error al guardar casa')
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = (casa) => {
  ElMessageBox.confirm(
    `¿Está seguro de eliminar la casa "${casa.numero_casa}"? Esta acción eliminará sus recibos asociados.`,
    'Confirmar eliminación',
    {
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await casasApi.delete(casa.numero_casa)
      ElMessage.success('Casa eliminada')
      await cargarCasas()
    } catch (error) {
      ElMessage.error(error.message || 'Error al eliminar casa')
    }
  }).catch(() => {})
}

onMounted(() => {
  cargarCasas()
  cargarPropietarios()
})
</script>

<style scoped>
.contenedor-tabla {
  padding: 0;
}

.header-acciones {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .header-acciones {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-acciones h2 {
    font-size: 18px;
    margin: 0;
  }
  
  :deep(.el-card__body) {
    padding: 10px;
    overflow-x: auto;
  }
  
  :deep(.el-table) {
    min-width: 600px;
  }

  :deep(.el-dialog) {
    width: 95% !important;
    margin: 10px auto;
  }
}
</style>
