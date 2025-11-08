import express from 'express';

const router = express.Router();

// 🟢 Página de inicio (login principal)
router.get("/", (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true,
        timer: req.query.timer ? parseInt(req.query.timer) : undefined
    } : {};

    res.render("login", alertData);
});

// ✅ RUTA GET PARA MOSTRAR LOGIN
router.get('/login', (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info'
    } : {};
    
    res.render('login', {
        ...alertData,
        title: 'Iniciar Sesión',
        user: null // Asegurar que no hay usuario en login
    });
});

// 🟢 Página de registro
router.get("/Registro", (req, res) => {
    const alertData = req.query.alert ? {
        alert: true,
        alertTitle: req.query.title || 'Info',
        alertMessage: req.query.message || '',
        alertIcon: req.query.icon || 'info',
        showConfirmButton: true
    } : {};

    res.render("Registro", alertData);
});

// frontend/routes/authRoutes.js - Ruta POST /login MEJORADA
router.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;
        
        console.log('📤 Enviando login al backend...');
        
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                pass: pass
            })
        });

        const result = await response.json();
        console.log('📨 Respuesta del backend:', result);

        if (!response.ok) {
            return res.redirect(`/login?alert=true&title=Error&message=${encodeURIComponent(result.error)}&icon=error`);
        }

        if (result.success) {
            console.log('✅ Login exitoso');
            
            // ✅ COPIAR SOLO LA COOKIE authToken (no las de tunneling)
            const setCookieHeader = response.headers.get('set-cookie');
            console.log('🍪 Set-Cookie header completo:', setCookieHeader);
            
            if (setCookieHeader) {
                // Extraer solo la cookie authToken
                const cookies = setCookieHeader.split(', ');
                const authTokenCookie = cookies.find(cookie => cookie.startsWith('authToken='));
                
                if (authTokenCookie) {
                    console.log('🍪 Cookie authToken encontrada:', authTokenCookie);
                    
                    // Establecer la cookie en el frontend
                    res.setHeader('set-cookie', authTokenCookie);
                    console.log('✅ Cookie authToken establecida en frontend');

                    // ✅ DEBUG: Establecer también una cookie de prueba
                    res.cookie('testCookie', 'funciona', {
                        httpOnly: false, // Para poder verla en el navegador
                        secure: true,
                        sameSite: 'none',
                        domain: '.app.github.dev',
                        maxAge: 24 * 60 * 60 * 1000
                    });
                    console.log('✅ Cookie de prueba establecida');
                } else {
                    console.log('❌ No se encontró authToken en las cookies');
                }
            }
            
            res.redirect('/principal');
        } else {
            throw new Error(result.message || 'Error en la autenticación');
        }

    } catch (error) {
        console.error('❌ Error en ruta de login:', error);
        res.redirect(`/login?alert=true&title=Error&message=${encodeURIComponent(error.message)}&icon=error`);
    }
});

// ✅ RUTA LOGOUT (SERVER-SIDE)
router.post('/logout', async (req, res) => {
    try {
        console.log('🔐 Cerrando sesión...');
        
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Cookie': `authToken=${req.cookies.authToken}`
            }
        });

        // Limpiar cookie en frontend también
        res.clearCookie('authToken', { 
            path: '/',
            domain: process.env.CODESPACES ? '.app.github.dev' : undefined
        });

        res.redirect('/login?alert=true&title=Sesión Cerrada&message=Has cerrado sesión correctamente&icon=success');
        
    } catch (error) {
        console.error('❌ Error en logout:', error);
        // Limpiar cookie incluso con error
        res.clearCookie('authToken');
        res.redirect('/login');
    }
});

export default router;
