const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Obtener todas las casas (con datos del propietario)
router.get('/', async (req, res) => {
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
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener casas:', error);
        res.status(500).json({ error: 'Error al obtener casas' });
    }
});

// GET - Obtener una casa por número
router.get('/:numero', async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT 
        c.numero_casa,
        p.cedula as propietario_cedula,
        p.nombre_completo as propietario_nombre
      FROM casas c
      LEFT JOIN propietarios p ON c.propietario_id = p.id
      WHERE c.numero_casa = ?
    `, [req.params.numero]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Casa no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener casa:', error);
        res.status(500).json({ error: 'Error al obtener casa' });
    }
});

// POST - Crear nueva casa
router.post('/', async (req, res) => {
    try {
        const { numero_casa, propietario_cedula } = req.body;

        if (!numero_casa || !propietario_cedula) {
            return res.status(400).json({ error: 'Número de casa y cédula del propietario son requeridos' });
        }

        // Obtener ID del propietario
        const [owners] = await db.query('SELECT id FROM propietarios WHERE cedula = ?', [propietario_cedula]);
        if (owners.length === 0) {
            return res.status(400).json({ error: 'El propietario especificado no existe' });
        }
        const propietario_id = owners[0].id;

        await db.query(
            'INSERT INTO casas (numero_casa, propietario_id) VALUES (?, ?)',
            [numero_casa, propietario_id]
        );

        res.status(201).json({ message: 'Casa creada exitosamente', numero_casa });
    } catch (error) {
        console.error('Error al crear casa:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe una casa con ese número' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'El propietario especificado no existe' });
        }
        res.status(500).json({ error: 'Error al crear casa' });
    }
});

// PUT - Actualizar casa (cambiar propietario)
router.put('/:numero', async (req, res) => {
    try {
        const { propietario_cedula } = req.body;
        const { numero } = req.params;

        // Obtener ID del propietario
        const [owners] = await db.query('SELECT id FROM propietarios WHERE cedula = ?', [propietario_cedula]);
        if (owners.length === 0) {
            return res.status(400).json({ error: 'El propietario especificado no existe' });
        }
        const propietario_id = owners[0].id;

        const [result] = await db.query(
            'UPDATE casas SET propietario_id = ? WHERE numero_casa = ?',
            [propietario_id, numero]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Casa no encontrada' });
        }

        res.json({ message: 'Casa actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar casa:', error);
        res.status(500).json({ error: 'Error al actualizar casa' });
    }
});

// DELETE - Eliminar casa
router.delete('/:numero', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM casas WHERE numero_casa = ?', [req.params.numero]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Casa no encontrada' });
        }

        res.json({ message: 'Casa eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar casa:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'No se puede eliminar: la casa tiene recibos asociados' });
        }
        res.status(500).json({ error: 'Error al eliminar casa' });
    }
});

module.exports = router;
