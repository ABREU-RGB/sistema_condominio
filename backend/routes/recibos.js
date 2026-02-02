const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Obtener todos los recibos
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.id as nro_recibo,
                c.numero_casa,
                r.fecha,
                r.monto_bs,
                r.monto_usd,
                r.tasa_cambio,
                r.referencia,
                m.nombre as metodo_pago,
                r.observaciones,
                p.nombre_completo as propietario_nombre,
                GROUP_CONCAT(CONCAT(cm.mes, '/', cm.anio) SEPARATOR ', ') as meses_pagados
            FROM recibos r
            LEFT JOIN casas c ON r.casa_id = c.id
            LEFT JOIN propietarios p ON c.propietario_id = p.id
            LEFT JOIN metodos_pago m ON r.metodo_pago_id = m.id
            LEFT JOIN detalles_recibo dr ON r.id = dr.recibo_id
            LEFT JOIN cuotas_mensuales cm ON dr.cuota_id = cm.id
            GROUP BY r.id
            ORDER BY r.fecha DESC, r.id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener recibos:', error);
        res.status(500).json({ error: 'Error al obtener recibos' });
    }
});

// GET - Obtener recibo individual
router.get('/:nro', async (req, res) => {
    try {
        const [recibo] = await db.query(`
            SELECT 
                r.id as nro_recibo,
                c.numero_casa,
                r.fecha,
                r.monto_bs,
                r.monto_usd,
                r.tasa_cambio,
                r.referencia,
                m.nombre as metodo_pago,
                r.observaciones,
                p.nombre_completo as propietario_nombre
            FROM recibos r
            LEFT JOIN casas c ON r.casa_id = c.id
            LEFT JOIN propietarios p ON c.propietario_id = p.id
            LEFT JOIN metodos_pago m ON r.metodo_pago_id = m.id
            WHERE r.id = ?
        `, [req.params.nro]);

        if (recibo.length === 0) {
            return res.status(404).json({ error: 'Recibo no encontrado' });
        }

        // Obtener periodos pagados
        const [periodos] = await db.query(`
            SELECT cm.mes, cm.anio, dr.monto_aplicado as monto_asignado 
            FROM detalles_recibo dr
            JOIN cuotas_mensuales cm ON dr.cuota_id = cm.id
            WHERE dr.recibo_id = ?
        `, [req.params.nro]);

        res.json({ ...recibo[0], periodos_pagados: periodos });
    } catch (error) {
        console.error('Error al obtener recibo:', error);
        res.status(500).json({ error: 'Error al obtener recibo' });
    }
});

// POST - Crear nuevo recibo
router.post('/', async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const {
            casa_numero, fecha, monto_bs, monto_usd,
            tasa_cambio, referencia, metodo_pago, observaciones,
            periodos_pagados // Array de { mes, anio, monto_asignado }
        } = req.body;

        if (!casa_numero || !fecha || !metodo_pago) {
            return res.status(400).json({ error: 'Casa, fecha y método de pago son requeridos' });
        }

        // 1. Obtener ID de casa
        const [casas] = await connection.query('SELECT id FROM casas WHERE numero_casa = ?', [casa_numero]);
        if (casas.length === 0) {
            return res.status(400).json({ error: 'La casa especificada no existe' });
        }
        const casa_id = casas[0].id;

        // 2. Obtener ID de método de pago
        const [metodos] = await connection.query('SELECT id FROM metodos_pago WHERE nombre = ?', [metodo_pago]);
        let metodo_pago_id;

        if (metodos.length === 0) {
            // Si no existe, podríamos crearlo o dar error. 
            // Para ser robusto, asumiremos que debe existir, pero si no, intentemos crearlo o fallar.
            // Mejor fallar por ahora para integridad, o usar un default.
            // Vamos a buscar "Efectivo" o el primero que haya si falla.
            return res.status(400).json({ error: `Método de pago '${metodo_pago}' no configurado` });
        } else {
            metodo_pago_id = metodos[0].id;
        }

        // 3. Insertar recibo
        const [resultRecibo] = await connection.query(
            `INSERT INTO recibos
            (casa_id, metodo_pago_id, fecha, monto_bs, monto_usd, tasa_cambio, referencia, observaciones)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
            [casa_id, metodo_pago_id, fecha, monto_bs || 0, monto_usd || 0, tasa_cambio, referencia, observaciones]
        );

        const recibo_id = resultRecibo.insertId;

        // 4. Insertar detalles (periodos)
        if (periodos_pagados && periodos_pagados.length > 0) {
            for (const periodo of periodos_pagados) {
                // Buscar la cuota correspondiente al mes/año
                const [cuotas] = await connection.query(
                    'SELECT id FROM cuotas_mensuales WHERE mes = ? AND anio = ?',
                    [periodo.mes, periodo.anio]
                );

                let cuota_id;
                if (cuotas.length === 0) {
                    // Si no existe la cuota para ese mes, la creamos al vuelo? 
                    // O detenemos el proceso?
                    // Lo ideal es crearla si estamos cobrando.
                    const [resCuota] = await connection.query(
                        'INSERT INTO cuotas_mensuales (mes, anio, monto_base, descripcion) VALUES (?, ?, ?, ?)',
                        [periodo.mes, periodo.anio, 0, `Cuota ${periodo.mes}/${periodo.anio} (Auto)`]
                    );
                    cuota_id = resCuota.insertId;
                } else {
                    cuota_id = cuotas[0].id;
                }

                await connection.query(
                    'INSERT INTO detalles_recibo (recibo_id, cuota_id, monto_aplicado) VALUES (?, ?, ?)',
                    [recibo_id, cuota_id, periodo.monto_asignado]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ message: 'Recibo creado exitosamente', nro_recibo: recibo_id });

    } catch (error) {
        await connection.rollback();
        console.error('Error al crear recibo:', error);
        res.status(500).json({ error: 'Error al crear recibo: ' + error.message });
    } finally {
        connection.release();
    }
});

// DELETE - Eliminar recibo
router.delete('/:nro', async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Eliminar detalles primero
        await connection.query('DELETE FROM detalles_recibo WHERE recibo_id = ?', [req.params.nro]);

        // Eliminar recibo
        const [result] = await connection.query('DELETE FROM recibos WHERE id = ?', [req.params.nro]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Recibo no encontrado' });
        }

        await connection.commit();
        res.json({ message: 'Recibo eliminado exitosamente' });
    } catch (error) {
        await connection.rollback();
        console.error('Error al eliminar recibo:', error);
        res.status(500).json({ error: 'Error al eliminar recibo' });
    } finally {
        connection.release();
    }
});

module.exports = router;
