const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Obtener todos los gastos
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM gastos ORDER BY fecha DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener gastos:', error);
        res.status(500).json({ error: 'Error al obtener gastos' });
    }
});

// POST - Crear nuevo gasto
router.post('/', async (req, res) => {
    try {
        const { fecha, beneficiario, concepto, monto_bs, monto_usd, nro_factura_proveedor, forma_pago } = req.body;

        if (!fecha || !concepto || !forma_pago) {
            return res.status(400).json({ error: 'Fecha, concepto y forma de pago son requeridos' });
        }

        const [result] = await db.query(
            `INSERT INTO gastos (fecha, beneficiario, concepto, monto_bs, monto_usd, nro_factura_proveedor, forma_pago) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [fecha, beneficiario || 'Agencia de Condominio', concepto, monto_bs || 0, monto_usd || 0, nro_factura_proveedor, forma_pago]
        );

        res.status(201).json({ message: 'Gasto registrado exitosamente', id: result.insertId });
    } catch (error) {
        console.error('Error al crear gasto:', error);
        res.status(500).json({ error: 'Error al registrar gasto' });
    }
});

// DELETE - Eliminar gasto
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM gastos WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        res.json({ message: 'Gasto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar gasto:', error);
        res.status(500).json({ error: 'Error al eliminar gasto' });
    }
});

module.exports = router;
