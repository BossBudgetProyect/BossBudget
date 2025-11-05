const db = require('../config/database');
const Gasto = require('../models/Gasto');

class GastoRepository {
    
    // Crear gasto
    async create(gastoData) {
        const [result] = await db.execute(
            `INSERT INTO gastos 
             (idPresupuesto, TipoDeMonto, TipoDeMontoDetalle, Monto, Descripcion, FechaDeRegistro) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                gastoData.idPresupuesto,
                gastoData.tipoDeMonto,
                gastoData.tipoDeMontoDetalle,
                gastoData.monto,
                gastoData.descripcion,
                gastoData.fechaDeRegistro
            ]
        );
        
        return new Gasto(
            result.insertId,
            gastoData.idPresupuesto,
            gastoData.fechaDeRegistro,
            gastoData.monto,
            gastoData.tipoDeMonto,
            gastoData.descripcion,
            gastoData.tipoDeMontoDetalle
        );
    }

    // Obtener gastos por presupuesto
    async findByPresupuesto(idPresupuesto) {
        const [rows] = await db.execute(
            'SELECT * FROM gastos WHERE idPresupuesto = ? ORDER BY FechaDeRegistro DESC',
            [idPresupuesto]
        );
        
        return rows.map(row => new Gasto(
            row.idGastos,
            row.idPresupuesto,
            row.FechaDeRegistro,
            parseFloat(row.Monto),
            row.TipoDeMonto,
            row.Descripcion,
            row.TipoDeMontoDetalle
        ));
    }

    // Obtener gasto por ID
    async findById(idGastos) {
        const [rows] = await db.execute(
            'SELECT * FROM gastos WHERE idGastos = ?',
            [idGastos]
        );
        
        if (rows.length === 0) return null;
        
        const gasto = rows[0];
        return new Gasto(
            gasto.idGastos,
            gasto.idPresupuesto,
            gasto.FechaDeRegistro,
            parseFloat(gasto.Monto),
            gasto.TipoDeMonto,
            gasto.Descripcion,
            gasto.TipoDeMontoDetalle
        );
    }

    // Actualizar gasto
    async update(idGastos, gastoData) {
        const [result] = await db.execute(
            'UPDATE gastos SET TipoDeMonto = ?, Monto = ?, Descripcion = ? WHERE idGastos = ?',
            [
                gastoData.tipoDeMonto,
                gastoData.monto,
                gastoData.descripcion,
                idGastos
            ]
        );
        
        return result.affectedRows > 0;
    }

    // Eliminar gasto
    async delete(idGastos) {
        const [result] = await db.execute(
            'DELETE FROM gastos WHERE idGastos = ?',
            [idGastos]
        );
        
        return result.affectedRows > 0;
    }

    // Verificar que el gasto pertenece a un presupuesto del usuario
    async verificarPropiedad(idGastos, nombreUsuario) {
        const [rows] = await db.execute(
            `SELECT g.idGastos 
             FROM gastos g
             INNER JOIN presupuesto p ON g.idPresupuesto = p.idPresupuesto
             WHERE g.idGastos = ? AND p.NombreUsuario = ?`,
            [idGastos, nombreUsuario]
        );
        
        return rows.length > 0;
    }
}

module.exports = new GastoRepository();