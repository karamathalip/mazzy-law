import { esc, each, contactBand } from '../layout/helpers.mjs';
import { icon } from '../layout/icons.mjs';

function heroImage(hero) {
  if (!hero.image) return '';
  // Unsplash's image CDN resizes on request, so we can offer several widths.
  if (hero.imageIsUnsplash) {
    const url = (w) => `${hero.image}?auto=format&amp;fit=crop&amp;w=${w}&amp;q=70`;
    const srcset = [800, 1200, 1600, 2400].map((w) => `${url(w)} ${w}w`).join(', ');
    return `<img class="hero__img" src="${url(1600)}" srcset="${srcset}" sizes="100vw" alt="${esc(hero.alt)}" width="1600" height="1067" fetchpriority="high" decoding="async" onerror="this.hidden=true">`;
  }
  return `<img class="hero__img" src="${esc(hero.image)}" alt="${esc(hero.alt)}" fetchpriority="high" decoding="async" onerror="this.hidden=true">`;
}

export default {
  id: 'home',
  path: '',
  title: 'Real Estate, Business & Estate Counsel in New York',
  description:
    'Mazzy Law PLLC advises clients throughout New York and New Jersey on real estate transactions, business and corporate law, estate planning, tax planning, and commercial litigation.',
  render(ctx) {
    const { site, practiceAreas, attorney, root } = ctx;
    return `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media">
    ${heroImage(site.hero)}
  </div>
  <div class="container hero__inner">
    <p class="eyebrow eyebrow--on-dark">${esc(site.firmName)} &middot; ${esc(site.address.city)}, ${esc(site.address.state)}</p>
    <h1 id="hero-title" class="hero__title">${esc(site.tagline)}</h1>
    <p class="hero__lead">${esc(site.description)}</p>
    <div class="hero__actions">
      <a class="btn btn--light" href="${root}contact/">Contact Us</a>
      <a class="btn btn--ghost-light" href="${root}practice-areas/">Practice Areas</a>
    </div>
  </div>
</section>

<section class="highlights" aria-label="Admissions and background">
  <div class="container">
    <ul class="highlights__list">
      ${each(
        attorney.highlights,
        (h) => `<li class="highlights__item"><span class="highlights__value">${esc(h.value)}</span><span class="highlights__label">${esc(h.label)}</span></li>`
      )}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="practice-title">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Practice Areas</p>
        <h2 id="practice-title" class="section-title">Transactional counsel, backed by litigation experience</h2>
      </div>
      <p class="section-head__text">Mazzy’s practice focuses on real estate transactions, business and corporate law, estate planning, tax planning, commercial transactions, and commercial litigation.</p>
    </div>
    <ul class="practice-grid">
      ${each(
        practiceAreas,
        (area) => `<li>
        <a class="practice-card" href="${root}practice-areas/#${area.id}">
          <span class="practice-card__icon">${icon(area.icon, { size: 28 })}</span>
          <h3 class="practice-card__title">${esc(area.title)}</h3>
          <p class="practice-card__text">${esc(area.summary)}</p>
          <span class="practice-card__more">Learn more ${icon('arrow', { size: 18 })}</span>
        </a>
      </li>`
      )}
      <li>
        <a class="practice-card practice-card--all" href="${root}practice-areas/">
          <h3 class="practice-card__title">All practice areas</h3>
          <p class="practice-card__text">Read the full description of each practice and its capabilities.</p>
          <span class="practice-card__more">View practice areas ${icon('arrow', { size: 18 })}</span>
        </a>
      </li>
    </ul>
  </div>
</section>

<section class="section section--alt" aria-labelledby="perspective-title">
  <div class="container">
    <div class="section-head section-head--stack">
      <p class="eyebrow">Perspective</p>
      <h2 id="perspective-title" class="section-title">What informs Mazzy’s approach</h2>
    </div>
    <ol class="perspective">
      ${each(
        attorney.perspective,
        (p, i) => `<li class="perspective__item">
        <span class="perspective__num" aria-hidden="true">0${i + 1}</span>
        <h3 class="perspective__title">${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </li>`
      )}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="profile-title">
  <div class="container profile">
    <div class="profile__portrait">
      ${
        attorney.photo
          ? `<img src="${root}${esc(attorney.photo)}" alt="${esc(attorney.name)}" loading="lazy">`
          : `<div class="monogram" aria-hidden="true"><span>M</span></div>`
      }
    </div>
    <div class="profile__body">
      <p class="eyebrow">About ${esc(attorney.name)}</p>
      <h2 id="profile-title" class="section-title">${esc(attorney.name)}</h2>
      <p class="profile__role">${esc(attorney.role)}, ${esc(site.firmName)}</p>
      ${each(attorney.shortBio, (p) => `<p>${esc(p)}</p>`)}
      <dl class="profile__facts">
        <div><dt>Bar admissions</dt><dd>${esc(attorney.barAdmissions.join(' · '))}</dd></div>
        <div><dt>Education</dt><dd>${each(attorney.education, (e) => `${esc(e.degree)}, ${esc(e.school)}`).replace(/\n/g, '<br>')}</dd></div>
      </dl>
      <a class="btn btn--primary" href="${root}about/">Read full profile</a>
    </div>
  </div>
</section>

${contactBand(ctx)}
`;
  },
};
