const db = require('../config/database');
const Ingreso = require('../models/Ingreso');

class IngresoRepository {
    
    // Crear ingreso
    async create(ingresoData) {
        const [result] = await db.execute(
            `INSERT INTO ingresos 
             (idPresupuesto, TipoDeMonto, TipoDeMontoDetalle, Monto, Descripcion, FechaDeRegistro) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                ingresoData.idPresupuesto,
                ingresoData.tipoDeMonto,
                ingresoData.tipoDeMontoDetalle,
                ingresoData.monto,
                ingresoData.descripcion,
                ingresoData.fechaDeRegistro
            ]
        );
        
        return new Ingreso(
            result.insertId,
            ingresoData.idPresupuesto,
            ingresoData.fechaDeRegistro,
            ingresoData.monto,
            ingresoData.tipoDeMonto,
            ingresoData.descripcion,
            ingresoData.tipoDeMontoDetalle
        );
    }

    // Obtener ingresos por presupuesto
    async findByPresupuesto(idPresupuesto) {
        const [rows] = await db.execute(
            'SELECT * FROM ingresos WHERE idPresupuesto = ? ORDER BY FechaDeRegistro DESC',
            [idPresupuesto]
        );
        
        return rows.map(row => new Ingreso(
            row.idIngresos,
            row.idPresupuesto,
            row.FechaDeRegistro,
            parseFloat(row.Monto),
            row.TipoDeMonto,
            row.Descripcion,
            row.TipoDeMontoDetalle
        ));
    }

    // Obtener ingreso por ID
    async findById(idIngresos) {
        const [rows] = await db.execute(
            'SELECT * FROM ingresos WHERE idIngresos = ?',
            [idIngresos]
        );
        
        if (rows.length === 0) return null;
        
        const ingreso = rows[0];
        return new Ingreso(
            ingreso.idIngresos,
            ingreso.idPresupuesto,
            ingreso.FechaDeRegistro,
            parseFloat(ingreso.Monto),
            ingreso.TipoDeMonto,
            ingreso.Descripcion,
            ingreso.TipoDeMontoDetalle
        );
    }

    // Actualizar ingreso
    async update(idIngresos, ingresoData) {
        const [result] = await db.execute(
            'UPDATE ingresos SET TipoDeMonto = ?, Monto = ?, Descripcion = ? WHERE idIngresos = ?',
            [
                ingresoData.tipoDeMonto,
                ingresoData.monto,
                ingresoData.descripcion,
                idIngresos
            ]
        );
        
        return result.affectedRows > 0;
    }

    // Eliminar ingreso
    async delete(idIngresos) {
        const [result] = await db.execute(
            'DELETE FROM ingresos WHERE idIngresos = ?',
            [idIngresos]
        );
        
        return result.affectedRows > 0;
    }

    // Verificar que el ingreso pertenece a un presupuesto del usuario
    async verificarPropiedad(idIngresos, nombreUsuario) {
        const [rows] = await db.execute(
            `SELECT i.idIngresos 
             FROM ingresos i
             INNER JOIN presupuesto p ON i.idPresupuesto = p.idPresupuesto
             WHERE i.idIngresos = ? AND p.NombreUsuario = ?`,
            [idIngresos, nombreUsuario]
        );
        
        return rows.length > 0;
    }
}

module.exports = new IngresoRepository();