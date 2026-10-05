import { esc, each, pageHeader, contactBand } from '../layout/helpers.mjs';

export default {
  id: 'about',
  path: 'about/',
  title: 'About Us',
  description:
    'About Mazzy Law PLLC and Mazzy: biography, education, bar and court admissions, and professional background in litigation, banking and financial planning.',
  render(ctx) {
    const { site, attorney, root } = ctx;
    const [lead, ...rest] = attorney.biography;
    return `
${pageHeader({
  eyebrow: 'About Us',
  title: site.firmName,
  lead: 'At Mazzy Law we deliver institutional-grade legal counsel with the agility of a boutique practice.',
})}

<section class="section section--tight" aria-labelledby="bio-title">
  <div class="container about-layout">
    <div class="about-main">
      <p class="eyebrow">Biography</p>
      <h2 id="bio-title" class="section-title">${esc(attorney.name)}</h2>
      <p class="about-lead">${esc(lead.text)}</p>
      <div class="prose bio">
        ${each(
          rest,
          (block) => `<section>
          <h3>${esc(block.heading)}</h3>
          <p>${esc(block.text)}</p>
        </section>`
        )}
      </div>
    </div>

    <aside class="credentials" aria-label="Credentials">
      <div class="credentials__portrait">
        ${
          attorney.photo
            ? `<img src="${root}${esc(attorney.photo)}" alt="${esc(attorney.name)}" loading="lazy">`
            : `<div class="monogram monogram--wide" aria-hidden="true"><span>M</span></div>`
        }
        <p class="credentials__name">${esc(attorney.name)}</p>
        <p class="credentials__role">${esc(attorney.role)}, ${esc(site.firmName)}</p>
      </div>
      <dl class="credentials__list">
        <div>
          <dt>Education</dt>
          ${each(attorney.education, (e) => `<dd><strong>${esc(e.degree)}</strong><br>${esc(e.school)}</dd>`)}
        </div>
        <div>
          <dt>Bar Admissions</dt>
          ${each(attorney.barAdmissions, (b) => `<dd>${esc(b)}</dd>`)}
        </div>
        <div>
          <dt>Court Admissions</dt>
          ${each(attorney.courtAdmissions, (c) => `<dd>${esc(c)}</dd>`)}
        </div>
        <div>
          <dt>Honors and Distinctions</dt>
          ${each(attorney.honors, (h) => `<dd>${esc(h)}</dd>`)}
        </div>
      </dl>
    </aside>
  </div>
</section>

<section class="section section--alt" aria-labelledby="background-title">
  <div class="container">
    <div class="section-head section-head--stack">
      <p class="eyebrow">Professional Background</p>
      <h2 id="background-title" class="section-title">Legal career and earlier experience</h2>
    </div>
    <div class="background">
      <div class="background__col">
        <h3 class="background__heading">Legal career</h3>
        <ul class="background__list">
          ${each(attorney.background.legal, (b) => `<li><strong>${esc(b.role)}</strong><span>${esc(b.org)}</span></li>`)}
        </ul>
      </div>
      <div class="background__col">
        <h3 class="background__heading">Before becoming an attorney</h3>
        <ul class="background__list">
          ${each(attorney.background.prior, (b) => `<li><strong>${esc(b.role)}</strong><span>${esc(b.org)}</span></li>`)}
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="areas-title">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Areas of Practice</p>
        <h2 id="areas-title" class="section-title">${esc(attorney.name)}’s practice areas</h2>
      </div>
      <p class="section-head__text"><a class="text-link" href="${root}practice-areas/">See the firm’s practice areas in detail</a></p>
    </div>
    <ul class="tick-list tick-list--short tick-list--three">
      ${each(attorney.practiceList, (item) => `<li>${esc(item)}</li>`)}
    </ul>
  </div>
</section>

${contactBand(ctx)}
`;
  },
};
