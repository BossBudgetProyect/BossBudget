const db = require('../config/database');

class PasswordResetTokenRepository {
    
    // Crear token de recuperación - CAMBIO: usar Correo
    async create(correo, token, expiresAt) {
        const [result] = await db.execute(
            'INSERT INTO password_reset_tokens (Correo, token, expires_at) VALUES (?, ?, ?)',  // CAMBIADO
            [correo, token, expiresAt]  // CAMBIADO: nombreUsuario → correo
        );
        
        return {
            id: result.insertId,
            correo,  // CAMBIADO
            token,
            expiresAt
        };
    }

    // Buscar token válido - SOLO busca por Correo (sin JOIN)
    async findValidToken(token) {
        const [rows] = await db.execute(
            'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',  // SIN JOIN
            [token]
        );
        
        if (rows.length === 0) return null;
        
        return {
            id: rows[0].id,
            correo: rows[0].Correo,  // CAMBIADO: ahora retorna correo
            token: rows[0].token,
            expiresAt: rows[0].expires_at
        };
    }

    // Eliminar token - NO CAMBIA
    async delete(token) {
        const [result] = await db.execute(
            'DELETE FROM password_reset_tokens WHERE token = ?',
            [token]
        );
        
        return result.affectedRows > 0;
    }

    // Eliminar tokens expirados - NO CAMBIA
    async deleteExpired() {
        const [result] = await db.execute(
            'DELETE FROM password_reset_tokens WHERE expires_at <= NOW()'
        );
        
        return result.affectedRows;
    }

    // NUEVO: Eliminar tokens por correo
    async deleteByEmail(correo) {
        const [result] = await db.execute(
            'DELETE FROM password_reset_tokens WHERE Correo = ?',
            [correo]
        );
        
        return result.affectedRows > 0;
    }
}

module.exports = new PasswordResetTokenRepository();