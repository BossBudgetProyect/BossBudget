# ✅ Railway Configuration Checklist - BossBudget Frontend

## 📋 Pre-deployment Checklist

### 1. Código
- [x] `app.js` eliminado
- [x] `server.js` consolidado con proxy
- [x] Todas las rutas importadas en `server.js`
- [x] Middleware `injectUserData` aplicado globalmente
- [x] Proxy configurado con `pathRewrite`

### 2. Variables de Entorno (Railway Dashboard)

Ve a tu servicio en Railway y configura estas variables:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_secret_jwt_aqui
FRONTEND_URL=https://nombre-app.up.railway.app
BACKEND_API_URL=https://bossbudgetapi-production.up.railway.app
```

**Donde obtener estos valores:**
- `JWT_SECRET`: Debe coincidir con el del backend
- `FRONTEND_URL`: Será la URL de tu app en Railway (ej: https://bossbudget-front.up.railway.app)
- `BACKEND_API_URL`: URL del backend (ej: https://bossbudgetapi-production.up.railway.app)

### 3. Conectar Base de Datos (si es necesario)

Si necesitas conectarte a una BD desde el frontend:
- Variables de conexión se auto-generan en Railway si usas PostgreSQL integrado
- Obtén las variables en la pestaña "Variables" del servicio

### 4. Verificar package.json

```json
{
  "name": "bossbudget",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "cookie-parser": "^1.4.7",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "ejs": "^3.1.10",
    "http-proxy-middleware": "^2.0.9",
    "express-rate-limit": "^8.2.1"
  }
}
```

✅ Todos estos están ya en package.json

### 5. Verificar .env local (para desarrollo)

Crea `.env` en `/workspaces/BossBudget/Front-end/`:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_secret_local
FRONTEND_URL=http://localhost:3000
BACKEND_API_URL=https://bossbudgetapi-production.up.railway.app
```

**NO COMMITEAR .env** (ya está en .gitignore ✓)

---

## 🚀 Deployment Steps

### Paso 1: Conectar Repositorio a Railway

```bash
# Si aún no está conectado
railway link

# O desde Railway Dashboard:
# 1. New Project → Deploy from GitHub
# 2. Selecciona repo BossBudget
# 3. Selecciona rama "Development"
```

### Paso 2: Configurar el Servicio

En Railway Dashboard → Tu Servicio:

1. **Settings Tab:**
   - ✅ Root Directory: `Front-end` (si está separado)
   - ✅ Watch Paths: `Front-end/` (para autodeploy)

2. **Environment Tab:**
   - Agregue todas las variables listadas arriba

3. **Build Command:**
   ```
   npm install
   ```

4. **Start Command:**
   ```
   npm start
   ```

### Paso 3: Deploy

```bash
# El deploy es automático después de push a Development
git push origin Development

# O manual en Railway Dashboard:
# Infrastructure → Redeploy
```

### Paso 4: Monitorear

En Railway:
- Pestaña "Logs" → Ver logs en tiempo real
- Pestaña "Metrics" → Ver CPU, memoria, requests

```
✅ Deberías ver:
"✅ Frontend server running on http://localhost:3000"
"📡 Proxying /api to https://bossbudgetapi-production.up.railway.app"
```

---

## 🔍 Testing Post-Deployment

### Test 1: Verificar que la app está activa

```bash
curl https://nombre-app.up.railway.app/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "user": null,
  "cookies": {},
  "timestamp": "2025-11-13T..."
}
```

### Test 2: Verificar proxy

En la consola del navegador (F12):

```javascript
// Abre la consola en https://nombre-app.up.railway.app

// Intenta hacer una petición
fetch('/api/presupuestos', { 
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(d => console.log(d))
```

**Debería recibir:**
- ✅ Status 200 con JSON del backend
- ✅ O 401 si no está autenticado (es lo esperado)
- ❌ NO 502, 504, 500 (significaría problema con proxy)

### Test 3: Verificar Logs

En Railway Logs, deberías ver:
```
[PROXY] GET /api/presupuestos -> 200
🔍 Cookie original: ...
✅ Cookie reescrita: ...
```

---

## ❌ Troubleshooting

### Error: "502 Bad Gateway"

**Causas posibles:**
1. Backend está caído
2. URL del backend es incorrecta
3. CORS bloqueado

**Soluciones:**
```javascript
// En server.js, verificar:
const apiProxy = createProxyMiddleware('/api', {
  target: 'https://bossbudgetapi-production.up.railway.app', // ✅ Correcta
  // ...
});

// O en variables de entorno:
target: process.env.BACKEND_API_URL
```

### Error: "Cannot find module 'dotenv'"

**Solución:**
```bash
npm install
# Railway debería ejecutar esto automáticamente
```

### Cookies no se guardan

**Causas:**
1. SameSite=Strict (debería ser Lax)
2. Secure flag en desarrollo

**Verificar en server.js:**
```javascript
.replace(/;\s*SameSite=[^;]*/gi, "; SameSite=Lax"); // ✅ Configurado
```

### Frontend muestra "No tienes presupuestos" pero backend tiene datos

**Causa:** Usuario no autenticado

**Verificar:**
1. ¿Token JWT en cookies?
2. ¿Backend devuelve error 401?

En consola (F12):
```javascript
document.cookie // Ver si está authToken
```

---

## 🔒 Seguridad - Verificación Final

- [x] JWT_SECRET es fuerte y en variables de entorno
- [x] CORS solo permite orígenes conocidos
- [x] Cookies con SameSite=Lax
- [x] HTTPS habilitado (Railway proporciona certificado)
- [x] Proxy reescribe URLs correctamente
- [x] Node_env=production en producción
- [x] No hay console.log de datos sensibles

---

## 📞 Support en Railway

Si necesitas ayuda:
- Docs: https://docs.railway.app/
- Status: https://railway.app/status
- Support: Railway Dashboard → Help & Support

---

## 🎉 ¡Listo!

Una vez que todo esté funcionando:

1. ✅ Push a GitHub (Development branch)
2. ✅ Railway auto-deploya
3. ✅ Verifica logs
4. ✅ Abre la app en navegador
5. ✅ ¡Disfruta!

