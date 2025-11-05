const gastoRepository = require('../repositories/gastoRepository');
const presupuestoRepository = require('../repositories/presupuestoRepository');

class GastoService {
    
    // Crear gasto
    async crearGasto(gastoData, nombreUsuario) {
        // Validaciones
        if (!gastoData.monto || isNaN(gastoData.monto) || gastoData.monto <= 0) {
            throw new Error('El monto debe ser un número válido mayor a 0');
        }

        if (!gastoData.tipoDeMonto) {
            throw new Error('El tipo de gasto es requerido');
        }

        // Verificar que el presupuesto pertenece al usuario
        const presupuesto = await presupuestoRepository.findByIdAndUser(
            gastoData.idPresupuesto, 
            nombreUsuario
        );
        
        if (!presupuesto) {
            throw new Error('Presupuesto no encontrado o no tienes permiso');
        }

        // Si es tipo "Otro", validar el detalle
        if (gastoData.tipoDeMonto === 'Otro' && (!gastoData.tipoDeMontoDetalle || gastoData.tipoDeMontoDetalle.trim() === '')) {
            throw new Error('Debe especificar el tipo de gasto');
        }

        // Usar fecha actual si no se proporciona
        const fechaRegistro = gastoData.fechaDeRegistro || new Date();

        const gasto = await gastoRepository.create({
            ...gastoData,
            fechaDeRegistro: fechaRegistro
        });

        return gasto.toJSON();
    }

    // Obtener gastos por presupuesto
    async obtenerGastosPorPresupuesto(idPresupuesto, nombreUsuario) {
        // Verificar que el presupuesto pertenece al usuario
        const presupuesto = await presupuestoRepository.findByIdAndUser(idPresupuesto, nombreUsuario);
        if (!presupuesto) {
            throw new Error('Presupuesto no encontrado o no tienes permiso');
        }

        const gastos = await gastoRepository.findByPresupuesto(idPresupuesto);
        return gastos.map(gasto => gasto.toJSON());
    }

    // Actualizar gasto
    async actualizarGasto(idGastos, gastoData, nombreUsuario) {
        // Verificar que el gasto pertenece al usuario
        const tienePermiso = await gastoRepository.verificarPropiedad(idGastos, nombreUsuario);
        if (!tienePermiso) {
            throw new Error('Gasto no encontrado o no tienes permiso');
        }

        const actualizado = await gastoRepository.update(idGastos, gastoData);
        if (!actualizado) {
            throw new Error('Error al actualizar el gasto');
        }

        return await gastoRepository.findById(idGastos);
    }

    // Eliminar gasto
    async eliminarGasto(idGastos, nombreUsuario) {
        // Verificar que el gasto pertenece al usuario
        const tienePermiso = await gastoRepository.verificarPropiedad(idGastos, nombreUsuario);
        if (!tienePermiso) {
            throw new Error('Gasto no encontrado o no tienes permiso');
        }

        const eliminado = await gastoRepository.delete(idGastos);
        if (!eliminado) {
            throw new Error('Error al eliminar el gasto');
        }

        return true;
    }

    // Obtener gasto específico
    async obtenerGasto(idGastos, nombreUsuario) {
        // Verificar que el gasto pertenece al usuario
        const tienePermiso = await gastoRepository.verificarPropiedad(idGastos, nombreUsuario);
        if (!tienePermiso) {
            throw new Error('Gasto no encontrado o no tienes permiso');
        }

        const gasto = await gastoRepository.findById(idGastos);
        if (!gasto) {
            throw new Error('Gasto no encontrado');
        }

        return gasto.toJSON();
    }
}

module.exports = new GastoService();