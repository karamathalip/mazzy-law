// Publishes ./dist to the gh-pages branch, which GitHub Pages serves.
//
//   node build.mjs && node deploy.mjs      (or: npm run deploy)
//
// It writes the contents of ./dist as a single commit and pushes it to
// origin/gh-pages. Your working branch, staged changes and files are untouched:
// the commit is assembled with a separate temporary index.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const GIT_DIR = join(ROOT, '.git');

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/index.html not found. Run "node build.mjs" first.');
  process.exit(1);
}
if (!existsSync(GIT_DIR)) {
  console.error('This folder is not a git repository yet. See README.md, "Deployment".');
  process.exit(1);
}

const run = (args, options = {}) =>
  (execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...options }) || '').trim();

// Treat ./dist as the work tree and use a throwaway index, so nothing in the
// real checkout changes.
const pagesEnv = {
  ...process.env,
  GIT_DIR,
  GIT_WORK_TREE: DIST,
  GIT_INDEX_FILE: join(GIT_DIR, 'pages-index'),
};
const pages = (args) => run(['-c', 'core.autocrlf=false', ...args], { cwd: DIST, env: pagesEnv });

const source = run(['rev-parse', '--short', 'HEAD']);
pages(['read-tree', '--empty']);
pages(['add', '--all', '--force', '.']);
const tree = pages(['write-tree']);
const commit = pages(['commit-tree', tree, '-m', `Deploy site from ${source}`]);

console.log(`Publishing commit ${commit.slice(0, 7)} to origin/gh-pages …`);
run(['push', '--force', 'origin', `${commit}:refs/heads/gh-pages`], { stdio: 'inherit' });
console.log('Done. GitHub Pages usually updates within a minute.');
