import { $, $$, reduce } from './lib/dom.js';
import { SECTOR_EN, UF } from './lib/constants.js';
import { norm } from './lib/text.js';
import { state, store } from './store.js';
import { buildAlbum, renderAlbum } from './sections/album.js';

export const qWords = () => norm(state.q).split(/\s+/).filter(w => w && w !== '#');
// número da ocupação com ou sem # e zero (9, 09, #9, #09)
const isNum = w => /^#?(\d{1,2})$/.exec(w);

// equipe: ao menos uma palavra tem de estar no nome; as outras podem ser a ocupação ou o número.
// comissão: vale o nome ou a função ("delegado", "psicólogo")
export const staffHit = (x, sk) => {
  const words = qWords();
  if (!words.length) return false;
  const name = norm(x.name);
  const ctx = norm(sk ? [sk.pt, sk.en, sk.sector, SECTOR_EN[sk.sector], x.wsRole].join(' ') : x.role);
  let byName = false, byRole = false;
  const ok = words.every(w => {
    const num = isNum(w);
    if (num) return !!sk && +num[1] === sk.n;
    if (w.length > 2 && name.includes(w)) { byName = true; return true; }
    if (!sk && w.length > 2 && ctx.includes(w)) { byRole = true; return true; }
    return !!sk && ctx.includes(w);
  });
  return ok && (byName || byRole);
};

// a figurinha passa em todos os filtros ativos?
export const matches = p => {
  const sk = store.bySkill[p.n];
  if (state.uf && p.uf !== state.uf) return false;
  if (state.reg && p.region !== state.reg) return false;
  if (state.sec && sk.sector !== state.sec) return false;
  if (state.city && `${p.city}|${p.uf}` !== state.city) return false;
  if (state.gender && p.gender !== state.gender) return false;
  if (state.ent && p.entity !== state.ent) return false;
  if (state.fmt && (sk.team ? 'dupla' : 'solo') !== state.fmt) return false;
  if (state.res === 'top5') { if (sk.position > 5) return false; }
  else if (state.res && sk.medal !== state.res) return false;
  if (state.q) {
    // palavras em português ou inglês
    const hay = norm([p.name, p.official, sk.pt, sk.en, p.city, p.uf, UF[p.uf], sk.sector, SECTOR_EN[sk.sector]].join(' '));
    const ok = qWords().every(w => {
      const num = isNum(w);
      return num ? +num[1] === sk.n : hay.includes(w);
    });
    // a figurinha também aparece quando a busca acha alguém da equipe da ocupação
    if (!ok && !store.D.teamOcc.some(t => t.n === p.n && staffHit(t, sk))) return false;
  }
  return true;
};

export const setFilter = (patch, scroll) => {
  Object.assign(state, patch);
  for (const k of ['q', 'uf', 'city', 'reg', 'sec', 'gender', 'ent', 'fmt']) $(`#f-${k}`).value = state[k];
  if ('order' in patch) { buildAlbum(); renderAlbum(true); } else renderAlbum();
  if (scroll) $('#album').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};

// botões com data-filter="chave:valor" (placar e almanaque): liga ou desliga o filtro e leva ao álbum
export const bindFilters = root => $$('[data-filter]', root).forEach(b => b.addEventListener('click', () => {
  const [k, v] = b.dataset.filter.split(':');
  setFilter({ [k]: state[k] === v ? '' : v }, true);
}));
