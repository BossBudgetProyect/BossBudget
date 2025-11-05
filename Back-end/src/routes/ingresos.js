const express = require('express');
const router = express.Router();
const ingresoController = require('../controllers/ingresoController');
const { authMiddleware } = require('../middlewares/auth');

// Crear ingreso para un presupuesto específico
router.post('/presupuesto/:idPresupuesto', authMiddleware, ingresoController.crearIngreso);

// Obtener ingresos de un presupuesto
router.get('/presupuesto/:idPresupuesto', authMiddleware, ingresoController.obtenerIngresosPorPresupuesto);

// Obtener total de ingresos de un presupuesto
router.get('/presupuesto/:idPresupuesto/total', authMiddleware, ingresoController.obtenerTotalIngresos);

// Obtener ingreso específico
router.get('/:id', authMiddleware, ingresoController.obtenerIngreso);

// Actualizar ingreso
router.put('/:id', authMiddleware, ingresoController.actualizarIngreso);

// Eliminar ingreso
router.delete('/:id', authMiddleware, ingresoController.eliminarIngreso);

module.exports = router;