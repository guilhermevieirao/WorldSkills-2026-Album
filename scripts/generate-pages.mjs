// Depois do `vite build`: grava em dist/ as páginas que não são o álbum.
// - f/<nº>-<nome>/: uma página por competidor com as etiquetas de prévia (WhatsApp, Discord, Instagram);
//   quem abre é levado para a figurinha no álbum. f/<nº>-<nome>/w/ é a variante com o card vertical;
// - 404.html, robots.txt, sitemap.xml e llms.txt.
// As imagens das prévias ficam em public/og/ (geradas por `npm run og`).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'dist');
const DOMAIN = 'skillex.com.br';
const BASE = `https://${DOMAIN}/`;
const SITE = 'Brasil em Shanghai';
const TODAY = new Date().toISOString().slice(0, 10);

const D = JSON.parse(readFileSync(join(ROOT, 'public', 'data.json'), 'utf8'));
const MEDAL = { prata: 'Medalha de Prata', bronze: 'Medalha de Bronze', excelencia: 'Medalha de Excelência', participacao: 'Participação' };
const skills = Object.fromEntries(D.skills.map(s => [s.n, s]));
const n2 = n => String(n).padStart(2, '0');
const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const write = (rel, text) => {
  const path = join(OUT, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
};

// cabeçalho comum: título, descrição, meta tags e prévia de link
const head = (path, title, desc, image, alt, { size = [1200, 630], canonical = null, robots = 'index, follow, max-image-preview:large' } = {}) => {
  const url = BASE + path;
  const up = '../'.repeat(path.split('/').length - 1);
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title>
<meta name="description" content="${e(desc)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${e(canonical !== null ? BASE + canonical : url)}">
<meta name="theme-color" content="#0e1f47">
<meta name="color-scheme" content="light">
<meta name="application-name" content="${SITE}">
<meta name="apple-mobile-web-app-title" content="${SITE}">
<meta name="format-detection" content="telephone=no">
<link rel="icon" type="image/png" href="${up}favicon.png">
<link rel="apple-touch-icon" href="${up}favicon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE}">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${e(url)}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:image" content="${e(BASE + image)}">
<meta property="og:image:secure_url" content="${e(BASE + image)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="${size[0]}">
<meta property="og:image:height" content="${size[1]}">
<meta property="og:image:alt" content="${e(alt)}">
<meta name="twitter:card" content="${size[0] > size[1] ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(desc)}">
<meta name="twitter:image" content="${e(BASE + image)}">
<meta name="twitter:image:alt" content="${e(alt)}">
`;
};

const redirectPage = (path, title, desc, image, alt, target, linkText, opts) => {
  const up = '../'.repeat(path.split('/').length - 1);
  return head(path, title, desc, image, alt, opts) + `<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0e1f47;color:#f3f6fb;font:500 17px/1.5 system-ui,sans-serif}a{color:#ffd21f}</style>
</head>
<body><p><a href="${up}${target}">${e(linkText)}</a></p>
<!-- redirecionamento só por script: os robôs de prévia (WhatsApp, Discord, Instagram) leem as etiquetas acima e não seguem -->
<script>location.replace(${JSON.stringify(up + target)});</script>
</body>
</html>
`;
};

// ── páginas das figurinhas ──
for (const p of D.people) {
  const s = skills[p.n];
  const where = p.city ? ` De ${p.city} (${p.uf}).` : ` ${p.uf}.`;
  const title = `${p.short} · #${n2(p.n)} ${s.pt} | ${SITE}`;
  // quem não medalhou não mostra o resultado nem a colocação, como no álbum
  const resTxt = s.medal !== 'participacao' ? `${MEDAL[s.medal]} · ${s.position}º de ${s.total} · ` : '';
  const desc = `${s.bestOfNation ? 'Best of Nation, a melhor nota do Brasil · ' : ''}${resTxt}${s.mark} pontos na WorldSkills Shanghai 2026.${where}`;
  const alt = `Figurinha de ${p.name}, ${s.pt}`;
  const link = `Abrir a figurinha de ${p.short}`;
  write(`f/${p.slug}/index.html`, redirectPage(`f/${p.slug}/`, title, desc, `og/${p.slug}.jpg`, alt, `#f${p.id}`, link));
  // variante da opção "WhatsApp": prévia com o card vertical; para buscadores, a página principal é a de cima
  write(`f/${p.slug}/w/index.html`, redirectPage(`f/${p.slug}/w/`, title, desc, `og/stories-link/${p.slug}.jpg`, alt, `#f${p.id}`, link,
    { size: [720, 1280], canonical: `f/${p.slug}/`, robots: 'noindex, follow' }));
}

// ── página 404 ──
write('404.html', `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | ${SITE}</title>
<meta name="description" content="Esse endereço não existe no álbum da delegação brasileira na WorldSkills Shanghai 2026.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0e1f47">
<link rel="icon" type="image/png" href="${BASE}favicon.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Barlow:wght@500;700&display=swap">
<style>
body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; box-sizing: border-box; background: #0e1f47; color: #f3f6fb; font: 500 17px/1.5 'Barlow', system-ui, sans-serif; text-align: center; }
h1 { margin: 0 0 12px; font: 900 clamp(3rem, 12vw, 6rem)/0.9 'Big Shoulders Display', 'Arial Narrow', sans-serif; text-transform: uppercase; }
h1 em { display: block; font-style: normal; color: #ffd21f; }
p { margin: 0 0 24px; color: #b9c6e4; }
a { display: inline-flex; align-items: center; min-height: 48px; padding: 0 22px; border-radius: 999px; background: #ffd21f; color: #1a1400; font-weight: 700; text-decoration: none; }
</style>
</head>
<body><main><h1>Figurinha <em>não encontrada</em></h1><p>Esse endereço não existe no álbum.</p><a href="${BASE}">Abrir o álbum</a></main></body>
</html>
`);

// ── buscadores e assistentes de IA ──
const c = m => D.skills.filter(s => s.medal === m).length;
const br = D.medalTable.find(m => m.member === 'Brazil');
// posição pelo quadro de pontos (soma das notas; scripts/points-table.mjs), como no placar do álbum
const brAm = D.medalTable.filter(m => m.americas).sort((a, b) => a.pointsRank - b.pointsRank).indexOf(br) + 1;
const brPts = br.points.toLocaleString('en-US').replace(/,/g, '.'); // 44.748
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
const urls = [[BASE, '1.0'], ...[...D.people].sort((a, b) => a.n - b.n || cmp(a.slug, b.slug)).map(p => [`${BASE}f/${p.slug}/`, '0.6'])];
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map(([u, pr]) => `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><priority>${pr}</priority></url>\n`).join('')
  + '</urlset>\n');
