import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de CORS y cookies
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
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

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ CONFIGURAR PROXY CON MEJOR MANEJO DE COOKIES
const apiProxy = createProxyMiddleware('/api', {
  target: 'https://bossbudgetapi-production.up.railway.app',
  changeOrigin: true,
  secure: true,
  logLevel: 'debug', // ✅ AGREGAR DEBUG
  onProxyRes(proxyRes, req, res) {
    console.log(`[PROXY] ${req.method} ${req.path} -> ${proxyRes.statusCode}`);
    
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
  },
  onError(err, req, res) {
    console.error("❌ Proxy error:", err.message);
    res.status(502).json({ error: "Backend unavailable", details: err.message });
  }
});

app.use('/api', apiProxy);

// ✅ RUTAS DE VISTAS
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/principal', (req, res) => {
  res.render('principal');
});

// ✅ LOG DE RUTAS DISPONIBLES
app.listen(3000, () => {
  console.log("✅ Frontend server running on http://localhost:3000");
  console.log("📡 Proxying /api to https://bossbudgetapi-production.up.railway.app");
  console.log("🔗 Allowed origins:", allowedOrigins);
});

