import * as serviceWorker from './serviceWorker';
import intro from './intro';
import './style.css';

// Initialize Intro
intro();

serviceWorker.register();