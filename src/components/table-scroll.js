import { $$ } from '../lib/dom.js';

// tabela larga no celular: rola de lado com o nome fixo; a borda direita esmaece enquanto houver colunas escondidas
export const initTableScroll = root => $$('.mt-wrap', root).forEach(wrap => {
  const box = wrap.firstElementChild;
  const upd = () => {
    wrap.dataset.over = box.scrollWidth > box.clientWidth + 2;
    wrap.dataset.more = box.scrollLeft + box.clientWidth < box.scrollWidth - 2;
  };
  box.addEventListener('scroll', upd, { passive: true });
  // a caixa muda com a tela; a tabela, quando a fonte chega
  const ro = new ResizeObserver(upd);
  ro.observe(box);
  ro.observe(box.firstElementChild);
});
