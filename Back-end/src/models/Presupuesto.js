class Presupuesto {
    constructor(idPresupuesto, Fecha, idTipoPresupuesto, Dinero, Ahorros, NombreUsuario) {
        this.idPresupuesto = idPresupuesto;
        this.Fecha = Fecha;
        this.idTipoPresupuesto = idTipoPresupuesto;
        this.Dinero = Dinero;
        this.Ahorros = Ahorros;
        this.NombreUsuario = NombreUsuario;
    }

    toJSON() {
        return {
            idPresupuesto: this.idPresupuesto,
            Fecha: this.Fecha,
            idTipoPresupuesto: this.idTipoPresupuesto,
            Dinero: this.Dinero,
            Ahorros: this.Ahorros,
            NombreUsuario: this.NombreUsuario
        };
    }
}

module.exports = Presupuesto;