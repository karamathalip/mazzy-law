import { pageHeader } from '../layout/helpers.mjs';

export default {
  id: 'not-found',
  path: '404.html',
  title: 'Page Not Found',
  description: 'The page you requested could not be found.',
  noindex: true,
  // This page can be served from any URL, so its links use the absolute base path.
  absoluteLinks: true,
  render(ctx) {
    const { root } = ctx;
    return `
${pageHeader({
  eyebrow: 'Error 404',
  title: 'Page not found',
  lead: 'The page you requested does not exist or has moved.',
})}
<section class="section section--tight">
  <div class="container">
    <a class="btn btn--primary" href="${root}">Return to the home page</a>
  </div>
</section>
`;
  },
};
