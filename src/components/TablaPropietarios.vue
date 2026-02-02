<template>
  <div class="contenedor-tabla">
    
    <div class="header-acciones">
      <h2>Gestión de Propietarios</h2>
      <el-button type="primary" size="large">+ Nuevo Propietario</el-button>
    </div>

    <el-card shadow="hover">
      <el-table :data="listaPropietarios" style="width: 100%" border stripe size="large">
        
        <el-table-column prop="id" label="ID" width="80" sortable />
        
        <el-table-column prop="nombre_completo" label="NOMBRE COMPLETO" min-width="200" sortable>
          <template #default="scope">
            <strong>{{ scope.row.nombre_completo }}</strong>
          </template>
        </el-table-column>

        <el-table-column label="ACCIONES" width="150" align="center">
          <template #default>
            <el-button size="small" type="primary" plain>Editar</el-button>
            <el-button size="small" type="danger" plain>Eliminar</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const listaPropietarios = ref([
  { id: 1, nombre_completo: 'Juan Perez' },
  { id: 2, nombre_completo: 'Maria Lopez' },
  { id: 3, nombre_completo: 'Carlos Ruiz' },
  { id: 4, nombre_completo: 'Ana Gomez' },
  { id: 5, nombre_completo: 'Luis Fernandez' },
])
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
    min-width: 400px;
  }
}
</style>
