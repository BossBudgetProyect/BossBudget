class Ingreso {
    constructor(idIngresos, idPresupuesto, FechaDeRegistro, Monto, TipoDeMonto, Descripcion, TipoDeMontoDetalle) {
        this.idIngresos = idIngresos;
        this.idPresupuesto = idPresupuesto;
        this.FechaDeRegistro = FechaDeRegistro;
        this.Monto = Monto;
        this.TipoDeMonto = TipoDeMonto;
        this.Descripcion = Descripcion;
        this.TipoDeMontoDetalle = TipoDeMontoDetalle;
    }

    toJSON() {
        return {
            idIngresos: this.idIngresos,
            idPresupuesto: this.idPresupuesto,
            FechaDeRegistro: this.FechaDeRegistro,
            Monto: this.Monto,
            TipoDeMonto: this.TipoDeMonto,
            Descripcion: this.Descripcion,
            TipoDeMontoDetalle: this.TipoDeMontoDetalle
        };
    }
}

module.exports = Ingreso;