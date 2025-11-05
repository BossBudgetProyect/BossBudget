// frontend/middleware/authMiddleware.js

// Middleware para inyectar datos del usuario en vistas EJS
export const injectUserData = async (req, res, next) => {
    console.log('🔐 injectUserData ejecutándose...');
    const token = req.cookies?.authToken;

    if (!token) {
        res.locals.user = null;
        return next();
    }

    try {
        const verifyResponse = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await verifyResponse.json();

        if (result.success) {
            res.locals.user = result.data.user;
            console.log('👤 Datos de usuario inyectados:', res.locals.user);
        } else {
            console.warn('⚠️ Token inválido en injectUserData');
            res.locals.user = null;
            res.clearCookie('authToken');
        }
    } catch (error) {
        console.error('❌ Error en injectUserData:', error.message);
        res.locals.user = null;
    }

    next();
};

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