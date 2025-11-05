class Usuario {
    constructor(Correo, Nombres, Apellidos, Contraseña, Profesion, FechaDeNacimiento, Expectativas, NombreUsuario, Foto, rol) {
        this.Correo = Correo;
        this.Nombres = Nombres;
        this.Apellidos = Apellidos;
        this.Contraseña = Contraseña;
        this.Profesion = Profesion;
        this.FechaDeNacimiento = FechaDeNacimiento;
        this.Expectativas = Expectativas;
        this.NombreUsuario = NombreUsuario;
        this.Foto = Foto;
        this.rol = rol;
    }

    toJSON() {
        return {
            Correo: this.Correo,
            Nombres: this.Nombres,
            Apellidos: this.Apellidos,
            Profesion: this.Profesion,
            FechaDeNacimiento: this.FechaDeNacimiento,
            Expectativas: this.Expectativas,
            NombreUsuario: this.NombreUsuario,
            Foto: this.Foto,
            rol: this.rol
        };
    }
}

module.exports = Usuario;