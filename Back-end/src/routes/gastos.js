const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');
const { authMiddleware } = require('../middlewares/auth');

// Crear gasto para un presupuesto específico
router.post('/presupuesto/:idPresupuesto', authMiddleware, gastoController.crearGasto);

// Obtener gastos de un presupuesto
router.get('/presupuesto/:idPresupuesto', authMiddleware, gastoController.obtenerGastosPorPresupuesto);

// Obtener gasto específico
router.get('/:id', authMiddleware, gastoController.obtenerGasto);

// Actualizar gasto
router.put('/:id', authMiddleware, gastoController.actualizarGasto);

// Eliminar gasto
router.delete('/:id', authMiddleware, gastoController.eliminarGasto);

module.exports = router;