function transformarTablaEnCarrusel() {
  const table = document.getElementById('UserOffersTable'); //[cite: 2]
  if (!table) return;

  // Evitar ataques XSS
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  };

  const getTooltipText = (el) => {
    if (!el) return '';
    return el.getAttribute('data-bs-original-title')
      || el.getAttribute('aria-label')
      || el.getAttribute('data-original-title')
      || '';
  };

  // 1. Extraer la información de cada fila de la tabla
  const rows = table.querySelectorAll('.article-row'); //[cite: 2]
  const items = [];

  rows.forEach(row => {
    // Imagen de la carta (scan)
    const cameraIcon = row.querySelector('.thumbnail-icon'); //[cite: 2]
    let imgSrc = '';
    if (cameraIcon) {
      const tooltipAttr = cameraIcon.getAttribute('data-bs-title')
        || cameraIcon.getAttribute('data-bs-original-title')
        || cameraIcon.getAttribute('aria-label')
        || '';
      const match = tooltipAttr.match(/src="([^"]+)"/);
      if (match) imgSrc = match[1];
    }

    // Carta: nombre, enlace
    const nameAnchor = row.querySelector('.col-seller a'); //[cite: 2]
    const name = nameAnchor ? nameAnchor.textContent.trim() : 'Carta sin nombre'; //[cite: 2]
    const link = nameAnchor ? nameAnchor.href : '#'; //[cite: 2]

    // Precio y Stock
    const price = row.querySelector('.color-primary')?.textContent.trim() || ''; //[cite: 2]
    const stock = row.querySelector('.item-count')?.textContent.trim() || '0'; //[cite: 2]

    // Carrito: Referencia al elemento DOM real
    const cartForm = row.querySelector('.actions-container'); //[cite: 2]

    // Expansión
    const expansionEl = row.querySelector('a.expansion-symbol'); //[cite: 2]
    const expansionLink = expansionEl ? expansionEl.href : ''; //[cite: 2]
    const expansionName = getTooltipText(expansionEl); //[cite: 2]
    const expansionIcon = expansionEl ? expansionEl.innerHTML : ''; //[cite: 2]

    // Rareza
    const rarityEl = row.querySelector('svg[aria-label], svg[data-bs-original-title]'); //[cite: 2]
    const rarityName = getTooltipText(rarityEl); //[cite: 2]
    const rarityIcon = rarityEl ? rarityEl.outerHTML : ''; //[cite: 2]

    // Condición de la carta
    const conditionEl = row.querySelector('a.article-condition'); //[cite: 2]
    const conditionLink = conditionEl ? conditionEl.href : ''; //[cite: 2]
    const conditionName = getTooltipText(conditionEl); //[cite: 2]
    const conditionBadge = conditionEl ? conditionEl.textContent.trim() : ''; //[cite: 2]

    // Idioma
    const languageEl = row.querySelector('span.icon[style*="background-image"]'); //[cite: 2]
    const languageName = getTooltipText(languageEl); //[cite: 2]
    const languageIcon = languageEl ? languageEl.outerHTML : ''; //[cite: 2]

    // Foto Subida por el vendedor
    const cameraAnchorEl = row.querySelector('a:has(.fonticon-camera)'); //[cite: 2]

    // Comentario / información del vendedor
    const commentEl = row.querySelector('.product-comments [data-bs-original-title], .product-comments span'); //[cite: 2]
    const sellerComment = getTooltipText(commentEl) || commentEl?.textContent.trim() || ''; //[cite: 2]

    items.push({
      name, link, imgSrc, price, stock, cartForm,
      expansionName, expansionLink, expansionIcon,
      rarityName, rarityIcon,
      conditionLink, conditionName, conditionBadge,
      languageIcon,
      sellerComment, cameraAnchorEl
    });
  });

  if (items.length === 0) return; //[cite: 2]

  // 2. Precargar todas las imágenes de la página
  const preloadedImages = []; //[cite: 2]
  items.forEach(item => { //[cite: 2]
    if (item.imgSrc) {
      const img = new Image();
      img.src = item.imgSrc;
      preloadedImages.push(img);
    }
  });

  // 3. Crear la estructura del Carrusel
  let currentIndex = 0; //[cite: 2]
  const carouselContainer = document.createElement('div'); //[cite: 2]
  carouselContainer.id = 'custom-card-carousel'; //[cite: 2]
  carouselContainer.className = 'card p-4 my-3 text-center border rounded shadow-sm'; //[cite: 2]
  carouselContainer._preloadedImages = preloadedImages; //[cite: 2]

  function renderCard(index) {
    // Si ya no quedan artículos, ocultar el carrusel o mostrar un mensaje
    if (items.length === 0) {
      carouselContainer.innerHTML = `<div class="alert alert-info mb-0">No cards left.</div>`;
      return;
    }

    const item = items[index];
    carouselContainer.innerHTML = `
      <div class="d-flex align-items-center justify-content-between mb-3">
        <button id="carousel-prev" class="btn btn-outline-primary btn-lg" ${index === 0 ? 'disabled' : ''}>‹ Back</button>
        <span class="badge carousel-counter fs-6">${index + 1} / ${items.length}</span>
        <button id="carousel-next" class="btn btn-outline-primary btn-lg" ${index === items.length - 1 ? 'disabled' : ''}>Next ›</button>
      </div>
      <div class="row align-items-center">
        <div class="col-md-5">
          ${item.imgSrc ? `<img src="${item.imgSrc}" alt="${escapeHtml(item.name)}" class="img-fluid rounded shadow" style="max-height: 320px;">` : '<div class="p-5 bg-light">Sin Imagen</div>'}
        </div>
        <div class="col-md-7 text-start">
          <h3><a href="${item.link}" target="_blank" class="text-decoration-none">${escapeHtml(item.name)}</a></h3>

          <div class="d-flex flex-wrap align-items-center gap-2 my-2 meta-row">
            ${item.expansionIcon ? `<a href="${item.expansionLink}" target="_blank" class="meta-badge" title="${escapeHtml(item.expansionName)}">${item.expansionIcon}<span class="meta-label">${escapeHtml(item.expansionName)}</span></a>` : ''}
            ${item.rarityIcon ? `<span class="meta-badge" title="${escapeHtml(item.rarityName)}">${item.rarityIcon}<span class="meta-label">${escapeHtml(item.rarityName)}</span></span>` : ''}
            ${item.conditionBadge ? `<a href="${escapeHtml(item.conditionLink)}" target="_blank" rel="noopener noreferrer"><span class="badge condition-badge cond-${escapeHtml(item.conditionBadge).toLowerCase()}" title="${escapeHtml(item.conditionName)}">${escapeHtml(item.conditionBadge)}</span></a>` : ''}
            ${item.languageIcon ? `<span class="meta-badge" title="${escapeHtml(item.languageName)}">${item.languageIcon}</span>` : ''}
          </div>

          <p class="fs-4 fw-bold text-success my-2">${item.price}</p>
          <p class="text-muted">Stock: <strong>${item.stock}</strong></p>

          <div class="mt-3 action-box" id="cart-container-placeholder"></div>

          <div class="seller-box d-flex align-items-center mt-3">
            <div id="seller-scan-container" class="me-2"></div>
            ${item.sellerComment ? `<p class="seller-comment mb-0 fst-italic">"${escapeHtml(item.sellerComment)}"</p>` : ''}
          </div>
        </div>
      </div>
    `; //[cite: 2]

    if (item.cartForm) {
      const cartPlaceholder = carouselContainer.querySelector('#cart-container-placeholder'); //[cite: 2]
      if (cartPlaceholder) {
        cartPlaceholder.appendChild(item.cartForm); //[cite: 2]

        // --- SOLUCIÓN DEL BUG ---
        // Escuchamos el evento submit/click para eliminar el artículo del carrusel tras comprarlo
        const form = item.cartForm.querySelector('form');
        if (form && !form.dataset.listenerAdded) {
          form.dataset.listenerAdded = 'true';
          form.addEventListener('submit', () => {
            // Se elimina esta carta del listado
            items.splice(index, 1);
            
            // Ajustar el índice si era la última carta disponible
            if (currentIndex >= items.length) {
              currentIndex = Math.max(0, items.length - 1);
            }
            
            // Renderizar la carta que queda en esa posición (o mensaje de vacío)
            renderCard(currentIndex);
          });
        }
      }
    }

    if (item.cameraAnchorEl) {
      const scanContainer = carouselContainer.querySelector('#seller-scan-container'); //[cite: 2]
      if (scanContainer) {
        scanContainer.appendChild(item.cameraAnchorEl.cloneNode(true)); //[cite: 2]
      }
    }

    // Asignar los eventos de navegación entre las cartas extraídas
    carouselContainer.querySelector('#carousel-prev')?.addEventListener('click', () => { //[cite: 2]
      if (currentIndex > 0) { //[cite: 2]
        currentIndex--; //[cite: 2]
        renderCard(currentIndex); //[cite: 2]
      }
    });

    carouselContainer.querySelector('#carousel-next')?.addEventListener('click', () => { //[cite: 2]
      if (currentIndex < items.length - 1) { //[cite: 2]
        currentIndex++; //[cite: 2]
        renderCard(currentIndex); //[cite: 2]
      }
    });
  }

  // 4. Reemplazar la tabla por el Carrusel
  renderCard(currentIndex); //[cite: 2]
  table.parentNode.insertBefore(carouselContainer, table); //[cite: 2]
  table.style.display = 'none'; //[cite: 2]
}

// Función para comprobar la configuración y ejecutar
function initExtension() {
  // Comprobamos la memoria de Chrome
  chrome.storage.local.get('carouselEnabled', (data) => {
    // Si es distinto de false, significa que está activado (o es la primera vez)
    if (data.carouselEnabled !== false) {
      transformarTablaEnCarrusel();
    }
  });
}

// Ejecutar al cargar el DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExtension);
} else {
  initExtension();
}