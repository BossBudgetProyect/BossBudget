// frontend/app.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { injectUserData } from './middlewares/authMiddleware.js'; // ✅ importa aquí

// Configuración de paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ Debe ir ANTES de injectUserData
app.use(express.static('public'));

// Middleware global para ver cookies (opcional)
app.use((req, res, next) => {
  console.log('🍪 req.cookies:', req.cookies);
  next();
});

// ✅ Aquí aplicas injectUserData para TODAS las rutas
app.use(injectUserData);

// ✅ Importar y usar rutas
import otherRoutes from './routes/otherRoutes.js';
import authRoutes from './routes/authRoutes.js';
import presupuestoRoutes from './routes/presupuestoRoutes.js';
import gastosRoutes from './routes/gastosRoutes.js';
import ingresosRoutes from './routes/ingresosRoutes.js';
import passRoutes from './routes/passRoutes.js';

app.use('/', otherRoutes);
app.use('/', authRoutes);
app.use('/', presupuestoRoutes);
app.use('/', gastosRoutes);
app.use('/', ingresosRoutes);
app.use('/', passRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    user: res.locals.user, // 👈 Verás si injectUserData funciona
    cookies: req.cookies,
    timestamp: new Date().toISOString(),
  });
});

// Errores
app.use((req, res) => {
  res.status(404).render('error', { message: 'Página no encontrada', error: { status: 404 } });
});

app.use((err, req, res, next) => {
  console.error('❌ Error en app:', err);
  res.status(500).render('error', {
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

app.listen(port, () => {
  console.log(`🎨 Frontend corriendo en http://localhost:${port}`);
  console.log(`✅ injectUserData activo globalmente`);
});