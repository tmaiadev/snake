import * as serviceWorker from './serviceWorker';
import intro from './intro';
import './style.css';

// Initialize Intro
intro();

function onResize() {
  const $game = document.querySelector('.game');
  $game.setAttribute('style', '');

  const rect = $game.getBoundingClientRect();

  const wWidth = window.innerWidth - 64;
  const wHeight = window.innerHeight - 64;

  if (rect.width > rect.height) {
    // landscape
    const height = wWidth * 0.5628;
    
    if (height > wHeight) {
      const width = wHeight * 1.77777777778;
      $game.style.width = `${width}px`;
      $game.style.height = `${wHeight}px`;
      return;
    }

    $game.style.width = `${wWidth}px`;
    $game.style.height = `${height}px`;
    return;
  }


  // portrait
  const width = wHeight * 0.5628;
  $game.style.width = `${width}px`;
  $game.style.height = `${wHeight}px`;
}

window.addEventListener('load', onResize);
window.addEventListener('resize', onResize);

// Hack to prevent iOS from bouncing
// when swiping up and down
document.addEventListener('touchmove', (evt) => {
  evt.preventDefault();
}, { passive: false });

serviceWorker.register();