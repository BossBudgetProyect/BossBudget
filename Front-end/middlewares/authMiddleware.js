// frontend/middleware/authMiddleware.js

// Middleware para inyectar datos del usuario en vistas EJS
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

export async function injectUserData(req, res, next) {
  const token = req.cookies.authToken;
  console.log('🍪 req.cookies:', req.cookies);

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado correctamente:', decoded);
    res.locals.user = decoded;
  } catch (err) {
    console.warn('⚠️ Token inválido localmente:', err.message);

    // Intentar fallback: validar token en el backend (útil cuando FRONTEND no comparte la misma SECRET)
    try {
      const BACKEND = process.env.BACKEND_API_URL || 'https://bossbudgetapi-production.up.railway.app';
      const url = `${BACKEND}/api/auth/validate`;
      console.log('[FALLBACK] consultando backend para validar token:', url);

      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          cookie: req.headers.cookie || ''
        },
        redirect: 'manual'
      });

      if (resp.ok) {
        const body = await resp.json();
        if (body && body.success && body.data && body.data.usuario) {
          console.log('✅ Fallback backend validó token y devolvió usuario');
          res.locals.user = body.data.usuario;
        } else if (body && body.success && body.data) {
          res.locals.user = body.data;
        } else {
          console.warn('⚠️ Fallback backend no devolvió usuario válido:', body);
        }
      } else {
        console.warn('⚠️ Fallback backend respondió con status', resp.status);
      }
    } catch (fetchErr) {
      console.error('❌ Error al validar token en backend:', fetchErr.message);
    }
    // res.clearCookie('authToken', { httpOnly: true, secure: true, sameSite: 'Strict' }); // 🧹 limpia cookie dañada
  }

  next();
}


export const protectView = async (req, res, next) => {
    console.log('🛡️ protectView ejecutándose para:', req.path);
    
    // ✅ CREAR una versión que espere a que injectUserData termine
    await new Promise((resolve) => {
        injectUserData(req, res, () => {
            console.log('🔍 protectView - después de injectUserData:', res.locals.user);
            resolve();
        });
    });
    
    // Luego verificar autenticación
    if (!res.locals.user) {
        console.log('🔴 Vista protegida - redirigiendo a login');
        return res.redirect('/login');
    }
    
    console.log('✅ protectView - acceso permitido');
    next();
};