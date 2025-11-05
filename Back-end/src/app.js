const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser'); // ✅ AGREGAR ESTO

// Importar rutas
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');
const presupuestosRoutes = require('./routes/presupuestos');
const gastosRoutes = require('./routes/gastos');
const ingresosRoutes = require('./routes/ingresos');

const app = express();

// ========== MIDDLEWARES GLOBALES ==========

// 1. CORS PRIMERO
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 2. ✅ COOKIE-PARSER - CRÍTICO para leer cookies
app.use(cookieParser());

// 3. Logging de requests
app.use((req, res, next) => {
    console.log('🔍 Request recibida en app.js:', req.method, req.url);
    console.log('🌐 Origin:', req.headers.origin);
    console.log('🍪 Cookies:', req.cookies); // ✅ Ahora podrás ver las cookies
    next();
});

// 4. Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 6. Etapa del desarrollo
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', true); // Confía en todos los proxies en producción
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

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BossBudget API is running',
        timestamp: new Date().toISOString()
    });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a BossBudget API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            presupuestos: '/api/presupuestos',
            health: '/health'
        }
    });
});

// ========== MANEJO DE ERRORES ==========

// Error handler
app.use((error, req, res, next) => {
    console.error('❌ Error:', error);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error.message 
    });
});

// 404 handler - SOLO para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint no encontrado',
        path: req.originalUrl
    });
});

module.exports = app;