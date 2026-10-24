import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDir = fileURLToPath(new URL('../dist/', import.meta.url));
const githubBase = '/portfolio/';

async function processDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(path);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;

    const html = await readFile(path, 'utf8');
    const rewritten = html
      .replaceAll('href="/', `href="${githubBase}`)
      .replaceAll("href='/", `href='${githubBase}`)
      .replaceAll('src="/', `src="${githubBase}`)
      .replaceAll("src='/", `src='${githubBase}`);
    if (rewritten !== html) await writeFile(path, rewritten);
  }
}

await processDirectory(outputDir);
