import { esc } from '../lib/dom.js';
import { MEDAL, MEDAL_SHORT, medaled, secVar } from '../lib/constants.js';
import { icon } from '../lib/icons.js';
import { n2, ord, shortName } from '../lib/text.js';
import { store } from '../store.js';

// figurinha do competidor: foto, número, UF, faixa com o nome e o resultado
export const sticker = (p, opts = {}) => {
  const sk = store.bySkill[p.n];
  const [w, h] = store.D.dims[p.photos.portrait] || [480, 640];
  const tag = opts.static ? 'div' : 'button';
  return `<${tag} class="sticker" ${tag === 'button' ? 'type="button"' : ''} data-id="${p.id}" data-m="${sk.medal}"
      aria-label="${esc(p.name)}, ${esc(sk.pt)}${medaled(sk) ? `, ${esc(MEDAL[sk.medal])}, ${sk.position}º de ${sk.total}` : ''}${sk.bestOfNation ? ', Best of Nation: melhor nota do Brasil' : ''}" style="--tint:${secVar(sk.sector)};--rot:${(((p.id * 37) % 5) - 2) * 0.45}deg">
      <span class="sticker__photo">
        <span class="sticker__n num">${n2(p.n)}</span>
        ${p.uf ? `<span class="sticker__uf">${p.uf}</span>` : ''}
        <img src="${p.photos.portrait}" alt="" width="${w}" height="${h}" loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async">
        ${sk.bestOfNation ? `<span class="sticker__bon" aria-hidden="true">${icon.star}Best of Nation${icon.star}</span>` : ''}
      </span>
      <span class="sticker__band"><span class="sticker__name">${esc(shortName(p.name))}</span><span class="sticker__occ">${esc(sk.pt)}</span></span>
      ${medaled(sk)
        ? `<span class="sticker__res"><span class="medal" data-m="${sk.medal}">${MEDAL_SHORT[sk.medal]}</span><span><b class="num">${ord(sk.position)}</b> de ${sk.total}</span></span>`
        : '<span class="sticker__res sticker__res--blank" aria-hidden="true"><span class="medal">&nbsp;</span><span><b class="num">0</b> de 0</span></span>'}
    </${tag}>`;
};

// lacuna impressa: o lugar da figurinha que o filtro tirou
export const slot = p => `<div class="slot peel-in" aria-hidden="true"><b class="num">${n2(p.n)}</b><span>${esc(shortName(p.name))}</span></div>`;
