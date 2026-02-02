const db = require('./config/db');

async function test() {
    try {
        const [rows] = await db.query(`
      SELECT 
        c.numero_casa,
        c.propietario_cedula,
        p.nombre_completo as propietario_nombre,
        p.telefono as propietario_telefono
      FROM casas c
      LEFT JOIN propietarios p ON c.propietario_cedula = p.cedula
      ORDER BY c.numero_casa
    `);
        console.log('Success:', rows);
        process.exit(0);
    } catch (error) {
        console.error('Error detail:', error);
        process.exit(1);
    }
}

test();
