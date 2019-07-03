import * as Controls from './controls';

export default () => {
  const state = {
    snake: [
      { y: 10, x: 10 },
      { y: 10, x: 9 },
      { y: 10, x: 8 },
    ],
    apple: { y: 10, x: 15 },
    score: 0,
    speed: 1,
    countdown: 3,
    gameover: false,
    direction: ['RIGHT'],
  }

  const $gameplay = document.querySelector('.gameplay');
  const $score = document.querySelector('.gameplay__score');
  const $speed = document.querySelector('.gameplay__speed');
  const $direction = document.querySelector('.gameplay__direction');
  const $countdown = document.querySelector('.gameplay__countdown');

  const $canvas = document.getElementById('canvas');
  $canvas.width = 400;
  $canvas.height = 400;
  const ctx = $canvas.getContext('2d');

  function draw(x, y, grey = false) {
    ctx.fillStyle = grey
      ? '#82937F'
      : '#707070';
    ctx.fillRect(x * 20, y * 20, 1, 20);
    ctx.fillRect(x * 20 + 19, y * 20, 1, 20);
    ctx.fillRect(x * 20, y * 20, 20, 1);
    ctx.fillRect(x * 20, y * 20 + 19, 20, 1);
    ctx.fillRect(x * 20 + 4, y * 20 + 4, 12, 12);
  }

  function collideWithSnake(x, y) {
    return Boolean(
      state
        .snake
        .find(snake => snake.x === x && snake.y === y),
    );
  }

  function updateSpeed() {
    state.speed += 1;
    $speed.innerHTML = state.speed;
  }

  function updateScore() {
    const hs = parseInt(localStorage.hs) || 0;
    state.score += 1;
    if (state.score > hs) localStorage.setItem('hs', state.score);
    if (state.score % 5 === 0) updateSpeed();
    $score.innerHTML = state.score;
  }

  function queueDirection(dir) {
    if (state.direction[state.direction.length - 1] === dir) return;
    state.direction.push(dir);
  }

  function update() {
    const head = {...state.snake[0]};
    const neck = state.snake[1];
    const { apple } = state;

    const direction = state.direction.length > 1
      ? state.direction.splice(0, 1)[0]
      : state.direction[0];

    if (direction === 'RIGHT') {
      head.x += 1;

      // Ignore moving right if
      // snake is moving left
      if (head.x === neck.x && head.y === neck.y) {
        head.x -= 2;
      }
    }

    if (direction === 'LEFT') {
      head.x -= 1;

      // Ignore moving left if
      // snake is moving right
      if (head.x === neck.x && head.y === neck.y) {
        head.x += 2;
      }
    }

    if (direction === 'UP') {
      head.y -= 1;
      if (head.y < 0) head.y = 19;

      // Ignore moving up if
      // snake is moving down
      if (head.x === neck.x && head.y === neck.y) {
        head.y += 2;
      }
    }

    if (direction === 'DOWN') {
      head.y += 1;

      // Ignore moving down if
      // snake is moving up
      if (head.x === neck.x && head.y === neck.y) {
        head.y -= 2;
      }
    }

    const appleEaten = head.x === apple.x
      && head.y === apple.y;

    const collidedWall = head.x < 0
      || head.x >= 20
      || head.y < 0
      || head.y >= 20;
    
    const collidedSnake = collideWithSnake(head.x, head.y);

    state.gameover = collidedWall || collidedSnake;

    state.snake = [
      head,
      ...state
        .snake
        .slice(0, state.snake.length - (appleEaten ? 0 : 1)),
    ];

    if (appleEaten) {
      const available = [];
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
          if (collideWithSnake(x, y) === false)
            available.push({ x, y });
        }
      }

      state
        .apple = available[Math.ceil(Math.random() * available.length)];

      updateScore();
    }

    render();
  }

  function render() {
    // clear canvas
    ctx.clearRect(0, 0, 400, 400);

    if (state.gameover) {
      // Draw canvas negative
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
          if (collideWithSnake(x, y) === false)
            draw(x, y);
        }
      }
    } else {
      // render snake
      state
        .snake
        .forEach(({ x, y }) => draw(x, y));

      // render apple
      draw(state.apple.x, state.apple.y, true);

      let timeout = 320 - (state.speed * 16);
      if (timeout < 16) timeout = 16;
      setTimeout(update, timeout);
    }
  }

  function startCountDown() {
    state.countdown -= 1;

    if (state.countdown === 0) {
      $countdown.classList.add('hide');
      render();
      return;
    }

    $countdown.innerHTML = state.countdown;
    setTimeout(startCountDown, 1000);
  }

  Controls.listen(Controls.KEYS.RIGHT, () => {
    queueDirection('RIGHT');
    $direction.innerHTML = '→';
  });

  Controls.listen(Controls.KEYS.LEFT, () => {
    queueDirection('LEFT');
    $direction.innerHTML = '←';
  });

  Controls.listen(Controls.KEYS.UP, () => {
    queueDirection('UP');
    $direction.innerHTML =  '↑';
  });

  Controls.listen(Controls.KEYS.DOWN, () => {
    queueDirection('DOWN');
    $direction.innerHTML = '↓';
  });

  Controls.listen(Controls.KEYS.ENTER, () => {
    if (state.gameover !== true) return;
    state.gameover = false;
    state.snake = [
      { y: 10, x: 10 },
      { y: 10, x: 9 },
      { y: 10, x: 8 },
    ];
    state.score = 0;
  });

  // Show gameplay screen
  $gameplay.classList.remove('hide');

  // Start count down
  setTimeout(startCountDown, 1000);

  // Render static snake
  state
    .snake
    .forEach(({ x, y }) => draw(x, y));
}
