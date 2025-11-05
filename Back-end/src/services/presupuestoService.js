const presupuestoRepository = require('../repositories/presupuestoRepository');
const detallePresupuestoRepository = require('../repositories/detallePresupuestoRepository');
const ingresoRepository = require('../repositories/ingresoRepository');
const gastoRepository = require('../repositories/gastoRepository');

class PresupuestoService {
    
    // Crear presupuesto con detalle
    async crearPresupuestoConDetalle(presupuestoData, detalleData) {
        // Validaciones
        if (!detalleData.nombre || !detalleData.monto || !detalleData.fecha_inicio || !detalleData.fecha_fin || !detalleData.categoria) {
            throw new Error('Todos los campos obligatorios deben ser completados');
        }

        if (isNaN(detalleData.monto) || detalleData.monto <= 0) {
            throw new Error('El monto debe ser un número válido mayor a 0');
        }

        // Crear presupuesto
        const presupuesto = await presupuestoRepository.create(presupuestoData);
        
        // Crear detalle asociado al presupuesto
        const detalle = await detallePresupuestoRepository.create({
            ...detalleData,
            idPresupuesto: presupuesto.idPresupuesto,
            tipo_movimiento: 'Ingreso',
            destino: 'presupuestado'
        });

        return {
            presupuesto: presupuesto.toJSON(),
            detalle: detalle.toJSON()
        };
    }

    // Obtener presupuesto completo con detalles, ingresos y gastos
    async obtenerPresupuestoCompleto(idPresupuesto, nombreUsuario) {
        // Verificar que el presupuesto pertenece al usuario
        const presupuesto = await presupuestoRepository.findByIdAndUser(idPresupuesto, nombreUsuario);
        if (!presupuesto) {
            throw new Error('Presupuesto no encontrado o no tienes permiso');
        }

        // Obtener detalles, ingresos y gastos en paralelo
        const [detalles, ingresos, gastos] = await Promise.all([
            detallePresupuestoRepository.findByPresupuesto(idPresupuesto),
            ingresoRepository.findByPresupuesto(idPresupuesto),
            gastoRepository.findByPresupuesto(idPresupuesto)
        ]);

        // Calcular totales
        const totalIngresos = ingresos.reduce((sum, ingreso) => sum + parseFloat(ingreso.Monto), 0);
        const totalGastos = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.Monto), 0);
        const balance = totalIngresos - totalGastos;

        return {
            presupuesto: presupuesto.toJSON(),
            detalles: detalles.map(d => d.toJSON()),
            ingresos: ingresos.map(i => i.toJSON()),
            gastos: gastos.map(g => g.toJSON()),
            totales: {
                ingresos: totalIngresos,
                gastos: totalGastos,
                balance: balance
            }
        };
    }

    // Actualizar presupuesto
    async actualizarPresupuesto(idPresupuesto, nombreUsuario, presupuestoData) {
        const actualizado = await presupuestoRepository.update(idPresupuesto, nombreUsuario, presupuestoData);
        if (!actualizado) {
            throw new Error('Error al actualizar el presupuesto');
        }
        return await this.obtenerPresupuestoCompleto(idPresupuesto, nombreUsuario);
    }

    // Eliminar presupuesto
    async eliminarPresupuesto(idPresupuesto, nombreUsuario) {
        const eliminado = await presupuestoRepository.delete(idPresupuesto, nombreUsuario);
        if (!eliminado) {
            throw new Error('Error al eliminar el presupuesto');
        }
        return true;
    }

    // Obtener todos los presupuestos de un usuario
    async obtenerPresupuestosPorUsuario(nombreUsuario) {
        const presupuestos = await presupuestoRepository.findByUser(nombreUsuario);
        
        // Para cada presupuesto, obtener detalles básicos
        const presupuestosConDetalles = await Promise.all(
            presupuestos.map(async (presupuesto) => {
                const detalles = await detallePresupuestoRepository.findByPresupuesto(presupuesto.idPresupuesto);
                return {
                    ...presupuesto.toJSON(),
                    detalles: detalles.map(d => d.toJSON())
                };
            })
        );

        return presupuestosConDetalles;
    }
}

module.exports = new PresupuestoService();