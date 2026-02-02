<template>
  <div class="contenedor-tabla">
    
    <div class="header-acciones">
      <h2>Control de Recibos</h2>
      <el-button type="primary" size="large">+ Nuevo Recibo</el-button>
    </div>

    <el-card shadow="hover">
      <el-table :data="listaRecibos" style="width: 100%" border stripe size="large">
        
        <el-table-column prop="id" label="RECIBO" width="90" sortable />
        
        <el-table-column prop="casa" label="CASA" width="100" sortable>
          <template #default="scope">
            <strong>{{ scope.row.casa }}</strong>
          </template>
        </el-table-column>

        <el-table-column prop="fecha" label="FECHA" width="120" />

        <el-table-column prop="monto_bs" label="BS" width="120">
          <template #default="scope">
            <span>Bs. {{ scope.row.monto_bs }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="monto_usd" label="$" width="100">
          <template #default="scope">
            <span class="texto-verde">$ {{ scope.row.monto_usd }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="referencia" label="REF." width="120" />

        <el-table-column prop="modo" label="MODO" width="120">
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.modo }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="propietario" label="PROPIETARIO" min-width="180" />

        <el-table-column prop="meses" label="MESES CANCELADOS" min-width="200">
          <template #default="scope">
            <el-tag 
              v-for="mes in scope.row.meses.split(', ')" 
              :key="mes" 
              type="success" 
              class="mr-1"
              effect="dark"
            >
              {{ mes }}
            </el-tag>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// Datos de prueba (Idénticos a tu foto)
// Nota: 'meses' es un string separado por comas, igual que en la BD
const listaRecibos = ref([
  { 
    id: 1001, 
    casa: 'A-52', 
    fecha: '01/02/2026', 
    monto_bs: '150.00', 
    monto_usd: '4.50', 
    referencia: '123456', 
    modo: 'Pago Movil', 
    propietario: 'Juan Perez', 
    meses: 'Enero' 
  },
  { 
    id: 1002, 
    casa: 'C-15', 
    fecha: '02/02/2026', 
    monto_bs: '300.00', 
    monto_usd: '9.00', 
    referencia: '987654', 
    modo: 'Zelle', 
    propietario: 'Maria Lopez', 
    meses: 'Enero, Febrero' 
  },
  { 
    id: 1003, 
    casa: 'B-04', 
    fecha: '03/02/2026', 
    monto_bs: '150.00', 
    monto_usd: '4.50', 
    referencia: 'EFECTIVO', 
    modo: 'Efectivo', 
    propietario: 'Carlos Ruiz', 
    meses: 'Marzo' 
  }
])
</script>

<style scoped>
.contenedor-tabla {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-acciones {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

/* Detalles cosméticos adicionales */
.texto-verde {
  color: #67c23a; /* Verde de Element Plus */
  font-weight: bold;
}

.mr-1 {
  margin-right: 5px;
  margin-bottom: 2px;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .contenedor-tabla {
    padding: 10px;
  }
  
  .header-acciones {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-acciones h2 {
    font-size: 18px;
    margin: 0;
  }
  
  /* Tabla con scroll horizontal */
  :deep(.el-card__body) {
    padding: 10px;
    overflow-x: auto;
  }
  
  :deep(.el-table) {
    min-width: 800px;
  }
}

@media (max-width: 480px) {
  .header-acciones h2 {
    font-size: 16px;
  }
}
</style>