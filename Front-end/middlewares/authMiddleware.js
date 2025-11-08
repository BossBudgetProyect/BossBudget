// frontend/middleware/authMiddleware.js

// Middleware para inyectar datos del usuario en vistas EJS
import jwt from 'jsonwebtoken';

export function injectUserData(req, res, next) {
  const token = req.cookies.authToken;
  console.log('🍪 req.cookies:', req.cookies);

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado correctamente:', decoded);
    res.locals.user = decoded;
  } catch (err) {
    console.warn('⚠️ Token inválido:', err.message);
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