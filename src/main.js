import './styles/index.css';
import { $ } from './lib/dom.js';
import { store } from './store.js';
import { initZoom } from './components/zoom.js';
import { initToTop } from './components/to-top.js';
import { initFoilSweep } from './components/foil.js';
import { initFit } from './components/fit.js';
import { initDialog, openBack } from './components/dialog.js';
import { renderFan } from './sections/fan.js';
import { initCover, renderStateSlide } from './sections/cover.js';
import { renderBoard } from './sections/board.js';
import { buildAlbum, initAlbum, renderAlbum } from './sections/album.js';
import { renderAlmanac } from './sections/almanac.js';
import { initFinder } from './sections/finder.js';
import { renderTeam } from './sections/team.js';
import { renderFooter } from './sections/footer.js';

initZoom();
initToTop();
initFoilSweep();
initFit();
initDialog();
initAlbum();

fetch('data.json').then(r => r.json()).then(data => {
  store.D = data;
  store.bySkill = Object.fromEntries(data.skills.map(s => [s.n, s]));
  store.people = Object.fromEntries(data.people.map(p => [p.id, p]));
  renderFooter();
  renderFan();
  renderStateSlide();
  initCover();
  renderBoard();
  buildAlbum();
  renderAlmanac();
  initFinder();
  renderAlbum(true);
  renderTeam();
  // link direto de uma figurinha: /#f12
  const m = location.hash.match(/^#f(\d+)$/);
  if (m) openBack(+m[1]);
}).catch(() => {
  $('#slide-state').hidden = true;
  $('#album').innerHTML = '<p class="empty-note" data-show="true">Não foi possível carregar os dados do álbum. Recarregue a página.</p>';
});
