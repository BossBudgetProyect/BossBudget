class TipoDeRecordatorio {
    constructor(idTiposDeRecordatorios, TipoDeRecordatorio, idRecordatorios) {
        this.idTiposDeRecordatorios = idTiposDeRecordatorios;
        this.TipoDeRecordatorio = TipoDeRecordatorio;
        this.idRecordatorios = idRecordatorios;
    }

    toJSON() {
        return {
            idTiposDeRecordatorios: this.idTiposDeRecordatorios,
            TipoDeRecordatorio: this.TipoDeRecordatorio,
            idRecordatorios: this.idRecordatorios
        };
    }
}

module.exports = TipoDeRecordatorio;