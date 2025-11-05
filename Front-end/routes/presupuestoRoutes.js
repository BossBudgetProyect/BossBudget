// frontend/routes/presupuestoRoutes.js
import express from 'express';
import { protectView } from '../middlewares/authMiddleware.js';

const router = express.Router();

// -------------------------- VISTAS (SOLO RENDER) --------------------------

// Página para crear presupuesto
router.get('/crearPresupuesto', protectView, (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true
    } : {};
    
    res.render('crearPresupuesto', {
        ...alertData,
        title: 'Crear Presupuesto',
        user: res.locals.user
    });
});

// Vista detallada del presupuesto
router.get('/presupuesto/:id', protectView, (req, res) => {
    const id = req.params.id;
    
    res.render('presupuesto', {
        title: 'Detalle del Presupuesto',
        user: res.locals.user,
        presupuestoId: id,
        // ❌ Los datos se cargarán via JavaScript llamando a la API
        presupuesto: null,
        gastos: [],
        ingresos: [],
        totales: { gastos: 0, ingresos: 0, balance: 0 }
    });
});

export default router;