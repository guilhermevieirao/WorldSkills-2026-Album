// nome numa linha só, com a letra encolhida até caber: a figurinha e o crachá ficam sempre do mesmo
// tamanho, com nome curto ou comprido (a altura da linha é fixa no CSS, então encolher não muda a altura)
const SEL = '.sticker__name, .card-staff__name, .card-staff__role';
const MIN = 0.6; // abaixo disso, reticências
const width = new WeakMap(); // largura da última medida de cada nome

const fit = els => {
  els = els.filter(el => el.isConnected);
  els.forEach(el => { el.style.fontSize = ''; });
  // mede tudo de uma vez e só depois escreve, para não recalcular o layout a cada nome; as larguras
  // vêm do estilo calculado, com fração de pixel (clientWidth arredonda e deixava sobrar reticências)
  const box = els.map(el => { const cs = getComputedStyle(el); width.set(el, el.clientWidth); return [parseFloat(cs.width), parseFloat(cs.fontSize)]; });
  els.forEach(el => { el.style.width = 'max-content'; });
  const text = els.map(el => parseFloat(getComputedStyle(el).width));
  els.forEach((el, i) => {
    el.style.width = '';
    const [w, fs] = box[i], tw = text[i];
    if (w > 0 && tw > w) el.style.fontSize = `${Math.max(MIN, Math.floor((w - 0.5) / tw * 1000) / 1000) * fs}px`;
  });
};

export const initFit = () => {
  // refaz a medida quando a largura muda: tela girada, página do álbum que volta a aparecer, verso aberto
  const ro = new ResizeObserver(entries => {
    const els = entries.map(e => e.target).filter(el => el.clientWidth !== width.get(el));
    if (els.length) fit(els);
  });
  const watch = root => {
    if (root.matches?.(SEL)) ro.observe(root);
    root.querySelectorAll?.(SEL).forEach(el => ro.observe(el));
  };
  watch(document.body);
  new MutationObserver(list => list.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) watch(n); })))
    .observe(document.body, { childList: true, subtree: true });
  // a fonte do título chega depois: mede de novo com ela
  const all = () => fit([...document.querySelectorAll(SEL)]);
  document.fonts?.ready.then(all);
  document.fonts?.addEventListener('loadingdone', all);
};
