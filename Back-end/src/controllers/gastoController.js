const gastoService = require('../services/gastoService');

class GastoController {
    
    // Crear gasto
    async crearGasto(req, res) {
        try {
            const { tipo, otroTipo, valor, descripcion, fecha } = req.body;
            const { idPresupuesto } = req.params;

            // Determinar tipo de monto final
            const tipoDeMonto = tipo;
            const tipoDeMontoDetalle = tipo === 'Otro' ? otroTipo.trim() : null;

            const gastoData = {
                idPresupuesto: parseInt(idPresupuesto),
                tipoDeMonto: tipoDeMonto,
                tipoDeMontoDetalle: tipoDeMontoDetalle,
                monto: parseFloat(valor),
                descripcion: descripcion || '',
                fechaDeRegistro: fecha
            };

            const gasto = await gastoService.crearGasto(gastoData, req.user.nombreUsuario);
            
            res.status(201).json({
                success: true,
                message: 'Gasto registrado exitosamente',
                data: gasto
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener gastos de un presupuesto
    async obtenerGastosPorPresupuesto(req, res) {
        try {
            const { idPresupuesto } = req.params;
            
            const gastos = await gastoService.obtenerGastosPorPresupuesto(
                idPresupuesto, 
                req.user.nombreUsuario
            );
            
            res.json({
                success: true,
                data: gastos
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }

    // Actualizar gasto
    async actualizarGasto(req, res) {
        try {
            const { id } = req.params;
            const { descripcion, valor } = req.body;

            const gastoData = {
                tipoDeMonto: descripcion,
                monto: parseFloat(valor),
                descripcion: descripcion
            };

            const gasto = await gastoService.actualizarGasto(id, gastoData, req.user.nombreUsuario);
            
            res.json({
                success: true,
                message: 'Gasto actualizado correctamente',
                data: gasto.toJSON()
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Eliminar gasto
    async eliminarGasto(req, res) {
        try {
            const { id } = req.params;
            
            await gastoService.eliminarGasto(id, req.user.nombreUsuario);
            
            res.json({
                success: true,
                message: 'Gasto eliminado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener gasto específico
    async obtenerGasto(req, res) {
        try {
            const { id } = req.params;
            
            const gasto = await gastoService.obtenerGasto(id, req.user.nombreUsuario);
            
            res.json({
                success: true,
                data: gasto
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new GastoController();