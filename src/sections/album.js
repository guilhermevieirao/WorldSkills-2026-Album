import { $, $$, esc, reduce } from '../lib/dom.js';
import { SECTORS, secVar } from '../lib/constants.js';
import { n2 } from '../lib/text.js';
import { FILTERS, state, store } from '../store.js';
import { matches, staffHit } from '../filters.js';
import { slot, sticker } from '../components/sticker.js';
import { crewBox, staffMini } from '../components/staff.js';
import { bindFoil } from '../components/foil.js';
import { openFromSticker } from '../components/dialog.js';

// o álbum: uma página por setor (ou todas em ordem numérica), com um espaço por competidor

const occBlock = s => `
          <div class="occ ${s.competitors.length > 1 ? 'occ--duo' : ''}" data-n="${s.n}" style="--sec:${secVar(s.sector)}">
            <div class="occ__head"><span class="occ__n num">${n2(s.n)}</span><span class="occ__name">${esc(s.pt)}</span></div>
            <div class="occ__stickers" style="--cols:${s.competitors.length}">${s.competitors.map(pid => `<div data-cell="${pid}"></div>`).join('')}</div>
            ${crewBox(s.n, s.pt)}
          </div>`;

export function buildAlbum() {
  const { D } = store;
  const album = $('#album');
  if (state.order === 'num') {
    const sks = [...D.skills].sort((a, b) => a.n - b.n);
    album.innerHTML = `<section class="page page--all" id="page-all" aria-labelledby="t-all">
        <div class="page__head">
          <h2 class="page__title" id="t-all"><span class="page__letter" aria-hidden="true">#</span>Todas as ocupações</h2>
          <div class="page__stats"><span><b class="num">64</b>ocupações em ordem numérica</span></div>
        </div>
        <div class="page__grid">${sks.map(occBlock).join('')}</div>
      </section>`;
  } else {
    album.innerHTML = SECTORS.map((sec, i) => {
      const sks = D.skills.filter(s => s.sector === sec.name).sort((a, b) => a.n - b.n);
      const comps = sks.reduce((a, s) => a + s.competitors.length, 0);
      const med = sks.filter(s => s.medal === 'prata' || s.medal === 'bronze').length;
      const exc = sks.filter(s => s.medal === 'excelencia').length;
      return `<section class="page" id="page-${sec.key}" style="--sec:var(--s-${sec.key})" aria-labelledby="t-${sec.key}">
          <div class="page__head">
            <h2 class="page__title" id="t-${sec.key}"><span class="page__letter" aria-label="Grupo ${'ABCDEF'[i]}">${'ABCDEF'[i]}</span>${sec.name}</h2>
            <div class="page__stats"><span><b class="num">${sks.length}</b>ocupações</span><span><b class="num">${comps}</b>competidores</span><span><b class="num">${med}</b>pódios</span><span><b class="num">${exc}</b>excelências</span></div>
          </div>
          <div class="page__grid">${sks.map(occBlock).join('')}</div>
        </section>`;
    }).join('');
  }
}

// cola ou descola cada figurinha conforme os filtros e atualiza contador, botões e caixas de equipe
export function renderAlbum(first) {
  const { D, bySkill, people } = store;
  const album = $('#album');
  album.dataset.compact = state.compact;
  let shown = 0;
  $$('#album .page').forEach(page => {
    let pageShown = 0;
    $$('.occ', page).forEach(occ => {
      const sk = bySkill[+occ.dataset.n];
      let occShown = 0;
      sk.competitors.forEach(pid => {
        const p = people[pid];
        const cell = $(`[data-cell="${pid}"]`, occ);
        const ok = matches(p);
        const was = cell.dataset.ok;
        if (was !== String(ok)) {
          cell.innerHTML = ok ? sticker(p) : slot(p);
          if (!first && ok && !reduce) cell.firstElementChild.classList.add('stick-in');
          cell.dataset.ok = ok;
        }
        if (ok) { occShown++; shown++; }
      });
      occ.hidden = state.compact && !occShown;
      pageShown += occShown;
    });
    page.hidden = !pageShown;
  });
  // equipes: abre a caixa de quem a busca achou e destaca a pessoa
  $$('#album details.crew').forEach(d => {
    const sk = bySkill[+d.dataset.n];
    let hits = 0;
    $$('.mini', d).forEach(m => { const hit = !!state.q && staffHit(D.teamOcc[+m.dataset.staff.split(':')[1]], sk); m.dataset.hit = hit; hits += hit; });
    if (hits && !d.open) { d.dataset.auto = 'true'; d.open = true; }
    else if (!hits && d.dataset.auto) { delete d.dataset.auto; d.open = false; }
  });
  // comissão: não tem figurinha, então aparece numa faixa acima do álbum
  const gen = state.q ? D.general.filter(g => staffHit(g)) : [];
  const box = $('#q-staff');
  box.hidden = !gen.length;
  box.innerHTML = gen.length ? `<h3>Na comissão <span class="num">(${gen.length})</span></h3><div class="q-staff__list">${gen.map(g => staffMini(g, `gen:${D.general.indexOf(g)}`)).join('')}</div>` : '';
  if (gen.length) $$('.mini', box).forEach(m => { m.dataset.hit = 'true'; });
  $('#f-count').textContent = shown;
  $('#empty').dataset.show = shown === 0 && !gen.length;
  const any = FILTERS.some(k => state[k]);
  $('#f-toggle').dataset.n = ['uf', 'city', 'reg', 'sec', 'gender', 'ent', 'fmt'].filter(k => state[k]).length;
  $('#f-clear').hidden = !any;
  for (const k of ['q', 'uf', 'city', 'reg', 'sec', 'gender', 'ent', 'fmt']) $(`#f-${k}-wrap`).dataset.on = !!state[k];
  $$('.order .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.order === state.order));
  $$('.finder__row .chip[data-res]').forEach(c => c.setAttribute('aria-pressed', c.dataset.res === state.res));
  $('#f-compact').setAttribute('aria-pressed', state.compact);
  $$('#board [data-filter], #almanac [data-filter]').forEach(b => {
    const [k, v] = b.dataset.filter.split(':');
    b.setAttribute('aria-pressed', state[k] === v);
    if (state[k] === v && b.matches('.brmap__uf')) b.parentNode.insertBefore(b, b.parentNode.querySelector('.brmap__lbl, .brmap__call'));
  });
  bindFoil();
}

export const initAlbum = () => $('#album').addEventListener('click', openFromSticker);
