// middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 3, // máximo 3 intentos por IP
    message: {
        success: false,
        error: 'Demasiados intentos de recuperación. Intenta en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por IP
});

module.exports = { passwordResetLimiter, generalLimiter };