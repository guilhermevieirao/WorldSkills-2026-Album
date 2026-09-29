import { $, $$, esc } from '../lib/dom.js';
import { MEDAL_SHORT, REGIONS, SECTORS, TONE, UF } from '../lib/constants.js';
import { n2 } from '../lib/text.js';
import { store } from '../store.js';
import { byPoints, pts, stateRanking } from '../lib/stats.js';
import { bindFilters } from '../filters.js';
import { openBack } from '../components/dialog.js';
import { initTableScroll } from '../components/table-scroll.js';
// contornos dos estados: @svg-maps/brazil (Victor Cazanave, CC BY 4.0); x/y = ponto de rótulo
import BR_MAP from '../data/brazil-map.json';

// estados pequenos demais para o rótulo: número fora, com linha até o estado
const MAP_CALLOUT = { PE: [614, 206], RJ: [548, 474], ES: [572, 380], AL: [640, 238], SE: [630, 262], PB: [640, 184], RN: [640, 160], DF: [452, 300] };
const RESULTS = ['prata', 'bronze', 'excelencia', 'participacao'];

// Almanaque: os números do Brasil, página impressa no fim do álbum
export const renderAlmanac = () => {
  const { D, bySkill, people } = store;
  const skills = D.skills, list = Object.values(people);
  const bar = (parts, max) => `<span class="bar__track">${parts.map(([m, v]) => v ? `<i style="width:${v / max * 100}%;background:${TONE[m]}" title="${MEDAL_SHORT[m]}: ${v}"></i>` : '').join('')}</span>`;
  const legend = `<div class="legend legend--left">${RESULTS.map(m => `<span><i style="background:${TONE[m]}"></i>${MEDAL_SHORT[m]}</span>`).join('')}</div>`;
  const occLink = s => `<button class="linkish" type="button" data-open="${s.competitors[0]}"><span class="num">#${n2(s.n)}</span> ${esc(s.pt)}</button>`;

  // 1. ocupações com mais países
  const crowded = [...skills].sort((a, b) => b.total - a.total || a.n - b.n).slice(0, 10);
  const maxT = crowded[0].total;
  const crowdedHtml = crowded.map(s => `<li class="rank-row">${occLink(s)}<span class="rank-row__v"><b class="num">${s.total}</b> países · Brasil ${s.position}º</span><span class="rank-row__bar"><i style="width:${s.total / maxT * 100}%"></i></span></li>`).join('');

  // 2. medalhas por setor (um resultado por ocupação)
  const bySec = SECTORS.map(sec => {
    const sk = skills.filter(s => s.sector === sec.name);
    const c = m => sk.filter(s => s.medal === m).length;
    return { sec, n: sk.length, parts: RESULTS.map(m => [m, c(m)]) };
  });
  const maxS = Math.max(...bySec.map(x => x.n));
  const secHtml = bySec.map(x => `<button class="bar" type="button" data-filter="sec:${x.sec.name}"><span>${x.sec.name}</span>${bar(x.parts, maxS)}<b class="num">${x.n}</b></button>`).join('');

  // 3. estados: ranking e mapa (os dois filtram o álbum)
  const { st, states } = stateRanking();
  const stateRows = states.map((u, i) => `<tr data-uf="${u.uf}"><td class="num">${i + 1}º</td><td><button class="linkish" type="button" data-filter="uf:${u.uf}">${UF[u.uf]}</button></td><td class="num">${u.occ}</td><td class="num">${u.prata}</td><td class="num">${u.bronze}</td><td class="num">${u.exc}</td></tr>`).join('');
  const shade = n => n >= 10 ? 1 : n >= 5 ? 0.66 : n >= 2 ? 0.42 : 0.24;
  const fill = n => `color-mix(in srgb, var(--green) ${Math.round(shade(n) * 100)}%, var(--paper-2))`;
  const tally = u => [u.ouro && `${u.ouro} ${u.ouro > 1 ? 'ouros' : 'ouro'}`, u.prata && `${u.prata} ${u.prata > 1 ? 'pratas' : 'prata'}`, u.bronze && `${u.bronze} ${u.bronze > 1 ? 'bronzes' : 'bronze'}`, u.exc && `${u.exc} ${u.exc > 1 ? 'excelências' : 'excelência'}`, u.part && `${u.part} ${u.part > 1 ? 'participações' : 'participação'}`].filter(Boolean).join(', ');
  const compTxt = u => `${u.n} competidor${u.n > 1 ? 'es' : ''}`;
  const ufLabel = u => `${UF[u.uf]}: ${u.rank}º no ranking dos estados; ${compTxt(u)}; ${tally(u)}`;
  const order = Object.keys(BR_MAP.states).sort((a, b) => (a === 'DF') - (b === 'DF'));
  const paths = order.map(uf => {
    const u = st[uf], m = BR_MAP.states[uf];
    return u
      ? `<path class="brmap__uf" d="${m.d}" data-has="true" data-uf="${uf}" data-filter="uf:${uf}" role="button" tabindex="0" aria-pressed="false" aria-label="${ufLabel(u)}" style="fill:${fill(u.n)}"/>`
      : `<path class="brmap__uf" d="${m.d}" aria-hidden="true"/>`;
  }).join('');
  const labels = states.map(u => {
    const m = BR_MAP.states[u.uf], dark = shade(u.n) >= 0.42 ? 'dark' : 'light', c = MAP_CALLOUT[u.uf];
    if (c) return `<g class="brmap__call" data-uf="${u.uf}" aria-hidden="true"><rect x="${c[0] - 6}" y="${c[1] - 20}" width="72" height="36" fill="transparent"/><line x1="${m.x}" y1="${m.y}" x2="${c[0] - 4}" y2="${c[1]}"/><circle cx="${m.x}" cy="${m.y}" r="2.6"/><text x="${c[0]}" y="${c[1] + 9}"><tspan class="uf">${u.uf}</tspan> <tspan class="n">${u.rank}º</tspan></text></g>`;
    return m.r >= 24
      ? `<g class="brmap__lbl" data-on="${dark}" transform="translate(${m.x} ${m.y})"><text class="uf" y="-9">${u.uf}</text><text class="n" y="19">${u.rank}º</text></g>`
      : `<g class="brmap__lbl" data-on="${dark}" data-size="s" transform="translate(${m.x} ${m.y})"><text class="uf" y="-6">${u.uf}</text><text class="n" y="14">${u.rank}º</text></g>`;
  }).join('');
  const mapHtml = `<div class="brmap"><svg viewBox="0 0 680 639" role="group" aria-label="Mapa do Brasil com a colocação de cada estado no ranking">${paths}${labels}</svg>
      <p class="brmap__info" aria-hidden="true">${states.length} estados com competidores. Passe o mouse ou toque para filtrar.</p></div>`;
  const mapLegend = `<div class="legend">${[[1, '1'], [2, '2 a 4'], [5, '5 a 9'], [10, '10 ou mais']].map(([n, t]) => `<span><i style="background:${fill(n)}"></i>${t}</span>`).join('')}</div>`;

  // 4. regiões
  const byReg = {};
  list.forEach(p => { const g = (byReg[p.region] ||= { n: 0, prata: 0, bronze: 0, excelencia: 0, participacao: 0 }); g.n++; g[bySkill[p.n].medal]++; });
  const regMax = Math.max(...REGIONS.map(r => byReg[r]?.n || 0));
  const regHtml = REGIONS.map(r => { const g = byReg[r] || { n: 0 }; return `<button class="bar" type="button" data-filter="reg:${r}"><span>${r}</span>${bar(RESULTS.map(m => [m, g[m] || 0]), regMax)}<b class="num">${g.n}</b></button>`; }).join('');

  // 5. Américas
  const am = byPoints().filter(r => r.americas);
  const amRows = am.map((r, i) => `<tr class="${r.member === 'Brazil' ? 'br' : ''}"><td class="num">${i + 1}º</td><td>${esc(r.pt)}</td><td class="num">${r.pointsRank}º</td><td class="num">${pts(r.points)}</td><td class="num">${r.entries}</td></tr>`).join('');

  // 6. quase pódio
  const near = skills.filter(s => s.medal !== 'prata' && s.medal !== 'bronze' && s.bronzeMark)
    .map(s => ({ s, gap: s.bronzeMark - s.mark })).sort((a, b) => a.gap - b.gap).slice(0, 8);
  const nearHtml = near.map(({ s, gap }) => `<li class="rank-row">${occLink(s)}<span class="rank-row__v"><b class="num">${gap}</b> ${gap === 1 ? 'ponto' : 'pontos'} do bronze · ${s.position}º de ${s.total}</span></li>`).join('');

  // 7. acima da média (mediana da ocupação)
  const diffs = skills.map(s => ({ s, d: s.mark - s.median })).sort((a, b) => b.d - a.d);
  const above = diffs.filter(x => x.d > 0).length;
  const aboveHtml = diffs.slice(0, 6).map(({ s, d }) => `<li class="rank-row">${occLink(s)}<span class="rank-row__v"><b class="num">+${Math.round(d)}</b> sobre a mediana (${Math.round(s.median)})</span></li>`).join('');

  // 8. mulheres e homens
  const G = { F: 'Mulheres', M: 'Homens' };
  const gRows = ['F', 'M'].map(g => {
    const ps = list.filter(p => p.gender === g); const c = m => ps.filter(p => bySkill[p.n].medal === m).length;
    return `<button class="bar" type="button" data-filter="gender:${g}"><span>${G[g]}</span>${bar(RESULTS.map(m => [m, c(m)]), list.filter(p => p.gender === 'M').length)}<b class="num">${ps.length}</b></button>`;
  }).join('');

  // 9. as 64 notas, em faixas de 20 pontos: uma plaquinha por ocupação, com a foto de quem competiu
  // e a moldura na cor do resultado; a dupla ocupa uma plaquinha dupla, com as duas fotos
  const bands = [];
  for (let lo = 780; lo >= 520; lo -= 20) bands.push(lo);
  const cell = s => {
    const ps = s.competitors.map(id => people[id]).filter(Boolean);
    const res = `${s.mark} pontos, ${MEDAL_SHORT[s.medal]}`;
    return `<span class="notes__cell${ps.length > 1 ? ' notes__cell--duo' : ''}" data-m="${s.medal}" style="--tone:${TONE[s.medal]}" title="#${n2(s.n)} ${esc(s.pt)}: ${res}${ps.length > 1 ? ' · dupla' : ''}">${ps.map(p => `<button type="button" data-open="${p.id}" aria-label="${esc(p.name)}, #${n2(s.n)} ${esc(s.pt)}, ${res}${ps.length > 1 ? ', em dupla' : ''}"><img src="${p.photos.portrait}" alt="" width="27" height="36" loading="lazy" decoding="async"></button>`).join('')}</span>`;
  };
  const notes = bands.map(lo => {
    const inBand = skills.filter(s => s.mark >= lo && s.mark < lo + 20).sort((a, b) => b.mark - a.mark);
    if (!inBand.length && (lo > 780 || lo < 540)) return '';
    const cut = lo === 700 ? '<div class="notes__cut"><span>700 pontos · a partir daqui, Medalha de Excelência</span></div>' : '';
    return `<div class="notes__row"><span class="notes__band num">${lo}–${lo + 19}</span><span class="notes__cells">${inBand.map(cell).join('')}</span><b class="notes__n num">${inBand.length || ''}</b></div>${cut}`;
  }).join('');
  const notesLegend = `<div class="legend legend--left">${RESULTS.map(m => `<span><i class="notes__key" style="--tone:${TONE[m]}"></i>${MEDAL_SHORT[m]}</span>`).join('')}<span><i class="notes__key notes__key--duo"></i>Dupla</span></div>`;

  // 10. o Brasil em cada edição (um resultado por ocupação; o antigo "Diploma" conta como excelência)
  const hist = D.history || [];
  const hMax = Math.max(...hist.map(h => h.occ));
  const HK = ['ouro', 'prata', 'bronze', 'excelencia', 'participacao'];
  const pod = h => h.ouro + h.prata + h.bronze;
  const best = [...hist].sort((a, b) => b.ouro - a.ouro || pod(b) - pod(a))[0];
  const tot = k => hist.reduce((a, h) => a + h[k], 0);
  const histRows = hist.map(h => `<li class="hist__row${h.year === 2026 ? ' hist__row--now' : ''}">
        <span class="hist__ed"><b class="num">${h.year}</b> ${esc(h.city)}</span>
        <span class="hist__bar" style="--w:${h.occ / hMax * 100}%" title="${HK.filter(k => h[k]).map(k => `${MEDAL_SHORT[k]}: ${h[k]}`).join(' · ')}">${HK.map(k => h[k] ? `<i style="flex:${h[k]};background:${TONE[k]}"></i>` : '').join('')}</span>
        <span class="hist__v"><span><b class="num">${pod(h)}</b> ${pod(h) === 1 ? 'pódio' : 'pódios'}</span><small>${h.ouro ? `${h.ouro} ${h.ouro > 1 ? 'ouros' : 'ouro'} · ` : ''}${h.comps} competidores</small></span>
      </li>`).join('');
  const histLegend = `<div class="legend legend--left">${HK.map(m => `<span><i style="background:${TONE[m]}"></i>${MEDAL_SHORT[m]}</span>`).join('')}</div>`;

  $('#almanac-grid').innerHTML = `
      <div class="panel"><h3>Ocupações com mais países</h3><p class="hint">As 10 disputas mais cheias e a posição do Brasil em cada uma.</p><ol class="rank-list">${crowdedHtml}</ol></div>
      <div class="panel"><h3>Medalhas por setor</h3><p class="hint">Um resultado por ocupação. Toque para filtrar o álbum.</p><div class="bars">${secHtml}</div>${legend}</div>
      <div class="panel panel--wide" id="estados"><h3>Ranking dos estados</h3><p class="hint">Como no quadro de medalhas oficial: cada ocupação vale um resultado (a dupla leva uma medalha só), e a ordem é pelas pratas, depois pelos bronzes e pelas excelências. No mapa, o número é a colocação de cada estado no ranking e a cor mostra quantos competidores ele levou. Toque em um estado para filtrar o álbum.</p>
        <div class="states">
          <div class="mt-wrap"><div class="mt-scroll"><table class="mt mt--states"><thead><tr><th>Posição</th><th>Estado</th><th>Ocupações</th><th>Pratas</th><th>Bronzes</th><th>Excelências</th></tr></thead><tbody>${stateRows}</tbody></table></div></div>
          <div>${mapHtml}${mapLegend}</div>
        </div>
      </div>
      <div class="panel"><h3>Por região</h3><p class="hint">Cada barra divide os competidores pelo resultado da ocupação.</p><div class="bars">${regHtml}</div>${legend}</div>
      <div class="panel"><h3>Brasil nas Américas</h3><p class="hint">Os países das Américas no quadro de pontos: a soma das notas em todas as ocupações disputadas.</p><div class="mt-wrap"><div class="mt-scroll"><table class="mt"><thead><tr><th>Posição</th><th>País</th><th>Posição geral</th><th>Pontos</th><th>Ocupações</th></tr></thead><tbody>${amRows}</tbody></table></div></div></div>
      <div class="panel"><h3>Quase pódio</h3><p class="hint">Onde o Brasil ficou mais perto da nota do bronze.</p><ol class="rank-list">${nearHtml}</ol></div>
      <div class="panel"><h3>Acima da média</h3><p class="hint">O Brasil passou da nota mediana da ocupação em <b class="num">${above}</b> das 64. As maiores diferenças:</p><ol class="rank-list">${aboveHtml}</ol></div>
      <div class="panel"><h3>Mulheres e homens</h3><p class="hint">${list.filter(p => p.gender === 'F').length} mulheres e ${list.filter(p => p.gender === 'M').length} homens, e o resultado da ocupação de cada um.</p><div class="bars">${gRows}</div>${legend}</div>
      <div class="panel panel--wide"><h3>As 64 notas do Brasil</h3><p class="hint">Cada foto é uma ocupação, agrupada pela nota, com a moldura na cor do resultado; as duplas aparecem lado a lado na mesma moldura. Toque para abrir a figurinha.</p><div class="notes">${notes}</div>${notesLegend}</div>
      <div class="panel panel--wide"><h3>O Brasil na história da WorldSkills</h3><p class="hint">O Brasil compete na WorldSkills desde ${(D.milestones || [])[0]?.year || hist[0]?.year}. Primeiro, os marcos da trajetória.</p>
        ${(D.milestones || []).length ? `<ol class="marcos">${D.milestones.map(m => `<li class="marco"><b class="marco__ano num">${m.year}</b><span class="marco__lugar">${esc(m.place)}</span><strong class="marco__titulo">${esc(m.title)}</strong><span class="marco__texto">${esc(m.text)}</span></li>`).join('')}</ol>` : ''}
        <p class="hint">Depois, edição por edição: em ${hist.length} edições desde ${hist[0]?.year}, <b class="num">${tot('ouro')}</b> ouros, <b class="num">${tot('prata')}</b> pratas e <b class="num">${tot('bronze')}</b> bronzes. A melhor campanha foi em casa, em ${best.city} ${best.year}, com ${best.ouro} ouros e ${pod(best)} pódios. Cada barra mostra o resultado de cada ocupação disputada, e a largura acompanha o número de ocupações.</p>
        <ol class="hist">${histRows}</ol>${histLegend}</div>`;
  bindFilters($('#almanac'));
  initTableScroll($('#almanac'));

  // mapa: ao passar o mouse ou focar num estado, a linha da tabela acende e a legenda mostra os números
  const info = $('#almanac .brmap__info'), infoDefault = info.innerHTML;
  const hot = uf => {
    $$('#almanac [data-uf]').forEach(el => { el.dataset.hot = el.dataset.uf === uf; });
    const u = uf && st[uf];
    info.innerHTML = u ? `<b>${UF[uf]}</b> · ${u.rank}º no ranking · ${compTxt(u)} · ${tally(u)}` : infoDefault;
  };
  $$('#almanac [data-uf]').forEach(el => {
    el.addEventListener('pointerenter', () => hot(el.dataset.uf));
    el.addEventListener('pointerleave', () => hot(''));
    el.addEventListener('focus', () => hot(el.dataset.uf));
    el.addEventListener('blur', () => hot(''));
  });
  $$('#almanac .brmap__call').forEach(g => g.addEventListener('click', () => $(`#almanac .brmap__uf[data-uf="${g.dataset.uf}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true }))));
  $$('#almanac .brmap__uf[role="button"]').forEach(el => el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  }));
  $('#almanac').addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openBack(+b.dataset.open); });
};
