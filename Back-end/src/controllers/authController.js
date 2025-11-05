const authService = require('../services/authService');
const { revokeToken } = require('../middlewares/auth');

class AuthController {
    
    // backend/controllers/authController.js - En login function
    // backend/controllers/authController.js - Login function CORREGIDA
    async login(req, res) {
        try {
            const { email, pass } = req.body;
            const resultado = await authService.login(email, pass);
            
            console.log('🍪 Enviando cookie authToken...');

            // ✅ CONFIGURACIÓN ESPECÍFICA PARA GITHUB CODESPACES
            const isGitHubCodespace = process.env.CODESPACES === 'true';
            
            const cookieOptions = {
                httpOnly: true,
                secure: true, // ✅ Siempre true en Codespaces
                sameSite: 'none', // ✅ Requerido para cross-origin
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            };

            // ✅ SIEMPRE usar dominio de GitHub en Codespaces
            if (isGitHubCodespace) {
                cookieOptions.domain = '.app.github.dev';
            }

            // Establecer cookie
            res.cookie('authToken', resultado.token, cookieOptions);
            
            console.log('✅ Cookie establecida para Codespaces');
            
            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    usuario: resultado.usuario
                }
            });

        } catch (error) {
            res.status(401).json({
                success: false,
                error: error.message
            });
        }
    }

    // Registro (se mantiene igual, está bien)
    async registrar(req, res) {
        try {
            const datosUsuario = {
                username: req.body.username,
                nombres: req.body.nom,
                apellidos: req.body.apell,
                password: req.body.pass,
                email: req.body.email,
                profesion: req.body.prof,
                nacimiento: req.body.nacimiento,
                expectativas: req.body.expec
            };

            const imagenNombre = req.file ? req.file.filename : null;
            
            const resultado = await authService.registrar(datosUsuario, imagenNombre);
            
            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: resultado
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener perfil (se mantiene igual, está bien)
    async obtenerPerfil(req, res) {
        try {
            const usuario = await authService.obtenerPerfil(req.user.correo);
            
            res.json({
                success: true,
                data: usuario
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }

    // Logout optimizado
    async logout(req, res) {
        try {
            console.log('🔐 Iniciando logout...');
            
            // ✅ SOLO cookies (eliminamos headers)
            const token = req.cookies.authToken;
            
            if (token) {
                console.log('🗑️ Revocando token...');
                await revokeToken(token);
            }

            // ✅ CONFIGURACIÓN SIMPLIFICADA
            const clearOptions = {
                httpOnly: true,
                path: '/'
            };

            // Agregar dominio solo si es GitHub Codespaces
            if (process.env.CODESPACES === 'true') {
                clearOptions.domain = '.app.github.dev';
            }

            res.clearCookie('authToken', clearOptions);

            console.log('✅ Logout completado - cookie limpiada');

            return res.status(200).json({
                success: true,
                message: 'Sesión cerrada correctamente'
            });

        } catch (error) {
            console.error('❌ Error en logout:', error);
            
            // Limpiar cookie incluso con error
            const clearOptions = {
                path: '/',
                domain: process.env.CODESPACES ? '.app.github.dev' : undefined
            };
            res.clearCookie('authToken', clearOptions);
            
            return res.status(200).json({
                success: true,
                message: 'Sesión cerrada'
            });
        }
    }
}

module.exports = new AuthController();