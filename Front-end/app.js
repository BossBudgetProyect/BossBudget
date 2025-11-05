// frontend/app.js
import dotenv from 'dotenv';
dotenv.config(); // ✅ Cargar variables de entorno

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { injectUserData } from './middlewares/authMiddleware.js';

// Configuración de paths para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// ✅ CONFIGURACIÓN EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser()); // ✅ CRÍTICO para leer cookies del backend

// ✅ ESTO DEBE ESTAR ANTES de las rutas
app.use(injectUserData); // Middleware GLOBAL

// ✅ MIDDLEWARES EN ORDEN CORRECTO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ MIDDLEWARE DE DEBUGGING MEJORADO
app.use((req, res, next) => {
    console.log('🌐 Ruta:', req.method, req.path);
    console.log('🍪 Cookies recibidas:', req.cookies);
    console.log('📧 Headers de cookie:', req.headers.cookie);
    next();
});

// ✅ IMPORTAR RUTAS
import otherRoutes from './routes/otherRoutes.js';
import authRoutes from './routes/authRoutes.js';
import presupuestoRoutes from './routes/presupuestoRoutes.js';
import gastosRoutes from './routes/gastosRoutes.js';
import ingresosRoutes from './routes/ingresosRoutes.js';
import passRoutes from './routes/passRoutes.js';

// ✅ USAR RUTAS
app.use('/', otherRoutes);
app.use('/', authRoutes);
app.use('/', presupuestoRoutes);
app.use('/', gastosRoutes);
app.use('/', ingresosRoutes);
app.use('/', passRoutes);

// ✅ RUTA HEALTH CHECK MEJORADA
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Frontend funcionando correctamente',
        hasAuthCookie: !!req.cookies.authToken,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ✅ MANEJO DE ERRORES 404
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Página no encontrada',
        error: { status: 404 },
        user: null
    });
});

// ✅ MANEJO DE ERRORES GENERALES
app.use((err, req, res, next) => {
    console.error('❌ Error en app:', err);
    res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {},
        user: null
    });
});

// ✅ INICIAR SERVIDOR
app.listen(port, () => {
    console.log(`🎨 Frontend corriendo en http://localhost:${port}`);
    console.log(`✅ Health check: http://localhost:${port}/health`);
    console.log(`🍪 Cookie-parser configurado correctamente`);
    console.log(`🔗 Backend esperado en: ${process.env.BACKEND_URL || 'http://localhost:3000'}`);
});