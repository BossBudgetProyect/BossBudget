import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de CORS y cookies
const allowedOrigins = [
  process.env.FRONTEND_URL, // debe ser el frontend URL de Railway
  "http://localhost:3000",  // para desarrollo local
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permite a Postman o backend interno
    if (allowedOrigins.includes(origin)) {
      console.log("🟢 CORS permitido para:", origin);
      return callback(null, true);
    } else {
      console.warn("🔴 CORS bloqueado para:", origin);
      return callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,  // importante para permitir las cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions)); // CORS debe ir primero

// Middleware para cookies (muy importante para manejar cookies)
app.use(cookieParser()); // ✅ Antes de injectUserData

// Middleware para manejar archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Si tienes archivos estáticos en 'public'

// Middleware para leer json y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar el proxy para todas las rutas /api
const apiProxy = createProxyMiddleware('/api', {
  target: 'https://bossbudgetapi-production.up.railway.app', // URL del backend
  changeOrigin: true,
  secure: true,  // Si el backend usa HTTPS, esto es necesario
  cookieDomainRewrite: '',
  pathRewrite: { '^/api': '/api' },
  onProxyRes(proxyRes, req, res) {
    const setCookie = proxyRes.headers["set-cookie"];
    if (setCookie && Array.isArray(setCookie)) {
      const rewritten = setCookie.map((c) =>
        c.replace(/;\s*Domain=[^;]+/i, "")  // Elimina el atributo Domain de Set-Cookie
      );
      proxyRes.headers["set-cookie"] = rewritten;
    }

    // Verifica si el contenido es HTML en lugar de JSON
    const contentType = proxyRes.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      // Si se recibe HTML, redirige o devuelve un error adecuado
      console.error("El backend está respondiendo con HTML en lugar de JSON.");
      res.status(500).json({ error: "El backend ha devuelto HTML. Esto no es esperado." });
    }
  },
  onError(err, req, res) {
    console.error("Proxy error:", err);
    res.status(502).json({ error: "Proxy error" });
  }
});

app.use('/api', apiProxy);  // Usamos el proxy para todas las rutas /api

// Aquí configura tus rutas de frontend si las tienes (con EJS, por ejemplo)
app.get('/', (req, res) => {
  res.render('index');  // index.ejs o cualquier otra vista
});

app.listen(3000, () => {
  console.log("Frontend server running on http://localhost:3000");
  console.log("Proxying /api to https://bossbudgetapi-production.up.railway.app");
});

