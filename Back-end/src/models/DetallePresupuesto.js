class DetallePresupuesto {
    constructor(idDetalle, idPresupuesto, categoria, tipo_movimiento, destino, monto, fecha_inicio, fecha_fin, nombre) {
        this.idDetalle = idDetalle;
        this.idPresupuesto = idPresupuesto;
        this.categoria = categoria;
        this.tipo_movimiento = tipo_movimiento;
        this.destino = destino;
        this.monto = monto;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.nombre = nombre;
    }

    toJSON() {
        return {
            idDetalle: this.idDetalle,
            idPresupuesto: this.idPresupuesto,
            categoria: this.categoria,
            tipo_movimiento: this.tipo_movimiento,
            destino: this.destino,
            monto: this.monto,
            fecha_inicio: this.fecha_inicio,
            fecha_fin: this.fecha_fin,
            nombre: this.nombre
        };
    }
}

module.exports = DetallePresupuesto;