const lines = [`# ${SITE}`, '',
  `> Álbum de figurinhas da delegação brasileira na WorldSkills Shanghai 2026 (23 a 26 de setembro de 2026, em Xangai, China): `
  + `os ${D.people.length} competidores do Brasil em ${D.skills.length} ocupações, com o resultado oficial de cada um, `
  + 'história, equipe de cada ocupação, comissão, placar e almanaque. Página independente de torcida, sem vínculo oficial '
  + 'com a WorldSkills, o SENAI, o Senac ou a CNI.', '',
  `O Brasil terminou em ${br.pointsRank}º no quadro de pontos, a soma das notas de todas as ocupações disputadas `
  + `(${brPts} pontos em ${br.entries} ocupações; nas duplas, a nota conta uma vez), e ${brAm}º entre os países das Américas, com `
  + `${c('prata')} pratas, ${c('bronze')} bronzes e ${c('excelencia')} medalhas de excelência. `
  + D.skills.filter(s => s.bestOfNation).map(s => `O Best of Nation (maior nota do Brasil) foi de ${D.people.filter(p => p.n === s.n).map(p => p.name).join(' e ')}, `
    + `em ${s.pt}, com ${s.mark} pontos. `).join(''), '',
  '## Álbum', '',
  `- [Álbum completo](${BASE}): figurinhas, filtros por estado, cidade, região, setor e resultado, placar, almanaque e comissão.`,
  `- [Dados em JSON](${BASE}data.json): competidores, ocupações, resultados, equipes, comissão, quadros de medalhas e de pontos e histórico do Brasil.`, '',
  '## Competidores', ''];
for (const p of [...D.people].sort((a, b) => a.n - b.n || cmp(a.name, b.name))) {
  const s = skills[p.n];
  const place = [p.city, p.uf].filter(Boolean).join(', ');
  lines.push(`- [${p.name}](${BASE}f/${p.slug}/): #${n2(p.n)} ${s.pt} (${s.sector}). ${MEDAL[s.medal]}, `
    + `${s.position}º de ${s.total}, ${s.mark} pontos.${s.bestOfNation ? ' Best of Nation.' : ''}${place ? ' ' + place + '.' : ''}`);
}
lines.push('', '## Fontes', '', ...D.sources.map(s => (s.url ? `- [${s.label}](${s.url})` : `- ${s.label}`)));
write('llms.txt', lines.join('\n') + '\n');

console.log(`páginas de figurinha: ${D.people.length} (+ variantes /w/) · 404 · robots.txt · sitemap.xml (${urls.length} endereços) · llms.txt`);
