const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const { passwordResetLimiter, generalLimiter } = require('../middlewares/rateLimit');

// Ruta pública para solicitar recuperación
router.post('/forgot-password', passwordResetLimiter, passwordController.solicitarRecuperacion);

// Ruta pública para restablecer contraseña
router.post('/reset-password', passwordResetLimiter, passwordController.restablecerContraseña);

// Ruta para verificar token (opcional)
router.get('/verify-token/:token', passwordController.verificarToken);

router.use(generalLimiter);

module.exports = router;