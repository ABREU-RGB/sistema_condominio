<template>
  <div class="contenedor-tabla">
    
    <div class="header-acciones">
      <h2>Control de Recibos</h2>
      <el-button type="primary" size="large" @click="abrirDialogoNuevo">
        <el-icon><Plus /></el-icon> Nuevo Recibo
      </el-button>
    </div>

    <!-- Filtros rápidos (opcional) -->
    <div class="filtros-tabla">
      <!-- Aquí podrían ir filtros por fecha/casa -->
    </div>

    <el-card shadow="hover">
      <el-table :data="listaRecibos" style="width: 100%" border stripe size="large">
        
        <el-table-column prop="nro_recibo" label="RECIBO" width="100" sortable>
          <template #default="scope">
            <span class="nro-recibo">#{{ scope.row.nro_recibo?.toString().padStart(4, '0') }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="casa_numero" label="CASA" width="100" sortable>
          <template #default="scope">
            <strong>{{ scope.row.casa_numero }}</strong>
          </template>
        </el-table-column>

        <el-table-column prop="fecha" label="FECHA" width="120" sortable>
          <template #default="scope">
            {{ formatearFecha(scope.row.fecha) }}
          </template>
        </el-table-column>

        <el-table-column prop="monto_bs" label="BS" width="120" align="right">
          <template #default="scope">
            <span>Bs. {{ Number(scope.row.monto_bs).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="monto_usd" label="$" width="100" align="right">
          <template #default="scope">
            <span class="texto-verde">$ {{ Number(scope.row.monto_usd).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="referencia" label="REF." width="120">
          <template #default="scope">
            <span class="texto-ref">{{ scope.row.referencia || 'N/A' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="metodo_pago" label="MÉTODO" width="120">
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.metodo_pago }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="propietario_nombre" label="PROPIETARIO" min-width="180" />

        <el-table-column label="MESES CANCELADOS" min-width="200">
          <template #default="scope">
            <div v-if="scope.row.meses_pagados">
              <el-tag 
                v-for="mes in scope.row.meses_pagados.split(', ')" 
                :key="mes" 
                type="success" 
                class="mr-1"
                effect="dark"
                size="small"
              >
                {{ mes }}
              </el-tag>
            </div>
            <span v-else class="sin-dato">—</span>
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
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- Diálogo Nuevo Recibo -->
    <el-dialog 
      v-model="mostrarDialogo" 
      title="Registrar Nuevo Pago de Condominio" 
      width="800px"
      :close-on-click-modal="false"
      top="5vh"
    >
      <el-form :model="nuevoRecibo" label-position="top">
        
        <!-- Encabezado del recibo -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Nro Recibo" required>
              <el-input-number v-model="nuevoRecibo.nro_recibo" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Fecha" required>
              <el-date-picker 
                v-model="nuevoRecibo.fecha" 
                type="date" 
                placeholder="Seleccione"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Casa / Unidad" required>
              <el-select 
                v-model="nuevoRecibo.casa_numero" 
                placeholder="Seleccione Casa" 
                filterable
                style="width: 100%"
              >
                <el-option 
                  v-for="casa in listaCasas" 
                  :key="casa.numero_casa" 
                  :label="`${casa.numero_casa} - ${casa.propietario_nombre || 'Sin prop.'}`" 
                  :value="casa.numero_casa" 
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Detalles de pago -->
        <div class="seccion-form">
          <h4>Detalles del Pago</h4>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Monto total ($)" required>
                <el-input-number 
                  v-model="nuevoRecibo.monto_usd" 
                  :precision="2" 
                  :min="0"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Monto total (Bs)">
                <el-input-number 
                  v-model="nuevoRecibo.monto_bs" 
                  :precision="2" 
                  :min="0"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Tasa de Cambio">
                <el-input-number 
                  v-model="nuevoRecibo.tasa_cambio" 
                  :precision="2" 
                  :min="0"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Método de Pago" required>
                <el-select v-model="nuevoRecibo.metodo_pago" placeholder="Seleccione" style="width: 100%">
                  <el-option label="Pago Móvil" value="Pago Móvil" />
                  <el-option label="Zelle" value="Zelle" />
                  <el-option label="Efectivo" value="Efectivo" />
                  <el-option label="Transferencia" value="Transferencia" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="Referencia / Comprobante">
                <el-input v-model="nuevoRecibo.referencia" placeholder="Nro de referencia bancaria" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- Conceptos / Periodos -->
        <div class="seccion-form">
          <div class="header-conceptos">
            <h4>Conceptos Cancelados</h4>
            <el-button size="small" type="success" plain @click="agregarPeriodo">
              + Agregar Periodo
            </el-button>
          </div>
          
          <div v-for="(item, index) in nuevoRecibo.periodos_pagados" :key="index" class="fila-periodo">
            <el-select v-model="item.mes" placeholder="Mes" style="width: 120px">
              <el-option v-for="m in 12" :key="m" :label="nombreMes(m)" :value="m" />
            </el-select>
            
            <el-input-number 
              v-model="item.anio" 
              placeholder="Año" 
              :controls="false"
              style="width: 80px" 
            />
            
            <el-input-number 
              v-model="item.monto_asignado" 
              placeholder="Monto $" 
              :min="0"
              :precision="2"
              style="width: 120px" 
            />
            
            <el-button type="danger" circle size="small" @click="eliminarPeriodo(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <div v-if="nuevoRecibo.periodos_pagados.length === 0" class="sin-registros">
            No se han agregado periodos al recibo
          </div>
        </div>

        <el-form-item label="Observaciones">
          <el-input v-model="nuevoRecibo.observaciones" type="textarea" :rows="2" />
        </el-form-item>

      </el-form>

      <template #footer>
        <el-button @click="mostrarDialogo = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarRecibo" :loading="guardando">
          Generar Recibo
        </el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { recibosApi, casasApi } from '../services/api'

// Datos
const listaRecibos = ref([])
const listaCasas = ref([])
const mostrarDialogo = ref(false)
const guardando = ref(false)

const nuevoRecibo = ref({
  nro_recibo: null,
  casa_numero: '',
  fecha: new Date().toISOString().split('T')[0],
  monto_bs: 0,
  monto_usd: 0,
  tasa_cambio: 0,
  metodo_pago: 'Pago Móvil',
  referencia: '',
  observaciones: '',
  periodos_pagados: []
})

// Métodos
const nombreMes = (mes) => {
  const meses = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return meses[mes] || ''
}

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return d.toLocaleDateString('es-VE')
}

const cargarRecibos = async () => {
  try {
    listaRecibos.value = await recibosApi.getAll()
  } catch (error) {
    console.error('Error al cargar recibos:', error)
    ElMessage.error('Error al cargar recibos')
  }
}

const cargarCasas = async () => {
  try {
    listaCasas.value = await casasApi.getAll()
  } catch (error) {
    console.error('Error al cargar casas:', error)
  }
}

const abrirDialogoNuevo = () => {
  nuevoRecibo.value = {
    nro_recibo: null, // Debería ser autoincremental o sugerido, por ahora manual
    casa_numero: '',
    fecha: new Date().toISOString().split('T')[0],
    monto_bs: 0,
    monto_usd: 0,
    tasa_cambio: 0,
    metodo_pago: 'Pago Móvil',
    referencia: '',
    observaciones: '',
    periodos_pagados: [
      { mes: new Date().getMonth() + 1, anio: new Date().getFullYear(), monto_asignado: 0 }
    ]
  }
  // Intentar sugerir próximo número
  if (listaRecibos.value.length > 0) {
    const max = Math.max(...listaRecibos.value.map(r => r.nro_recibo))
    nuevoRecibo.value.nro_recibo = max + 1
  } else {
    nuevoRecibo.value.nro_recibo = 1
  }
  
  mostrarDialogo.value = true
}

const agregarPeriodo = () => {
  nuevoRecibo.value.periodos_pagados.push({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    monto_asignado: 0
  })
}

const eliminarPeriodo = (index) => {
  nuevoRecibo.value.periodos_pagados.splice(index, 1)
}

const guardarRecibo = async () => {
  if (!nuevoRecibo.value.nro_recibo || !nuevoRecibo.value.casa_numero) {
    ElMessage.warning('Número de recibo y casa son obligatorios')
    return
  }

  guardando.value = true
  try {
    await recibosApi.create(nuevoRecibo.value)
    ElMessage.success('Recibo generado exitosamente')
    mostrarDialogo.value = false
    await cargarRecibos()
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message || 'Error al generar recibo')
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = (recibo) => {
  ElMessageBox.confirm(
    `¿Eliminar recibo #${recibo.nro_recibo}?`,
    'Confirmar eliminación',
    {
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await recibosApi.delete(recibo.nro_recibo)
      ElMessage.success('Recibo eliminado')
      await cargarRecibos()
    } catch (error) {
      ElMessage.error('Error al eliminar recibo')
    }
  }).catch(() => {})
}

onMounted(() => {
  cargarRecibos()
  cargarCasas()
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

.nro-recibo {
  font-family: monospace;
  font-weight: bold;
  font-size: 14px;
}

.texto-verde {
  color: #67c23a;
  font-weight: bold;
}

.texto-ref {
  font-family: monospace;
  color: #909399;
}

.mr-1 {
  margin-right: 5px;
  margin-bottom: 2px;
}

.sin-dato {
  color: #c0c4cc;
}

/* Formulario */
.seccion-form {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.seccion-form h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 14px;
  color: #606266;
  text-transform: uppercase;
  font-weight: 600;
}

.header-conceptos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.fila-periodo {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.sin-registros {
  text-align: center;
  color: #909399;
  font-style: italic;
  padding: 10px;
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
    min-width: 1000px;
  }

  :deep(.el-dialog) {
    width: 95% !important;
    margin: 10px auto;
  }
}
</style>