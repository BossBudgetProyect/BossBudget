// frontend/routes/otherRoutes.js
// frontend/routes/otherRoutes.js
import express from 'express';
import { protectView } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/principal', protectView, (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true
    } : {};
    
    res.render('principal', {
            user: res.locals.user, // ✅ CORREGIDO
            name: res.locals.user.nombreUsuario || 'Usuario',
            email: res.locals.user.email || 'usuario@ejemplo.com',
            foto: res.locals.user.foto || null
        });
});

router.get('/Reportes', protectView, (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true
    } : {};
    
    res.render('Reportes', {
        ...alertData,
        title: 'Reportes',
        user: res.locals.user
    });
});

router.get('/registroCredito', protectView, (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true
    } : {};
    
    res.render('registroCredito', {
        ...alertData,
        title: 'Registro de Créditos',
        user: res.locals.user
    });
});

router.get('/TiposRecordatorios', protectView, (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true
    } : {};
    
    res.render('TiposRecordatorios', {
        ...alertData,
        title: 'Tipos de Recordatorios',
        user: res.locals.user
    });
});

router.get('/RecuperarContraseña', protectView, (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true
    } : {};
    
    res.render('RecuperarContraseña', {
        ...alertData,
        title: 'Recuperar Contraseña',
        user: res.locals.user
    });
});

router.get('/cuenta', protectView, (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true
    } : {};
    
    res.render('cuenta', {
        ...alertData,
        title: 'Mi Cuenta',
        user: res.locals.user,
        // ✅ Los datos del usuario ya vienen de res.locals.user
        // ❌ ELIMINADO: req.session.name, req.session.email, etc.
        moneda: "USD" // Esto podría venir de una API también
    });
});

export default router;