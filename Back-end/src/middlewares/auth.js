// back-end/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

// 🧩 Lista negra temporal (Set en memoria)
const tokenBlacklist = new Map();

/**
 * Middleware para verificar y validar el JWT
 * Busca token en: 1. Headers Authorization, 2. Cookies
 */
const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    // 🍪 1. PRIMERO buscar en cookies (para el frontend web)
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
      console.log('🔐 Token encontrado en cookies');
    }
    
    // 🔑 2. SEGUNDO buscar en headers Authorization (para APIs/móvil)
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
        console.log('🔐 Token encontrado en headers');
      }
    }

    // ❌ Si no hay token en ningún lado
    if (!token) {
      console.log('❌ No se encontró token en cookies ni headers');
      return res.status(401).json({
        success: false,
        error: 'Token de acceso requerido'
      });
    }

    // 🧱 1. Verificar si el token está en la lista negra
    if (tokenBlacklist.has(token)) {
      console.log('❌ Token en lista negra');
      return res.status(401).json({
        success: false,
        error: 'Token revocado. Inicie sesión nuevamente.'
      });
    }

    // 🧱 2. Verificar firma y expiración
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuario:', decoded.correo);

    // 🧱 3. Adjuntar datos del usuario a la request
    req.user = decoded;
    next();

  } catch (error) {
    console.error('❌ Error en authMiddleware:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
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

module.exports = { authMiddleware, revokeToken };