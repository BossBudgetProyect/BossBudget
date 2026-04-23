import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import { injectUserData } from './middlewares/authMiddleware.js';

// ✅ IMPORTAR TODAS LAS RUTAS
import otherRoutes from './routes/otherRoutes.js';
import authRoutes from './routes/authRoutes.js';
import presupuestoRoutes from './routes/presupuestoRoutes.js';
import gastosRoutes from './routes/gastosRoutes.js';
import ingresosRoutes from './routes/ingresosRoutes.js';
import passRoutes from './routes/passRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS y cookies
const FRONTEND_URL = process.env.FRONTEND_URL?.trim() || "http://localhost:3000";
const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:3000",
  "https://bossbudget-production.up.railway.app",
  "https://bossbudget-front.up.railway.app",
  "https://bossbudgetapi-production.up.railway.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      console.log("🟢 CORS permitido para:", origin);
      return callback(null, true);
    } else {
      console.warn("🔴 CORS bloqueado para:", origin);
      return callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

// ✅ MIDDLEWARES GLOBALES - EN ORDEN CORRECTO
app.use(cors(corsOptions));
// ✅ CONFIGURAR PROXY (colocado ANTES de body parsers)
const BACKEND_API_URL = process.env.BACKEND_API_URL?.trim() || 'https://bossbudgetapi-production.up.railway.app';
console.log('📡 BACKEND_API_URL:', BACKEND_API_URL);
const apiProxy = createProxyMiddleware({
  target: BACKEND_API_URL,
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  proxyTimeout: 20000,
  timeout: 20000,
  // No pathRewrite: reenviamos la misma ruta recibida al backend
  onProxyReq(proxyReq, req, res) {
    try {
      console.log('[PROXY REQ] =>', req.method, req.url);
      console.log('[PROXY REQ] headers from client:', req.headers);

      // Si express ya parseó el body (req.body existe), reescribirlo en la petición proxied
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    } catch (err) {
      console.error('Error en onProxyReq:', err);
    }
  },
  onProxyRes(proxyRes, req, res) {
    console.log(`[PROXY] ${req.method} ${req.path} -> ${proxyRes.statusCode}`);
    
    // ✅ Manejo mejorado de cookies
    const setCookie = proxyRes.headers["set-cookie"];
    if (setCookie && Array.isArray(setCookie)) {
      const rewritten = setCookie.map((c) => {
        console.log("🔍 Cookie original:", c);
        
        let newCookie = c
          .replace(/;\s*Domain=[^;]*/gi, "")
          .replace(/;\s*SameSite=[^;]*/gi, "; SameSite=Lax");
        
        if (process.env.NODE_ENV !== 'production') {
          newCookie = newCookie.replace(/;\s*Secure/gi, "");
        }
        
        console.log("✅ Cookie reescrita:", newCookie);
        return newCookie;
      });
      proxyRes.headers["set-cookie"] = rewritten;
    }
    
    // ✅ Asegurar que el Content-Type sea correcto para JSON
    if (proxyRes.headers["content-type"]) {
      console.log("📦 Content-Type recibido:", proxyRes.headers["content-type"]);
    }
  },
  onError(err, req, res) {
    console.error("❌ Proxy error:", err.message);
    res.status(502).json({ 
      error: "Backend unavailable", 
      details: err.message,
      path: req.path 
    });
  }
});

// Aplicar proxy ANTES de los middlewares que parsean el body
app.use('/api', (req, res, next) => {
  if (req.url == null) {
    req.url = req.originalUrl || '';
  }
  next();
}, apiProxy);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ DEBUG: Ver cookies recibidas
app.use((req, res, next) => {
  console.log('🍪 req.cookies:', req.cookies);
  next();
});

// ✅ Aplicar middleware de inyección de datos GLOBALMENTE
app.use(injectUserData);

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ✅ Aplicar todas las rutas
app.use('/', otherRoutes);
app.use('/', authRoutes);
app.use('/', presupuestoRoutes);
app.use('/', gastosRoutes);
app.use('/', ingresosRoutes);
app.use('/', passRoutes);

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    user: res.locals.user,
    cookies: req.cookies,
    timestamp: new Date().toISOString(),
  });
});

// ✅ Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Página no encontrada', 
    error: { status: 404 },
    user: res.locals.user
  });
});

// ✅ Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error en app:', err);
  res.status(500).render('error', {
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {},
    user: res.locals.user
  });
});

// ✅ Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Frontend server running on http://localhost:${port}`);
  console.log(`📡 Proxying /api to ${BACKEND_API_URL}`);
  console.log(`🔗 Allowed origins:`, allowedOrigins);
  console.log(`🛡️ injectUserData activo globalmente`);
});

