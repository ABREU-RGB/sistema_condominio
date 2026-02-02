const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const propietariosRoutes = require('./routes/propietarios');
const casasRoutes = require('./routes/casas');
const recibosRoutes = require('./routes/recibos');
const gastosRoutes = require('./routes/gastos');
const cuotasRoutes = require('./routes/cuotas');

// Usar rutas
app.use('/api/propietarios', propietariosRoutes);
app.use('/api/casas', casasRoutes);
app.use('/api/recibos', recibosRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/cuotas', cuotasRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API Sistema Condominio funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});
