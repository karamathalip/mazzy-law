// Page shell: <head>, header, footer and the palette preview switch.
// Every page is wrapped by renderLayout(), so navigation and footer are defined once.

import { esc, each, addressLine } from './helpers.mjs';
import { icon } from './icons.mjs';

const THEME_LABELS = { grey: 'Grey', blue: 'Blue' };

function head(ctx) {
  const { site, page, root, themeInit } = ctx;
  const title = page.path === '' ? `${site.firmName} | ${page.title}` : `${page.title} | ${site.firmName}`;
  const description = page.description || site.description;
  const { siteUrl, indexable } = site.seo;
  const canonical = siteUrl && !page.path.endsWith('.html') ? `${siteUrl}${page.path}` : '';
  const noindex = !indexable || page.noindex;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: site.firmName,
    description: site.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: 'US',
    },
    areaServed: ['New York', 'New Jersey'],
  };
  if (site.phone.href) jsonLd.telephone = site.phone.href;
  if (site.email) jsonLd.email = site.email;
  if (site.hoursSchema) jsonLd.openingHours = site.hoursSchema;
  if (siteUrl) jsonLd.url = siteUrl;

  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.firmName)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
<meta name="theme-color" content="#f3f2ef">
<link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
<script>${themeInit.trim()}</script>
<link rel="stylesheet" href="${root}assets/css/site.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>`;
}

function header(ctx) {
  const { site, page, root } = ctx;
  const isCurrent = (path) => path === page.path;
  return `<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="${root}" aria-label="${esc(site.firmName)} — home">
      <span class="brand__mark" aria-hidden="true">M</span>
      <span class="brand__text">
        <span class="brand__name">Mazzy Law</span>
        <span class="brand__suffix">PLLC</span>
      </span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
      <span class="nav-toggle__open">${icon('menu')}</span>
      <span class="nav-toggle__close">${icon('close')}</span>
      <span class="visually-hidden">Menu</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main" data-nav>
      <ul class="site-nav__list">
        ${each(
          site.nav,
          (item) =>
            `<li><a class="site-nav__link" href="${root}${item.path}"${isCurrent(item.path) ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`
        )}
      </ul>
    </nav>
  </div>
</header>`;
}

function footer(ctx) {
  const { site, page, root, year } = ctx;
  // The Contact page already lists the address and telephone in its body, so the
  // footer leaves them out there; every other page shows them once, here.
  const showContact = !page.hideFooterContact;
  const credits = (page.photoCredits || [])
    .map((c) => `<a href="${esc(c.creditUrl)}" rel="noopener">${esc(c.credit)}</a>`)
    .join(' and ');
  return `<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <p class="site-footer__name">${esc(site.firmName)}</p>
      ${
        showContact
          ? `<address class="site-footer__address">
        ${esc(site.address.line1)}<br>
        ${esc(site.address.city)}, ${esc(site.address.state)} ${esc(site.address.zip)}
      </address>
      ${site.phone.display ? `<p><a href="tel:${esc(site.phone.href)}">${esc(site.phone.display)}</a></p>` : ''}
      ${site.email ? `<p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>` : ''}`
          : ''
      }
    </div>
    <nav class="site-footer__nav" aria-label="Footer">
      <p class="site-footer__heading">Site</p>
      <ul>
        ${each(site.nav, (item) => `<li><a href="${root}${item.path}">${esc(item.label)}</a></li>`)}
      </ul>
    </nav>
    <nav class="site-footer__nav" aria-label="Legal">
      <p class="site-footer__heading">Legal</p>
      <ul>
        ${each(site.footerLinks, (item) => `<li><a href="${root}${item.path}">${esc(item.label)}</a></li>`)}
      </ul>
    </nav>
  </div>
  <div class="container">
   <div class="site-footer__legal">
    <p><strong>Attorney Advertising.</strong> The materials and information contained on this website may be considered Attorney Advertising. Prior results do not guarantee a similar outcome. The content on this website is provided for informational purposes only and does not create an attorney-client relationship. <a href="${root}disclaimers/">Read the full disclaimers and notices</a>.</p>
    <p class="site-footer__meta">
      <span>&copy; ${year} ${esc(site.firmName)}</span>
      ${credits ? `<span>Photographs by ${credits} on Unsplash</span>` : ''}
    </p>
   </div>
  </div>
</footer>`;
}

// Preview control for comparing the two palettes. Remove it by setting
// theme.showSwitcher to false in src/data/site.json.
function themeSwitcher(ctx) {
  const { site } = ctx;
  if (!site.theme.showSwitcher) return '';
  return `<aside class="theme-switch" aria-label="Preview colour palette" data-theme-switch>
  <span class="theme-switch__label">Palette</span>
  ${each(
    site.theme.available,
    (t) =>
      `<button type="button" class="theme-switch__btn" data-theme-value="${t}" aria-pressed="${t === site.theme.default}"><span class="theme-switch__swatch theme-switch__swatch--${t}" aria-hidden="true"></span>${THEME_LABELS[t] || t}</button>`
  )}
</aside>`;
}

export function renderLayout(ctx, body) {
  const { site, root, page } = ctx;
  return `<!doctype html>
<html lang="en" data-theme="${site.theme.default}">
${head(ctx)}
<body class="page-${page.id}">
<a class="skip-link" href="#main">Skip to main content</a>
${header(ctx)}
<main id="main">
${body}
</main>
${footer(ctx)}
${themeSwitcher(ctx)}
<script src="${root}assets/js/main.js" defer></script>
</body>
</html>
`;
}

export { addressLine };
