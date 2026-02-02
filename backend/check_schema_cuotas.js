const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.query('DESCRIBE cuotas_mensuales');
        console.log('Columns in cuotas_mensuales table:', rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

check();
