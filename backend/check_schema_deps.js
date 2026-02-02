const db = require('./config/db');

async function check() {
    try {
        const [periodos] = await db.query('DESCRIBE periodos_pagados');
        console.log('Columns in periodos_pagados table:', periodos);

        // Check if metodos_pago exists
        try {
            const [metodos] = await db.query('DESCRIBE metodos_pago');
            console.log('Columns in metodos_pago table:', metodos);
        } catch (e) {
            console.log('Table metodos_pago does not exist or error:', e.message);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

check();
