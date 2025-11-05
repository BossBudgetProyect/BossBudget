// frontend/app.js
// SOLO librerías necesarias para el frontend
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'; // ✅ CORREGIDO: import para ES modules

// Configuración de paths para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001; // Puerto diferente al backend

// ✅ MANTENER - Configurar EJS
app.set('view engine', 'ejs');

// ✅ CORREGIDO - Orden correcto de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ AHORA SÍ FUNCIONARÁ
app.use(express.static('public'));

// Configurar carpeta de vistas
app.set('views', path.join(__dirname, 'views'));

// ✅ AGREGAR middleware de debugging para cookies
app.use((req, res, next) => {
    console.log('🍪 Middleware de cookies - req.cookies:', req.cookies);
    console.log('🌐 Ruta:', req.path);
    next();
});

// ✅ MANTENER (pero transformadas) - Rutas de vistas
// Importar rutas del frontend
import otherRoutes from './routes/otherRoutes.js';
import authRoutes from './routes/authRoutes.js';
import presupuestoRoutes from './routes/presupuestoRoutes.js';
import gastosRoutes from './routes/gastosRoutes.js';
import ingresosRoutes from './routes/ingresosRoutes.js';
import passRoutes from './routes/passRoutes.js';

// Usar rutas
app.use('/', otherRoutes);
app.use('/', authRoutes);
app.use('/', presupuestoRoutes);
app.use('/', gastosRoutes);
app.use('/', ingresosRoutes);
app.use('/', passRoutes);

// Ruta de prueba para verificar que funciona
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Frontend funcionando correctamente',
        cookies: req.cookies, // ✅ DEBUG: ver cookies en health check
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Página no encontrada',
        error: { status: 404 }
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('❌ Error en app:', err);
    res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Iniciar servidor del frontend
app.listen(port, () => {
    console.log(`🎨 Frontend corriendo en http://localhost:${port}`);
    console.log(`✅ Health check: http://localhost:${port}/health`);
    console.log(`🍪 Cookie-parser configurado correctamente`);
});