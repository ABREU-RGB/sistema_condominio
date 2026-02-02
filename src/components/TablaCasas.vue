<template>
  <div class="contenedor-tabla">
    
    <div class="header-acciones">
      <h2>Gestión de Propiedades (Casas)</h2>
      <el-button type="primary" size="large">+ Nueva Casa</el-button>
    </div>

    <el-card shadow="hover">
      <el-table :data="listaCasas" style="width: 100%" border stripe size="large">
        
        <el-table-column prop="id" label="ID" width="80" sortable />
        
        <el-table-column prop="numero" label="NÚMERO DE CASA" width="180" sortable>
          <template #default="scope">
             <el-tag effect="dark" type="success" size="large">{{ scope.row.numero }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="propietario" label="PROPIETARIO ACTUAL" min-width="200" sortable />

        <el-table-column label="ACCIONES" width="150" align="center">
          <template #default>
            <el-button size="small" type="primary" plain>Editar</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const listaCasas = ref([
  { id: 1, numero: 'A-01', propietario: 'Juan Perez' },
  { id: 2, numero: 'C-15', propietario: 'Maria Lopez' },
  { id: 3, numero: 'B-04', propietario: 'Carlos Ruiz' },
  { id: 4, numero: 'A-52', propietario: 'Juan Perez' }, /* Juan tiene 2 casas */
  { id: 5, numero: 'D-10', propietario: 'Ana Gomez' },
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
    min-width: 500px;
  }
}
</style>
