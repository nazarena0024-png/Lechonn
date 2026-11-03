<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Piggy Picnic 🐷</title>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Trebuchet MS", sans-serif;
  background: #ffe8f1;
  color: #793c58;
  text-align: center;
  overflow: hidden;
}

h1 {
  margin: 10px 0 5px;
  color: #e66c9e;
  font-size: 28px;
}

#stats {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 8px;
}

.stat {
  background: #fff4f8;
  border: 3px solid #f4a9c7;
  border-radius: 18px;
  padding: 8px 18px;
  font-weight: bold;
  box-shadow: 0 3px 0 #e99ab9;
}

#game {
  width: 96vw;
  max-width: 500px;
  height: 75vh;
  max-height: 680px;
  min-height: 420px;
  margin: auto;
  position: relative;
  overflow: hidden;
  border: 5px solid #f5a8c7;
  border-radius: 22px;
  background: #a7d9f5;
  touch-action: none;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

#overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 239, 247, .88);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

#overlay h2 {
  font-size: 32px;
  color: #df6599;
  margin: 8px;
}

#overlay p {
  font-size: 17px;
  max-width: 280px;
}

button {
  background: #ed82ad;
  color: white;
  border: 3px solid white;
  border-radius: 25px;
  padding: 13px 28px;
  font-size: 19px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 0 #c85c89;
}

button:active {
  transform: translateY(3px);
  box-shadow: none;
}
</style>
</head>

<body>

<h1>🐷 Piggy Picnic 🍓</h1>

<div id="stats">
  <div class="stat">🪙 Monedas: <span id="coins">0</span></div>
  <div class="stat">⏰ Tiempo: <span id="time">90</span>s</div>
</div>

<div id="game">
  <canvas id="canvas"></canvas>

  <div id="overlay">
    <div style="font-size:65px">🧺🍓</div>
    <h2>Piggy Picnic</h2>
    <p>¡Ayudá al cerdito a juntar comida para su picnic!</p>
    <p>Movelo con el dedo o el mouse y atrapá los alimentos.</p>
    <button onclick="startGame()">¡JUGAR! 💗</button>
  </div>
</div>

<audio id="music" src="music.mp3" loop></audio>

<script>
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game = document.getElementById("game");

let W, H;
let coins = 0;
let time = 90;
let playing = false;
let foods = [];
let pigX = 0;
let lastSpawn = 0;
let animation;
let timer;

const pigWidth = 115;
const pigHeight = 135;

function resize() {
  const rect = game.getBoundingClientRect();
  W = rect.width;
  H = rect.height;

  canvas.width = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;

  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  if (pigX === 0) pigX = W / 2;
}

window.addEventListener("resize", resize);
resize();

