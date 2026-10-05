import { esc, each, pageHeader, contactBand } from '../layout/helpers.mjs';
import { icon } from '../layout/icons.mjs';

function capabilities(area) {
  let html = '';
  if (area.groups) {
    html += `<ol class="capability-groups">
      ${each(
        area.groups,
        (group, i) => `<li class="capability-group">
        <span class="capability-group__num" aria-hidden="true">0${i + 1}</span>
        <h4 class="capability-group__title">${esc(group.title)}</h4>
        <p class="capability-group__intro">${esc(group.intro)}</p>
        <dl class="capability-group__items">
          ${each(group.items, (item) => `<div><dt>${esc(item.term)}</dt><dd>${esc(item.text)}</dd></div>`)}
        </dl>
      </li>`
      )}
    </ol>`;
  }
  if (area.points) {
    html += `<ul class="point-list">${each(area.points, (p) => `<li>${esc(p)}</li>`)}</ul>`;
  }
  if (area.list) {
    html += `${area.listIntro ? `<p class="list-intro">${esc(area.listIntro)}</p>` : ''}
    <ul class="tick-list tick-list--${area.listStyle || 'short'}">${each(area.list, (item) => `<li>${esc(item)}</li>`)}</ul>`;
  }
  return html;
}

export default {
  id: 'practice-areas',
  path: 'practice-areas/',
  title: 'Practice Areas',
  description:
    'Practice areas of Mazzy Law PLLC: real estate transactions, business and corporate law, tax planning and advisory services, estate planning, and litigation.',
  render(ctx) {
    const { practiceAreas } = ctx;
    return `
${pageHeader({
  eyebrow: 'Practice Areas',
  title: 'Practice Areas',
  lead: 'Real estate transactions, business and corporate law, tax planning and advisory services, estate planning, and litigation.',
})}

<section class="section section--tight">
  <div class="container practice-layout">
    <nav class="practice-toc" aria-label="Practice areas on this page">
      <p class="practice-toc__heading">On this page</p>
      <ul>
        ${each(practiceAreas, (area) => `<li><a href="#${area.id}">${esc(area.title)}</a></li>`)}
      </ul>
    </nav>
    <div class="practice-sections">
      ${each(
        practiceAreas,
        (area) => `<article class="practice-area" id="${area.id}" aria-labelledby="${area.id}-title">
        <header class="practice-area__header">
          <span class="practice-area__icon">${icon(area.icon, { size: 30 })}</span>
          <h2 id="${area.id}-title" class="practice-area__title">${esc(area.title)}</h2>
        </header>
        <div class="practice-area__intro prose">
          ${each(area.intro, (p) => `<p>${esc(p)}</p>`)}
        </div>
        <h3 class="practice-area__subhead">Capabilities</h3>
        ${capabilities(area)}
      </article>`
      )}
      <p class="fine-print">Prior results do not guarantee a similar outcome.</p>
    </div>
  </div>
</section>

${contactBand(ctx)}
`;
  },
};
