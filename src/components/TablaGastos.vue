<template>
  <div class="contenedor-tabla">
    
    <div class="header-acciones">
      <h2>Control de Gastos</h2>
      <el-button type="primary" size="large" @click="mostrarDialogo = true">
        <el-icon><Plus /></el-icon> Nuevo Gasto
      </el-button>
    </div>

    <!-- Resumen de gastos -->
    <div class="resumen-gastos">
      <div class="resumen-item">
        <span class="resumen-label">Total Gastos (Bs)</span>
        <span class="resumen-valor bs">Bs. {{ totalBs }}</span>
      </div>
      <div class="resumen-item">
        <span class="resumen-label">Total Gastos ($)</span>
        <span class="resumen-valor usd">$ {{ totalUsd }}</span>
      </div>
    </div>

    <el-card shadow="hover">
      <el-table :data="listaGastos" style="width: 100%" border stripe size="large">
        
        <el-table-column prop="id" label="ID" width="70" sortable />
        
        <el-table-column prop="fecha" label="FECHA" width="120" sortable>
          <template #default="scope">
            {{ formatearFecha(scope.row.fecha) }}
          </template>
        </el-table-column>

        <el-table-column prop="beneficiario" label="BENEFICIARIO" min-width="180" />

        <el-table-column prop="concepto" label="CONCEPTO" min-width="200">
          <template #default="scope">
            <el-tooltip :content="scope.row.concepto" placement="top">
              <span class="concepto-truncado">{{ scope.row.concepto }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="monto_bs" label="MONTO BS" width="130" align="right">
          <template #default="scope">
            <span class="texto-naranja">Bs. {{ Number(scope.row.monto_bs || 0).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="monto_usd" label="MONTO $" width="110" align="right">
          <template #default="scope">
            <span class="texto-verde">$ {{ Number(scope.row.monto_usd || 0).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="nro_factura_proveedor" label="FACTURA" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.nro_factura_proveedor" size="small" type="info">
              {{ scope.row.nro_factura_proveedor }}
            </el-tag>
            <span v-else class="sin-factura">—</span>
          </template>
        </el-table-column>

        <el-table-column prop="forma_pago" label="FORMA PAGO" width="130">
          <template #default="scope">
            <el-tag 
              :type="scope.row.forma_pago === 'Efectivo' ? 'success' : 'primary'" 
              size="small"
            >
              {{ scope.row.forma_pago }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="ACCIONES" width="100" align="center" fixed="right">
          <template #default="scope">
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="confirmarEliminar(scope.row)"
            >
              Eliminar
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- Diálogo de nuevo gasto -->
    <el-dialog 
      v-model="mostrarDialogo" 
      title="Registrar Nuevo Gasto" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="nuevoGasto" label-position="top">
        <el-form-item label="Fecha" required>
          <el-date-picker 
            v-model="nuevoGasto.fecha" 
            type="date" 
            placeholder="Seleccione fecha"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="Beneficiario">
          <el-input v-model="nuevoGasto.beneficiario" placeholder="Agencia de Condominio" />
        </el-form-item>

        <el-form-item label="Concepto" required>
          <el-input 
            v-model="nuevoGasto.concepto" 
            type="textarea" 
            :rows="2"
            placeholder="Descripción del gasto"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Monto Bs">
              <el-input-number 
                v-model="nuevoGasto.monto_bs" 
                :precision="2" 
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Monto $">
              <el-input-number 
                v-model="nuevoGasto.monto_usd" 
                :precision="2" 
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Nº Factura (Opcional)">
          <el-input v-model="nuevoGasto.nro_factura_proveedor" placeholder="Número de factura" />
        </el-form-item>

        <el-form-item label="Forma de Pago" required>
          <el-select v-model="nuevoGasto.forma_pago" placeholder="Seleccione" style="width: 100%">
            <el-option label="Transferencia" value="Transferencia" />
            <el-option label="Efectivo" value="Efectivo" />
            <el-option label="Pago Móvil" value="Pago Móvil" />
            <el-option label="Zelle" value="Zelle" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarDialogo = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarGasto" :loading="guardando">
          Guardar Gasto
        </el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { gastosApi } from '../services/api'

// Datos
const listaGastos = ref([])
const mostrarDialogo = ref(false)
const guardando = ref(false)

const nuevoGasto = ref({
  fecha: '',
  beneficiario: 'Agencia de Condominio',
  concepto: '',
  monto_bs: 0,
  monto_usd: 0,
  nro_factura_proveedor: '',
  forma_pago: ''
})

// Computed
const totalBs = computed(() => {
  return listaGastos.value.reduce((sum, g) => sum + Number(g.monto_bs || 0), 0).toFixed(2)
})

const totalUsd = computed(() => {
  return listaGastos.value.reduce((sum, g) => sum + Number(g.monto_usd || 0), 0).toFixed(2)
})

// Métodos
const formatearFecha = (fecha) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return d.toLocaleDateString('es-VE')
}

const cargarGastos = async () => {
  try {
    listaGastos.value = await gastosApi.getAll()
  } catch (error) {
    console.error('Error al cargar gastos:', error)
    ElMessage.error('Error al cargar los gastos')
  }
}

const guardarGasto = async () => {
  if (!nuevoGasto.value.fecha || !nuevoGasto.value.concepto || !nuevoGasto.value.forma_pago) {
    ElMessage.warning('Complete los campos requeridos')
    return
  }

  guardando.value = true
  try {
    await gastosApi.create(nuevoGasto.value)
    ElMessage.success('Gasto registrado exitosamente')
    mostrarDialogo.value = false
    resetearFormulario()
    await cargarGastos()
  } catch (error) {
    ElMessage.error(error.message || 'Error al registrar gasto')
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = (gasto) => {
  ElMessageBox.confirm(
    `¿Está seguro de eliminar el gasto "${gasto.concepto}"?`,
    'Confirmar eliminación',
    {
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await gastosApi.delete(gasto.id)
      ElMessage.success('Gasto eliminado')
      await cargarGastos()
    } catch (error) {
      ElMessage.error('Error al eliminar gasto')
    }
  }).catch(() => {})
}

const resetearFormulario = () => {
  nuevoGasto.value = {
    fecha: '',
    beneficiario: 'Agencia de Condominio',
    concepto: '',
    monto_bs: 0,
    monto_usd: 0,
    nro_factura_proveedor: '',
    forma_pago: ''
  }
}

onMounted(() => {
  cargarGastos()
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

.resumen-gastos {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.resumen-item {
  background: white;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.resumen-label {
  color: #909399;
  font-size: 13px;
}

.resumen-valor {
  font-size: 20px;
  font-weight: 600;
}

.resumen-valor.bs { color: #e6a23c; }
.resumen-valor.usd { color: #67c23a; }

.texto-verde {
  color: #67c23a;
  font-weight: bold;
}

.texto-naranja {
  color: #e6a23c;
  font-weight: 500;
}

.concepto-truncado {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sin-factura {
  color: #c0c4cc;
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

  .resumen-gastos {
    flex-direction: column;
    gap: 10px;
  }
  
  :deep(.el-card__body) {
    padding: 10px;
    overflow-x: auto;
  }
  
  :deep(.el-table) {
    min-width: 900px;
  }

  :deep(.el-dialog) {
    width: 95% !important;
    margin: 10px auto;
  }
}
</style>
