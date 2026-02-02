const db = require('./config/db');

async function check() {
    try {
        const [detalles] = await db.query('DESCRIBE detalles_recibo');
        console.log('Columns in detalles_recibo table:', detalles);

        const [metodos] = await db.query('DESCRIBE metodos_pago');
        console.log('Columns in metodos_pago table:', metodos);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

check();
