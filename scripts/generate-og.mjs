// Desenha as imagens de prévia de link e os cards de stories em public/og/, a partir de scripts/og/card.html.
//   npm run og                         → álbum e todos os competidores
//   npm run og -- 31-myllena-nogueira  → só as figurinhas indicadas (slug ou "album")
// Saída: og/<slug>.jpg (1200×630), og/stories/<slug>.jpg (1080×1920) e og/stories-link/<slug>.jpg
// (720×1280, até 250 KB, a prévia vertical do WhatsApp). Usa o Chrome instalado no computador
// (playwright-core não baixa navegador); outro caminho pode ir em CHROME_PATH.
// Roda só localmente, quando os dados mudam: as imagens ficam no repositório e o deploy só as copia.
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OG = join(ROOT, 'public', 'og');
const D = JSON.parse(readFileSync(join(ROOT, 'public', 'data.json'), 'utf8'));
const only = process.argv.slice(2);
const jobs = [['album', 'album'], ...D.people.map(p => [String(p.id), p.slug])].filter(([, slug]) => !only.length || only.includes(slug));

// servidor estático da raiz do projeto: o cartão lê /public/data.json e as fotos de /public/img
const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = createServer((req, res) => {
  const path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  try {
    if (!path.startsWith(ROOT) || !statSync(path).isFile()) throw new Error();
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' });
    res.end(readFileSync(path));
  } catch { res.writeHead(404).end(); }
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const base = `http://127.0.0.1:${server.address().port}/scripts/og/card.html`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
const render = async (id, story, scale = 1) => {
  const [w, h] = story ? [1080, 1920] : [1200, 630];
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  await page.goto(`${base}?id=${id}&fmt=${story ? 'story' : ''}`);
  await page.waitForSelector('body[data-ready]', { timeout: 30000 });
  return { page, clip: { x: 0, y: 0, width: w, height: h } };
};
const save = (rel, buf) => { const f = join(OG, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, buf); return buf.length; };

let biggest = 0;
for (const [id, slug] of jobs) {
  let { page, clip } = await render(id, false);
  biggest = Math.max(biggest, save(`${slug}.jpg`, await page.screenshot({ clip, type: 'jpeg', quality: 86 })));
  await page.close();
  ({ page, clip } = await render(id, true));
  save(`stories/${slug}.jpg`, await page.screenshot({ clip, type: 'jpeg', quality: 90 }));
  await page.close();
  // a versão leve do card vertical, para a prévia do WhatsApp (ele ignora imagens muito grandes)
  ({ page, clip } = await render(id, true, 720 / 1080));
  for (const quality of [84, 78, 72]) {
    const buf = await page.screenshot({ clip, type: 'jpeg', quality, scale: 'device' });
    save(`stories-link/${slug}.jpg`, buf);
    if (buf.length <= 250_000) break;
  }
  await page.close();
  process.stdout.write('.');
}
await browser.close();
server.close();
console.log(`\n${jobs.length} figurinhas · maior prévia: ${Math.round(biggest / 1000)} KB`);
if (biggest > 300_000) throw new Error('prévia acima de 300 KB: o WhatsApp pode ignorar');
