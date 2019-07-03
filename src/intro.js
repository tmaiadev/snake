import * as Controls from './controls';
import { isMobile } from './constants';
import Gameplay from './gameplay';

export default () => {
  const $intro = document.querySelector('.intro');

  // Update high score
  const $hs = document.querySelector('.intro__hs__number');
  $hs.innerHTML = localStorage.getItem('hs') || 0;

  // Update instructions
  const $instructions = document.querySelector('.intro__instructions');
  $instructions.innerHTML = isMobile
    ? 'Tap to start'
    : 'Press ENTER to start';
  
  function goToMenu() {
    $intro.classList.add('hidden');
    Gameplay();
  }

  Controls.listenOnce(Controls.KEYS.ENTER, goToMenu);
}
