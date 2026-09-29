import { $, $$, esc, reduce } from '../lib/dom.js';
import { MEDAL, UF } from '../lib/constants.js';
import { icon, ZOOM_BTN } from '../lib/icons.js';
import { stateRanking } from '../lib/stats.js';
import { shortName } from '../lib/text.js';
import { store } from '../store.js';
import { setFilter } from '../filters.js';
import { openBack } from '../components/dialog.js';

// capa, 1º destaque: o Best of Nation e o estado da dupla, na mesma estrutura da capa do Brasil
export const renderStateSlide = () => {
  const { D, people } = store;
  const best = D.skills.find(s => s.bestOfNation);
  const duo = best ? best.competitors.map(id => people[id]).filter(Boolean) : [];
  const uf = duo[0]?.uf, slide = $('#slide-state');
  if (!uf || !UF[uf]) { slide.hidden = true; return; }
  const rank = stateRanking().st[uf].rank;
  const mine = Object.values(people).filter(p => p.uf === uf);
  const names = duo.map(p => shortName(p.name)).join(' e ');
  const ph = D.bonPhoto;
  const photo = ph ? `<figure class="cover__photo" data-zoom-root>${ZOOM_BTN.replace('Ampliar a foto', 'Ampliar a foto da dupla do Best of Nation')}
          <img src="${ph.src}" alt="${esc(`A dupla do Best of Nation, ${names}, com as medalhas na WorldSkills Shanghai 2026`)}" width="${ph.w}" height="${ph.h}" fetchpriority="high" decoding="async">
          <figcaption><b>${icon.star}${esc(names)}${icon.star}</b><span class="sr"> · </span><span>${esc(best.pt)} · ${best.mark} pontos</span></figcaption>
        </figure>` : '';
  slide.dataset.name = `Best of Nation, ${UF[uf]}`;
  slide.innerHTML = `<div class="wrap cover__grid">
        <div class="cover__text">
          <p class="cover__kicker">${icon.star}${esc(UF[uf])}</p>
          <h2 class="cover__title">Best of <span>Nation</span></h2>
          <p class="cover__lead">${esc(names)} ${duo.length > 1 ? 'fizeram' : 'fez'} a maior nota do Brasil em Shanghai: ${best.mark} pontos em ${esc(best.pt)}, com ${MEDAL[best.medal].toLowerCase()}.${best.brazilRecord ? ' É a maior pontuação de todos os tempos do Brasil na ocupação.' : ''}</p>
          <div class="cover__actions">
            <button class="btn btn--yellow" type="button" data-cover-uf="${uf}">Ver as ${mine.length} figurinhas</button>
            <button class="btn btn--ghost" type="button" data-cover-open="${duo[0].id}">Ver o Best of Nation</button>
            <a class="btn btn--ghost" href="#estados">${rank}º no ranking dos estados</a>
          </div>
        </div>
        ${photo}
      </div>`;
  slide.addEventListener('click', e => {
    const f = e.target.closest('[data-cover-uf]'); if (f) { setFilter({ uf: f.dataset.coverUf }, true); return; }
    const o = e.target.closest('[data-cover-open]'); if (o) openBack(+o.dataset.coverOpen);
  });
  slide.hidden = false;
};

// carrossel da capa: setas, bolinhas e o deslizar do dedo; passa sozinho até a pessoa mexer
export const initCover = () => {
  const cover = $('#topo'), track = $('#cover-track'), nav = $('#cover-nav');
  const slides = $$('.cover__slide', track).filter(s => !s.hidden);
  if (slides.length < 2) return;
  const dots = $$('.cover__dot', nav);
  slides.forEach((s, k) => s.setAttribute('aria-label', `${k + 1} de ${slides.length}: ${s.dataset.name}`));
  dots.forEach((d, k) => d.setAttribute('aria-label', 'Destaque ' + slides[k].getAttribute('aria-label')));
  nav.hidden = false;
  let cur = 0, timer = 0, auto = !reduce, hover = false, focus = false, settle = 0;
  const set = i => {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => { s.inert = k !== cur; });
    dots.forEach((d, k) => d.setAttribute('aria-current', k === cur));
  };
  const go = i => { set(i); track.scrollTo({ left: cur * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' }); };
  const tick = () => {
    clearTimeout(timer);
    if (auto && !hover && !focus && !document.hidden) timer = setTimeout(() => { go(cur + 1); tick(); }, 3500);
  };
  const stop = () => { auto = false; clearTimeout(timer); };
  nav.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    stop(); go(b.dataset.slide != null ? +b.dataset.slide : cur + +b.dataset.step);
  });
  // deslizar com o dedo ou com o trackpad: o slide que parar encaixado na tela vira o atual
  // (posições no meio do caminho, como numa rolagem suave ainda em curso, não contam)
  track.addEventListener('scroll', () => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      const w = track.clientWidth, i = Math.round(track.scrollLeft / w);
      if (i !== cur && Math.abs(track.scrollLeft - i * w) < 2) set(i);
    }, 90);
  }, { passive: true });
  track.addEventListener('pointerdown', stop, { passive: true });
  track.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) stop(); }, { passive: true });
  // pausa com o mouse em cima ou com o foco dentro da capa
  cover.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hover = true; tick(); } });
  cover.addEventListener('pointerleave', () => { hover = false; tick(); });
  cover.addEventListener('focusin', () => { focus = true; tick(); });
  cover.addEventListener('focusout', e => { if (!cover.contains(e.relatedTarget)) { focus = false; tick(); } });
  document.addEventListener('visibilitychange', tick);
  addEventListener('resize', () => track.scrollTo({ left: cur * track.clientWidth }));
  set(0); tick();
};
