// frontend/routes/ingresosRoutes.js
import express from 'express';
import { protectView } from '../middlewares/authMiddleware.js';

const router = express.Router();

// -------------------------- VISTAS (SOLO RENDER) --------------------------

// Mostrar formulario de registro de ingresos
router.get('/ingresos/nuevo/:idPresupuesto', protectView, (req, res) => {
    res.render('registroIngresos', {
        title: 'Registrar Ingreso',
        user: res.locals.user,
        idPresupuesto: req.params.idPresupuesto
        // ❌ ELIMINADO: req.session.name, req.session.foto
    });
});

export default router;