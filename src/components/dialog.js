import { $, $$, esc, reduce } from '../lib/dom.js';
import { MEDAL, UF, medaled, secVar } from '../lib/constants.js';
import { icon, ZOOM_BTN } from '../lib/icons.js';
import { n2, ord } from '../lib/text.js';
import { store } from '../store.js';
import { matches } from '../filters.js';
import { crewBox, natBlock } from './staff.js';
import { bindShare, shareMenu } from './share.js';

// verso da figurinha: o diálogo com fotos, resultado, trajetória, ocupação e equipe

const imgTag = (ph, extra = '') => `<img src="${ph.src}" ${extra}>`;
const bindThumbs = (dlg, photos) => $$('.thumbs button', dlg).forEach(b => b.addEventListener('click', () => {
  const ph = photos[+b.dataset.k];
  $$('.thumbs button', dlg).forEach(x => x.setAttribute('aria-pressed', x === b));
  $('#back-cap').textContent = ph.cap;
  $('#back-img').src = ph.src;
}));

// ficha de quem é da equipe de uma ocupação ("occ:i") ou da comissão ("gen:i")
export const openStaff = key => {
  const { D, bySkill } = store;
  const [kind, i] = key.split(':'); const x = kind === 'occ' ? D.teamOcc[+i] : D.general[+i];
  if (!x) return;
  const sk = kind === 'occ' ? bySkill[x.n] : null;
  const photos = [...x.imgs.map(src => ({ src, cap: D.credits.flickr })), { src: x.natImg, cap: D.credits.national }].filter(ph => ph.src);
  const place = x.dn ? 'Departamento Nacional' : x.uf ? UF[x.uf] : '';
  const dlg = $('#back');
  dlg.style.setProperty('--sec', sk ? secVar(sk.sector) : 'var(--cover)');
  dlg.innerHTML = `<div class="back__inner">
      <div class="back__media">
        <figure class="back__main" style="margin:0" data-zoom-root>${ZOOM_BTN}${imgTag(photos[0], `id="back-img" alt="${esc(x.name)}"`)}<figcaption id="back-cap">${esc(photos[0].cap)}</figcaption></figure>
        ${photos.length > 1 ? `<div class="thumbs" role="group" aria-label="Fotos">${photos.map((ph, k) => `<button type="button" aria-pressed="${k === 0}" data-k="${k}" aria-label="Foto ${k + 1} de ${photos.length}">${imgTag(ph, 'alt=""')}</button>`).join('')}</div>` : ''}
      </div>
      <div class="back__body">
        <div class="back__band">
          <span class="back__n num">${sk ? n2(x.n) : (x.dn ? 'DN' : x.uf || '—')}</span>
          <div class="back__id">
            <h2 class="back__name" id="back-name" tabindex="-1">${esc(x.name)}</h2>
            <div class="back__where">${sk ? `${x.wsRole ? esc(x.wsRole) : 'Equipe'} · ${esc(sk.pt)}` : esc(x.role)}${place ? ' · ' + esc(place) : ''}</div>
          </div>
          <div class="back__nav"><button class="icon-btn" type="button" data-close aria-label="Fechar">${icon.close}</button></div>
        </div>
        ${x.pastWS ? `<div class="exws"><h3><span class="ex-badge ex-badge--inline">${icon.star}</span>Ex-competidor da WorldSkills</h3><ul class="nat__list">${x.pastWS.map(a => `<li><b>${esc(a.event)}</b> · ${esc(a.skill)} · ${esc(a.medal)} (${a.position}º lugar)${a.note ? `<br>${esc(a.note)}` : ''}</li>`).join('')}</ul></div>` : ''}
        ${natBlock(x.national, sk ? x.n : null)}
      </div></div>`;
  bindThumbs(dlg, photos);
  $('[data-close]', dlg).addEventListener('click', () => dlg.close());
  if (!dlg.open) dlg.showModal();
  $('#back-name').focus({ preventScroll: true });
  $('.back__body', dlg).scrollTop = 0;
};

