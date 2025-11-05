const usuarioRepository = require('../repositories/usuarioRepository');
const passwordResetTokenRepository = require('../repositories/passwordResetTokenRepository');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

class PasswordService {
    
    async solicitarRecuperacion(correo) {
        const usuario = await usuarioRepository.findByEmail(correo);
        if (!usuario) {
            throw new Error('No hay cuenta asociada a este correo');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await passwordResetTokenRepository.create(usuario.Correo, token, expiresAt);

        // Enlace directo al frontend con el token
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        
        try {
            await transporter.sendMail({
                to: correo,
                subject: 'Recuperación de contraseña - BossBudget',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb; text-align: center;">Recuperación de Contraseña</h2>
                        
                        <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="${resetLink}" 
                            style="background-color: #2563eb; color: white; padding: 12px 24px; 
                                    text-decoration: none; border-radius: 6px; border: none; 
                                    cursor: pointer; font-size: 16px; display: inline-block;">
                                Restablecer Contraseña
                            </a>
                        </div>
                        
                        <p><strong>El enlace expira en 15 minutos.</strong></p>
                        
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 20px;">
                            <p style="margin: 0; font-size: 14px; color: #6b7280;">
                                <strong>Nota de seguridad:</strong> Este enlace caduca en 15 minutos 
                                y es de un solo uso. Si no lo solicitaste, ignora este mensaje.
                            </p>
                        </div>
                    </div>
                `,
            });
        } catch (error) {
            console.error('Error enviando email:', error);
            throw new Error('Error al enviar el correo de recuperación');
        }

        return { 
            message: '¡Revisa tu correo para el enlace de recuperación!'
        };
    }   

    async restablecerContraseña(token, nuevaContraseña) {
        if (!nuevaContraseña || nuevaContraseña.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        // Verificar token válido
        const tokenData = await passwordResetTokenRepository.findValidToken(token);
        if (!tokenData) {
            throw new Error('El token es inválido o ha expirado');
        }

        // Hashear nueva contraseña
        const contraseñaHasheada = await bcrypt.hash(nuevaContraseña, 10);

        // Actualizar por CORREO en lugar de NombreUsuario
        const actualizado = await usuarioRepository.updatePassword(
            tokenData.correo,
            contraseñaHasheada
        );

        if (!actualizado) {
            throw new Error('Error al actualizar la contraseña');
        }

        // Eliminar token usado
        await passwordResetTokenRepository.delete(token);

        return { message: 'Contraseña actualizada correctamente' };
    }

    async verificarToken(token) {
        const tokenData = await passwordResetTokenRepository.findValidToken(token);
        return {
            valido: !!tokenData,
            // Si necesitas el correo para algo en el frontend, puedes retornarlo:
            correo: tokenData?.correo
        };
    }
}

module.exports = new PasswordService();