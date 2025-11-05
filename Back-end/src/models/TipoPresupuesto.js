class TipoPresupuesto {
    constructor(idTipoPresupuesto, TipoDePresupuesto) {
        this.idTipoPresupuesto = idTipoPresupuesto;
        this.TipoDePresupuesto = TipoDePresupuesto;
    }

    toJSON() {
        return {
            idTipoPresupuesto: this.idTipoPresupuesto,
            TipoDePresupuesto: this.TipoDePresupuesto
        };
    }
}

module.exports = TipoPresupuesto;