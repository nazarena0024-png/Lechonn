
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Piggy Picnic 🐷</title>
<style>
* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Trebuchet MS", sans-serif;
  text-align: center;
  color: #87445c;
  background: #ffe5ef;
  user-select: none;
}

header { padding: 12px 8px 6px; }
h1 { margin: 4px; font-size: 29px; }
p { margin: 6px; }

#stats {
  display: flex;
  justify-content: space-around;
  gap: 6px;
  padding: 10px;
  font-weight: bold;
}

.stat {
  background: white;
  border: 2px solid #f6b5ce;
  border-radius: 15px;
  padding: 8px;
  flex: 1;
}

#game {
  position: relative;
  width: min(94vw, 420px);
  height: min(65vh, 510px);
  min-height: 340px;
  margin: auto;
  overflow: hidden;
  border: 5px solid white;
  border-radius: 20px;
  background-color: #9cdb86;
  background-image:
    linear-gradient(45deg, #f9b8d0 25%, transparent 25%),
    linear-gradient(-45deg, #f9b8d0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f9b8d0 75%),
    linear-gradient(-45deg, transparent 75%, #f9b8d0 75%);
  background-size: 44px 44px;
  background-position: 0 0, 0 22px, 22px -22px, -22px 0;
  touch-action: pan-y;
}

#pig {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 65px;
  width: 82px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff1f5;
  border: 3px solid #f2a4bf;
  border-radius: 45% 45% 35% 35%;
  z-index: 2;
}

.food {
  position: absolute;
  top: -45px;
  font-size: 34px;
  width: 42px;
  height: 42px;
  z-index: 1;
}

#overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: #fff0f2eF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

#overlay h2 { font-size: 28px; margin: 8px; }
#overlay p { line-height: 1.5; }

button {
  background: #f18ab2;
  color: white;
  border: 3px solid white;
  border-radius: 22px;
  padding: 13px 25px;
  font-size: 18px;
  font-weight: bold;
  margin: 8px;
  box-shadow: 0 4px #d86d98;
}

#hint { font-size: 13px; padding: 10px; }
</style>
</head>
<body>

<header>
  <h1>🐷 Piggy Picnic 🎀</h1>
  <p>¡Atrapa la comida y gana monedas!</p>
</header>

<div id="stats">
  <div class="stat">🪙 <span id="coins">0</span></div>
  <div class="stat">⏰ <span id="time">90</span> s</div>
</div>

<div id="game">
  <div id="pig">🐷</div>
  <div id="overlay">
    <div style="font-size:65px">🧺🍓</div>
    <h2>¡Hora de picnic!</h2>
    <p>Mové el cerdito con tu dedo.<br>
    ¡Cada comida atrapada vale una moneda!</p>
    <button id="start">¡JUGAR! 💗</button>
  </div>
</div>

<p id="hint">👆 Deslizá el dedo por el picnic para mover al cerdito.</p>

<audio id="music" src="music.mp3" loop></audio>

<script>
const game = document.getElementById("game");
const pig = document.getElementById("pig");
const overlay = document.getElementById("overlay");
const coinsText = document.getElementById("coins");
const timeText = document.getElementById("time");
const startButton = document.getElementById("start");
const music = document.getElementById("music");

let coins = 0;
let time = 90;
let playing = false;
let foods = [];
let spawnTimer;
let clockTimer;
let lastFrame = 0;
let animationId;

const treats = ["🍓", "🍎", "🍪", "🍕", "🧁", "🍉", "🍩"];

function movePig(clientX) {
  const rect = game.getBoundingClientRect();
  let x = clientX - rect.left;
  x = Math.max(43, Math.min(rect.width - 43, x));
  pig.style.left = x + "px";
}

game.addEventListener("pointerdown", e => {
  if (playing) movePig(e.clientX);
});

game.addEventListener("pointermove", e => {
  if (playing && e.buttons === 1) movePig(e.clientX);
});

function spawnFood() {
  if (!playing) return;
  const el = document.createElement("div");
  el.className = "food";
  el.textContent = treats[Math.floor(Math.random() * treats.length)];

  const maxX = game.clientWidth - 42;
  const x = Math.random() * maxX;
  el.style.left = x + "px";
  game.appendChild(el);

  foods.push({
    el,
    x,
    y: -45,
    speed: 125 + Math.random() * 75
  });
}

function frame(timestamp) {
  if (!playing) return;
  const dt = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.04) : 0;
  lastFrame = timestamp;

  const pigLeft = pig.offsetLeft;
  const pigTop = pig.offsetTop;
  const pigRight = pigLeft + pig.offsetWidth;
  const pigBottom = pigTop + pig.offsetHeight;

  for (let i = foods.length - 1; i >= 0; i--) {
    const f = foods[i];
    f.y += f.speed * dt;
    f.el.style.top = f.y + "px";

    const hit =
      f.x + 34 > pigLeft &&
      f.x + 8 < pigRight &&
      f.y + 34 > pigTop &&
      f.y + 8 < pigBottom;

    if (hit) {
      coins++;
      coinsText.textContent = coins;
      f.el.remove();
      foods.splice(i, 1);
    } else if (f.y > game.clientHeight) {
      f.el.remove();
      foods.splice(i, 1);
    }
  }

  animationId = requestAnimationFrame(frame);
}

function endGame() {
  playing = false;
  clearInterval(spawnTimer);
  clearInterval(clockTimer);
  cancelAnimationFrame(animationId);

  music.pause();
  music.currentTime = 0;

  foods.forEach(f => f.el.remove());
  foods = [];

  overlay.innerHTML = `
    <div style="font-size:65px">🐷💗</div>
    <h2>¡Picnic terminado!</h2>
    <p>¡Juntaste ${coins} monedas! 🪙</p>
    <button id="restart">JUGAR OTRA VEZ</button>
  `;
  overlay.style.display = "flex";
  document.getElementById("restart").onclick = startGame;
}

function startGame() {
  clearInterval(spawnTimer);
  clearInterval(clockTimer);
  cancelAnimationFrame(animationId);
  foods.forEach(f => f.el.remove());
  foods = [];
  coins = 0;
  time = 90;
  lastFrame = 0;

  coinsText.textContent = coins;
  timeText.textContent = time;
  overlay.style.display = "none";
  playing = true;

  music.currentTime = 0;
  music.play().catch(() => {});

  spawnTimer = setInterval(spawnFood, 850);
  clockTimer = setInterval(() => {
    if (!playing) return;
    time--;
    timeText.textContent = time;
    if (time <= 0) endGame();
  }, 1000);

  animationId = requestAnimationFrame(frame);
}

startButton.onclick = startGame;
</script>
</body>
</html>
