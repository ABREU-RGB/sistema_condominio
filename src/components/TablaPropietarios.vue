<template>
  <div class="contenedor-tabla">
    
    <div class="header-acciones">
      <h2>Gestión de Propietarios</h2>
      <el-button type="primary" size="large" @click="abrirDialogoNuevo">
        <el-icon><Plus /></el-icon> Nuevo Propietario
      </el-button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="barra-busqueda">
      <el-input 
        v-model="busqueda" 
        placeholder="Buscar por cédula o nombre..." 
        clearable
        style="max-width: 350px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <el-card shadow="hover">
      <el-table :data="propietariosFiltrados" style="width: 100%" border stripe size="large">
        
        <el-table-column prop="cedula" label="CÉDULA/RIF" width="150" sortable>
          <template #default="scope">
            <el-tag effect="dark" type="info" size="large">{{ scope.row.cedula }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="nombre_completo" label="NOMBRE COMPLETO" min-width="200" sortable>
          <template #default="scope">
            <strong>{{ scope.row.nombre_completo }}</strong>
          </template>
        </el-table-column>

        <el-table-column prop="telefono" label="TELÉFONO" width="150">
          <template #default="scope">
            <span v-if="scope.row.telefono">{{ scope.row.telefono }}</span>
            <span v-else class="sin-dato">—</span>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="EMAIL" min-width="200">
          <template #default="scope">
            <span v-if="scope.row.email" class="email-link">{{ scope.row.email }}</span>
            <span v-else class="sin-dato">—</span>
          </template>
        </el-table-column>

        <el-table-column label="ACCIONES" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" plain @click="editarPropietario(scope.row)">
              Editar
            </el-button>
            <el-button size="small" type="danger" plain @click="confirmarEliminar(scope.row)">
              Eliminar
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- Diálogo Nuevo/Editar Propietario -->
    <el-dialog 
      v-model="mostrarDialogo" 
      :title="modoEdicion ? 'Editar Propietario' : 'Nuevo Propietario'" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="propietarioForm" label-position="top">
        <el-form-item label="Cédula o RIF" required>
          <el-input 
            v-model="propietarioForm.cedula" 
            placeholder="Ej: V-12345678"
            :disabled="modoEdicion"
          >
            <template #prepend>
              <el-select v-model="propietarioForm.tipoCedula" style="width: 70px" :disabled="modoEdicion">
                <el-option label="V" value="V" />
                <el-option label="E" value="E" />
                <el-option label="J" value="J" />
                <el-option label="G" value="G" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="Nombre Completo" required>
          <el-input v-model="propietarioForm.nombre_completo" placeholder="Nombre y apellido" />
        </el-form-item>

        <el-form-item label="Teléfono">
          <el-input v-model="propietarioForm.telefono" placeholder="Ej: 0414-1234567" />
        </el-form-item>

        <el-form-item label="Email">
          <el-input v-model="propietarioForm.email" type="email" placeholder="correo@ejemplo.com" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarDialogo = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarPropietario" :loading="guardando">
          {{ modoEdicion ? 'Actualizar' : 'Guardar' }}
        </el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { propietariosApi } from '../services/api'

// Datos
const listaPropietarios = ref([])
const busqueda = ref('')
const mostrarDialogo = ref(false)
const modoEdicion = ref(false)
const guardando = ref(false)
const cedulaOriginal = ref('')

const propietarioForm = ref({
  tipoCedula: 'V',
  cedula: '',
  nombre_completo: '',
  telefono: '',
  email: ''
})

// Computed
const propietariosFiltrados = computed(() => {
  if (!busqueda.value) return listaPropietarios.value
  const termino = busqueda.value.toLowerCase()
  return listaPropietarios.value.filter(p => 
    p.cedula.toLowerCase().includes(termino) || 
    p.nombre_completo.toLowerCase().includes(termino)
  )
})

// Métodos
const cargarPropietarios = async () => {
  try {
    listaPropietarios.value = await propietariosApi.getAll()
  } catch (error) {
    console.error('Error al cargar propietarios:', error)
    ElMessage.error('Error al cargar los propietarios')
  }
}

const abrirDialogoNuevo = () => {
  modoEdicion.value = false
  cedulaOriginal.value = ''
  propietarioForm.value = {
    tipoCedula: 'V',
    cedula: '',
    nombre_completo: '',
    telefono: '',
    email: ''
  }
  mostrarDialogo.value = true
}

const editarPropietario = (prop) => {
  modoEdicion.value = true
  cedulaOriginal.value = prop.cedula
  
  // Extraer tipo de cédula del formato V-12345678
  const partes = prop.cedula.split('-')
  const tipo = partes[0] || 'V'
  const numero = partes.slice(1).join('-') || prop.cedula
  
  propietarioForm.value = {
    tipoCedula: tipo,
    cedula: numero,
    nombre_completo: prop.nombre_completo,
    telefono: prop.telefono || '',
    email: prop.email || ''
  }
  mostrarDialogo.value = true
}

const guardarPropietario = async () => {
  const cedulaCompleta = `${propietarioForm.value.tipoCedula}-${propietarioForm.value.cedula}`
  
  if (!propietarioForm.value.cedula || !propietarioForm.value.nombre_completo) {
    ElMessage.warning('Cédula y nombre son obligatorios')
    return
  }

  const datos = {
    cedula: cedulaCompleta,
    nombre_completo: propietarioForm.value.nombre_completo,
    telefono: propietarioForm.value.telefono || null,
    email: propietarioForm.value.email || null
  }

  guardando.value = true
  try {
    if (modoEdicion.value) {
      await propietariosApi.update(cedulaOriginal.value, datos)
      ElMessage.success('Propietario actualizado')
    } else {
      await propietariosApi.create(datos)
      ElMessage.success('Propietario creado exitosamente')
    }
    mostrarDialogo.value = false
    await cargarPropietarios()
  } catch (error) {
    ElMessage.error(error.message || 'Error al guardar propietario')
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = (prop) => {
  ElMessageBox.confirm(
    `¿Está seguro de eliminar a "${prop.nombre_completo}"? Esta acción también eliminará todas sus casas asociadas.`,
    'Confirmar eliminación',
    {
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await propietariosApi.delete(prop.cedula)
      ElMessage.success('Propietario eliminado')
      await cargarPropietarios()
    } catch (error) {
      ElMessage.error(error.message || 'Error al eliminar propietario')
    }
  }).catch(() => {})
}

onMounted(() => {
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

.barra-busqueda {
  margin-bottom: 15px;
}

.sin-dato {
  color: #c0c4cc;
}

.email-link {
  color: #409eff;
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

  .barra-busqueda {
    width: 100%;
  }

  .barra-busqueda .el-input {
    max-width: 100% !important;
  }
  
  :deep(.el-card__body) {
    padding: 10px;
    overflow-x: auto;
  }
  
  :deep(.el-table) {
    min-width: 700px;
  }

  :deep(.el-dialog) {
    width: 95% !important;
    margin: 10px auto;
  }
}
</style>
