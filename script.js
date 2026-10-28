const ui = {
  game: document.getElementById('game'),
  pig: document.getElementById('pig'),
  overlay: document.getElementById('overlay'),
  coins: document.getElementById('coins'),
  time: document.getElementById('time'),
  start: document.getElementById('start'),
  message: document.getElementById('message'),
  instructions: document.getElementById('instructions'),
};

const gameState = {
  coins: 0,
  timeLeft: 30,
  isPlaying: false,
  foods: [],
  spawnTimer: null,
  clockTimer: null,
  animationFrame: null,
  lastTimestamp: 0,
};

const drawings = [
  `
    <svg viewBox="0 0 44 48">
      <path d="M22 12 Q8 2 7 19 Q5 35 22 44 Q39 35 37 19 Q36 2 22 12" fill="#ed5576" stroke="#a83250" stroke-width="2.5"/>
      <path d="M22 12 Q16 4 25 3 Q31 3 32 8" fill="#66b85d" stroke="#397b43" stroke-width="2.5"/>
      <g fill="#ffd5a0"><circle cx="16" cy="20" r="1.5"/><circle cx="28" cy="23" r="1.5"/><circle cx="20" cy="31" r="1.5"/><circle cx="30" cy="33" r="1.5"/></g>
    </svg>
  `,
  `
    <svg viewBox="0 0 44 48">
      <path d="M23 11 Q9 5 7 23 Q7 41 22 44 Q39 42 38 24 Q37 8 23 11" fill="#ed6a72" stroke="#a73b49" stroke-width="2.5"/>
      <path d="M23 12 Q20 4 28 3 L36 7 L29 15" fill="#70b85a" stroke="#397b43" stroke-width="2.5"/>
      <path d="M16 19 Q21 15 25 19" fill="none" stroke="#ffb1a4" stroke-width="2"/>
    </svg>
  `,
  `
    <svg viewBox="0 0 44 48">
      <path d="M7 11 Q22 5 37 11 L40 37 Q22 45 4 37 Z" fill="#d99a56" stroke="#8b522c" stroke-width="2.5"/>
      <g fill="#75452c"><circle cx="15" cy="18" r="3"/><circle cx="29" cy="17" r="3"/><circle cx="22" cy="28" r="3"/><circle cx="12" cy="34" r="2.5"/><circle cx="32" cy="34" r="2.5"/></g>
      <g fill="#ffe1a0"><circle cx="14" cy="15" r="1"/><circle cx="28" cy="14" r="1"/></g>
    </svg>
  `,
  `
    <svg viewBox="0 0 44 48">
      <path d="M9 8 L35 8 L40 38 Q22 46 4 38 Z" fill="#f6bd55" stroke="#a96b35" stroke-width="2.5"/>
      <path d="M10 15 Q22 24 34 15" fill="none" stroke="#ed7250" stroke-width="5"/>
      <path d="M12 10 L15 3 L23 8 L30 2 L34 11" fill="#5d9b4d" stroke="#397b43" stroke-width="2.5"/>
    </svg>
  `,
];

const musica = new Audio('https://cdn.pixabay.com/audio/2022/10/25/audio_946b7e3b5c.mp3');
musica.loop = true;
musica.volume = 0.35;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function movePig(xPosition) {
  const gameRect = ui.game.getBoundingClientRect();
  const pigWidth = ui.pig.offsetWidth;
  const minX = 28;
  const maxX = gameRect.width - pigWidth - 28;
  const nextX = clamp(xPosition - gameRect.left - pigWidth / 2, minX, maxX);
  ui.pig.style.left = `${nextX}px`;
}

function handlePointerMove(event) {
  if (!gameState.isPlaying) {
    return;
  }

  if (event.pointerType === 'touch' || event.buttons === 1) {
    movePig(event.clientX);
    event.preventDefault();
  }
}

