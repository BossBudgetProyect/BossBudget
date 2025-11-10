const Presupuestos = {
  async cargarPresupuestos() {
    try {
      console.log('📊 Cargando presupuestos...');
      
      const response = await fetch('https://stunning-train-69wj9qqxwvxj3r4vr-3000.app.github.dev/api/presupuestos', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Error en la respuesta');
      
      const result = await response.json();
      console.log('✅ Presupuestos cargados:', result.data.length);
      
      this.renderizarPresupuestos(result.data || []);
      this.actualizarContador(result.data.length);
      
    } catch (error) {
      console.error('❌ Error cargando presupuestos:', error);
      Alertas.showAlert('Error', 'No se pudieron cargar los presupuestos', 'error');
    }
  },

  renderizarPresupuestos(presupuestos) {
    const container = document.getElementById('budgetsContainer');
    
    if (!presupuestos || presupuestos.length === 0) {
      container.innerHTML = this.getHTMLSinPresupuestos();
      return;
    }
    
    container.innerHTML = presupuestos.map(presupuesto => this.getHTMLPresupuesto(presupuesto)).join('');
  },

  getHTMLPresupuesto(presupuesto) {
    const total = Number(presupuesto.totalPresupuesto) || 0;
    const gastado = Number(presupuesto.totalGastado) || 0;
    const porcentaje = total > 0 ? (gastado / total) * 100 : 0;
    let color = 'bg-green-500';
    if (porcentaje >= 75) color = 'bg-red-500';
    else if (porcentaje >= 50) color = 'bg-yellow-400';

    return `
      <div class="presupuesto-card bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-5">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-gray-800">${presupuesto.nombre}</h3>
            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Activo</span>
          </div>
          
          <div class="mt-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Gastado: $${gastado.toLocaleString()}</span>
              <span>Total: $${total.toLocaleString()}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="${color} h-2.5 rounded-full" style="width: ${porcentaje}%"></div>
            </div>
            <p class="text-xs text-right text-gray-500 mt-1">${porcentaje.toFixed(1)}% usado</p>
          </div>
          
          <div class="flex justify-between mt-4 text-sm">
            <span class="text-gray-500">${presupuesto.fecha_inicio}</span>
            <span class="text-gray-500">${presupuesto.fecha_fin}</span>
          </div>
        </div>
        
        <div class="bg-gray-50 px-5 py-3 flex justify-between items-center">
          <a href="/presupuesto/${presupuesto.idPresupuesto}" class="text-blue-600 hover:text-blue-800 font-medium text-sm">Ver Detalle</a>
          <div class="flex space-x-2">
            <button onclick="Modales.openEditBudgetModal(
              '${presupuesto.idPresupuesto}',
              '${presupuesto.nombre}',
              '${presupuesto.totalPresupuesto}',
              '${presupuesto.fecha_inicio}',
              '${presupuesto.fecha_fin}'
            )" class="text-gray-500 hover:text-yellow-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button onclick="Modales.openDeleteBudgetModal('${presupuesto.idPresupuesto}')" class="text-gray-500 hover:text-red-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  getHTMLSinPresupuestos() {
    return `
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No tienes presupuestos</h3>
        <p class="mt-1 text-gray-500">Comienza creando tu primer presupuesto para gestionar tus finanzas.</p>
        <div class="mt-6">
          <a href="/crearPresupuesto" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Presupuesto
          </a>
        </div>
      </div>
    `;
  },

  actualizarContador(cantidad) {
    const contadorElement = document.querySelector('.bg-green-500 + p.text-2xl');
    if (contadorElement) {
      contadorElement.textContent = cantidad;
    }
  }
};