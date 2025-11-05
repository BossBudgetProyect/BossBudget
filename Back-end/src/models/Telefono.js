class Telefono {
    constructor(idTelefono, Numero, Correo) {
        this.idTelefono = idTelefono;
        this.Numero = Numero;
        this.Correo = Correo;
    }

    toJSON() {
        return {
            idTelefono: this.idTelefono,
            Numero: this.Numero,
            Correo: this.Correo
        };
    }
}

module.exports = Telefono;