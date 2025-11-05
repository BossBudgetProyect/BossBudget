import express from 'express';

const router = express.Router();

// 🟢 Página de inicio (login principal)
router.get("/", (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true,
        timer: req.query.timer ? parseInt(req.query.timer) : undefined
    } : {};

    res.render("login", alertData);
});

// 🟢 Alias de login (redirige a la raíz)
router.get("/login", (req, res) => res.redirect('/'));

// 🟢 Página de registro
router.get("/Registro", (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true
    } : {};

    res.render("Registro", alertData);
});

export default router;
