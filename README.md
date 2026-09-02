# Cardmarket Carousel Enhancement

> Extensión de navegador (Chrome / Manifest V3) que transforma la lista de vistas previas de artículos en Cardmarket (Pokémon) en un carrusel interactivo, más cómodo de navegar.

Read this in [English](#english) or [Español](#español).

---

## English

### What it does

On a seller's article list page on Cardmarket (`cardmarket.com/es/Pokemon/Users/*`), the extension replaces the default table view with a card-style carousel. Each card shows:

- Card image
- Name and link to the product page
- Expansion, rarity, condition, language and reverse-holo badges
- Price and stock
- The original "add to cart" controls
- Seller comment / uploaded scan (if available)

You can navigate between cards with **Back / Next** buttons, and once an item is purchased it's automatically removed from the carousel.

### Features

- 🔄 One-click toggle to enable/disable the carousel from the popup
- 🖼️ Image preloading for smoother navigation
- 🛒 Keeps the native cart form fully functional (no re-implementation of Cardmarket's logic)
- 🎨 Styled to match Cardmarket's light/dark theme (Bootstrap variables)
- 💾 Setting saved with `chrome.storage.local`, persists across sessions

### Installation

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome (or the equivalent page in another Chromium-based browser).
3. Enable **Developer mode** (top right corner).
4. Click **Load unpacked** and select the project folder.
5. Visit a Cardmarket seller's article list page — the carousel will appear automatically.

### Usage

Click the extension icon to open the popup and toggle the carousel on or off with the switch. The page reloads automatically to apply the change.

### Project structure

```
├── manifest.json    # Extension manifest (Manifest V3)
├── content.js       # Builds the carousel from the article table
├── style.css        # Carousel styles (injected into Cardmarket)
├── popup.html        # Extension popup
├── popup.css         # Popup styles
├── popup.js          # Popup logic (reads/writes the setting)
└── README.md
```

### Permissions

- `storage`: to remember whether the carousel is enabled.
- Content script access limited to `https://www.cardmarket.com/es/Pokemon/Users/*`.

### Disclaimer

This is an unofficial, community-made extension and is not affiliated with or endorsed by Cardmarket.

### Author

Made by [**Josua194**](https://github.com/Josua194).

---

## Español

### Qué hace

En la página de artículos de un vendedor en Cardmarket (`cardmarket.com/es/Pokemon/Users/*`), la extensión sustituye la tabla por defecto por un carrusel de tarjetas. Cada tarjeta muestra:

- Imagen de la carta
- Nombre y enlace a la ficha del producto
- Insignias de expansión, rareza, condición, idioma y reverse holo
- Precio y stock
- Los controles originales de "añadir al carrito"
- Comentario del vendedor / foto subida (si está disponible)

Puedes navegar entre cartas con los botones **Back / Next**, y cuando se compra un artículo se elimina automáticamente del carrusel.

### Características

- 🔄 Interruptor de un clic para activar/desactivar el carrusel desde el popup
- 🖼️ Precarga de imágenes para una navegación más fluida
- 🛒 Mantiene el formulario de carrito original totalmente funcional (no reimplementa la lógica de Cardmarket)
- 🎨 Estilos adaptados al tema claro/oscuro de Cardmarket (variables de Bootstrap)
- 💾 La configuración se guarda con `chrome.storage.local` y persiste entre sesiones

### Instalación

1. Descarga o clona este repositorio.
2. Abre `chrome://extensions` en Chrome (o la página equivalente en otro navegador basado en Chromium).
3. Activa el **Modo de desarrollador** (esquina superior derecha).
4. Haz clic en **Cargar descomprimida** y selecciona la carpeta del proyecto.
5. Visita la lista de artículos de un vendedor en Cardmarket — el carrusel aparecerá automáticamente.

### Uso

Haz clic en el icono de la extensión para abrir el popup y activar o desactivar el carrusel con el interruptor. La página se recarga automáticamente para aplicar el cambio.

### Estructura del proyecto

```
├── manifest.json    # Manifiesto de la extensión (Manifest V3)
├── content.js       # Construye el carrusel a partir de la tabla de artículos
├── style.css        # Estilos del carrusel (inyectados en Cardmarket)
├── popup.html        # Popup de la extensión
├── popup.css         # Estilos del popup
├── popup.js          # Lógica del popup (lee/guarda la configuración)
└── README.md
```

### Permisos

- `storage`: para recordar si el carrusel está activado.
- Acceso del content script limitado a `https://www.cardmarket.com/es/Pokemon/Users/*`.

### Aviso

Esta es una extensión no oficial, hecha por la comunidad, y no está afiliada ni respaldada por Cardmarket.

### Autor

Hecho por [**Josua194**](https://github.com/Josua194).