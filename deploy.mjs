// Builds and publishes the site to two branches:
//
//   gh-pages  the GitHub Pages preview (noindex) at karamathalip.github.io/mazzy-law/
//   live      the build for https://mazzylaw.com/, which is copied to Bluehost
//
//   node deploy.mjs      (or: npm run deploy)
//
// Each build is written as a single commit and force-pushed to its branch. Your
// working branch, staged changes and files are untouched: the commits are
// assembled with a separate temporary index. ./dist is left holding the live build.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const GIT_DIR = join(ROOT, '.git');

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

const publish = (buildArgs, branch) => {
  execFileSync(process.execPath, [join(ROOT, 'build.mjs'), ...buildArgs], { cwd: ROOT, stdio: 'inherit' });
  if (!existsSync(join(DIST, 'index.html'))) throw new Error('The build did not produce dist/index.html.');
  pages(['read-tree', '--empty']);
  pages(['add', '--all', '--force', '.']);
  const tree = pages(['write-tree']);
  const commit = pages(['commit-tree', tree, '-m', `Deploy site from ${source}`]);
  console.log(`Publishing commit ${commit.slice(0, 7)} to origin/${branch} …`);
  run(['push', '--force', 'origin', `${commit}:refs/heads/${branch}`], { stdio: 'inherit' });
};

publish(['--target=github'], 'gh-pages');
publish([], 'live');
console.log('Done. GitHub Pages usually updates within a minute; the live branch is ready to copy to Bluehost.');
