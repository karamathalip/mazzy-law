import { esc, rich, each, pageHeader } from '../layout/helpers.mjs';

// Every practice area uses the same pattern: title, introduction, "Capabilities",
// then plain bulleted lists (Real Estate adds three numbered sub-groups).
const list = (items, columns = 1) =>
  `<ul class="tick-list${columns > 1 ? ' tick-list--two' : ''}">${each(items, (item) => `<li>${rich(item)}</li>`)}</ul>`;

function capabilities(area) {
  let html = '';
  if (area.groups) {
    html += each(
      area.groups,
      (group, i) => `<div class="capability-group">
        <h4 class="capability-group__title">${i + 1}. ${esc(group.title)}</h4>
        <p>${esc(group.intro)}</p>
        ${list(group.items)}
      </div>`
    );
  }
  if (area.items) {
    html += `${area.itemsIntro ? `<p>${esc(area.itemsIntro)}</p>` : ''}${list(area.items, area.columns)}`;
  }
  return html;
}

export default {
  id: 'practice-areas',
  path: 'practice-areas/',
  title: 'Practice Areas',
  description:
    'Practice areas of Mazzy Law PLLC: real estate transactions, business and corporate law, tax planning and advisory services, estate planning, and commercial disputes.',
  render(ctx) {
    const { practiceAreas } = ctx;
    return `
${pageHeader({ title: 'Practice Areas' })}

<section class="section section--tight">
  <div class="container"><div class="text-column">
    ${each(
      practiceAreas,
      (area) => `<article class="practice-area" id="${area.id}" aria-labelledby="${area.id}-title">
      <h2 id="${area.id}-title" class="practice-area__title">${esc(area.title)}</h2>
      <div class="prose">
        ${each(area.intro, (p) => `<p>${esc(p)}</p>`)}
      </div>
      <h3 class="practice-area__subhead">Capabilities</h3>
      <div class="prose">
        ${capabilities(area)}
      </div>
    </article>`
    )}
  </div></div>
</section>
`;
  },
};
