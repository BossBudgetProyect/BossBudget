class Recordatorio {
    constructor(idRecordatorios, Comentario, NombreUsuario) {
        this.idRecordatorios = idRecordatorios;
        this.Comentario = Comentario;
        this.NombreUsuario = NombreUsuario;
    }

    toJSON() {
        return {
            idRecordatorios: this.idRecordatorios,
            Comentario: this.Comentario,
            NombreUsuario: this.NombreUsuario
        };
    }
}

module.exports = Recordatorio;