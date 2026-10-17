import { esc, photo } from '../layout/helpers.mjs';

export default {
  id: 'home',
  path: '',
  title: 'A Law Firm Built for The Future',
  description:
    'Mazzy Law PLLC, New York. Real estate, business and corporate law, estate planning, tax planning, and commercial transactions for individuals and businesses in New York and New Jersey.',
  render(ctx) {
    const { site, root, page } = ctx;
    // Footer credits for the two photographs used on this page.
    page.photoCredits = [site.hero, site.mission];
    return `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media">
    ${photo(site.hero, { className: 'hero__img', widths: [800, 1600, 2400], width: 1600, height: 1067, eager: true })}
  </div>
  <div class="container hero__inner">
    <p class="eyebrow eyebrow--on-dark">${esc(site.firmName)} &middot; ${esc(site.address.city)}, ${esc(site.address.state)}</p>
    <h1 id="hero-title" class="hero__title">${esc(site.tagline)}</h1>
    <div class="hero__actions">
      <a class="btn btn--light" href="${root}contact/">Contact Us</a>
      <a class="btn btn--ghost-light" href="${root}practice-areas/">Practice Areas</a>
    </div>
  </div>
</section>

<section class="section mission" aria-labelledby="mission-title">
  <div class="container mission__inner">
    <figure class="mission__media">
      ${photo(site.mission, {
        className: 'mission__img',
        widths: [600, 900, 1200],
        sizes: '(min-width: 900px) 40vw, 100vw',
        width: 900,
        height: 1125,
      })}
    </figure>
    <div class="mission__body">
      <h2 id="mission-title" class="mission__title">${esc(site.mission.title)}</h2>
      <blockquote class="mission__quote">
        <p>“${esc(site.mission.text)}”</p>
      </blockquote>
    </div>
  </div>
</section>
`;
  },
};
