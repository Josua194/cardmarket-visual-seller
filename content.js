function transformarTablaEnCarrusel() {
  const table = document.getElementById('UserOffersTable');
  if (!table) return;

  // evitar ataques XSS
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
  const rows = table.querySelectorAll('.article-row');
  const items = [];

  rows.forEach(row => {
    // Imagen de la carta (scan) desde el tooltip del icono de la cámara
    const cameraIcon = row.querySelector('.thumbnail-icon');
    let imgSrc = '';
    if (cameraIcon) {
      const tooltipAttr = cameraIcon.getAttribute('data-bs-title')
        || cameraIcon.getAttribute('data-bs-original-title')
        || cameraIcon.getAttribute('aria-label')
        || '';
      const match = tooltipAttr.match(/src="([^"]+)"/);
      if (match) imgSrc = match[1];
    }

    // Carta: nombre, enlace y foto (si la tiene)
    const nameAnchor = row.querySelector('.col-seller a');
    const name = nameAnchor ? nameAnchor.textContent.trim() : 'Carta sin nombre';
    const link = nameAnchor ? nameAnchor.href : '#';

    // Precio
    const price = row.querySelector('.color-primary')?.textContent.trim() || '';
    // Stock disponible
    const stock = row.querySelector('.item-count')?.textContent.trim() || '0';
    // Carrito
    const cartForm = row.querySelector('.actions-container')?.innerHTML || '';

    // Expansión
    const expansionEl = row.querySelector('a.expansion-symbol');
    const expansionLink = expansionEl ? expansionEl.href : '';
    const expansionName = getTooltipText(expansionEl);
    const expansionIcon = expansionEl ? expansionEl.innerHTML : '';

    // Rareza (icono svg)
    const rarityEl = row.querySelector('svg[aria-label], svg[data-bs-original-title]');
    const rarityName = getTooltipText(rarityEl);
    const rarityIcon = rarityEl ? rarityEl.outerHTML : '';

    // Condición de la carta
    const conditionEl = row.querySelector('a.article-condition');
    const conditionLink = conditionEl ? conditionEl.href : '';
    const conditionName = getTooltipText(conditionEl);
    const conditionBadge = conditionEl ? conditionEl.textContent.trim() : '';

    // Idioma
    const languageEl = row.querySelector('span.icon[style*="background-image"]');
    const languageName = getTooltipText(languageEl);
    const languageIcon = languageEl ? languageEl.outerHTML : '';

    // Foto Subida por el vendedor (si la tiene)
    const cameraAnchorEl = row.querySelector('a:has(.fonticon-camera)');

    // Comentario / información que da el vendedor
    const commentEl = row.querySelector('.product-comments [data-bs-original-title], .product-comments span');
    const sellerComment = getTooltipText(commentEl) || commentEl?.textContent.trim() || '';

    items.push({
      name, link, imgSrc, price, stock, cartForm,
      expansionName, expansionLink, expansionIcon,
      rarityName, rarityIcon,
      conditionLink, conditionName, conditionBadge,
      languageIcon,
      sellerComment, cameraAnchorEl
    });
  });

  if (items.length === 0) return;

  // 2. Precargar todas las imágenes de la página (cartas + fotos de vendedor)
  // para que el navegador las tenga en caché y el carrusel no parpadee al navegar.
  const preloadedImages = [];
  items.forEach(item => {
    if (item.imgSrc) {
      const img = new Image();
      img.src = item.imgSrc;
      preloadedImages.push(img);
    }
  });

  // 3. Crear la estructura del Carrusel
  let currentIndex = 0;
  const carouselContainer = document.createElement('div');
  carouselContainer.id = 'custom-card-carousel';
  carouselContainer.className = 'card p-4 my-3 text-center border rounded shadow-sm';
  // Mantener referencia a las imágenes precargadas para que no se pierdan (GC)
  carouselContainer._preloadedImages = preloadedImages;

  function renderCard(index) {
    const item = items[index];
    carouselContainer.innerHTML = `
      <div class="d-flex align-items-center justify-content-between mb-3">
        <button id="carousel-prev" class="btn btn-outline-primary btn-lg" ${index === 0 ? 'disabled' : ''}>‹ Anterior</button>
        <span class="badge bg-secondary fs-6">${index + 1} / ${items.length}</span>
        <button id="carousel-next" class="btn btn-outline-primary btn-lg" ${index === items.length - 1 ? 'disabled' : ''}>Siguiente ›</button>
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
            ${item.conditionBadge ? `<a href="${escapeHtml(item.conditionLink)}" target="_blank" rel="noopener noreferrer"><span class="badge condition-badge" title="${escapeHtml(item.conditionName)}">${escapeHtml(item.conditionBadge)}</span></a>` : ''}
            ${item.languageIcon ? `<span class="meta-badge" title="${escapeHtml(item.languageName)}">${item.languageIcon}</span>` : ''}
          </div>

          <p class="fs-4 fw-bold text-success my-2">${item.price}</p>
          <p class="text-muted">Disponibles: <strong>${item.stock}</strong></p>

          <div class="mt-3 action-box">${item.cartForm}</div>

          <div class="seller-box d-flex align-items-center mt-3">
            <div id="seller-scan-container" class="me-2"></div>
            ${item.sellerComment ? `<p class="seller-comment mb-0 fst-italic">"${escapeHtml(item.sellerComment)}"</p>` : ''}
          </div>
        </div>
      </div>
    `;

    if (item.cameraAnchorEl) {
      const scanContainer = carouselContainer.querySelector('#seller-scan-container');
      if (scanContainer) {
        // Usamos cloneNode(true) para no destruir el original en caso de volver atrás en el carrusel
        scanContainer.appendChild(item.cameraAnchorEl.cloneNode(true));
      }
    }

    // Asignar los eventos de navegación entre las cartas extraídas
    carouselContainer.querySelector('#carousel-prev')?.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderCard(currentIndex);
      }
    });

    carouselContainer.querySelector('#carousel-next')?.addEventListener('click', () => {
      if (currentIndex < items.length - 1) {
        currentIndex++;
        renderCard(currentIndex);
      }
    });
  }

  // 4. Reemplazar la tabla por el Carrusel
  renderCard(currentIndex);
  table.parentNode.insertBefore(carouselContainer, table);
  table.style.display = 'none'; // Mantiene la tabla original oculta en el DOM sin destruirla
}

// Ejecutar la modificación al cargar el DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', transformarTablaEnCarrusel);
} else {
  transformarTablaEnCarrusel();
}