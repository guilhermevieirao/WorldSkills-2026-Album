import { store } from '../store.js';

// quadro de pontos: soma das notas de cada país em todas as ocupações que disputou (nas duplas, a nota conta uma vez)
export const byPoints = () => [...store.D.medalTable].sort((a, b) => a.pointsRank - b.pointsRank);
export const pts = n => Math.round(n).toLocaleString('pt-BR');

// ranking dos estados como o quadro de medalhas oficial (almanaque e capa): cada ocupação vale um resultado,
// então a dupla leva uma medalha só; a ordem é a olímpica (ouros, pratas, bronzes), depois excelências e,
// no fim, o número de competidores
export const stateRanking = () => {
  const { bySkill, people } = store;
  const st = {}, seen = {};
  Object.values(people).forEach(p => {
    const u = (st[p.uf] ||= { uf: p.uf, n: 0, occ: 0, ouro: 0, prata: 0, bronze: 0, exc: 0, part: 0 });
    u.n++;
    const occ = (seen[p.uf] ||= new Set());
    if (occ.has(p.n)) return;
    occ.add(p.n);
    u.occ++;
    const m = bySkill[p.n].medal;
    if (m === 'excelencia') u.exc++; else if (m === 'participacao') u.part++; else u[m]++;
  });
  const states = Object.values(st).sort((a, b) => b.ouro - a.ouro || b.prata - a.prata || b.bronze - a.bronze || b.exc - a.exc || b.n - a.n);
  states.forEach((u, i) => { u.rank = i + 1; });
  return { st, states };
};