function roundedRect(x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawTree(x, y, size) {
  ctx.fillStyle = "#79533d";
  ctx.fillRect(x - 7 * size, y, 14 * size, 65 * size);

  const leaves = ["#39864c", "#4d9b54", "#68ae5e"];
  leaves.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
      x + Math.sin(i * 2) * 13 * size,
      y - 17 * size - i * 12 * size,
      35 * size,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}

function drawCloud(x, y, s) {
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.beginPath();
  ctx.arc(x, y, 18*s, 0, Math.PI*2);
  ctx.arc(x+20*s, y-10*s, 22*s, 0, Math.PI*2);
  ctx.arc(x+42*s, y, 18*s, 0, Math.PI*2);
  ctx.fill();
}

function drawBackground() {
  // Cielo
  const sky = ctx.createLinearGradient(0, 0, 0, H * .55);
  sky.addColorStop(0, "#83c9f3");
  sky.addColorStop(1, "#d8f1ff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Nubes
  drawCloud(W*.18, H*.12, .8);
  drawCloud(W*.72, H*.2, .65);

  // Césped
  ctx.fillStyle = "#82bd62";
  ctx.fillRect(0, H*.38, W, H*.62);

  // Árboles
  drawTree(W*.08, H*.38, .8);
  drawTree(W*.28, H*.42, .55);
  drawTree(W*.73, H*.4, .75);
  drawTree(W*.94, H*.38, .9);

  // Manta de picnic
  const blanketY = H*.72;
  ctx.fillStyle = "#ffacd0";
  ctx.fillRect(0, blanketY, W, H-blanketY);

  const square = 28;
  for (let y = blanketY; y < H; y += square) {
    for (let x = 0; x < W; x += square) {
      if ((Math.floor((x)/square) + Math.floor((y-blanketY)/square)) % 2 === 0) {
        ctx.fillStyle = "#fff5fa";
        ctx.fillRect(x, y, square, square);
      }
    }
  }

  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.fillRect(0, blanketY, W, 5);
}

function drawPig() {
  const x = pigX;
  const y = H - 145;

  ctx.save();
  ctx.translate(x, y);

  // Piernas
  roundedRect(-40, 78, 25, 32, 10, "#f6a0c1");
  roundedRect(15, 78, 25, 32, 10, "#f6a0c1");

  // Zapatos
  roundedRect(-48, 98, 36, 15, 9, "#f7a6c4");
  roundedRect(12, 98, 36, 15, 9, "#f7a6c4");

  // Brazos
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(-43, 10);
  ctx.lineTo(-62, 48);
  ctx.moveTo(43, 10);
  ctx.lineTo(62, 48);
  ctx.stroke();

  ctx.strokeStyle = "#f6a0c1";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-43, 10);
  ctx.lineTo(-62, 48);
  ctx.moveTo(43, 10);
  ctx.lineTo(62, 48);
  ctx.stroke();

  // Cuerpo
  roundedRect(-48, 10, 96, 82, 27, "#f6a0c1");

  // Jardinero azul
  roundedRect(-48, 28, 96, 58, 18, "#2868b8");

  // Tirantes
  ctx.strokeStyle = "#2868b8";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(-30, 34);
  ctx.lineTo(-25, -4);
  ctx.moveTo(30, 34);
  ctx.lineTo(25, -4);
  ctx.stroke();

  // Botones
  ctx.fillStyle = "#ffd84c";
  ctx.beginPath();
  ctx.arc(-25, 30, 4, 0, Math.PI*2);
  ctx.arc(25, 30, 4, 0, Math.PI*2);
  ctx.fill();

  // Cabeza
  ctx.fillStyle = "#f7a5c5";
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 4;

  // Orejas
  ctx.beginPath();
  ctx.ellipse(-39, -47, 18, 27, -.6, 0, Math.PI*2);
  ctx.ellipse(39, -47, 18, 27, .6, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, -22, 66, 59, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // Ojos
  ctx.fillStyle = "#17121a";
  ctx.beginPath();
  ctx.arc(-25, -29, 4, 0, Math.PI*2);
  ctx.arc(25, -29, 4, 0, Math.PI*2);
  ctx.fill();

  // Hocico
  ctx.fillStyle = "#f38bad";
  ctx.beginPath();
  ctx.ellipse(0, -5, 24, 17, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#24141b";
  ctx.beginPath();
  ctx.arc(-8, -5, 3, 0, Math.PI*2);
  ctx.arc(8, -5, 3, 0, Math.PI*2);
  ctx.fill();

  // Sonrisa
  ctx.strokeStyle = "#24141b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 8, 14, .2, Math.PI-.2);
  ctx.stroke();

  // Bolsillo
  roundedRect(-19, 48, 38, 25, 8, "#174c91");
  ctx.fillStyle = "#ffdc54";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.fillText("★", 0, 67);

  // Cola
  ctx.strokeStyle = "#f6a0c1";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(52, 63, 12, 0, Math.PI*1.7);
  ctx.stroke();

  ctx.restore();
}

const foodTypes = ["🍓", "🍎", "🍒", "🧁", "🍪", "🍉", "🥕"];

function spawnFood() {
  foods.push({
    x: 25 + Math.random() * (W - 50),
    y: -25,
    speed: 2 + Math.random() * 1.8,
    emoji: foodTypes[Math.floor(Math.random()*foodTypes.length)]
  });
}

function drawFoods() {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "30px Arial";

  foods.forEach(food => {
    ctx.fillText(food.emoji, food.x, food.y);
  });
}

function updateFoods() {
  for (let i = foods.length - 1; i >= 0; i--) {
    const food = foods[i];
    food.y += food.speed;

    if (
      food.y > H - 175 &&
      food.y < H - 35 &&
      Math.abs(food.x - pigX) < 60
    ) {
      coins++;
      document.getElementById("coins").textContent = coins;
      foods.splice(i, 1);
      continue;
    }

    if (food.y > H + 30) {
      foods.splice(i, 1);
    }
  }
}

function frame(timestamp) {
  if (!playing) return;

  drawBackground();

  if (timestamp - lastSpawn > 750) {
    spawnFood();
    lastSpawn = timestamp;
  }

  updateFoods();
  drawFoods();
  drawPig();

  animation = requestAnimationFrame(frame);
}

function movePig(clientX) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  pigX = Math.max(65, Math.min(W - 65, x));
}

canvas.addEventListener("pointerdown", e => {
  if (playing) movePig(e.clientX);
});

canvas.addEventListener("pointermove", e => {
  if (playing && e.buttons === 1) movePig(e.clientX);
});

function startGame() {
  cancelAnimationFrame(animation);
  clearInterval(timer);

  coins = 0;
  time = 90;
  foods = [];
  pigX = W/2;
  lastSpawn = 0;
  playing = true;

  document.getElementById("coins").textContent = coins;
  document.getElementById("time").textContent = time;
  document.getElementById("overlay").style.display = "none";

  const music = document.getElementById("music");
  music.currentTime = 0;
  music.play().catch(() => {});

  timer = setInterval(() => {
    if (!playing) return;

    time--;
    document.getElementById("time").textContent = time;

    if (time <= 0) endGame();
  }, 1000);

  animation = requestAnimationFrame(frame);
}

function endGame() {
  playing = false;
  clearInterval(timer);
  cancelAnimationFrame(animation);

  const music = document.getElementById("music");
  music.pause();
  music.currentTime = 0;

  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";

  overlay.innerHTML = `
    <div style="font-size:65px">🐷💗</div>
    <h2>¡Picnic terminado!</h2>
    <p>¡Juntaste ${coins} monedas!</p>
    <p>¡Gracias por jugar!</p>
    <button onclick="startGame()">JUGAR DE NUEVO 🍓</button>
  `;

  document.getElementById("time").textContent = 0;
}

drawBackground();
drawPig();
</script>

</body>
</html>
