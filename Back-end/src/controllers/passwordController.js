const passwordService = require('../services/passwordService');

class PasswordController {
    
    // Solicitar recuperación de contraseña
    async solicitarRecuperacion(req, res) {
        try {
            const { email } = req.body;
            
            const resultado = await passwordService.solicitarRecuperacion(email);
            
            res.json({
                success: true,
                message: resultado.message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Restablecer contraseña
    async restablecerContraseña(req, res) {
        try {
            const { token, password } = req.body;
            
            const resultado = await passwordService.restablecerContraseña(token, password);
            
            res.json({
                success: true,
                message: resultado.message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Verificar token
    async verificarToken(req, res) {
        try {
            const { token } = req.params;
            
            const resultado = await passwordService.verificarToken(token);
            
            res.json({
                success: true,
                valido: resultado.valido,
                correo: resultado.correo // Opcional: si quieres retornar el correo
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new PasswordController();