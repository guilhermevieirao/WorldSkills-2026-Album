// foto ampliada: a lupa de qualquer [data-zoom-root] abre a foto inteira; um toque, Esc ou × fecham
export const initZoom = () => {
  const dlg = document.getElementById('zoom');
  let from = null;
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-zoom]');
    if (!b) return;
    const root = b.closest('[data-zoom-root]'), img = root && root.querySelector('img');
    if (!img || !img.src) return;
    from = b;
    const z = dlg.querySelector('img');
    z.src = img.currentSrc || img.src; z.alt = img.alt || '';
    dlg.querySelector('.zoom__cap').textContent = root.querySelector('figcaption')?.textContent || img.alt || '';
    dlg.showModal();
    dlg.querySelector('.zoom__close').focus();
  });
  dlg.addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => { dlg.querySelector('img').removeAttribute('src'); if (from?.isConnected) from.focus({ preventScroll: true }); });
};
