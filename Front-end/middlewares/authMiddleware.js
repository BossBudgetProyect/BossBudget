// frontend/middlewares/authMiddleware.js - VERSIÓN COMPLETA DEBUG
import fetch from 'node-fetch';

export const injectUserData = async (req, res, next) => {
    console.log('🔐 injectUserData ejecutándose...');
    console.log('🍪 Token disponible:', req.cookies?.authToken ? 'SÍ' : 'NO');
    
    const token = req.cookies?.authToken;

    if (!token) {
        console.log('❌ No hay token - user será null');
        res.locals.user = null;
        return next();
    }

    try {
        console.log('📤 Llamando a /api/auth/verify con token...');
        console.log('🔗 URL:', `${process.env.BACKEND_URL}/api/auth/verify`);
        
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/verify`, {
            method: 'GET',
            headers: {
                'Cookie': `authToken=${token}`
            },
            timeout: 10000
        });

        console.log('📨 Status de verify:', response.status);
        console.log('📨 Headers de verify:', response.headers);
        
        if (!response.ok) {
            console.log('❌ Verify falló - status:', response.status);
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log('📊 Resultado COMPLETO de verify:', JSON.stringify(result, null, 2));

        if (result.success && result.data && result.data.user) {
            res.locals.user = result.data.user;
            console.log('✅ User inyectado correctamente:', res.locals.user);
        } else {
            console.log('❌ Verify success pero sin user data');
            res.locals.user = null;
        }

    } catch (error) {
        console.error('❌ Error en injectUserData:', error.message);
        console.error('❌ Stack:', error.stack);
        res.locals.user = null;
    }

    console.log('🔐 injectUserData finalizado - user:', res.locals.user);
    next();
};

export const protectView = (req, res, next) => {
    console.log('🛡️ protectView ejecutándose para:', req.path);
    console.log('👤 res.locals.user:', res.locals.user);
    
    if (!res.locals.user) {
        console.log('🔴 NO HAY USER - Redirigiendo a login');
        return res.redirect('/login?alert=true&title=Acceso Denegado&message=Debes iniciar sesión&icon=warning');
    }
    
    console.log('✅ ACCESS PERMITIDO para:', res.locals.user.nombreUsuario);
    next();
};