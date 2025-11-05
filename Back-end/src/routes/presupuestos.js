const express = require('express');
const router = express.Router();
const presupuestoController = require('../controllers/presupuestoController');
const { authMiddleware } = require('../middlewares/auth');

// Crear presupuesto
router.post('/', authMiddleware, presupuestoController.crearPresupuesto);

// Obtener presupuestos del usuario
router.get('/', authMiddleware, presupuestoController.obtenerPresupuestosUsuario);

// Obtener presupuesto específico
router.get('/:id', authMiddleware, presupuestoController.obtenerPresupuesto);

// Actualizar presupuesto
router.put('/:id', authMiddleware, presupuestoController.actualizarPresupuesto);

// Eliminar presupuesto
router.delete('/:id', authMiddleware, presupuestoController.eliminarPresupuesto);

module.exports = router;