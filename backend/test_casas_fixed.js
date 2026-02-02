const db = require('./config/db');

async function test() {
    try {
        const [rows] = await db.query(`
      SELECT 
        c.numero_casa,
        p.cedula as propietario_cedula,
        p.nombre_completo as propietario_nombre,
        p.telefono as propietario_telefono
      FROM casas c
      LEFT JOIN propietarios p ON c.propietario_id = p.id
      ORDER BY c.numero_casa
    `);
        console.log('Success - Count:', rows.length);
        if (rows.length > 0) console.log('Sample:', rows[0]);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

test();
