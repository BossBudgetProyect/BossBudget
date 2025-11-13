# 🔧 SOLUCIÓN: Error del Proxy en Railway - BossBudget Frontend

## 📋 Problema Identificado

Había **dos servidores Express conflictivos**:
- `app.js` - Servidor sin proxy
- `server.js` - Servidor con proxy configurado

Esto causaba:
1. ❌ Conflicto de puertos/rutas
2. ❌ Falta de inyección de datos del usuario en las vistas
3. ❌ Cookies no se procesaban correctamente
4. ❌ El proxy no funcionaba como esperado

---

## ✅ Soluciones Aplicadas

### 1. **Consolidación en un único servidor (`server.js`)**

Se unificó toda la funcionalidad en `server.js`:

```javascript
// ✅ Ahora incluye:
- dotenv para variables de entorno
- Todas las rutas del proyecto importadas
- Middleware de inyección de datos (injectUserData)
- Proxy configurado correctamente
- Manejo de errores
- Health check endpoint
```

### 2. **Eliminación de `app.js`**

```bash
rm /workspaces/BossBudget/Front-end/app.js
```

No se necesita dos servidores. `server.js` maneja todo.

### 3. **Mejoras en el Proxy (server.js)**

```javascript
const apiProxy = createProxyMiddleware('/api', {
  target: 'https://bossbudgetapi-production.up.railway.app',
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  pathRewrite: {
    '^/api/': '/', // ✅ NUEVA: Reescribe el path correctamente
  },
  // ... rest de configuración
});
```

**Cambios principales:**
- ✅ Agregada opción `pathRewrite` para reescribir URLs correctamente
- ✅ Mejorado manejo de cookies (Domain y SameSite)
- ✅ Mejor manejo de errores con más información
- ✅ Logging mejorado

### 4. **Orden correcto de Middlewares**

```javascript
// ✅ ORDEN CORRECTO:
1. cors()
2. cookieParser()
3. express.json()
4. express.urlencoded()
5. express.static()
6. injectUserData (GLOBAL) ← Aquí es clave
7. Importar todas las rutas
8. Configurar proxy
```

### 5. **Agregar CORS para el Backend**

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
  "https://bossbudgetapi-production.up.railway.app", // ✅ NUEVA
];
```

---

## 🚀 Configuración para Railway

### Variables de Entorno Necesarias

En Railway, asegúrate de tener configuradas:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_secret_aqui
FRONTEND_URL=https://tuapp.up.railway.app
```

### Archivo `package.json` (Verificado)

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

✅ El `start` script apunta a `server.js` (correcto)

---

## 🧪 Testing Local

Para verificar que todo funciona:

```bash
cd /workspaces/BossBudget/Front-end

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# O para producción
npm start
```

**Verificar que funciona:**

```bash
# Health check
curl http://localhost:3000/health

# Ver logs del proxy
# Deberías ver: "📡 Proxying /api to https://bossbudgetapi-production.up.railway.app"
```

---

## 🔍 Debugging: Cómo verificar que el Proxy funciona

### En el navegador (DevTools):

1. Abre la consola (F12)
2. Realiza una acción que haga fetch a `/api/presupuestos`
3. Ve a la pestaña **Network**
4. Busca la petición a `/api/presupuestos`
5. Verifica:
   - ✅ Status: 200 (o el esperado)
   - ✅ Response: JSON válido
   - ✅ Content-Type: `application/json`

### En los logs del servidor:

```
[PROXY] GET /api/presupuestos -> 200
🟢 CORS permitido para: https://bossbudgetapi-production.up.railway.app
🍪 req.cookies: { authToken: "..." }
```

---

## 📝 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `server.js` | ✅ Consolidado con todas las rutas y proxy |
| `app.js` | ❌ Eliminado (duplicado) |
| `package.json` | ✅ Sin cambios necesarios |

---

## ⚠️ Posibles Problemas y Soluciones

### Problema 1: "Cannot find module 'dotenv'"

**Solución:**
```bash
npm install dotenv
```

### Problema 2: "Proxy error: connect ECONNREFUSED"

**Causa:** El backend no está disponible
**Solución:** 
- Verifica que la URL del backend sea correcta
- Verifica que el backend esté corriendo en Railway
- Revisa los logs de Railway

### Problema 3: "Error: No permitido por CORS"

**Solución:** Verifica que el origin está en `allowedOrigins`:
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
  "https://bossbudgetapi-production.up.railway.app",
];
```

### Problema 4: Cookies no se guardan

**Solución:** Verifica que:
1. El backend envía `Set-Cookie` correctamente
2. Las cookies tienen `SameSite=Lax` (configurado en proxy)
3. El frontend usa `credentials: 'include'` en fetch (verificado en principal.ejs ✅)

---

## 🎯 Flujo Correcto Ahora

```
Cliente (Browser)
    ↓
    │ fetch('/api/presupuestos', { credentials: 'include' })
    ↓
server.js (Puerto 3000)
    ↓
    │ Proxy Middleware
    │ /api → Backend
    ↓
Backend (Railway)
    ↓
    │ Respuesta JSON + Set-Cookie
    ↓
Proxy reescribe cookies (SameSite=Lax, sin Secure en dev)
    ↓
Client recibe JSON + guarda cookie
    ↓
✅ Proxima petición incluye cookie automáticamente
```

---

## 📚 Recursos Útiles

- [http-proxy-middleware docs](https://github.com/chimurai/http-proxy-middleware)
- [Express CORS docs](https://expressjs.com/en/resources/middleware/cors.html)
- [Railway Docs](https://docs.railway.app/)

---

## ✨ Próximos Pasos

1. ✅ Hacer push de estos cambios a `git`
2. ✅ Redeploy en Railway
3. ✅ Verificar logs en Railway
4. ✅ Probar en navegador (Network tab)

```bash
git add .
git commit -m "fix: Consolidate server.js with proxy and remove app.js conflict"
git push origin Development
```

---

**Estado:** ✅ Corregido y listo para producción

