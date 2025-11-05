class Gasto {
    constructor(idGastos, idPresupuesto, FechaDeRegistro, Monto, TipoDeMonto, Descripcion, TipoDeMontoDetalle) {
        this.idGastos = idGastos;
        this.idPresupuesto = idPresupuesto;
        this.FechaDeRegistro = FechaDeRegistro;
        this.Monto = Monto;
        this.TipoDeMonto = TipoDeMonto;
        this.Descripcion = Descripcion;
        this.TipoDeMontoDetalle = TipoDeMontoDetalle;
    }

    toJSON() {
        return {
            idGastos: this.idGastos,
            idPresupuesto: this.idPresupuesto,
            FechaDeRegistro: this.FechaDeRegistro,
            Monto: this.Monto,
            TipoDeMonto: this.TipoDeMonto,
            Descripcion: this.Descripcion,
            TipoDeMontoDetalle: this.TipoDeMontoDetalle
        };
    }
}

module.exports = Gasto;