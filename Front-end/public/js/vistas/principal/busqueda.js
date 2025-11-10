const Busqueda = {
  filterBudgets() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const budgetCards = document.querySelectorAll('.presupuesto-card');
    
    budgetCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toUpperCase();
      if (title.includes(filter)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    this.mostrarMensajeNoResultados(filter, budgetCards);
  },

  mostrarMensajeNoResultados(filter, budgetCards) {
    const visibleCards = [...budgetCards].filter(card => card.style.display !== 'none');
    const noResults = document.getElementById('noResults');
    
    if (visibleCards.length === 0 && filter.length > 0) {
      if (!noResults) {
        const grid = document.querySelector('.grid');
        const message = document.createElement('div');
        message.id = 'noResults';
        message.className = 'col-span-full text-center py-8';
        message.innerHTML = `
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No se encontraron resultados</h3>
          <p class="mt-1 text-gray-500">No hay presupuestos que coincidan con "${input.value}"</p>
        `;
        grid.appendChild(message);
      }
    } else if (noResults) {
      noResults.remove();
    }
  },

  inicializar() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('keyup', () => this.filterBudgets());
    }
  }
};