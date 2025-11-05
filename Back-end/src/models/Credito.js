class Credito {
    constructor(idCreditos, idPresupuesto, RangoInicial, RangoFinal, MontoTotal, idTipoDeCredito) {
        this.idCreditos = idCreditos;
        this.idPresupuesto = idPresupuesto;
        this.RangoInicial = RangoInicial;
        this.RangoFinal = RangoFinal;
        this.MontoTotal = MontoTotal;
        this.idTipoDeCredito = idTipoDeCredito;
    }

    toJSON() {
        return {
            idCreditos: this.idCreditos,
            idPresupuesto: this.idPresupuesto,
            RangoInicial: this.RangoInicial,
            RangoFinal: this.RangoFinal,
            MontoTotal: this.MontoTotal,
            idTipoDeCredito: this.idTipoDeCredito
        };
    }
}

module.exports = Credito;