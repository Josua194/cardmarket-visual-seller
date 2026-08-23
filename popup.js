document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleCarousel');

  // 1. Cargar la configuración actual al abrir el panel
  // Por defecto, asumimos que está activado (true) si no hay nada guardado
  chrome.storage.local.get('carouselEnabled', (data) => {
    toggle.checked = data.carouselEnabled !== false; 
  });

  // 2. Guardar el cambio cuando el usuario haga clic en la casilla
  toggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ carouselEnabled: e.target.checked });
    
    // Opcional: Recargar la página automáticamente para aplicar los cambios
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  });
});