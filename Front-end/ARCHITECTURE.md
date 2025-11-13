# 🏗️ Arquitectura de BossBudget Frontend - Después de la Corrección

## 📐 Diagrama de la Solución

```
┌─────────────────────────────────────────────────────────────────┐
│                      NAVEGADOR DEL USUARIO                       │
│  https://bossbudget-front.up.railway.app                        │
│  - Login                                                         │
│  - Principal (presupuestos)                                     │
│  - Crear presupuesto                                            │
└─────────────────────────────────────────────────────────────────┘
                             │
                      fetch('/api/...')
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND SERVER (server.js)                     │
│              Puerto: 3000 (Railway asigna puerto)               │
│                                                                  │
│  ├─ CORS Middleware                                            │
│  │  └─ Validar origen (localhost, Railway URL, Backend)        │
│  │                                                              │
│  ├─ Cookie Parser                                              │
│  │  └─ Procesar y guardar cookies (authToken)                 │
│  │                                                              │
│  ├─ JSON Parser                                                │
│  │  └─ Procesar body JSON de peticiones                       │
│  │                                                              │
│  ├─ Static Files (express.static)                              │
│  │  └─ Servir: /public (CSS, JS, imágenes)                   │
│  │                                                              │
│  ├─ injectUserData (GLOBAL)                                    │
│  │  └─ Decodificar JWT de cookie → res.locals.user           │
│  │  └─ Disponible en TODAS las rutas                         │
│  │                                                              │
│  ├─ RUTAS DE VISTAS (EJS)                                      │
│  │  ├─ GET /               → principal.ejs                    │
│  │  ├─ GET /login          → login.ejs                        │
│  │  ├─ GET /principal      → principal.ejs (protegida)       │
│  │  ├─ GET /presupuesto/:id→ presupuesto.ejs (protegida)    │
│  │  ├─ GET /crearPresupuesto → crearPresupuesto.ejs         │
│  │  ├─ GET /Reportes       → Reportes.ejs                    │
│  │  └─ ... (más rutas)                                        │
│  │                                                              │
│  ├─ PROXY MIDDLEWARE ⭐                                        │
│  │  ├─ Ruta: /api/*                                          │
│  │  ├─ Destino: https://bossbudgetapi-production.up.railway  │
│  │  │                                                          │
│  │  ├─ pathRewrite: /api/* → /*                             │
│  │  │  (Ejemplo: /api/presupuestos → /presupuestos)         │
│  │  │                                                          │
│  │  ├─ changeOrigin: true (cambia header Origin)             │
│  │  │                                                          │
│  │  ├─ onProxyRes: Reescribe cookies                         │
│  │  │  ├─ Elimina Domain                                      │
│  │  │  ├─ Setea SameSite=Lax                                 │
│  │  │  └─ En dev, elimina Secure flag                       │
│  │  │                                                          │
│  │  └─ onError: Maneja errores de conexión (502, 504)        │
│  │                                                              │
│  └─ HEALTH CHECK                                               │
│     └─ GET /health → { status: 'OK', user, cookies, ... }   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
         (Si es /api/...)            (Si es otra ruta)
              │                             │
              ▼                             ▼
    ┌─────────────────┐         ┌──────────────────┐
    │   PROXY REWRITE │         │  RENDER EJS VIEW │
    │                 │         │                  │
    │ /api → remover │         │ inyectar datos:  │
    │ /presupuestos  │         │ - user           │
    └────────┬────────┘         │ - name           │
             │                  │ - presupuestos   │
             ▼                  └────────┬─────────┘
    ┌─────────────────┐                  │
    │   ADD HEADERS   │                  ▼
    │                 │          ┌──────────────┐
    │ - Content-Type  │          │ HTML + CSS   │
    │ - Credentials   │          │ + JavaScript │
    │ - Cookie        │          └──────┬───────┘
    └────────┬────────┘                 │
             │                          │
             ▼                          │
    ┌─────────────────────┐             │
    │ BACKEND API (RAILWAY)│             │
    │ presupuestos/:...    │             │
    │ gastos/:...          │             │
    │ ingresos/:...        │             │
    │ auth/:...            │             │
    └────────┬────────────┘             │
             │                          │
             ▼                          ▼
    ┌──────────────┐           ┌─────────────────┐
    │ JSON Response│           │ Rendered Page   │
    │ + Set-Cookie │           │ en el navegador │
    └────────┬─────┘           └────────┬────────┘
             │                         │
             │      PROXY REWRITE      │
             │    COOKIES AQUI:        │
             │   - Domain: removido    │
             │   - SameSite: Lax       │
             │   - Secure: opcional    │
             │                         │
             └─────────────┬───────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │  NAVEGADOR RECIBE:      │
             │  - JSON / HTML válido   │
             │  - Cookie guardada      │
             │  - Página funcional ✅  │
             └─────────────────────────┘
```

