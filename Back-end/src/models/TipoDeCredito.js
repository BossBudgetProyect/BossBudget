class TipoDeCredito {
    constructor(idTipoDeCredito, TipoDeCredito) {
        this.idTipoDeCredito = idTipoDeCredito;
        this.TipoDeCredito = TipoDeCredito;
    }

    toJSON() {
        return {
            idTipoDeCredito: this.idTipoDeCredito,
            TipoDeCredito: this.TipoDeCredito
        };
    }
}

module.exports = TipoDeCredito;