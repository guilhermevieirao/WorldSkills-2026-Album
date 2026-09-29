import { $$, reduce } from '../lib/dom.js';

const SHINY = '.sticker[data-m="prata"], .sticker[data-m="bronze"]';

// prata e bronze: o brilho da figurinha segue o ponteiro
export const bindFoil = () => {
  if (reduce) return;
  $$(SHINY).forEach(el => {
    if (el.dataset.foil) return;
    el.dataset.foil = 1;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '50%'); el.style.setProperty('--my', '30%'); });
  });
};

// no celular não há cursor: o brilho corre com a rolagem
export const initFoilSweep = () => {
  if (reduce || !matchMedia('(hover: none), (pointer: coarse)').matches) return;
  let raf = 0;
  const sweep = () => {
    raf = 0;
    $$(SHINY).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const t = 1 - (r.top + r.height / 2) / innerHeight;
      el.style.setProperty('--mx', (t * 120 - 10).toFixed(1) + '%');
      el.style.setProperty('--my', (t * 80 + 10).toFixed(1) + '%');
    });
  };
  addEventListener('scroll', () => { raf ||= requestAnimationFrame(sweep); }, { passive: true });
};