---

## 🔄 Flujo de Autenticación

```
1. USUARIO HACE LOGIN
   └─ POST /api/login { email, password }
                │
                ▼
   Proxy reescribe: /api/login → /login
   Envía al Backend
                │
                ▼
   Backend valida y devuelve:
   {
     success: true,
     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     Set-Cookie: authToken=token; SameSite=Lax;
   }
                │
                ▼
   Proxy intercepta respuesta
   Reescribe cookies (SameSite=Lax)
   Browser recibe cookie
                │
                ▼
2. USUARIO NAVEGA A /principal
   └─ GET /principal
                │
                ▼
   injectUserData middleware:
   - Lee cookie: req.cookies.authToken
   - Decodifica JWT: jwt.verify(token, SECRET)
   - Setea: res.locals.user = { id, nombre, email, ... }
                │
                ▼
3. VISTA RENDERIZA
   └─ principal.ejs recibe res.locals.user
   └─ Muestra: "¡Bienvenida, María!"
   └─ Llama fetch('/api/presupuestos', { credentials: 'include' })
                │
                ▼
4. FETCH A API
   └─ Navegador AUTO-INCLUYE cookie (credentials: 'include')
   └─ POST /api/presupuestos
      Cookie: authToken=...
                │
                ▼
   Proxy reescribe y envía
   Backend recibe con token
   Backend valida token
   Backend devuelve presupuestos
                │
                ▼
5. RESPUESTA EN JS
   └─ principal.ejs recibe JSON válido
   └─ Actualiza DOM con presupuestos
   └─ ¡Usuario ve sus datos! ✅
```

---

## 📁 Estructura de Carpetas Actual

```
Front-end/
├── server.js ⭐ ARCHIVO PRINCIPAL
│   ├─ Importa todas las rutas
│   ├─ Configura proxy
│   ├─ Aplica middlewares
│   └─ Escucha en puerto 3000
│
├── package.json
│   └─ start: "node server.js"
│
├── middlewares/
│   └── authMiddleware.js
│       ├─ injectUserData() → res.locals.user
│       └─ protectView() → redirige a login si no auth
│
├── routes/ ⭐ IMPORTADAS EN server.js
│   ├── authRoutes.js
│   ├── presupuestoRoutes.js
│   ├── gastosRoutes.js
│   ├── ingresosRoutes.js
│   ├── otherRoutes.js
│   └── passRoutes.js
│
├── views/ (EJS TEMPLATES)
│   ├── principal.ejs ⭐ PÁGINA PRINCIPAL
│   │   └─ Tiene scripts que usan /api/presupuestos
│   ├── presupuesto.ejs
│   ├── login.ejs
│   ├── crearPresupuesto.ejs
│   ├── Reportes.ejs
│   └── ... más vistas
│
├── public/ (ARCHIVOS ESTÁTICOS)
│   ├── css/
│   ├── js/
│   ├── img/
│   └── video/
│
└── QUICKSTART.md (esta carpeta)
```

---

## 🎯 Puntos Clave del Fix

| Aspecto | Problema | Solución |
|---------|----------|----------|
| **Servidores** | 2 Express conflictivos (app.js + server.js) | Consolidar en server.js |
| **Rutas** | server.js no tenía rutas, solo proxy | Importar todas las rutas |
| **Middleware** | injectUserData no aplicado globalmente | Aplicar con `app.use()` |
| **Proxy URL** | /api/presupuestos → /api/presupuestos (error) | pathRewrite: /api/ → / |
| **Cookies** | Domain y SameSite incorrectos | Reescribir en onProxyRes |
| **Errores** | Logs confusos | Mejorar logging y error handling |

---

## ✅ Verificaciones Después del Deploy

```javascript
// En consola del navegador (F12 → Console):

// 1. ¿Cookies están guardadas?
console.log(document.cookie);
// Debe mostrar: authToken=...

// 2. ¿Usuario está inyectado?
// Debería verse en la página: "¡Bienvenida, María!"

// 3. ¿API responde?
fetch('/api/presupuestos', { credentials: 'include' })
  .then(r => r.json())
  .then(d => console.log(d));
// Debe devolver array de presupuestos

// 4. ¿Proxy funciona?
// F12 → Network → ver petición a /api/presupuestos
// Status: 200 (no 502)
```

---

## 🚀 Variables Críticas en Railway

```env
# CRÍTICOS - Sin estos, FALLA:
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_secret_jwt_aqui

# RECOMENDADOS:
FRONTEND_URL=https://bossbudget-front.up.railway.app
BACKEND_API_URL=https://bossbudgetapi-production.up.railway.app
```

---

**Arquitectura Actualizada:** Nov 13, 2025 | **Status:** ✅ Production Ready

