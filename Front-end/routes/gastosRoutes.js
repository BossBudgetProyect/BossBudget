// frontend/routes/gastosRoutes.js
import express from 'express';
import { protectView } from '../middlewares/authMiddleware.js';

const router = express.Router();

// -------------------------- VISTAS (SOLO RENDER) --------------------------

// Mostrar formulario de registro de gastos
router.get('/gastos/nuevo/:idPresupuesto', protectView, (req, res) => {
    res.render('registroGastos', {
        title: 'Registrar Gasto',
        user: res.locals.user,
        idPresupuesto: req.params.idPresupuesto
        // ❌ ELIMINADO: req.session.name, req.session.foto
    });
});

export default router;