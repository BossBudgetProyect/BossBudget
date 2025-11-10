// ✅ COMPARTIDO - Funciona en TODAS las vistas
const Alertas = {
  showAlert(title, message, icon, callback = null) {
    if (typeof Swal === 'undefined') {
      alert(`${title}: ${message}`);
      if (callback) callback();
      return;
    }

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    if (icon === 'success' && title.includes('éxito')) {
      Swal.fire({
        title: '🎉 ' + title,
        text: message,
        icon: 'success',
        confirmButtonText: '¡Genial!',
        confirmButtonColor: '#10b981',
        background: '#f0fdf4',
        iconColor: '#10b981',
        timer: 3000,
        timerProgressBar: true,
        willClose: callback
      });
    } else if (icon === 'error') {
      Swal.fire({
        title: '❌ ' + title,
        text: message,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        background: '#fef2f2',
        iconColor: '#ef4444'
      });
    } else {
      Toast.fire({ icon: icon, title: message });
    }
  },

  showLoading(title = 'Cargando...', text = 'Por favor espera') {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: title,
        text: text,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
    }
  },

  closeLoading() {
    if (typeof Swal !== 'undefined') {
      Swal.close();
    }
  }
};