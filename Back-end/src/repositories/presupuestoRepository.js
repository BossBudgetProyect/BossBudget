const db = require('../config/database');
const Presupuesto = require('../models/Presupuesto');

class PresupuestoRepository {
    
    // Crear presupuesto
    async create(presupuestoData) {
        const [result] = await db.execute(
            'INSERT INTO presupuesto (Fecha, idTipoPresupuesto, Dinero, Ahorros, NombreUsuario) VALUES (?, ?, ?, ?, ?)',
            [
                presupuestoData.fecha,
                presupuestoData.idTipoPresupuesto,
                presupuestoData.dinero,
                presupuestoData.ahorros,
                presupuestoData.nombreUsuario
            ]
        );
        
        return new Presupuesto(
            result.insertId,
            presupuestoData.fecha,
            presupuestoData.idTipoPresupuesto,
            presupuestoData.dinero,
            presupuestoData.ahorros,
            presupuestoData.nombreUsuario
        );
    }

    // Obtener presupuesto por ID y usuario
    async findByIdAndUser(idPresupuesto, nombreUsuario) {
        const [rows] = await db.execute(
            'SELECT * FROM presupuesto WHERE idPresupuesto = ? AND NombreUsuario = ?',
            [idPresupuesto, nombreUsuario]
        );
        
        if (rows.length === 0) return null;
        
        const presupuesto = rows[0];
        return new Presupuesto(
            presupuesto.idPresupuesto,
            presupuesto.Fecha,
            presupuesto.idTipoPresupuesto,
            presupuesto.Dinero,
            presupuesto.Ahorros,
            presupuesto.NombreUsuario
        );
    }

    // Obtener todos los presupuestos de un usuario
    async findByUser(nombreUsuario) {
        const [rows] = await db.execute(
            'SELECT * FROM presupuesto WHERE NombreUsuario = ? ORDER BY Fecha DESC',
            [nombreUsuario]
        );
        
        return rows.map(row => new Presupuesto(
            row.idPresupuesto,
            row.Fecha,
            row.idTipoPresupuesto,
            row.Dinero,
            row.Ahorros,
            row.NombreUsuario
        ));
    }

    // Actualizar presupuesto
    async update(idPresupuesto, nombreUsuario, presupuestoData) {
        const [result] = await db.execute(
            'UPDATE presupuesto SET Fecha = ?, idTipoPresupuesto = ?, Dinero = ?, Ahorros = ? WHERE idPresupuesto = ? AND NombreUsuario = ?',
            [
                presupuestoData.fecha,
                presupuestoData.idTipoPresupuesto,
                presupuestoData.dinero,
                presupuestoData.ahorros,
                idPresupuesto,
                nombreUsuario
            ]
        );
        
        return result.affectedRows > 0;
    }

    // Eliminar presupuesto
    async delete(idPresupuesto, nombreUsuario) {
        const [result] = await db.execute(
            'DELETE FROM presupuesto WHERE idPresupuesto = ? AND NombreUsuario = ?',
            [idPresupuesto, nombreUsuario]
        );
        
        return result.affectedRows > 0;
    }
}

module.exports = new PresupuestoRepository();