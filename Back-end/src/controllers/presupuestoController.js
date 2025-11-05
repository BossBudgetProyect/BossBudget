const presupuestoService = require('../services/presupuestoService');

class PresupuestoController {
    
    // Crear presupuesto
    async crearPresupuesto(req, res) {
        try {
            const { nombre, valor, fecha_inicio, fecha_fin, categoria, otraCategoria } = req.body;
            
            // Determinar categoría final
            const categoriaFinal = categoria === 'Otros' && otraCategoria?.trim() !== '' 
                ? otraCategoria.trim() 
                : categoria;

            // Datos para el presupuesto
            const presupuestoData = {
                fecha: new Date(),
                idTipoPresupuesto: 2, // Mensual por defecto
                dinero: 0,
                ahorros: 0,
                nombreUsuario: req.user.nombreUsuario // Del JWT
            };

            // Datos para el detalle
            const detalleData = {
                nombre: nombre,
                monto: parseFloat(valor),
                fecha_inicio: fecha_inicio,
                fecha_fin: fecha_fin,
                categoria: categoriaFinal
            };

            const resultado = await presupuestoService.crearPresupuestoConDetalle(presupuestoData, detalleData);
            
            res.status(201).json({
                success: true,
                message: 'Presupuesto creado correctamente',
                data: resultado
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener presupuesto completo
    async obtenerPresupuesto(req, res) {
        try {
            const { id } = req.params;
            const resultado = await presupuestoService.obtenerPresupuestoCompleto(
                id, 
                req.user.nombreUsuario
            );
            
            res.json({
                success: true,
                data: resultado
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener todos los presupuestos del usuario
    async obtenerPresupuestosUsuario(req, res) {
        try {
            const presupuestos = await presupuestoService.obtenerPresupuestosPorUsuario(req.user.nombreUsuario);
            
            res.json({
                success: true,
                data: presupuestos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Actualizar presupuesto
    async actualizarPresupuesto(req, res) {
        try {
            const { id } = req.params;
            const { nombre, monto, fecha_inicio, fecha_fin } = req.body;
            
            // En una implementación real, aquí actualizarías el detalle del presupuesto
            // Por simplicidad, asumimos que se actualiza el primer detalle
            const resultado = await presupuestoService.actualizarPresupuesto(
                id,
                req.user.nombreUsuario,
                req.body
            );
            
            res.json({
                success: true,
                message: 'Presupuesto actualizado correctamente',
                data: resultado
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Eliminar presupuesto
    async eliminarPresupuesto(req, res) {
        try {
            const { id } = req.params;
            
            await presupuestoService.eliminarPresupuesto(id, req.user.nombreUsuario);
            
            res.json({
                success: true,
                message: 'Presupuesto eliminado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new PresupuestoController();