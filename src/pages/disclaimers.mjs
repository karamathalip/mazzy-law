import { esc, each, pageHeader } from '../layout/helpers.mjs';

export default {
  id: 'disclaimers',
  path: 'disclaimers/',
  title: 'Disclaimers & Notices',
  description: 'Website disclaimers and notices for Mazzy Law PLLC, including the attorney advertising notice.',
  render(ctx) {
    const { disclaimers } = ctx;
    return `
${pageHeader({ eyebrow: 'Legal', title: disclaimers.title, lead: disclaimers.subtitle })}

<section class="section section--tight">
  <div class="container container--narrow">
    <ol class="legal">
      ${each(
        disclaimers.sections,
        (section) => `<li class="legal__item" id="${section.id}">
        <h2 class="legal__title">${esc(section.title)}</h2>
        ${each(
          section.body,
          (block) => `<p>${block.label ? `<strong>${esc(block.label)}:</strong> ` : ''}${esc(block.text)}</p>`
        )}
      </li>`
      )}
    </ol>
  </div>
</section>
`;
  },
};
