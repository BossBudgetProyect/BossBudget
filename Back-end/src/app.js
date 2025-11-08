const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Importar rutas
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');
const presupuestosRoutes = require('./routes/presupuestos');
const gastosRoutes = require('./routes/gastos');
const ingresosRoutes = require('./routes/ingresos');

const app = express();

// ========== MIDDLEWARES GLOBALES ==========

// 1. CORS PRIMERO - CONFIGURACIÓN OPTIMIZADA
const corsOptions = {
    origin: function (origin, callback) {
        // ✅ Permitir requests sin origin (como mobile apps o curl)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:3001', // Tu frontend EJS
            'https://yourdomain.com' // Tu dominio en producción
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// 2. ✅ COOKIE-PARSER - CRÍTICO para leer cookies
app.use(cookieParser());

// 3. Logging de requests (OPTIMIZADO)
app.use((req, res, next) => {
    console.log('🔍', req.method, req.url, '- Origin:', req.headers.origin);
    
    // ✅ Solo loguear cookies en desarrollo (por seguridad)
    if (process.env.NODE_ENV === 'development') {
        console.log('🍪 Cookies:', req.cookies ? Object.keys(req.cookies) : 'No cookies');
    }
    next();
});

// 4. Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 6. Configuración de proxy y seguridad
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // ✅ Confía solo en el primer proxy
    
    // ✅ Headers de seguridad adicionales en producción
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });
}

// ========== RUTAS ==========

// ✅ RUTAS PÚBLICAS PRIMERO
app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);

// ✅ RUTAS PROTEGIDAS DESPUÉS
app.use('/api/presupuestos', presupuestosRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/ingresos', ingresosRoutes);

// ========== RUTAS BÁSICAS ==========

// Health check (MEJORADO)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BossBudget API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a BossBudget API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            auth: '/api/auth',
            presupuestos: '/api/presupuestos',
            health: '/health'
        }
    });
});

// ========== MANEJO DE ERRORES ==========

// Manejo de errores de CORS
app.use((error, req, res, next) => {
    if (error.message === 'No permitido por CORS') {
        return res.status(403).json({
            success: false,
            error: 'Origen no permitido'
        });
    }
    next(error);
});

// Error handler general
app.use((error, req, res, next) => {
    console.error('❌ Error:', error);
    
    // ✅ No exponer detalles del error en producción
    const errorResponse = {
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Error interno del servidor' 
            : error.message
    };
    
    // ✅ Incluir stack trace solo en desarrollo
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = error.stack;
    }
    
    res.status(500).json(errorResponse);
});

// 404 handler - SOLO para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Endpoint no encontrado',
        path: req.originalUrl
    });
});

module.exports = app;