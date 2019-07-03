export const KEYS = {
  ENTER: 'ENTER',
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN',
};

const listeners = [];
let lastKey = KEYS.RIGHT;

function dispatchListeners() {
  listeners
    .filter(l => l.key === lastKey)
    .forEach(l => l.cb());
}

window.addEventListener('keydown', (evt) => {
  const key = evt.key.toLowerCase();
  switch (key) {
    case 'w':
    case 'arrowup':
      lastKey = KEYS.UP;
      break;

    case 's':
    case 'arrowdown':
      lastKey = KEYS.DOWN;
      break;

    case 'd':
    case 'arrowright':
      lastKey = KEYS.RIGHT;
      break;

    case 'a':
    case 'arrowleft':
      lastKey = KEYS.LEFT;
      break;

    case 'enter':
      lastKey = KEYS.ENTER;
      break;

    default:
      break;
  }

  dispatchListeners();
});


const touch = {
  start: {
    x: 0,
    y: 0,
  },
  move: {
    x: 0,
    y: 0,
  },
};

window.addEventListener('touchstart', (evt) => {
  const t = evt.touches[0];
  touch.start.x = t.clientX;
  touch.start.y = t.clientY;
  touch.move.x = t.clientX;
  touch.move.y = t.clientY;
});

window.addEventListener('touchmove', (evt) => {
  const t = evt.touches[0];
  touch.move.x = t.clientX;
  touch.move.y = t.clientY;
});

window.addEventListener('touchend', (evt) => {
  let movedX = touch.move.x - touch.start.x;
  let movedY = touch.move.y - touch.start.y;

  const diffX = movedX < 0
    ? movedX * -1
    : movedX;

  const diffY = movedY < 0
    ? movedY * -1
    : movedY;

  if (
    diffX < 10
    && diffY < 10
  ) {
    // Did not move, pressed ENTER
    lastKey = KEYS.ENTER;
  } else if (diffX > diffY) {
    // Moved horizontally
    lastKey = movedX < 0
      ? KEYS.LEFT
      : KEYS.RIGHT;
  } else {
    // Moved vertically
    lastKey = movedY < 0
      ? KEYS.UP
      : KEYS.DOWN;
  }

  dispatchListeners();
});

export function getLastKey() {
  return lastKey;
}

export function listen(key, cb) {
  const id = `${Math.random() * 1000000}-${new Date() - 1}`;
  listeners.push({
    id,
    key,
    cb: () => cb(id),
  });
  return id;
}

export function unlisten(id) {
  if (id) {
    listeners.splice(
      listeners.findIndex(l => l.id === id),
      1
    );
  } else {
    listeners.splice(0, listeners.length);
  }
}

export function listenOnce(key, cb) {
  listen(key, (id) => {
    cb(id);
    unlisten(id);
  });
}