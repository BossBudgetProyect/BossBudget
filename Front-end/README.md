# 💰 BossBudget Frontend

**Interfaz web moderna y responsiva para gestión integral de presupuestos personales y empresariales**, desarrollada con **Node.js**, **Express.js** y **EJS**, que consume una API REST externa para sincronización de datos en tiempo real.

---

## 📋 Descripción General

BossBudget Frontend es una aplicación web que proporciona una experiencia de usuario intuitiva para:

- 🔐 **Autenticación y gestión de cuentas**: Registro, login, recuperación de contraseña
- 💳 **Gestión de presupuestos**: Crear, editar y monitorear presupuestos
- 💸 **Registro de gastos e ingresos**: Categorizar y analizar transacciones
- 📊 **Reportes y análisis**: Visualizar datos financieros con gráficos
- 📱 **Recordatorios**: Configurar alertas para eventos financieros
- 🏦 **Gestión de créditos**: Registrar y monitorear créditos

### Características Técnicas

- ✅ **Servidor renderizado** con EJS (Server-Side Rendering)
- ✅ **Autenticación basada en JWT** almacenada en cookies seguras
- ✅ **Proxy inteligente** para comunicación transparente con la API backend
- ✅ **CORS configurado** para múltiples orígenes (desarrollo y producción)
- ✅ **Middleware de inyección de datos** para disponibilidad global de usuario
- ✅ **Rutas protegidas** con validación de autenticación
- ✅ **Manejo de errores centralizado** con vistas de error elegantes
- ✅ **Seguridad en cookies** con configuración SameSite y Secure

---

