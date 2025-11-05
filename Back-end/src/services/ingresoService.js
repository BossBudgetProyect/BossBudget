const ingresoRepository = require('../repositories/ingresoRepository');
const presupuestoRepository = require('../repositories/presupuestoRepository');

class IngresoService {
    
    // Crear ingreso
    async crearIngreso(ingresoData, nombreUsuario) {
        // Validaciones
        if (!ingresoData.monto || isNaN(ingresoData.monto) || ingresoData.monto <= 0) {
            throw new Error('El monto debe ser un número válido mayor a 0');
        }

        if (!ingresoData.tipoDeMonto) {
            throw new Error('El tipo de ingreso es requerido');
        }

        // Verificar que el presupuesto pertenece al usuario
        const presupuesto = await presupuestoRepository.findByIdAndUser(
            ingresoData.idPresupuesto, 
            nombreUsuario
        );
        
        if (!presupuesto) {
            throw new Error('Presupuesto no encontrado o no tienes permiso');
        }

        // Si es tipo "Otro", validar el detalle
        if (ingresoData.tipoDeMonto === 'Otro' && (!ingresoData.tipoDeMontoDetalle || ingresoData.tipoDeMontoDetalle.trim() === '')) {
            throw new Error('Debe especificar el tipo de ingreso');
        }

        // Usar fecha actual si no se proporciona
        const fechaRegistro = ingresoData.fechaDeRegistro || new Date();

        const ingreso = await ingresoRepository.create({
            ...ingresoData,
            fechaDeRegistro: fechaRegistro
        });

        return ingreso.toJSON();
    }

    // Obtener ingresos por presupuesto
    async obtenerIngresosPorPresupuesto(idPresupuesto, nombreUsuario) {
        // Verificar que el presupuesto pertenece al usuario
        const presupuesto = await presupuestoRepository.findByIdAndUser(idPresupuesto, nombreUsuario);
        if (!presupuesto) {
            throw new Error('Presupuesto no encontrado o no tienes permiso');
        }

        const ingresos = await ingresoRepository.findByPresupuesto(idPresupuesto);
        return ingresos.map(ingreso => ingreso.toJSON());
    }

    // Actualizar ingreso
    async actualizarIngreso(idIngresos, ingresoData, nombreUsuario) {
        // Verificar que el ingreso pertenece al usuario
        const tienePermiso = await ingresoRepository.verificarPropiedad(idIngresos, nombreUsuario);
        if (!tienePermiso) {
            throw new Error('Ingreso no encontrado o no tienes permiso');
        }

        const actualizado = await ingresoRepository.update(idIngresos, ingresoData);
        if (!actualizado) {
            throw new Error('Error al actualizar el ingreso');
        }

        return await ingresoRepository.findById(idIngresos);
    }

    // Eliminar ingreso
    async eliminarIngreso(idIngresos, nombreUsuario) {
        // Verificar que el ingreso pertenece al usuario
        const tienePermiso = await ingresoRepository.verificarPropiedad(idIngresos, nombreUsuario);
        if (!tienePermiso) {
            throw new Error('Ingreso no encontrado o no tienes permiso');
        }

        const eliminado = await ingresoRepository.delete(idIngresos);
        if (!eliminado) {
            throw new Error('Error al eliminar el ingreso');
        }

        return true;
    }

    // Obtener ingreso específico
    async obtenerIngreso(idIngresos, nombreUsuario) {
        // Verificar que el ingreso pertenece al usuario
        const tienePermiso = await ingresoRepository.verificarPropiedad(idIngresos, nombreUsuario);
        if (!tienePermiso) {
            throw new Error('Ingreso no encontrado o no tienes permiso');
        }

        const ingreso = await ingresoRepository.findById(idIngresos);
        if (!ingreso) {
            throw new Error('Ingreso no encontrado');
        }

        return ingreso.toJSON();
    }

    // Obtener total de ingresos por presupuesto
    async obtenerTotalIngresosPorPresupuesto(idPresupuesto, nombreUsuario) {
        const ingresos = await this.obtenerIngresosPorPresupuesto(idPresupuesto, nombreUsuario);
        return ingresos.reduce((total, ingreso) => total + parseFloat(ingreso.Monto), 0);
    }
}

module.exports = new IngresoService();