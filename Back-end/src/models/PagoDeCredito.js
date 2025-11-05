class PagoDeCredito {
    constructor(idPagoDeCredito, TipoDePago, idCreditos, AccionRealizada) {
        this.idPagoDeCredito = idPagoDeCredito;
        this.TipoDePago = TipoDePago;
        this.idCreditos = idCreditos;
        this.AccionRealizada = AccionRealizada;
    }

    toJSON() {
        return {
            idPagoDeCredito: this.idPagoDeCredito,
            TipoDePago: this.TipoDePago,
            idCreditos: this.idCreditos,
            AccionRealizada: this.AccionRealizada
        };
    }
}

module.exports = PagoDeCredito;