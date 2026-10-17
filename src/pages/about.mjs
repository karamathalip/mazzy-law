import { esc, each, pageHeader, photo } from '../layout/helpers.mjs';

export default {
  id: 'about',
  path: 'about/',
  title: 'About Us',
  description:
    'About Mazzy Law PLLC and its Founder and Managing Partner, M. Mazzy: biography, practice areas, bar and court admissions, and education.',
  render(ctx) {
    const { site, attorney, root } = ctx;
    return `
${pageHeader({
  title: site.firmName,
  lead: 'At Mazzy Law we deliver institutional-grade legal counsel with the agility of a boutique practice.',
})}

<section class="section section--tight">
  <div class="container about-layout">
    <aside class="credentials" aria-labelledby="attorney-name">
      ${photo(
        { image: attorney.photo, alt: attorney.photoAlt },
        { root, className: 'credentials__photo', width: 800, height: 800 }
      )}
      <div class="credentials__body">
        <h2 id="attorney-name" class="credentials__name">${esc(attorney.name)}</h2>
        <p class="credentials__role">${esc(attorney.role)}</p>
        <dl class="credentials__list">
          <div>
            <dt>Bar Admissions</dt>
            ${each(attorney.barAdmissions, (b) => `<dd>${esc(b)}</dd>`)}
          </div>
          <div>
            <dt>Court Admissions</dt>
            ${each(attorney.courtAdmissions, (c) => `<dd>${esc(c)}</dd>`)}
          </div>
          <div>
            <dt>Education</dt>
            ${each(attorney.education, (e) => `<dd>${esc(e)}</dd>`)}
          </div>
        </dl>
      </div>
    </aside>

    <div class="about-main">
      <section aria-labelledby="bio-title">
        <h2 id="bio-title" class="about-main__title">Biography</h2>
        <div class="prose">
          ${each(attorney.biography, (p) => `<p>${esc(p)}</p>`)}
        </div>
      </section>
      <section aria-labelledby="areas-title">
        <h2 id="areas-title" class="about-main__title">Practice Areas</h2>
        <ul class="tick-list tick-list--two">
          ${each(attorney.practiceList, (item) => `<li>${esc(item)}</li>`)}
        </ul>
      </section>
    </div>
  </div>
</section>
`;
  },
};
