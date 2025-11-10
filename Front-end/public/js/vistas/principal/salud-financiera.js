const SaludFinanciera = {
  actualizarSaludFinanciera(puntaje) {
    const barra = document.getElementById('saludBar');
    const label = document.getElementById('saludLabel');
    
    if (!barra || !label) return;
    
    barra.style.width = `${puntaje}%`;
    
    if (puntaje < 25) {
      barra.className = 'bg-red-500 h-2.5 rounded-full progress-bar';
      label.textContent = 'Crítica';
      label.className = 'text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800';
    } else if (puntaje < 50) {
      barra.className = 'bg-orange-400 h-2.5 rounded-full progress-bar';
      label.textContent = 'Regular';
      label.className = 'text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-800';
    } else if (puntaje < 75) {
      barra.className = 'bg-yellow-400 h-2.5 rounded-full progress-bar';
      label.textContent = 'Buena';
      label.className = 'text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800';
    } else {
      barra.className = 'bg-green-500 h-2.5 rounded-full progress-bar';
      label.textContent = 'Excelente';
      label.className = 'text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800';
    }
  },

  // Aquí puedes agregar más funciones para el dashboard
  inicializar() {
    // Por ahora solo ejemplo simulado
    this.actualizarSaludFinanciera(65);
  }
};