## 🏗️ Arquitectura del Proyecto

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│              NAVEGADOR DEL USUARIO                          │
│         Frontend: https://bossbudget-front.railway.app     │
└────────────────────────────┬────────────────────────────────┘
                             │
                      HTTP/HTTPS (Fetch/Axios)
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
         ▼                                       ▼
   /api/* (PROXY)                      Rutas de Vistas
         │                                 (SSR)
         │                                 │
         │                            Renderizado
         │                            HTML/CSS/JS
         │
         └──────────────────┬──────────────────────┐
                            │                      │
                            ▼                      ▼
                   ┌──────────────────┐    Navegador
                   │   BACKEND API    │    (Cliente)
                   │   (Express +     │
                   │    MySQL)        │
                   └──────────────────┘
```

### Arquitectura MVC + Servidor Proxy

```
┌─────────────────────────────────────────────────────────────┐
│                  EXPRESS SERVER (Port 3000)                 │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ MIDDLEWARES GLOBALES                                │   │
│  ├─ CORS (Cross-Origin Resource Sharing)              │   │
│  ├─ Cookie Parser                                      │   │
│  ├─ JSON Parser                                        │   │
│  ├─ Static Files (/public)                            │   │
│  └─ injectUserData (Inyecta datos de usuario en res)  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│           ┌───────────────┴───────────────┐                │
│           │                               │                │
│           ▼                               ▼                │
│  ┌──────────────────┐        ┌──────────────────────┐    │
│  │ RUTAS DE VISTAS  │        │   PROXY MIDDLEWARE   │    │
│  │ (SSR con EJS)    │        │   (/api/* forward)   │    │
│  │                  │        │                      │    │
│  ├─ GET /          │        ├─ pathRewrite         │    │
│  ├─ GET /login     │        ├─ changeOrigin        │    │
│  ├─ GET /principal │        ├─ onProxyRes          │    │
│  ├─ GET /presupuest│        │  (Reescribir cookies)│    │
│  ├─ POST /api/*    │        └──────────────────────┘    │
│  └──────────────────┘                  │                 │
│           │                            │                 │
│           │                            ▼                 │
│           │              ┌──────────────────────┐        │
│           │              │  Backend API REST    │        │
│           │              │ (Node.js + Express   │        │
│           │              │      + MySQL)        │        │
│           │              └──────────────────────┘        │
│           │                            │                 │
│           └────────────┬───────────────┘                 │
│                        │                                 │
│                        ▼                                 │
│            ┌──────────────────────┐                     │
│            │  JSON Response o     │                     │
│            │  EJS Rendered HTML   │                     │
│            └──────────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Clave

| Componente | Responsabilidad |
|-----------|-----------------|
| **server.js** | Punto de entrada, configuración de Express |
| **Middlewares** | CORS, cookies, inyección de datos de usuario |
| **Routes** | Definición de rutas frontend (vistas) |
| **Views (EJS)** | Templates HTML con datos inyectados del servidor |
| **Public (static)** | CSS, JavaScript, imágenes, videos |
| **Proxy** | Redirección transparente de /api/* al backend |

---

## 📂 Estructura de Carpetas

```
Front-end/
│
├── 📄 server.js                    # Punto de entrada principal de Express
├── 📄 package.json                 # Dependencias y configuración del proyecto
├── 📄 ARCHITECTURE.md              # Documentación de arquitectura detallada
├── 📄 README.md                    # Este archivo
│
├── 📁 middlewares/                 # Middlewares personalizados
│   └── authMiddleware.js           # Inyección de datos de usuario, validación JWT
│
├── 📁 routes/                      # Rutas del frontend (vistas)
│   ├── authRoutes.js               # Rutas de autenticación (login, registro)
│   ├── presupuestoRoutes.js        # Rutas de presupuestos
│   ├── gastosRoutes.js             # Rutas de gastos
│   ├── ingresosRoutes.js           # Rutas de ingresos
│   ├── passRoutes.js               # Rutas de cambio/recuperación de contraseña
│   └── otherRoutes.js              # Rutas diversas (reportes, créditos, etc)
│
├── 📁 views/                       # Templates EJS (Server-Side Rendering)
│   ├── login.ejs                   # Página de login
│   ├── Registro.ejs                # Página de registro
│   ├── principal.ejs               # Página principal (dashboard)
│   ├── presupuesto.ejs             # Detalle de presupuesto
│   ├── crearPresupuesto.ejs        # Formulario crear presupuesto
│   ├── registroGastos.ejs          # Formulario registrar gastos
│   ├── registroIngresos.ejs        # Formulario registrar ingresos
│   ├── crearCredito.ejs            # Formulario crear crédito
│   ├── registroCredito.ejs         # Formulario registrar crédito
│   ├── cuenta.ejs                  # Gestión de cuenta de usuario
│   ├── Reportes.ejs                # Panel de reportes y análisis
│   ├── TiposRecordatorios.ejs      # Configuración de recordatorios
│   ├── forgot-password.ejs         # Solicitar recuperación de contraseña
│   ├── reset-password.ejs          # Restablecer contraseña
│   ├── error.ejs                   # Página de error genérica
│   │
│   └── 📁 partials/                # Componentes reutilizables
│       └── navbar.ejs              # Barra de navegación
│
├── 📁 public/                      # Archivos estáticos
│   ├── 📁 css/                     # Estilos CSS
│   │
│   ├── 📁 js/                      # Scripts JavaScript del cliente
│   │   └── presupuesto.js          # Lógica de presupuestos en cliente
│   │
│   ├── 📁 img/                     # Imágenes y logotipos
│   │
│   └── 📁 video/                   # Videos de demostración o ayuda
│
├── 📁 views.backup/                # Backup de vistas anteriores
│   └── ...
│
└── 📁 node_modules/                # Dependencias instaladas (no versionar)
```

---

## 🛠️ Instalación y Configuración

### Prerequisitos

- **Node.js** 16.x o superior ([descargar](https://nodejs.org/))
- **npm** 8.x o superior (incluido con Node.js)
- **Backend API ejecutándose** en http://localhost:5000 (o URL de producción)

### Pasos de Instalación

#### 1. Clonar el repositorio

```bash
git clone https://github.com/BossBudgetProyect/BossBudget.git
cd BossBudget/Front-end
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto (`Front-end/.env`):

```env
# Servidor
PORT=3000
NODE_ENV=development

# URL de la API Backend
API_BASE_URL=http://localhost:5000
API_URL=http://localhost:5000/api

# Frontend (para CORS del backend)
FRONTEND_URL=http://localhost:3000

# Base de datos (si aplica localmente)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=bossbudget

# JWT (debe coincidir con el backend)
JWT_SECRET=tu_jwt_secret_super_seguro
```

**Configuración para Producción (Railway):**

```env
PORT=3000
NODE_ENV=production

API_BASE_URL=https://bossbudgetapi-production.up.railway.app
API_URL=https://bossbudgetapi-production.up.railway.app/api

FRONTEND_URL=https://bossbudget-front.up.railway.app

JWT_SECRET=tu_jwt_secret_super_seguro_en_produccion
```

#### 4. Ejecutar el servidor

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## 🎨 Estilos y Frontend

### Stack de Estilos

El proyecto utiliza:
- **EJS** para renderizado del lado del servidor
- **CSS personalizado** en archivos estáticos
- **Bootstrap o TailwindCSS** (según configuración)
- **JavaScript vanilla** para interactividad del cliente

### Estructura de Archivos de Estilo

```
public/
├── css/
│   ├── style.css              # Estilos principales
│   ├── presupuesto.css        # Estilos específicos de presupuestos
│   └── responsive.css         # Media queries y responsive design
│
└── js/
    ├── presupuesto.js         # Lógica de presupuestos en cliente
    ├── dashboard.js           # Interactividad del dashboard
    ├── forms.js               # Validación de formularios
    └── api-client.js          # Cliente para llamadas a API
```

### Modificar Estilos

Para añadir o modificar estilos globales:

```bash
# Editar archivo CSS principal
nano public/css/style.css

# Si usas TailwindCSS, recompilar:
npm run build:css
```

### Convenciones de CSS

- Usar clases en lugar de IDs (mejor reutilización)
- Nomenclatura BEM: `.block__element--modifier`
- Responsive first: mobile → tablet → desktop
- Variables CSS para colores y espaciamiento

---

## 🚀 Uso del Proyecto

### Comandos Disponibles

```bash
# Iniciar en modo desarrollo (con nodemon para auto-reload)
npm run dev

# Iniciar en modo producción
npm start

# Ver logs (si está configurado)
npm run logs

# Instalar dependencias
npm install

# Actualizar dependencias
npm update
```

### Flujo de Uso Principal

#### 1. **Página de Login** (`GET /`)
```
Usuario accede a http://localhost:3000
  ↓
Renderiza login.ejs
  ↓
Usuario ingresa credenciales
  ↓
POST /api/auth/login (proxy → backend)
  ↓
Backend valida y devuelve JWT en cookie
  ↓
Frontend guarda cookie automáticamente
```

#### 2. **Dashboard Principal** (`GET /principal`)
```
Usuario autenticado accede a /principal
  ↓
Middleware authMiddleware decodifica JWT
  ↓
Inyecta user en res.locals
  ↓
Renderiza principal.ejs con datos del usuario
  ↓
JavaScript del cliente puede hacer GET /api/presupuestos
  ↓
Proxy redirige a backend
  ↓
Datos se renderan dinámicamente
```

#### 3. **Crear Presupuesto**
```
GET /crearPresupuesto
  ↓
Renderiza formulario crearPresupuesto.ejs
  ↓
Usuario llena formulario
  ↓
POST /api/presupuestos (proxy)
  ↓
Backend crea presupuesto en BD
  ↓
Response redirige a /principal
```

### Acceso a Datos de Usuario en Vistas EJS

En cualquier vista EJS, los datos del usuario están disponibles:

```ejs
<!-- En principal.ejs -->
<h1>¡Bienvenido, <%= user.nombre %>!</h1>
<p>Email: <%= user.email %></p>
<p>ID: <%= user.id %></p>
```

El middleware `authMiddleware` inyecta automáticamente `user` en `res.locals`.

---

## 🔌 Conexión con la API Backend

### Configuración del Proxy

El servidor Express incluye un **proxy middleware** que redirige todas las peticiones a `/api/*` al backend. Esto se configura en `server.js`:

```javascript
app.use('/api', createProxyMiddleware({
  target: process.env.API_BASE_URL || 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',  // Elimina /api del path
  },
  onProxyRes: (proxyRes, req, res) => {
    // Manejo especial de cookies
    // Reescritura de headers
  }
}));
```

### Endpoints Disponibles

El frontend proxy redirige a estos endpoints del backend:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `POST` | `/api/auth/logout` | Cerrar sesión |
| `GET` | `/api/presupuestos` | Listar presupuestos del usuario |
| `POST` | `/api/presupuestos` | Crear presupuesto |
| `GET` | `/api/presupuestos/:id` | Obtener detalles de presupuesto |
| `PUT` | `/api/presupuestos/:id` | Actualizar presupuesto |
| `DELETE` | `/api/presupuestos/:id` | Eliminar presupuesto |
| `GET` | `/api/gastos` | Listar gastos |
| `POST` | `/api/gastos` | Registrar gasto |
| `GET` | `/api/ingresos` | Listar ingresos |
| `POST` | `/api/ingresos` | Registrar ingreso |
| `POST` | `/api/password/forgot` | Solicitar recuperación de contraseña |
| `POST` | `/api/password/reset` | Restablecer contraseña |

### Ejemplo: Llamada a la API desde JavaScript del Cliente

**En `public/js/presupuesto.js`:**

```javascript
// Obtener presupuestos
async function cargarPresupuestos() {
  try {
    const response = await fetch('/api/presupuestos', {
      method: 'GET',
      credentials: 'include',  // Incluir cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const presupuestos = await response.json();
    renderizarPresupuestos(presupuestos);
  } catch (error) {
    console.error('Error al cargar presupuestos:', error);
    mostrarError('No se pudieron cargar los presupuestos');
  }
}

// Crear presupuesto
async function crearPresupuesto(datos) {
  try {
    const response = await fetch('/api/presupuestos', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    const resultado = await response.json();
    
    if (response.ok) {
      mostrarExito('Presupuesto creado exitosamente');
      window.location.href = '/principal';
    } else {
      mostrarError(resultado.message || 'Error al crear presupuesto');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarError('Error en la solicitud');
  }
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', cargarPresupuestos);
```

### Autenticación y JWT

#### Flujo de Autenticación

```
1. Usuario inicia sesión (POST /api/auth/login)
   ↓
2. Backend valida credenciales
   ↓
3. Backend genera JWT y lo envía en Set-Cookie header
   ↓
4. Browser guarda automáticamente la cookie
   ↓
5. En peticiones siguientes, credentials: 'include' envía la cookie
   ↓
6. Middleware authMiddleware decodifica el JWT
   ↓
7. res.locals.user contiene datos del usuario
```

#### Manejo de Token en Cookies

El middleware `authMiddleware.js` decodifica automáticamente el JWT:

```javascript
export function injectUserData(req, res, next) {
  const token = req.cookies.authToken;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
    } catch (error) {
      console.warn('Token inválido');
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  
  next();
}
```

#### Rutas Protegidas

```javascript
// En routes/*.js
function requireAuth(req, res, next) {
  if (!req.cookies.authToken) {
    return res.redirect('/');  // Redirige a login
  }
  next();
}

router.get('/principal', requireAuth, (req, res) => {
  res.render('principal', { user: res.locals.user });
});
```

### Manejo de Errores

#### Errores Comunes del Proxy

```
502 Bad Gateway → El backend no está disponible
504 Gateway Timeout → El backend tardó demasiado
CORS Error → Verificar allowedOrigins en server.js
Cookie Not Set → Verificar configuración de onProxyRes
```

#### Respuesta a Errores en Cliente

```javascript
async function hacerPeticion(url, opciones) {
  try {
    const response = await fetch(url, opciones);
    
    if (response.status === 401) {
      // Token expirado o no válido
      window.location.href = '/';  // Redirigir a login
      return null;
    }
    
    if (response.status === 403) {
      // No autorizado
      mostrarError('No tienes permiso para acceder a esto');
      return null;
    }
    
    if (response.status === 404) {
      // No encontrado
      mostrarError('El recurso no existe');
      return null;
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    mostrarError(error.message);
    return null;
  }
}
```

---

## 📦 Dependencias Principales

### Dependencias de Producción

```json
{
  "axios": "^1.13.2",           // Cliente HTTP alternativo a fetch
  "bcryptjs": "^3.0.3",         // Hash de contraseñas
  "cookie-parser": "^1.4.7",    // Parser de cookies
  "cors": "^2.8.5",             // Control de origen cruzado
  "dotenv": "^17.2.3",          // Variables de entorno
  "ejs": "^3.1.10",             // Template engine (Server-Side Rendering)
  "express": "^5.1.0",          // Framework web
  "express-rate-limit": "^8.2.1", // Rate limiting
  "http-proxy-middleware": "^2.0.9", // Proxy middleware
  "jsonwebtoken": "^9.0.2",     // Manejo de JWT
  "nodemailer": "^7.0.10"       // Envío de emails
}
```

### Dependencias de Desarrollo

```json
{
  "nodemon": "^3.1.10"          // Auto-reload durante desarrollo
}
```

---

## 🚢 Despliegue

### Despliegue en Railway (Recomendado)

#### Requisitos

- Cuenta en [Railway.app](https://railway.app)
- Repositorio en GitHub conectado

#### Pasos

1. **Conectar repositorio a Railway:**
   - Ir a railway.app → New → GitHub Repo
   - Seleccionar repositorio BossBudget
   - Seleccionar rama `Development`

2. **Configurar variables de entorno:**
   - En Railway → Variables
   - Añadir todas las variables del `.env`

3. **Configurar Port:**
   ```
   PORT=3000 (Railway asignará automáticamente)
   ```

4. **Deploy automático:**
   - Cada push a `Development` despliega automáticamente

#### Variables en Producción

```env
PORT=3000
NODE_ENV=production
API_BASE_URL=https://bossbudgetapi-production.up.railway.app
API_URL=https://bossbudgetapi-production.up.railway.app/api
FRONTEND_URL=https://bossbudget-front.railway.app
JWT_SECRET=<secreto_super_seguro_en_railway>
```

### Despliegue en Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Seguir instrucciones interactivas
```

### Despliegue en Docker

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

**Build y run:**

```bash
docker build -t bossbudget-frontend .
docker run -p 3000:3000 --env-file .env bossbudget-frontend
```

---

## 📋 Buenas Prácticas y Estilo de Código

### Linting y Formato

Se recomienda usar:

```bash
# Instalar ESLint
npm install --save-dev eslint prettier

# Inicializar ESLint
npx eslint --init

# Formatear código
npx prettier --write .
```

### Estructura de Archivos

- **Nombres en kebab-case:** `presupuesto.js`, `auth-routes.js`
- **Componentes EJS:** Usar `partials/` para reutilización
- **Archivos estáticos:** Organizar por tipo (css, js, img, video)

### Convenciones de Nombres

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Variables | camelCase | `usuario`, `presupuestoActual` |
| Constantes | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| Funciones | camelCase | `crearPresupuesto()`, `validarEmail()` |
| Clases | PascalCase | `UsuarioController`, `PresupuestoService` |
| Archivos | kebab-case | `auth-routes.js`, `presupuesto.ejs` |

### Manejo de Errores

```javascript
// ❌ Evitar
console.log(error);
res.send('Error');

// ✅ Preferir
console.error('Error al crear presupuesto:', error.message);
res.status(500).json({ 
  error: 'Error interno del servidor',
  message: error.message 
});
```

### Comentarios Útiles

```javascript
// ✅ Comentarios claros
// Obtener presupuestos del usuario actual
const presupuestos = await api.get('/presupuestos');

// ❌ Evitar comentarios obvios
// Aumentar contador
contador++;
```

### Validación de Datos

```javascript
// En formularios y peticiones
function validarFormulario(datos) {
  const errores = [];
  
  if (!datos.nombre || datos.nombre.trim() === '') {
    errores.push('El nombre es requerido');
  }
  
  if (!datos.email || !validarEmail(datos.email)) {
    errores.push('Email inválido');
  }
  
  if (datos.monto <= 0) {
    errores.push('El monto debe ser mayor a 0');
  }
  
  return { valido: errores.length === 0, errores };
}
```

---

## 🤝 Contribución

### Flujo de Contribución

1. **Fork el repositorio:**
   ```bash
   # En GitHub, hacer click en "Fork"
   ```

2. **Clonar fork local:**
   ```bash
   git clone https://github.com/TU_USUARIO/BossBudget.git
   cd BossBudget/Front-end
   ```

3. **Crear rama de feature:**
   ```bash
   git checkout -b feature/tu-feature-nombre
   # Ej: git checkout -b feature/agregar-grafico-gastos
   ```

4. **Realizar cambios:**
   ```bash
   # Editar archivos...
   npm run dev  # Verificar localmente
   ```

5. **Commit con mensaje descriptivo:**
   ```bash
   git add .
   git commit -m "feat: agregar gráfico de gastos por categoría"
   ```

6. **Push a tu fork:**
   ```bash
   git push origin feature/tu-feature-nombre
   ```

7. **Crear Pull Request:**
   - Ir a GitHub
   - Crear PR de tu branch a `Development`
   - Describir cambios detalladamente

### Convención de Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature nueva
git commit -m "feat: agregar panel de análisis"

# Bug fix
git commit -m "fix: corregir renderizado de presupuestos"

# Documentación
git commit -m "docs: actualizar README con instrucciones de deploy"

# Refactoring
git commit -m "refactor: simplificar lógica de autenticación"

# Estilos
git commit -m "style: mejorar diseño responsive del dashboard"

# Performance
git commit -m "perf: optimizar carga de datos presupuestos"
```

---

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**.

```
ISC License (ISC)

Copyright (c) 2024 BossBudget Team

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
```

---

## 👥 Créditos y Contacto

### Equipo de Desarrollo

- **Proyecto:** BossBudget
- **Organización:** BossBudget Project
- **Repositorio:** [github.com/BossBudgetProyect/BossBudget](https://github.com/BossBudgetProyect/BossBudget)

### Enlaces Útiles

- 📖 [Documentación de Express.js](https://expressjs.com/)
- 🎨 [Documentación de EJS](https://ejs.co/)
- 🔐 [JWT.io - JSON Web Tokens](https://jwt.io/)
- 📚 [Documentación de Node.js](https://nodejs.org/en/docs/)
- 🚀 [Railway.app - Despliegue](https://railway.app)

### Reportar Problemas

Si encuentras un bug o tienes una sugerencia:

1. Crear una [issue en GitHub](https://github.com/BossBudgetProyect/BossBudget/issues)
2. Describir el problema detalladamente
3. Incluir pasos para reproducir
4. Adjuntar capturas de pantalla si es necesario

---

## 📞 Soporte

Para soporte o preguntas:

- 📧 Email: support@bossbudget.com
- 💬 Discord: [BossBudget Community](https://discord.gg/bossbudget)
- 🐙 GitHub Issues: [Crear issue](https://github.com/BossBudgetProyect/BossBudget/issues)

---

## 📈 Roadmap

### Próximas Mejoras Planeadas

- [ ] Gráficos más avanzados con Chart.js
- [ ] Exportar reportes a PDF
- [ ] Aplicación móvil (React Native)
- [ ] Modo oscuro (dark mode)
- [ ] Internacionalización (i18n)
- [ ] Notificaciones en tiempo real
- [ ] Colaboración multiusuario en presupuestos

---

**Última actualización:** Noviembre 2024  
**Versión:** 1.0.0  
**Estado:** En desarrollo 🚧

