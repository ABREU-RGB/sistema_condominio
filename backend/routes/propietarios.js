const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Obtener todos los propietarios
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM propietarios ORDER BY nombre_completo');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener propietarios:', error);
        res.status(500).json({ error: 'Error al obtener propietarios' });
    }
});

// GET - Obtener un propietario por cédula
router.get('/:cedula', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM propietarios WHERE cedula = ?', [req.params.cedula]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Propietario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener propietario:', error);
        res.status(500).json({ error: 'Error al obtener propietario' });
    }
});

// POST - Crear nuevo propietario
router.post('/', async (req, res) => {
    try {
        const { cedula, nombre_completo, telefono, email } = req.body;

        if (!cedula || !nombre_completo) {
            return res.status(400).json({ error: 'Cédula y nombre son requeridos' });
        }

        await db.query(
            'INSERT INTO propietarios (cedula, nombre_completo, telefono, email) VALUES (?, ?, ?, ?)',
            [cedula, nombre_completo, telefono || null, email || null]
        );

        res.status(201).json({ message: 'Propietario creado exitosamente', cedula });
    } catch (error) {
        console.error('Error al crear propietario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe un propietario con esa cédula' });
        }
        res.status(500).json({ error: 'Error al crear propietario' });
    }
});

// PUT - Actualizar propietario
router.put('/:cedula', async (req, res) => {
    try {
        const { nombre_completo, telefono, email } = req.body;
        const { cedula } = req.params;

        const [result] = await db.query(
            'UPDATE propietarios SET nombre_completo = ?, telefono = ?, email = ? WHERE cedula = ?',
            [nombre_completo, telefono, email, cedula]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Propietario no encontrado' });
        }

        res.json({ message: 'Propietario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar propietario:', error);
        res.status(500).json({ error: 'Error al actualizar propietario' });
    }
});

// DELETE - Eliminar propietario
router.delete('/:cedula', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM propietarios WHERE cedula = ?', [req.params.cedula]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Propietario no encontrado' });
        }

        res.json({ message: 'Propietario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar propietario:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'No se puede eliminar: el propietario tiene casas asociadas' });
        }
        res.status(500).json({ error: 'Error al eliminar propietario' });
    }
});

module.exports = router;
