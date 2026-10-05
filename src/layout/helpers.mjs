// Small shared helpers used by the layout and pages.

/** Escape text for safe use in HTML content and attributes. */
export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Join an array of HTML strings. */
export const each = (items, fn) => (items || []).map(fn).join('\n');

/** Full postal address on one line. */
export const addressLine = (a) => `${a.line1}, ${a.city}, ${a.state} ${a.zip}`;

/** Reusable page header used on every inner page. */
export const pageHeader = ({ eyebrow, title, lead }) => `
<section class="page-header">
  <div class="container">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1 class="page-header__title">${esc(title)}</h1>
    ${lead ? `<p class="page-header__lead">${esc(lead)}</p>` : ''}
  </div>
</section>`;

/** Closing call-to-action band shared by all pages. */
export const contactBand = ({ site, root }) => `
<section class="cta-band" aria-labelledby="cta-band-title">
  <div class="container cta-band__inner">
    <div>
      <p class="eyebrow eyebrow--on-dark">Contact</p>
      <h2 id="cta-band-title" class="cta-band__title">Speak with ${esc(site.firmName)}</h2>
      <p class="cta-band__text">${esc(addressLine(site.address))}</p>
    </div>
    <div class="cta-band__actions">
      <a class="btn btn--light" href="${root}contact/">Contact Us</a>
      ${site.phone.display ? `<a class="btn btn--ghost-light" href="tel:${esc(site.phone.href)}">Call ${esc(site.phone.display)}</a>` : ''}
    </div>
  </div>
</section>`;
