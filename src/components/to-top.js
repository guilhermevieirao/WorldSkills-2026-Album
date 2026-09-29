// botão amarelo de voltar ao topo, que aparece depois da primeira tela
export const initToTop = () => {
  const btn = document.getElementById('to-top');
  const sync = () => { btn.dataset.show = scrollY > innerHeight * 0.9; };
  addEventListener('scroll', sync, { passive: true });
  sync();
  btn.addEventListener('click', () => { scrollTo({ top: 0 }); document.getElementById('topo').focus({ preventScroll: true }); });
};
