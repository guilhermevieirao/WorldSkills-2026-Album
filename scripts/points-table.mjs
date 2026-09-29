// Quadro de pontos da WorldSkills Shanghai 2026: grava em public/data.json o total de pontos de cada país.
//   npm run points
// O critério é o do comparativo oficial da WorldSkills por total de pontos (Member Results Comparison ·
// Comparison By Total Points Scored): o total de um país é a soma das notas de todas as ocupações oficiais
// que ele disputou (uma nota por ocupação; nas duplas e equipes, a nota conta uma vez), e a ordem é do
// maior total para o menor. Os resultados vêm da API pública da WorldSkills, a mesma do results.worldskills.org.
// Cada linha de "medalTable" ganha "points" (total) e "pointsRank" (posição no quadro de pontos).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data.json');
const EVENT = 611; // WorldSkills Shanghai 2026
const API = 'https://api.worldskills.org/results';

const get = async url => {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (err) {
      if (i === 3) throw err;
      await new Promise(res => setTimeout(res, 2000 + 2000 * i));
    }
  }
};

const results = [];
for (let off = 0; ; off += 100) {
  const page = await get(`${API}/?offset=${off}&limit=100&event=${EVENT}&l=en`);
  results.push(...page.results);
  if (off + 100 >= page.total_count) break;
}

const totals = {};
for (const r of results) {
  if (r.skill?.type !== 'official') continue;
  const t = (totals[r.member.name.text] ||= { points: 0, skills: new Set() });
  if (t.skills.has(r.skill.id)) throw new Error(`duas notas na mesma ocupação: ${r.member.name.text}`);
  t.skills.add(r.skill.id);
  t.points += r.mark || 0;
}

const D = JSON.parse(readFileSync(DATA, 'utf8'));
const mt = D.medalTable;
const names = new Set(mt.map(m => m.member));
if (names.size !== Object.keys(totals).length || [...names].some(n => !totals[n])) throw new Error('os países do quadro de medalhas e da API não batem');
for (const m of mt) {
  const t = totals[m.member];
  if (t.skills.size !== m.entries) throw new Error(`${m.member}: ${t.skills.size} ocupações na API, ${m.entries} no quadro`);
  m.points = Math.round(t.points * 100) / 100;
}
// posição por total de pontos; totais iguais dividem a posição
for (const m of mt) m.pointsRank = 1 + mt.filter(o => o.points > m.points).length;
writeFileSync(DATA, JSON.stringify(D));
const order = [...mt].sort((a, b) => b.points - a.points);
console.log('quadro de pontos:', order.slice(0, 5).map(m => `${m.pointsRank}º ${m.member} ${m.points.toLocaleString('pt-BR')}`).join(' · '));
