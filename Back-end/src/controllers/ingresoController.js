const ingresoService = require('../services/ingresoService');

class IngresoController {
    
    // Crear ingreso
    async crearIngreso(req, res) {
        try {
            const { tipo, otroTipo, valor, descripcion, fecha } = req.body;
            const { idPresupuesto } = req.params;

            // Determinar tipo de monto final
            const tipoDeMonto = tipo;
            const tipoDeMontoDetalle = tipo === 'Otro' ? otroTipo.trim() : null;

            const ingresoData = {
                idPresupuesto: parseInt(idPresupuesto),
                tipoDeMonto: tipoDeMonto,
                tipoDeMontoDetalle: tipoDeMontoDetalle,
                monto: parseFloat(valor),
                descripcion: descripcion || '',
                fechaDeRegistro: fecha
            };

            const ingreso = await ingresoService.crearIngreso(ingresoData, req.user.nombreUsuario);
            
            res.status(201).json({
                success: true,
                message: 'Ingreso registrado exitosamente',
                data: ingreso
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener ingresos de un presupuesto
    async obtenerIngresosPorPresupuesto(req, res) {
        try {
            const { idPresupuesto } = req.params;
            
            const ingresos = await ingresoService.obtenerIngresosPorPresupuesto(
                idPresupuesto, 
                req.user.nombreUsuario
            );
            
            res.json({
                success: true,
                data: ingresos
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }

    // Actualizar ingreso
    async actualizarIngreso(req, res) {
        try {
            const { id } = req.params;
            const { descripcion, valor } = req.body;

            const ingresoData = {
                tipoDeMonto: descripcion,
                monto: parseFloat(valor),
                descripcion: descripcion
            };

            const ingreso = await ingresoService.actualizarIngreso(id, ingresoData, req.user.nombreUsuario);
            
            res.json({
                success: true,
                message: 'Ingreso actualizado correctamente',
                data: ingreso.toJSON()
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Eliminar ingreso
    async eliminarIngreso(req, res) {
        try {
            const { id } = req.params;
            
            await ingresoService.eliminarIngreso(id, req.user.nombreUsuario);
            
            res.json({
                success: true,
                message: 'Ingreso eliminado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener ingreso específico
    async obtenerIngreso(req, res) {
        try {
            const { id } = req.params;
            
            const ingreso = await ingresoService.obtenerIngreso(id, req.user.nombreUsuario);
            
            res.json({
                success: true,
                data: ingreso
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener total de ingresos por presupuesto
    async obtenerTotalIngresos(req, res) {
        try {
            const { idPresupuesto } = req.params;
            
            const total = await ingresoService.obtenerTotalIngresosPorPresupuesto(
                idPresupuesto, 
                req.user.nombreUsuario
            );
            
            res.json({
                success: true,
                data: { total }
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new IngresoController();