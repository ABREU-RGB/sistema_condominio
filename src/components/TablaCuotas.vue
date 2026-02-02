<template>
  <div class="contenedor-tabla">
    
    <div class="header-acciones">
      <h2>Configuración de Cuotas Mensuales</h2>
      <div class="acciones-grupo">
        <el-button type="success" size="large" @click="mostrarGenerador = true">
          <el-icon><Calendar /></el-icon> Generar Año
        </el-button>
        <el-button type="primary" size="large" @click="abrirDialogoNueva">
          <el-icon><Plus /></el-icon> Nueva Cuota
        </el-button>
      </div>
    </div>

    <!-- Filtro por año -->
    <div class="filtro-anio">
      <span>Filtrar por año:</span>
      <el-select v-model="anioFiltro" placeholder="Todos" clearable style="width: 120px">
        <el-option 
          v-for="anio in aniosDisponibles" 
          :key="anio" 
          :label="anio" 
          :value="anio" 
        />
      </el-select>
    </div>

    <el-card shadow="hover">
      <el-table :data="cuotasFiltradas" style="width: 100%" border stripe size="large">
        
        <el-table-column prop="id" label="ID" width="70" sortable />
        
        <el-table-column label="PERÍODO" width="180" sortable>
          <template #default="scope">
            <el-tag effect="dark" type="primary" size="large">
              {{ nombreMes(scope.row.mes) }} {{ scope.row.anio }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="monto_deuda" label="MONTO BASE" width="150" align="right">
          <template #default="scope">
            <span class="monto-cuota">$ {{ Number(scope.row.monto_deuda).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="descripcion" label="DESCRIPCIÓN" min-width="200" />

        <el-table-column label="ACCIONES" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" plain @click="editarCuota(scope.row)">
              Editar
            </el-button>
            <el-button size="small" type="danger" plain @click="confirmarEliminar(scope.row)">
              Eliminar
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- Diálogo Nueva/Editar Cuota -->
    <el-dialog 
      v-model="mostrarDialogo" 
      :title="modoEdicion ? 'Editar Cuota' : 'Nueva Cuota Mensual'" 
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="cuotaForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Mes" required>
              <el-select v-model="cuotaForm.mes" placeholder="Seleccione" style="width: 100%" :disabled="modoEdicion">
                <el-option v-for="m in 12" :key="m" :label="nombreMes(m)" :value="m" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Año" required>
              <el-input-number 
                v-model="cuotaForm.anio" 
                :min="2020" 
                :max="2030"
                style="width: 100%"
                :disabled="modoEdicion"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Monto Base ($)" required>
          <el-input-number 
            v-model="cuotaForm.monto_deuda" 
            :precision="2" 
            :min="0"
            :step="0.5"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Descripción">
          <el-input v-model="cuotaForm.descripcion" placeholder="Cuota de Condominio" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarDialogo = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarCuota" :loading="guardando">
          {{ modoEdicion ? 'Actualizar' : 'Crear' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Diálogo Generar Año -->
    <el-dialog 
      v-model="mostrarGenerador" 
      title="Generar Cuotas del Año" 
      width="400px"
      :close-on-click-modal="false"
    >
      <el-alert 
        title="Esta acción creará 12 cuotas (enero a diciembre) con el monto indicado." 
        type="info" 
        :closable="false"
        style="margin-bottom: 20px"
      />

      <el-form :model="generadorForm" label-position="top">
        <el-form-item label="Año">
          <el-input-number 
            v-model="generadorForm.anio" 
            :min="2020" 
            :max="2030"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Monto Base ($)">
          <el-input-number 
            v-model="generadorForm.monto_deuda" 
            :precision="2" 
            :min="0"
            :step="0.5"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Descripción">
          <el-input v-model="generadorForm.descripcion" placeholder="Cuota de Condominio" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarGenerador = false">Cancelar</el-button>
        <el-button type="success" @click="generarAnio" :loading="generando">
          Generar 12 Cuotas
        </el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Calendar } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cuotasApi } from '../services/api'

// Datos
const listaCuotas = ref([])
const anioFiltro = ref(null)
const mostrarDialogo = ref(false)
const mostrarGenerador = ref(false)
const modoEdicion = ref(false)
const guardando = ref(false)
const generando = ref(false)
const cuotaEditandoId = ref(null)

const cuotaForm = ref({
  mes: null,
  anio: new Date().getFullYear(),
  monto_deuda: 4.50,
  descripcion: 'Cuota de Condominio'
})

const generadorForm = ref({
  anio: new Date().getFullYear(),
  monto_deuda: 4.50,
  descripcion: 'Cuota de Condominio'
})

// Computed
const aniosDisponibles = computed(() => {
  const anios = [...new Set(listaCuotas.value.map(c => c.anio))]
  return anios.sort((a, b) => b - a)
})

const cuotasFiltradas = computed(() => {
  if (!anioFiltro.value) return listaCuotas.value
  return listaCuotas.value.filter(c => c.anio === anioFiltro.value)
})

// Métodos
const nombreMes = (mes) => {
  const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return meses[mes] || ''
}

const cargarCuotas = async () => {
  try {
    listaCuotas.value = await cuotasApi.getAll()
  } catch (error) {
    console.error('Error al cargar cuotas:', error)
    ElMessage.error('Error al cargar las cuotas')
  }
}

const abrirDialogoNueva = () => {
  modoEdicion.value = false
  cuotaEditandoId.value = null
  cuotaForm.value = {
    mes: null,
    anio: new Date().getFullYear(),
    monto_deuda: 4.50,
    descripcion: 'Cuota de Condominio'
  }
  mostrarDialogo.value = true
}

const editarCuota = (cuota) => {
  modoEdicion.value = true
  cuotaEditandoId.value = cuota.id
  cuotaForm.value = {
    mes: cuota.mes,
    anio: cuota.anio,
    monto_deuda: Number(cuota.monto_deuda),
    descripcion: cuota.descripcion
  }
  mostrarDialogo.value = true
}

const guardarCuota = async () => {
  if (!cuotaForm.value.mes || !cuotaForm.value.anio || !cuotaForm.value.monto_deuda) {
    ElMessage.warning('Complete todos los campos requeridos')
    return
  }

  guardando.value = true
  try {
    if (modoEdicion.value) {
      await cuotasApi.update(cuotaEditandoId.value, cuotaForm.value)
      ElMessage.success('Cuota actualizada')
    } else {
      await cuotasApi.create(cuotaForm.value)
      ElMessage.success('Cuota creada exitosamente')
    }
    mostrarDialogo.value = false
    await cargarCuotas()
  } catch (error) {
    ElMessage.error(error.message || 'Error al guardar cuota')
  } finally {
    guardando.value = false
  }
}

const generarAnio = async () => {
  if (!generadorForm.value.anio || !generadorForm.value.monto_deuda) {
    ElMessage.warning('Indique el año y monto')
    return
  }

  generando.value = true
  try {
    const result = await cuotasApi.generarAnio(generadorForm.value)
    ElMessage.success(result.message)
    mostrarGenerador.value = false
    await cargarCuotas()
  } catch (error) {
    ElMessage.error(error.message || 'Error al generar cuotas')
  } finally {
    generando.value = false
  }
}

const confirmarEliminar = (cuota) => {
  ElMessageBox.confirm(
    `¿Eliminar la cuota de ${nombreMes(cuota.mes)} ${cuota.anio}?`,
    'Confirmar eliminación',
    {
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await cuotasApi.delete(cuota.id)
      ElMessage.success('Cuota eliminada')
      await cargarCuotas()
    } catch (error) {
      ElMessage.error('Error al eliminar cuota')
    }
  }).catch(() => {})
}

onMounted(() => {
  cargarCuotas()
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
  gap: 15px;
}

.acciones-grupo {
  display: flex;
  gap: 10px;
}

.filtro-anio {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #606266;
}

.monto-cuota {
  color: #409eff;
  font-weight: bold;
  font-size: 16px;
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

  .acciones-grupo {
    flex-direction: column;
    width: 100%;
  }

  .acciones-grupo .el-button {
    width: 100%;
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
