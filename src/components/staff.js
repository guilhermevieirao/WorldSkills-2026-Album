import { esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { n2, shortName } from '../lib/text.js';
import { store } from '../store.js';

// foto miniatura de quem é da equipe de uma ocupação (key "occ:i") ou da comissão ("gen:i")
export const staffMini = (x, key) => `<button type="button" class="mini" data-staff="${key}" ${x.pastWS ? 'data-ex="true"' : ''} aria-label="${esc(x.name)}${x.wsRole ? ', ' + esc(x.wsRole) : ''}${x.pastWS ? ', ex-competidor da WorldSkills' : ''}: ver ficha"><span class="mini__photo"><img alt="" src="${x.imgs[0]}" loading="lazy" width="100" height="100">${x.pastWS ? `<span class="ex-badge">${icon.star}</span>` : ''}</span>${esc(shortName(x.name))}<small>${key.startsWith('gen') ? esc(x.role) : x.uf}</small></button>`;

// caixa "Equipe" da ocupação, embaixo das figurinhas e no verso
export const crewBox = (n, name) => {
  const list = store.D.teamOcc.filter(t => t.n === n);
  if (!list.length) return '';
  return `<details class="crew" data-n="${n}">
      <summary>Equipe · ${esc(name)} <span class="num">(${list.length})</span></summary>
      <div class="crew__list">${list.map(t => staffMini(t, `occ:${store.D.teamOcc.indexOf(t)}`)).join('')}</div>
    </details>`;
};

// etapa nacional: registros na mesma ocupação ficam juntos; outra ocupação vai numa caixa à parte
export const natBlock = (nat, n) => {
  if (!nat || !nat.length) return '';
  const line = r => `<li><b>${esc(r.perfil)}</b>${r.ocupacao ? ` · ${esc(r.ocupacao)}${r.n ? ` <span class="num">(#${n2(r.n)})</span>` : ''}` : ''} · ${esc(r.instituicao)}</li>`;
  const same = n ? nat.filter(r => !r.n || r.n === n) : nat;
  const other = n ? nat.filter(r => r.n && r.n !== n) : [];
  return `<div class="nat"><h3>Na etapa nacional</h3>
      ${same.length ? `<ul class="nat__list">${same.map(line).join('')}</ul>` : ''}
      ${other.length ? `<div class="nat__other"><h4>Outra ocupação na etapa nacional</h4>
        <p>Na seletiva brasileira ${same.length ? 'também ' : ''}atuou em outra ocupação. No mundial, a ocupação foi ${esc(store.bySkill[n]?.pt || '')} <span class="num">(#${n2(n)})</span>.</p>
        <ul class="nat__list">${other.map(line).join('')}</ul></div>` : ''}
    </div>`;
};
