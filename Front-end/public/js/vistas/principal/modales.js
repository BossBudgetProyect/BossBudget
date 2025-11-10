const Modales = {
  currentBudgetId: null,

  openDeleteBudgetModal(idPresupuesto) {
    this.currentBudgetId = idPresupuesto;
    document.getElementById('deleteModal').style.display = 'flex';
  },

  openEditBudgetModal(idPresupuesto, nombre, monto, fecha_inicio, fecha_fin) {
    this.currentBudgetId = idPresupuesto;
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const parts = dateString.split(/[/-]/);
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return '';
      }
      return date.toISOString().split('T')[0];
    };

    document.getElementById('editBudgetId').value = idPresupuesto;
    document.getElementById('editBudgetName').value = nombre || '';
    document.getElementById('editBudgetAmount').value = monto || '';
    document.getElementById('editBudgetStartDate').value = formatDate(fecha_inicio);
    document.getElementById('editBudgetEndDate').value = formatDate(fecha_fin);
    
    document.getElementById('editModal').style.display = 'flex';
  },

  closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    this.currentBudgetId = null;
  },

  closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    this.currentBudgetId = null;
  },

  inicializarEventos() {
    // Manejar clic fuera del modal
    window.onclick = (event) => {
      if (event.target.className === 'modal') {
        this.closeDeleteModal();
        this.closeEditModal();
      }
    };

    // Evento para formulario de edición
    document.getElementById('editBudgetForm').addEventListener('submit', (e) => this.handleEditSubmit(e));
    
    // Evento para botón de eliminar
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.handleDelete());
  },

  async handleEditSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="animate-spin">⏳</i> Procesando...';
    submitBtn.disabled = true;
    
    const formData = {
      idPresupuesto: document.getElementById('editBudgetId').value,
      nombre: document.getElementById('editBudgetName').value,
      monto: document.getElementById('editBudgetAmount').value,
      fecha_inicio: document.getElementById('editBudgetStartDate').value,
      fecha_fin: document.getElementById('editBudgetEndDate').value
    };

    if (!formData.nombre || !formData.monto || !formData.fecha_inicio || !formData.fecha_fin) {
      Alertas.showAlert('Campos incompletos', 'Por favor completa todos los campos requeridos', 'warning');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }

    Alertas.showLoading('Actualizando presupuesto...', 'Guardando los cambios');
    
    try {
      const response = await fetch(`/api/presupuestos/${formData.idPresupuesto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      Alertas.closeLoading();

      if (data.success) {
        Alertas.showAlert('¡Presupuesto Actualizado!', '🎊 Los cambios se han guardado correctamente', 'success', () => {
          location.reload();
        });
      } else {
        throw new Error(data.message || 'Error al actualizar el presupuesto');
      }
    } catch (error) {
      Alertas.closeLoading();
      console.error('Error:', error);
      Alertas.showAlert('Error al actualizar', error.message || 'No se pudo actualizar el presupuesto', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  },

  async handleDelete() {
    if (!this.currentBudgetId) return;
    
    const deleteBtn = document.getElementById('confirmDeleteBtn');
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<i class="animate-spin">⏳</i> Eliminando...';
    deleteBtn.disabled = true;

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      Alertas.showLoading('Eliminando presupuesto...', 'Por favor espera');

      try {
        const response = await fetch(`/api/presupuestos/${this.currentBudgetId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const data = await response.json();
        Alertas.closeLoading();

        if (data.success) {
          Alertas.showAlert('¡Presupuesto Eliminado!', '🗑️ El presupuesto ha sido eliminado correctamente', 'success', () => {
            location.reload();
          });
        } else {
          throw new Error(data.message || 'Error al eliminar el presupuesto');
        }
      } catch (error) {
        Alertas.closeLoading();
        console.error('Error:', error);
        Alertas.showAlert('Error al eliminar', error.message || 'No se pudo eliminar el presupuesto', 'error');
      }
    }

    deleteBtn.innerHTML = originalText;
    deleteBtn.disabled = false;
    this.closeDeleteModal();
  }
};