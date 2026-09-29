import { $, esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { shortName } from '../lib/text.js';
import { store } from '../store.js';

const ROLE_ORDER = ['Delegado Oficial', 'Delegado Técnico', 'Delegado Técnico Adjunto', 'Observador Oficial', 'Líder de Competidores', 'Suporte Competidores', 'Suporte Experts', 'Suporte Técnico', 'Psicólogo'];
const ROLE_PLURAL = { 'Delegado Oficial': 'Delegado oficial', 'Delegado Técnico': 'Delegado técnico', 'Delegado Técnico Adjunto': 'Delegados técnicos adjuntos', 'Observador Oficial': 'Observador oficial', 'Líder de Competidores': 'Líderes de competidores', 'Suporte Competidores': 'Suporte aos competidores', 'Suporte Experts': 'Suporte aos experts', 'Suporte Técnico': 'Suporte técnico', 'Psicólogo': 'Psicologia' };

// comissão da delegação, em crachás por função, e a foto da delegação reunida
export const renderTeam = () => {
  const { D } = store;
  const roles = ROLE_ORDER.map(r => [r, D.general.filter(g => g.role === r)]).filter(x => x[1].length);
  $('#roles').innerHTML = roles.map(([r, list]) => `<div class="role"><h3>${ROLE_PLURAL[r] || r} <span class="num" style="color:var(--ink-3)">(${list.length})</span></h3>
      <div class="role__list">${list.map(g => `<button type="button" class="card-staff" data-staff="gen:${D.general.indexOf(g)}" ${g.pastWS ? 'data-ex="true"' : ''} aria-label="${esc(g.name)}, ${esc(g.role)}${g.pastWS ? ', ex-competidor da WorldSkills' : ''}: ver ficha"><span class="card-staff__photo"><img alt="" src="${g.imgs[0]}" loading="lazy" width="160" height="200">${g.pastWS ? `<span class="ex-badge">${icon.star}</span>` : ''}</span>
      <span class="card-staff__uf" ${g.dn ? 'title="Departamento Nacional"' : ''}>${g.dn ? 'DN' : g.uf || '—'}</span>
      <span class="card-staff__band"><span class="card-staff__name">${esc(shortName(g.name))}</span><span class="card-staff__role">${esc(g.role)}</span></span></button>`).join('')}</div></div>`).join('');
  $('#delegation-frame').innerHTML = `<img src="${D.delegation}" alt="A delegação brasileira reunida" width="1024" height="683" loading="lazy">`;
};
