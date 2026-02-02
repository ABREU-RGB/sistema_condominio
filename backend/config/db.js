const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexiones MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistema_condominio',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de conexión
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a MySQL - Base de datos:', process.env.DB_NAME);
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error conectando a MySQL:', err.message);
    });

module.exports = pool;
