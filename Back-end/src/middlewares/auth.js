// back-end/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

// 🧩 Lista negra temporal (Set en memoria)
const tokenBlacklist = new Map();

/**
 * ✅ MIDDLEWARE PRINCIPAL - Solo para cookies (rutas web)
 */
const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    // 🍪 SOLO buscar en cookies (eliminamos headers para web)
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
      console.log('🔐 Token encontrado en cookies');
    }

    // ❌ Si no hay token en cookies
    if (!token) {
      console.log('❌ No se encontró token en cookies');
      return res.status(401).json({
        success: false,
        error: 'Sesión no encontrada. Inicie sesión nuevamente.'
      });
    }

    // 🧱 1. Verificar si el token está en la lista negra
    if (tokenBlacklist.has(token)) {
      console.log('❌ Token en lista negra');
      
      // Limpiar cookie inválida
      res.clearCookie('authToken', { 
        path: '/',
        domain: process.env.CODESPACES ? '.app.github.dev' : undefined
      });
      
      return res.status(401).json({
        success: false,
        error: 'Sesión expirada. Inicie sesión nuevamente.'
      });
    }

    console.log('🔐 Token encontrado, verificando...');

    // 🧱 2. Verificar firma y expiración
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuario:', decoded.correo);

    // 🧱 3. Adjuntar datos del usuario a la request
    req.user = decoded;
    next();

  } catch (error) {
    console.error('❌ Error en authMiddleware:', error.message);
    
    // Limpiar cookie en caso de error
    res.clearCookie('authToken', { 
      path: '/',
      domain: process.env.CODESPACES ? '.app.github.dev' : undefined
    });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Sesión expirada. Inicie sesión nuevamente.'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Sesión inválida. Inicie sesión nuevamente.'
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Error de autenticación'
      });
    }
  }
};

/**
 * ✅ MIDDLEWARE PARA APIS EXTERNAS (móvil, otros servicios)
 * Este sí acepta headers para casos específicos
 */
const authMiddlewareAPI = (req, res, next) => {
  try {
    let token = null;

    // 🔑 Buscar en headers Authorization (solo para APIs externas)
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
      console.log('🔐 Token encontrado en headers (API)');
    }

    // ❌ Si no hay token
    if (!token) {
      console.log('❌ No se encontró token en headers para API');
      return res.status(401).json({
        success: false,
        error: 'Token de API requerido'
      });
    }

    // 🧱 Verificar blacklist
    if (tokenBlacklist.has(token)) {
      console.log('❌ Token API en lista negra');
      return res.status(401).json({
        success: false,
        error: 'Token revocado'
      });
    }

    // 🧱 Verificar firma y expiración
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token API válido para usuario:', decoded.correo);

    req.user = decoded;
    next();

  } catch (error) {
    console.error('❌ Error en authMiddlewareAPI:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token API expirado'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token API inválido'
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Error de autenticación API'
      });
    }
  }
};

/**
 * Agrega un token a la blacklist (por ejemplo, al hacer logout)
 */
const revokeToken = async (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      console.log('⚠️ Token no válido para revocar');
      return;
    }

    // Guardamos su expiración (timestamp en ms)
    const expiry = decoded.exp * 1000;
    tokenBlacklist.set(token, expiry);

    // Limpieza automática
    setTimeout(() => {
      tokenBlacklist.delete(token);
      console.log('🧹 Token eliminado de blacklist por expiración');
    }, expiry - Date.now());
    
    console.log(`✅ Token revocado. Expira en: ${new Date(expiry).toLocaleString()}`);
    
  } catch (err) {
    console.error('❌ Error al revocar token:', err.message);
    throw err;
  }
};

module.exports = { 
  authMiddleware,     // ✅ Para rutas web (solo cookies)
  authMiddlewareAPI,  // ✅ Para APIs externas (solo headers)  
  revokeToken 
};