import { $, $$, esc } from '../lib/dom.js';
import { UF } from '../lib/constants.js';
import { n2 } from '../lib/text.js';
import { store } from '../store.js';
import { byPoints, pts } from '../lib/stats.js';
import { bindFilters } from '../filters.js';
import { sticker } from '../components/sticker.js';
import { openFromSticker } from '../components/dialog.js';
import { initTableScroll } from '../components/table-scroll.js';

// placar do Brasil: medalhas, melhor nota e quadro de pontos
export const renderBoard = () => {
  const { D, people } = store;
  const skills = D.skills;
  const cnt = m => skills.filter(s => s.medal === m).length;
  const mt = byPoints();
  const br = mt.find(r => r.member === 'Brazil');
  const am = mt.filter(r => r.americas);
  const row = r => `<tr class="${r.member === 'Brazil' ? 'br' : ''}"><td class="num">${r.pointsRank}º</td><td>${esc(r.pt)}</td><td class="num">${pts(r.points)}</td><td class="num">${r.entries}</td></tr>`;
  // os 10 primeiros sempre à vista; com o Brasil fora deles, a linha do Brasil fica logo abaixo e o meio se abre num botão
  const inTop = br.pointsRank <= 10;
  const top = mt.slice(0, 10), mid = inTop ? [] : mt.slice(10, br.pointsRank - 1), low = mt.slice(inTop ? 10 : br.pointsRank);
  const lowText = open => inTop
    ? `${open ? 'Esconder' : 'Ver'} do 11º ao ${mt.length}º`
    : open ? 'Esconder os países abaixo do Brasil' : `Ver os ${low.length} abaixo do Brasil`;
  const best = skills.find(s => s.bestOfNation);
  const duo = best.competitors.map(id => people[id]);
  const ufs = [...new Set(duo.map(p => UF[p.uf]))];

  $('#board').innerHTML = `
      <div class="panel">
        <h3>Medalhas</h3>
        <div class="medals medals--3">
          <button class="medal-tile" type="button" data-m="prata" data-filter="res:prata"><b class="num">${cnt('prata')}</b><span>Prata</span></button>
          <button class="medal-tile" type="button" data-m="bronze" data-filter="res:bronze"><b class="num">${cnt('bronze')}</b><span>Bronze</span></button>
          <button class="medal-tile" type="button" data-m="excelencia" data-filter="res:excelencia"><b class="num">${cnt('excelencia')}</b><span>Excelência</span></button>
        </div>
        <div class="rank"><b class="num">${br.pointsRank}º</b><span>no quadro de pontos entre ${mt.length} países e regiões, com ${pts(br.points)} pontos nas ${br.entries} ocupações, e ${am.indexOf(br) + 1}º entre os países das Américas. As pratas vieram em Tecnologia da Moda e em Integração de Sistemas Robóticos.</span></div>
      </div>
      <div class="panel best">
        <h3>Melhor nota do Brasil</h3>
        <div class="best__grid">
          <div class="best__stickers">${duo.map(p => sticker(p, { eager: true })).join('')}</div>
          <div class="best__text">
            <p class="best__score"><b class="num">${best.mark}</b> pontos</p>
            <p>${esc(duo.map(p => p.name).join(' e '))}, ${ufs.length === 1 ? 'de ' + esc(ufs[0]) : 'de ' + esc(ufs.join(' e '))} (${esc(duo.map(p => p.city).filter(Boolean).join(' e '))}), fizeram a maior nota do Brasil em Shanghai, em ${esc(best.pt)} <span class="num">(#${n2(best.n)})</span>.</p>
            <p class="best__award">Prêmio Best of Nation, dado ao melhor resultado de cada país, e medalha de bronze.</p>
          </div>
        </div>
      </div>
      <div class="panel panel--wide">
        <h3>Quadro de pontos</h3>
        <p class="hint">A soma das notas de cada país em todas as ocupações que disputou (nas duplas, a nota conta uma vez), o critério do comparativo oficial da WorldSkills por total de pontos.</p>
        <div class="mt-wrap"><div class="mt-scroll"><table class="mt"><thead><tr><th>Posição</th><th>País</th><th>Pontos</th><th>Ocupações</th></tr></thead>
          <tbody>${top.map(row).join('')}</tbody>
          ${inTop ? '' : `<tbody id="mt-mid" hidden>${mid.map(row).join('')}</tbody>
          <tbody><tr class="gap" id="mt-gap"><td colspan="4"><button class="mt-more" type="button" data-more="mt-mid" aria-expanded="false">Ver do 11º ao ${br.pointsRank - 1}º</button></td></tr>${row(br)}</tbody>`}
          <tbody id="mt-low" hidden>${low.map(row).join('')}</tbody>
        </table></div></div>
        ${low.length ? `<button class="mt-more mt-more--low" type="button" data-more="mt-low" aria-expanded="false">${lowText(false)}</button>` : ''}
      </div>`;
  $$('#board .mt-more').forEach(b => b.addEventListener('click', () => {
    const t = $('#' + b.dataset.more); t.hidden = !t.hidden; b.setAttribute('aria-expanded', !t.hidden);
    if (b.dataset.more === 'mt-mid') b.textContent = t.hidden ? `Ver do 11º ao ${br.pointsRank - 1}º` : 'Esconder do 11º ao ' + (br.pointsRank - 1) + 'º';
    else b.textContent = lowText(!t.hidden);
  }));
  bindFilters($('#board'));
  initTableScroll($('#board'));
  $('#board .best__stickers').addEventListener('click', openFromSticker);
};
