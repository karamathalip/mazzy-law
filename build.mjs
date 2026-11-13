// Zero-dependency static site generator for the Mazzy Law PLLC website.
// It uses only Node's standard library, so there is nothing to install.
//
//   node build.mjs          -> writes ./dist
//   node build.mjs --serve  -> builds, then serves ./dist at http://localhost:4173
//   node build.mjs --target=github -> builds the GitHub Pages preview (noindex, /mazzy-law/)
//
// Without --target the build is for the live site, https://mazzylaw.com/ (Bluehost).
//
// Content lives in src/data/*.json. Pages live in src/pages/*.mjs.
// To add a page: create src/pages/<name>.mjs (see README) and, if it should
// appear in the menu, add one line to "nav" in src/data/site.json.

import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderLayout } from './src/layout/layout.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const TARGET = (process.argv.find((a) => a.startsWith('--target=')) || '').slice('--target='.length);

const readJson = async (name) => {
  const json = JSON.parse(await readFile(join(SRC, 'data', name), 'utf8'));
  // site.json: settings for another hosting target override the live-site SEO settings.
  if (name === 'site.json' && json.seo) {
    const override = TARGET ? json.seo.targets && json.seo.targets[TARGET] : null;
    if (TARGET && !override) throw new Error(`Unknown --target "${TARGET}" (see seo.targets in site.json)`);
    const { targets, ...seo } = json.seo;
    json.seo = { ...seo, ...override };
  }
  return json;
};

// Order matters: tokens -> base -> components -> page-specific.
const CSS_FILES = ['tokens.css', 'base.css', 'components.css', 'pages.css'];

async function build() {
  const started = Date.now();
  const data = {
    site: await readJson('site.json'),
    practiceAreas: await readJson('practice-areas.json'),
    attorney: await readJson('attorney.json'),
    disclaimers: await readJson('disclaimers.json'),
  };
  data.year = new Date().getFullYear();

  await rm(DIST, { recursive: true, force: true });
  await mkdir(join(DIST, 'assets', 'css'), { recursive: true });

  // Static assets (images, scripts) are copied as-is. The site uses the system
  // font Times New Roman, so there are no font files to publish.
  for (const dir of ['img', 'js']) {
    await cp(join(SRC, 'assets', dir), join(DIST, 'assets', dir), {
      recursive: true,
      // Maintainer notes and the inlined theme script are not published.
      filter: (path) => !path.endsWith('.md') && !path.endsWith('theme-init.js'),
    });
  }

  // One stylesheet, concatenated from the design-system partials.
  const css = (await Promise.all(CSS_FILES.map((f) => readFile(join(SRC, 'assets', 'css', f), 'utf8')))).join('\n');
  await writeFile(join(DIST, 'assets', 'css', 'site.css'), css);

  const themeInit = await readFile(join(SRC, 'assets', 'js', 'theme-init.js'), 'utf8');

  // Version stamp for the stylesheet and script URLs (?v=...). It changes whenever
  // their content changes, so browsers never keep using a stale copy after a deploy.
  const mainJs = await readFile(join(SRC, 'assets', 'js', 'main.js'), 'utf8');
  const assetVersion = createHash('sha256').update(css).update(mainJs).digest('hex').slice(0, 10);

  // Every module in src/pages is a page.
  const pageFiles = (await readdir(join(SRC, 'pages'))).filter((f) => f.endsWith('.mjs')).sort();
  const built = [];
  for (const file of pageFiles) {
    const { default: page } = await import(pathToFileURL(join(SRC, 'pages', file)).href);
    // page.path is '' for the home page, 'about/' for /about/, or a file name such as '404.html'.
    const isFile = page.path.endsWith('.html');
    const depth = isFile ? 0 : page.path.split('/').filter(Boolean).length;
    // Relative prefix back to the site root, so the site works at any base path.
    // The 404 page can be served from any URL, so it uses the absolute base path.
    const root = page.absoluteLinks ? data.site.seo.basePath : depth === 0 ? './' : '../'.repeat(depth);
    const ctx = { ...data, root, page, themeInit, assetVersion };
    const html = renderLayout(ctx, page.render(ctx));
    const out = isFile ? join(DIST, page.path) : join(DIST, page.path, 'index.html');
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, html);
    built.push(page);
  }

  // Tell GitHub Pages not to run Jekyll.
  await writeFile(join(DIST, '.nojekyll'), '');

  // Apache (Bluehost): custom 404 page, no directory listings, sensible caching.
  // GitHub Pages ignores this file.
  await writeFile(
    join(DIST, '.htaccess'),
    [
      'Options -Indexes',
      `ErrorDocument 404 ${data.site.seo.basePath}404.html`,
      // Only the real domain may be indexed: any other host name that reaches these
      // files (Bluehost's temporary address, for example) is sent a noindex header.
      ...(data.site.seo.indexable && data.site.seo.siteUrl
        ? [
            `SetEnvIfNoCase Host ^(www\\.)?${new URL(data.site.seo.siteUrl).hostname.replace(/^www\./, '').replace(/\./g, '\\.')}$ LIVE_HOST`,
            '<IfModule mod_headers.c>',
            '  Header set X-Robots-Tag "noindex, nofollow" env=!LIVE_HOST',
            '</IfModule>',
          ]
        : []),
      '<IfModule mod_expires.c>',
      '  ExpiresActive On',
      '  ExpiresByType text/html "access plus 0 seconds"',
      '  ExpiresByType text/css "access plus 1 year"',
      '  ExpiresByType text/javascript "access plus 1 year"',
      '  ExpiresByType application/javascript "access plus 1 year"',
      '  ExpiresByType image/jpeg "access plus 1 week"',
      '  ExpiresByType image/svg+xml "access plus 1 week"',
      '</IfModule>',
      '',
    ].join('\n')
  );

  const { siteUrl, indexable } = data.site.seo;
  if (indexable && siteUrl) {
    const urls = built
      .filter((p) => !p.path.endsWith('.html') && !p.noindex)
      .map((p) => `  <url><loc>${siteUrl}${p.path}</loc></url>`)
      .join('\n');
    await writeFile(
      join(DIST, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
    );
    await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`);
  } else {
    await writeFile(join(DIST, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  }

  console.log(`Built ${built.length} pages for ${TARGET || 'the live site'} (${data.site.seo.siteUrl}) into dist/ in ${Date.now() - started} ms`);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

// Minimal preview server that mimics GitHub Pages: it serves the site under the
// configured base path (for example /mazzy-law/) and falls back to 404.html.
async function serve(port = 4173) {
  const site = await readJson('site.json');
  const base = site.seo.basePath || '/';
  createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path === '/' && base !== '/') {
      res.writeHead(302, { Location: base });
      return res.end();
    }
    if (!path.startsWith(base)) path = base + '__missing__';
    let rel = path.slice(base.length);
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    else if (!extname(rel)) {
      res.writeHead(301, { Location: path + '/' });
      return res.end();
    }
    try {
      const body = await readFile(join(DIST, rel));
      res.writeHead(200, { 'Content-Type': MIME[extname(rel)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      const body = await readFile(join(DIST, '404.html'));
      res.writeHead(404, { 'Content-Type': MIME['.html'] });
      res.end(body);
    }
  }).listen(port, () => console.log(`Preview: http://localhost:${port}${base}`));
}

await build();
if (process.argv.includes('--serve')) await serve();
