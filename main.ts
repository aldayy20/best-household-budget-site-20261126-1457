// DompetKeluarga — hand-in script for the make.fun household-budget site bounty.
// Runs on Node 22 with the standard library only. The site itself is the static
// app/ directory next to this file (plain HTML, CSS and ES modules, no build step
// and nothing fetched from the network at runtime). This script packages that site
// for the judge: it stages app/ and screenshots/ into the output directory and
// writes dossier.json there, the summary the scorer reads — the screenshots, the
// files and bytes of the first load, and the source tree — produced by the vendored
// make.fun library in vendor/makefun-frontend.ts, which must stay untouched so the
// dossier matches byte for byte what the scorer's own copy would write.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader's container the output directory is /output. Serve the site
// for a manual look with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Directory holding this file, and therefore app/ and screenshots/.
const sourceDir = dirname(fileURLToPath(import.meta.url));

// Where the hand-in goes: /output in the grader, or MAKEFUN_OUTPUT_DIR locally.
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function stageFolder(name) {
  const from = join(sourceDir, name);
  const to = join(targetDir, name);
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) {
    cpSync(from, to, { recursive: true });
  }
}

mkdirSync(targetDir, { recursive: true });
stageFolder('app');
stageFolder('screenshots');

// Limits taken from the scorer's own gate (reference/gate.json). Only the text
// cap changes what the dossier contains; the rest mirror what the scorer refuses
// outright, so a hand-in that passes here will not be turned away there: at most
// 4 screenshots and none over 256 KiB, at most 993 entries totalling 16 MiB in
// app/ — app/ is counted alongside the output folder's own 1000-entry ceiling,
// which also covers screenshots/ and dossier.json itself.
const dossierText = buildDossier(targetDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});

writeFileSync(join(targetDir, 'dossier.json'), dossierText);
