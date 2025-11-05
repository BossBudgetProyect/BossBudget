class PasswordResetToken {
    constructor(id, Correo, token, expires_at) {
        this.id = id;
        this.Correo = Correo;
        this.token = token;
        this.expires_at = expires_at;
    }

    toJSON() {
        return {
            id: this.id,
            Correo: this.Correo,
            token: this.token,
            expires_at: this.expires_at
        };
    }
}

module.exports = PasswordResetToken;