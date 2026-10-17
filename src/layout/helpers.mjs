// Small shared helpers used by the layout and pages.

/** Escape text for safe use in HTML content and attributes. */
export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Escape text, then turn **bold** markers from the content files into <strong>. */
export const rich = (value = '') => esc(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

/** Join an array of HTML strings. */
export const each = (items, fn) => (items || []).map(fn).join('\n');

/** Full postal address on one line. */
export const addressLine = (a) => `${a.line1}, ${a.city}, ${a.state} ${a.zip}`;

/**
 * Responsive <img> for a photo. Unsplash URLs are resized by Unsplash's CDN,
 * so several widths are offered; any other path is used as-is.
 */
export const photo = ({ image, imageIsUnsplash, alt }, { root = '', className = '', widths = [800, 1200, 1600], sizes = '100vw', width, height, eager = false } = {}) => {
  if (!image) return '';
  const loading = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  const dims = width && height ? ` width="${width}" height="${height}"` : '';
  if (imageIsUnsplash) {
    const url = (w) => `${image}?auto=format&amp;fit=crop&amp;w=${w}&amp;q=70`;
    const srcset = widths.map((w) => `${url(w)} ${w}w`).join(', ');
    return `<img class="${className}" src="${url(widths[Math.min(1, widths.length - 1)])}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}"${dims} ${loading} decoding="async" onerror="this.hidden=true">`;
  }
  return `<img class="${className}" src="${root}${esc(image)}" alt="${esc(alt)}"${dims} ${loading} decoding="async">`;
};

/** Reusable page header used on every inner page. */
export const pageHeader = ({ eyebrow, title, lead }) => `
<section class="page-header">
  <div class="container">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1 class="page-header__title">${esc(title)}</h1>
    ${lead ? `<p class="page-header__lead">${esc(lead)}</p>` : ''}
  </div>
</section>`;
