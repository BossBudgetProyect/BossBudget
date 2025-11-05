const db = require('../config/database');
const DetallePresupuesto = require('../models/DetallePresupuesto');

class DetallePresupuestoRepository {
    
    // Crear detalle de presupuesto
    async create(detalleData) {
        const [result] = await db.execute(
            `INSERT INTO detallepresupuesto 
             (idPresupuesto, categoria, tipo_movimiento, destino, monto, fecha_inicio, fecha_fin, nombre) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                detalleData.idPresupuesto,
                detalleData.categoria,
                detalleData.tipo_movimiento,
                detalleData.destino,
                detalleData.monto,
                detalleData.fecha_inicio,
                detalleData.fecha_fin,
                detalleData.nombre
            ]
        );
        
        return new DetallePresupuesto(
            result.insertId,
            detalleData.idPresupuesto,
            detalleData.categoria,
            detalleData.tipo_movimiento,
            detalleData.destino,
            detalleData.monto,
            detalleData.fecha_inicio,
            detalleData.fecha_fin,
            detalleData.nombre
        );
    }

    // Obtener detalles por presupuesto
    async findByPresupuesto(idPresupuesto) {
        const [rows] = await db.execute(
            'SELECT * FROM detallepresupuesto WHERE idPresupuesto = ?',
            [idPresupuesto]
        );
        
        return rows.map(row => new DetallePresupuesto(
            row.idDetalle,
            row.idPresupuesto,
            row.categoria,
            row.tipo_movimiento,
            row.destino,
            parseFloat(row.monto),
            row.fecha_inicio,
            row.fecha_fin,
            row.nombre
        ));
    }

    // Actualizar detalle
    async update(idDetalle, detalleData) {
        const [result] = await db.execute(
            `UPDATE detallepresupuesto 
             SET nombre = ?, monto = ?, fecha_inicio = ?, fecha_fin = ?, categoria = ?
             WHERE idDetalle = ?`,
            [
                detalleData.nombre,
                detalleData.monto,
                detalleData.fecha_inicio,
                detalleData.fecha_fin,
                detalleData.categoria,
                idDetalle
            ]
        );
        
        return result.affectedRows > 0;
    }
}

module.exports = new DetallePresupuestoRepository();