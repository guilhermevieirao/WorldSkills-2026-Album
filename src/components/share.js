import { $, $$, esc } from '../lib/dom.js';
import { MEDAL, SITE_URL, medaled } from '../lib/constants.js';
import { icon } from '../lib/icons.js';
import { n2, shortName } from '../lib/text.js';
import { store } from '../store.js';

// compartilhar: menu com o compartilhamento do aparelho, WhatsApp, link e o card vertical para stories

// link direto da figurinha: a página dela no site, que tem a prévia (foto, nome e resultado)
// para WhatsApp, Discord e Instagram e abre o álbum já na figurinha
export const shareUrl = id => store.people[id]?.slug ? `${SITE_URL}f/${store.people[id].slug}/` : `${SITE_URL}#f${id}`;

const shareText = p => {
  const sk = store.bySkill[p.n];
  return `${shortName(p.name)} · #${n2(p.n)} ${sk.pt} na WorldSkills Shanghai 2026: ${medaled(sk) ? `${MEDAL[sk.medal]}, ${sk.position}º de ${sk.total}` : `${sk.mark} pontos`}.`;
};
const storyName = p => `${p.slug || 'figurinha-' + p.n}-worldskills-2026.jpg`;
// o card vertical (1080×1920) já vem pronto em og/stories/
const storyBlob = p => fetch(`og/stories/${p.slug}.jpg`).then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); });

// dentro de um iframe o compartilhamento e o download do navegador não funcionam
const framedView = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
const canNativeShare = () => !framedView && typeof navigator.share === 'function';

export const shareMenu = p => {
  // no WhatsApp vai o endereço /w/, cuja prévia é o card vertical
  const url = shareUrl(p.id), waUrl = p.slug ? `${SITE_URL}f/${p.slug}/w/` : url;
  const wa = `https://wa.me/?text=${encodeURIComponent(shareText(p) + ' ' + waUrl)}`;
  const item = (act, ic, label, extra = '') => `<button type="button" role="menuitem" class="share__item" data-act="${act}" ${extra}>${ic}<span>${label}</span></button>`;
  return `<div class="share__menu" role="menu" aria-label="Compartilhar" hidden>
      ${canNativeShare() ? item('native', icon.share, 'Compartilhar…') : ''}
      <a role="menuitem" class="share__item" data-act="wa" href="${wa}" target="_blank" rel="noopener">${icon.chat}<span>WhatsApp</span></a>
      ${item('copy', icon.link, 'Copiar link')}
      ${!framedView ? item('story', icon.down, 'Baixar card para stories') : ''}
    </div>`;
};

export const toastMsg = (msg, ms = 2600) => {
  const toast = $('#back .back__toast');
  if (!toast) return;
  clearTimeout(toast._t); toast.textContent = msg; toast.hidden = false;
  toast._t = setTimeout(() => { toast.hidden = true; }, ms);
};
// quando o navegador não deixa copiar, o link aparece num campo já selecionado
const toastInput = url => {
  const toast = $('#back .back__toast');
  clearTimeout(toast._t);
  toast.innerHTML = `<label>Copie o link: <input type="text" readonly value="${esc(url)}"></label>`;
  toast.hidden = false;
  const inp = $('input', toast);
  setTimeout(() => { inp.focus(); inp.select(); }, 0);
  toast._t = setTimeout(() => { toast.hidden = true; }, 12000);
};
const saveBlob = (blob, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
};

export const bindShare = (dlg, p) => {
  const btn = $('[data-share]', dlg), menu = $('.share__menu', dlg);
  const items = () => $$('[role="menuitem"]', menu);
  let story = null; // o card é preparado ao abrir o menu, para o compartilhamento sair na hora do toque
  const close = (focus = true) => { if (menu.hidden) return; menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (focus) btn.focus(); };
  const open = () => {
    menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); items()[0]?.focus();
    if (!story && (canNativeShare() || !framedView)) { story = storyBlob(p); story.catch(() => { story = null; }); }
  };
  dlg._closeShare = close;
  btn.addEventListener('click', () => (menu.hidden ? open() : close()));
  menu.addEventListener('keydown', e => {
    const list = items(), i = list.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
    if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
    if (e.key === 'Tab') close(false);
  });
  if (dlg._shareOutside) dlg.removeEventListener('click', dlg._shareOutside);
  dlg._shareOutside = e => { if (!menu.hidden && !e.target.closest('.share')) close(false); };
  dlg.addEventListener('click', dlg._shareOutside);
  menu.addEventListener('click', async e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act, url = shareUrl(p.id);
    close(act !== 'wa');
    if (act === 'native') {
      try {
        const blob = await (story || storyBlob(p));
        const file = new File([blob], storyName(p), { type: 'image/jpeg' });
        await navigator.share(navigator.canShare?.({ files: [file] })
          ? { files: [file], title: shortName(p.name), text: `${shareText(p)} ${url}` }
          : { title: shortName(p.name), text: shareText(p), url });
      } catch (err) {
        if (err?.name === 'AbortError') return;
        try { await navigator.share({ title: shortName(p.name), text: shareText(p), url }); } catch (e2) { if (e2?.name !== 'AbortError') toastMsg('Não deu para abrir o compartilhamento.'); }
      }
    }
    if (act === 'copy') {
      try { await navigator.clipboard.writeText(url); toastMsg('Link copiado. É só colar na conversa.'); } catch (err) { toastInput(url); }
    }
    if (act === 'story') {
      try {
        saveBlob(await (story || storyBlob(p)), storyName(p));
        toastMsg('Card salvo. É só postar nos stories ou no status.');
      } catch (err) {
        toastMsg('Não deu para salvar o card aqui.');
      }
    }
  });
};
