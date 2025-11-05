class Cuenta {
    constructor(idCuentas, Banco, Monto, idPresupuesto) {
        this.idCuentas = idCuentas;
        this.Banco = Banco;
        this.Monto = Monto;
        this.idPresupuesto = idPresupuesto;
    }

    toJSON() {
        return {
            idCuentas: this.idCuentas,
            Banco: this.Banco,
            Monto: this.Monto,
            idPresupuesto: this.idPresupuesto
        };
    }
}

module.exports = Cuenta;