function createFood() {
  const item = document.createElement('div');
  item.className = 'food';
  item.innerHTML = drawings[Math.floor(Math.random() * drawings.length)];

  const x = Math.random() * (ui.game.clientWidth - 44);
  item.style.left = `${x}px`;
  item.style.top = '-48px';

  ui.game.appendChild(item);

  gameState.foods.push({
    id: Date.now() + Math.random(),
    element: item,
    x,
    y: -48,
    speed: 115 + Math.random() * 70,
  });
}

function updateFrame(timestamp) {
  if (!gameState.isPlaying) {
    return;
  }

  const dt = gameState.lastTimestamp ? Math.min((timestamp - gameState.lastTimestamp) / 1000, 0.04) : 0;
  gameState.lastTimestamp = timestamp;

  const pigLeft = ui.pig.offsetLeft;
  const pigTop = ui.pig.offsetTop;
  const pigRight = pigLeft + ui.pig.offsetWidth;
  const pigBottom = pigTop + ui.pig.offsetHeight;

  for (let index = gameState.foods.length - 1; index >= 0; index -= 1) {
    const food = gameState.foods[index];
    food.y += food.speed * dt;
    food.element.style.top = `${food.y}px`;

    const foodLeft = food.x;
    const foodRight = food.x + 38;
    const foodTop = food.y;
    const foodBottom = food.y + 38;

    const collides =
      foodRight > pigLeft + 8 &&
      foodLeft + 8 < pigRight - 8 &&
      foodBottom > pigTop + 8 &&
      foodTop + 8 < pigBottom;

    if (collides) {
      gameState.coins += 1;
      ui.coins.textContent = String(gameState.coins);
      food.element.remove();
      gameState.foods.splice(index, 1);
      continue;
    }

    if (food.y > ui.game.clientHeight) {
      food.element.remove();
      gameState.foods.splice(index, 1);
    }
  }

  gameState.animationFrame = requestAnimationFrame(updateFrame);
}

function endGame() {
  gameState.isPlaying = false;
  clearInterval(gameState.spawnTimer);
  clearInterval(gameState.clockTimer);
  cancelAnimationFrame(gameState.animationFrame);
  gameState.foods.forEach((food) => food.element.remove());
  gameState.foods = [];
  gameState.lastTimestamp = 0;

  ui.overlay.style.display = 'flex';
  ui.message.textContent = '¡Picnic terminado!';
  ui.instructions.innerHTML = `Juntaste <b>${gameState.coins} monedas</b> ♡<br />¡Vamos por otra partida!`;
  ui.start.textContent = 'JUGAR OTRA VEZ';
}

function startGame() {
  clearInterval(gameState.spawnTimer);
  clearInterval(gameState.clockTimer);
  cancelAnimationFrame(gameState.animationFrame);
  gameState.foods.forEach((food) => food.element.remove());
  gameState.foods = [];

  gameState.coins = 0;
  gameState.timeLeft = 30;
  gameState.lastTimestamp = 0;
  gameState.isPlaying = true;

  ui.coins.textContent = '0';
  ui.time.textContent = '30';
  ui.overlay.style.display = 'none';

  const initialPigLeft = (ui.game.clientWidth - ui.pig.offsetWidth) / 2;
  ui.pig.style.left = `${initialPigLeft}px`;

  musica.play().catch(() => {});

  gameState.spawnTimer = setInterval(createFood, 850);
  gameState.clockTimer = setInterval(() => {
    if (!gameState.isPlaying) {
      return;
    }

    gameState.timeLeft -= 1;
    ui.time.textContent = String(gameState.timeLeft);

    if (gameState.timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  gameState.animationFrame = requestAnimationFrame(updateFrame);
}

ui.game.addEventListener('pointerdown', (event) => {
  if (gameState.isPlaying) {
    movePig(event.clientX);
    event.preventDefault();
  }
});

ui.game.addEventListener('pointermove', handlePointerMove);
ui.start.addEventListener('click', startGame);