// figurinhas na ordem do álbum, só as que passam nos filtros: as setas do verso andam por elas
const order = () => Object.values(store.people).filter(matches).sort((a, b) => a.n - b.n || a.id - b.id).map(p => p.id);

export const openBack = id => {
  const { D, bySkill, people } = store;
  const p = people[id]; if (!p) return;
  const sk = bySkill[p.n];
  const ids = order(); const i = ids.indexOf(id);
  const prev = ids[(i - 1 + ids.length) % ids.length] ?? id, next = ids[(i + 1) % ids.length] ?? id;
  const photos = [
    { src: p.photos.portrait, cap: D.credits.portrait },
    { src: p.photos.news, cap: D.credits.news },
    ...p.photos.flickr.map(f => ({ src: f, cap: D.credits.flickr })),
    { src: p.natImg, cap: D.credits.national },
  ].filter(x => x.src);
  const partner = sk.competitors.filter(x => x !== id).map(x => people[x]);
  const where = [p.city, p.uf ? UF[p.uf] : null].filter(Boolean).join(', ');
  const dlg = $('#back');
  const goIdx = $$('[data-go]', dlg).indexOf(document.activeElement);
  dlg.style.setProperty('--sec', secVar(sk.sector));
  dlg.innerHTML = `<div class="back__inner">
      <div class="back__media">
        <figure class="back__main" style="margin:0" data-zoom-root>${ZOOM_BTN}<img id="back-img" src="${photos[0].src}" alt="${esc(p.name)}"><figcaption id="back-cap">${esc(photos[0].cap)}</figcaption></figure>
        <div class="thumbs" role="group" aria-label="Fotos">${photos.map((ph, k) => `<button type="button" aria-pressed="${k === 0}" data-k="${k}" aria-label="Foto ${k + 1} de ${photos.length}">${imgTag(ph, 'alt="" loading="lazy"')}</button>`).join('')}</div>
      </div>
      <div class="back__body">
        <div class="back__band">
          <span class="back__n num" aria-label="Figurinha ${p.n}">${n2(p.n)}</span>
          <div class="back__id">
            <h2 class="back__name" id="back-name" tabindex="-1">${esc(p.name)}</h2>
            <div class="back__where">${esc(sk.pt)}${where ? ' · ' + esc(where) : ''}${p.region ? ' · ' + esc(p.region) : ''} · ${esc(p.national?.[0]?.instituicao || p.entity)}</div>
          </div>
          <div class="back__nav">
            <button class="icon-btn" type="button" data-go="${prev}" aria-label="Figurinha anterior">${icon.left}</button>
            <button class="icon-btn" type="button" data-go="${next}" aria-label="Próxima figurinha">${icon.right}</button>
            <div class="share">
              <button class="icon-btn" type="button" data-share aria-haspopup="menu" aria-expanded="false" aria-label="Compartilhar esta figurinha" title="Compartilhar">${icon.share}</button>
              ${shareMenu(p)}
            </div>
            <button class="icon-btn" type="button" data-close aria-label="Fechar">${icon.close}</button>
          </div>
        </div>
        <p class="result-line">${medaled(sk) ? `<span class="medal" data-m="${sk.medal}">${MEDAL[sk.medal]}</span><span><b class="num">${ord(sk.position)}</b> de ${sk.total}</span>` : ''}<span><b class="num">${sk.mark}</b> pontos</span></p>
        ${sk.bestOfNation ? `<div class="bon"><span class="bon__stars" aria-hidden="true">${icon.star}${icon.star}${icon.star}</span><div><p class="bon__title">Best of Nation</p><p class="bon__text">Melhor da nação: a maior nota do Brasil em Shanghai, entre todas as ocupações${partner.length ? ', conquistada em dupla' : ''}.</p></div></div>` : ''}
        <div>
          <p class="muted" style="font-size:14px">${sk.gold ? `Ouro: ${esc(sk.gold.pt)}, com ${sk.gold.mark} pontos · ` : ''}${partner.length ? 'Em dupla com ' + partner.map(x => esc(x.name)).join(', ') : 'Ocupação individual'}</p>
        </div>
        ${p.story ? `<div style="display:grid;gap:6px"><h3>A trajetória</h3><p>${esc(p.story)}</p></div>` : ''}
        <div style="display:grid;gap:6px"><h3>A ocupação</h3><p class="muted">${esc(sk.about)}</p><p class="muted" style="font-size:13px">Nome oficial: ${esc(sk.en)}</p></div>
        ${natBlock((p.national || []).some(r => r.n && r.n !== p.n) ? p.national.filter(r => r.n && r.n !== p.n) : null, p.n)}
        ${crewBox(p.n, sk.pt)}
        <div class="back__links"><a href="${sk.url}" target="_blank" rel="noopener">Página da ocupação na WorldSkills</a><a href="https://results.worldskills.org/results?event=611&member=21" target="_blank" rel="noopener">Resultados oficiais</a></div>
      </div>
      <div class="back__toast" role="status" aria-live="polite" hidden></div></div>`;
  bindThumbs(dlg, photos);
  bindShare(dlg, p);
  $$('[data-go]', dlg).forEach(b => b.addEventListener('click', () => openBack(+b.dataset.go)));
  $('[data-close]', dlg).addEventListener('click', () => dlg.close());
  const crew = $('details.crew', dlg); if (crew) crew.open = true;
  if (!dlg.open) {
    dlg.showModal();
    // o verso abre girando a partir da figurinha clicada
    const from = document.querySelector(`.sticker[data-id="${id}"]:hover, .sticker[data-id="${id}"]:focus`) || store.lastSticker;
    if (!reduce && from && dlg.animate) {
      const a = from.getBoundingClientRect(), b = dlg.getBoundingClientRect();
      const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
      const sc = Math.max(0.15, a.width / b.width);
      dlg.getAnimations().forEach(x => x.cancel());
      dlg.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${sc}) perspective(1200px) rotateY(90deg)`, opacity: 0.4 },
        { transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${(1 + sc) / 2}) perspective(1200px) rotateY(40deg)`, opacity: 1, offset: 0.45 },
        { transform: 'none', opacity: 1 },
      ], { duration: 520, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }
  }
  // o foco vai para o nome; ao passar de figurinha pelas setas, fica na mesma seta
  if (goIdx >= 0) $$('[data-go]', dlg)[goIdx]?.focus({ preventScroll: true });
  else $('#back-name').focus({ preventScroll: true });
  $('.back__body', dlg).scrollTop = 0;
  try { history.replaceState(null, '', '#f' + id); } catch (e) {}
};

// abre o verso a partir de uma figurinha clicada (álbum, capa, placar)
export const openFromSticker = e => {
  const s = e.target.closest('.sticker');
  if (s) { store.lastSticker = s; openBack(+s.dataset.id); }
};

export const initDialog = () => {
  const dlg = $('#back');
  document.addEventListener('click', e => { const b = e.target.closest('[data-staff]'); if (b) openStaff(b.dataset.staff); });
  dlg.addEventListener('click', e => { if (e.target === e.currentTarget) e.currentTarget.close(); });
  // Esc fecha primeiro o menu de compartilhar, depois o verso
  dlg.addEventListener('cancel', e => {
    const menu = $('#back .share__menu');
    if (menu && !menu.hidden) { e.preventDefault(); e.currentTarget._closeShare?.(); }
  });
  dlg.addEventListener('close', () => { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} });
  // setas do teclado passam de figurinha
  document.addEventListener('keydown', e => {
    if (!dlg.open) return;
    if ($('#back .share__menu:not([hidden])')) return;
    if (e.key === 'ArrowRight') $('[data-go]:nth-child(2)', dlg)?.click();
    if (e.key === 'ArrowLeft') $('[data-go]', dlg)?.click();
  });
};
