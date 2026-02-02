const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Obtener todas las cuotas mensuales
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM cuotas_mensuales ORDER BY anio DESC, mes DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener cuotas:', error);
        res.status(500).json({ error: 'Error al obtener cuotas' });
    }
});

// GET - Obtener cuota de un mes/año específico
router.get('/:anio/:mes', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM cuotas_mensuales WHERE anio = ? AND mes = ?',
            [req.params.anio, req.params.mes]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cuota no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener cuota:', error);
        res.status(500).json({ error: 'Error al obtener cuota' });
    }
});

// POST - Crear nueva cuota mensual
router.post('/', async (req, res) => {
    try {
        const { mes, anio, monto_deuda, descripcion } = req.body;

        if (!mes || !anio || !monto_deuda) {
            return res.status(400).json({ error: 'Mes, año y monto son requeridos' });
        }

        const [result] = await db.query(
            `INSERT INTO cuotas_mensuales (mes, anio, monto_deuda, descripcion) 
             VALUES (?, ?, ?, ?)`,
            [mes, anio, monto_deuda, descripcion || 'Cuota de Condominio']
        );

        res.status(201).json({ message: 'Cuota creada exitosamente', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Ya existe una cuota para ese mes/año' });
        }
        console.error('Error al crear cuota:', error);
        res.status(500).json({ error: 'Error al crear cuota' });
    }
});

// PUT - Actualizar cuota
router.put('/:id', async (req, res) => {
    try {
        const { monto_deuda, descripcion } = req.body;

        const [result] = await db.query(
            'UPDATE cuotas_mensuales SET monto_deuda = ?, descripcion = ? WHERE id = ?',
            [monto_deuda, descripcion, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cuota no encontrada' });
        }

        res.json({ message: 'Cuota actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar cuota:', error);
        res.status(500).json({ error: 'Error al actualizar cuota' });
    }
});

// DELETE - Eliminar cuota
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM cuotas_mensuales WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cuota no encontrada' });
        }

        res.json({ message: 'Cuota eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cuota:', error);
        res.status(500).json({ error: 'Error al eliminar cuota' });
    }
});

// POST - Generar cuotas para todo un año
router.post('/generar-anio', async (req, res) => {
    try {
        const { anio, monto_deuda, descripcion } = req.body;

        if (!anio || !monto_deuda) {
            return res.status(400).json({ error: 'Año y monto son requeridos' });
        }

        const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let creadas = 0;
        let existentes = 0;

        for (const mes of meses) {
            try {
                await db.query(
                    `INSERT INTO cuotas_mensuales (mes, anio, monto_deuda, descripcion) 
                     VALUES (?, ?, ?, ?)`,
                    [mes, anio, monto_deuda, descripcion || 'Cuota de Condominio']
                );
                creadas++;
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    existentes++;
                } else {
                    throw err;
                }
            }
        }

        res.status(201).json({
            message: `Cuotas generadas: ${creadas} nuevas, ${existentes} ya existían`,
            creadas,
            existentes
        });
    } catch (error) {
        console.error('Error al generar cuotas:', error);
        res.status(500).json({ error: 'Error al generar cuotas del año' });
    }
});

module.exports = router;
