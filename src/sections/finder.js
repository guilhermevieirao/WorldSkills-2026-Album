import { $, $$, esc } from '../lib/dom.js';
import { REGIONS, SECTORS, UF } from '../lib/constants.js';
import { FILTERS, state, store } from '../store.js';
import { setFilter } from '../filters.js';

// barra "Procurar figurinha": busca, seletores, resultados e organização do álbum
export const initFinder = () => {
  const all = Object.values(store.people);
  const count = f => all.filter(f).length;
  const ufs = [...new Set(all.map(p => p.uf))].filter(Boolean).sort((a, b) => UF[a].localeCompare(UF[b]));
  $('#f-uf').insertAdjacentHTML('beforeend', ufs.map(u => `<option value="${u}">${UF[u]} (${count(p => p.uf === u)})</option>`).join(''));
  $('#f-reg').insertAdjacentHTML('beforeend', REGIONS.filter(r => count(p => p.region === r)).map(r => `<option value="${r}">${r} (${count(p => p.region === r)})</option>`).join(''));
  $('#f-sec').insertAdjacentHTML('beforeend', SECTORS.map(s => `<option value="${s.name}">${s.name}</option>`).join(''));
  const cities = [...new Set(all.filter(p => p.city).map(p => `${p.city}|${p.uf}`))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  $('#f-city').insertAdjacentHTML('beforeend', cities.map(c => { const [n, u] = c.split('|'); return `<option value="${esc(c)}">${esc(n)} (${u}) · ${count(p => `${p.city}|${p.uf}` === c)}</option>`; }).join(''));
  for (const k of ['city', 'gender', 'ent', 'fmt']) $(`#f-${k}`).addEventListener('change', e => setFilter({ [k]: e.target.value }));
  $$('.order .chip').forEach(c => c.addEventListener('click', () => state.order !== c.dataset.order && setFilter({ order: c.dataset.order })));
  // desktop: gênero, SENAI/Senac e formato ficam ao lado dos resultados; no celular, dentro da gaveta de filtros
  const wide = matchMedia('(min-width: 721px)');
  const place = () => {
    ['f-gender-wrap', 'f-ent-wrap', 'f-fmt-wrap'].forEach(id => {
      const el = $('#' + id);
      if (wide.matches) $('.finder__row').appendChild(el); else $('#f-selects').appendChild(el);
    });
    if (wide.matches) $('.finder__bar').appendChild($('#f-clear')); else $('.finder__row').appendChild($('#f-clear'));
  };
  place(); wide.addEventListener('change', place);
  let t;
  $('#f-q').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => setFilter({ q: e.target.value.trim() }), 120); });
  $('#f-uf').addEventListener('change', e => setFilter({ uf: e.target.value }));
  $('#f-reg').addEventListener('change', e => setFilter({ reg: e.target.value }));
  $('#f-sec').addEventListener('change', e => setFilter({ sec: e.target.value }));
  $$('.finder__row .chip[data-res]').forEach(c => c.addEventListener('click', () => setFilter({ res: c.dataset.res })));
  $('#f-compact').addEventListener('click', () => setFilter({ compact: !state.compact }));
  $('#f-toggle').addEventListener('click', () => {
    const f = $('.finder'); const open = f.dataset.open !== 'true';
    f.dataset.open = open; $('#f-toggle').setAttribute('aria-expanded', open);
  });
  const clear = () => setFilter(Object.fromEntries(FILTERS.map(k => [k, ''])));
  $('#f-clear').addEventListener('click', clear);
  $('#empty-clear').addEventListener('click', clear);
};
