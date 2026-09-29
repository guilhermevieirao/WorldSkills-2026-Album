import { $, esc } from '../lib/dom.js';
import { SOCIAL, ZOOM_BTN } from '../lib/icons.js';
import { store } from '../store.js';

// rodapé: fontes dos dados e créditos de quem fez a página
export const renderFooter = () => {
  const { D } = store;
  const A = D.author;
  if (A) $('#author').innerHTML = `<span class="author__photo" data-zoom-root><img src="${A.photo}" alt="${esc(A.name)}" loading="lazy" decoding="async">${ZOOM_BTN.replace('Ampliar a foto', 'Ampliar a foto de ' + esc(A.name))}</span>
      <div><h2 class="author__name">${esc(A.name)}</h2><p class="author__role">${esc(A.role)} · criou esta página</p>
        <ul class="author__links">${A.links.map(l => `<li><a href="${l.url}" target="_blank" rel="noopener me">${SOCIAL[l.label] || ''}${esc(l.label)}</a></li>`).join('')}</ul></div>`;
  $('#sources').innerHTML = D.sources.map(s => s.url ? `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>` : `<li>${esc(s.label)}</li>`).join('');
};
