import { $ } from '../lib/dom.js';
import { store } from '../store.js';
import { sticker } from '../components/sticker.js';
import { openFromSticker } from '../components/dialog.js';

// capa: leque com os medalhistas de prata e bronze
export const renderFan = () => {
  const { D, people } = store;
  const medal = D.skills.filter(s => s.medal === 'prata' || s.medal === 'bronze').sort((a, b) => (a.medal === 'prata' ? 0 : 1) - (b.medal === 'prata' ? 0 : 1) || b.mark - a.mark);
  const pick = medal.flatMap(s => s.competitors).slice(0, 5);
  const ordered = [pick[3], pick[1], pick[0], pick[2], pick[4]].filter(Boolean);
  $('#fan').innerHTML = ordered.map(pid => sticker(people[pid], { eager: true })).join('');
  $('#fan').addEventListener('click', openFromSticker);
};
