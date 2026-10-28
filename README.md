
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Piggy Picnic</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#ffe6ef;color:#873c58;font-family:"Trebuchet MS",sans-serif;text-align:center}
header{padding:12px 8px 4px}
h1{margin:0;font-size:30px;color:#d94f85;text-shadow:2px 2px white}
header p{margin:4px}
.stats{display:flex;justify-content:center;gap:10px;padding:10px}
.stat{background:#fff8fa;border:2px solid #f4a8c2;border-radius:18px;padding:10px;flex:1;max-width:180px;font-weight:bold;font-size:17px}
#game{position:relative;overflow:hidden;width:94vw;max-width:440px;height:64vh;min-height:380px;max-height:580px;margin:auto;border:5px solid white;border-radius:25px;background:linear-gradient(#9cdbfa 0%,#d7f2ff 47%,#b8e5a0 48%,#7ec46c 100%);box-shadow:0 0 0 3px #f5a5c1;touch-action:none}
.cloud{position:absolute;background:#fff;border-radius:50%;width:90px;height:35px;top:13%;opacity:.9}
.cloud:before,.cloud:after{content:"";position:absolute;background:#fff;border-radius:50%}
.cloud:before{width:42px;height:42px;left:12px;top:-17px}
.cloud:after{width:35px;height:35px;right:12px;top:-12px}
.c1{left:-20px}.c2{right:-25px;top:28%}
.bush{position:absolute;bottom:23%;height:95px;width:120px;border-radius:50%;background:#75b85e;border:5px solid #639e50}
.b1{left:-55px}.b2{right:-55px}
.fence{position:absolute;bottom:21%;left:0;width:100%;height:13px;background:#d9a675;border-top:3px solid #b77c51;border-bottom:3px solid #b77c51}
.fence:before{content:"";position:absolute;inset:-22px 10% 0;background:repeating-linear-gradient(90deg,#d9a675 0 12px,transparent 12px 65px);height:35px}
#blanket{position:absolute;bottom:0;height:24%;width:100%;background-color:#fff0f5;background-image:linear-gradient(90deg,#f6a8c6 25%,transparent 25%,transparent 75%,#f6a8c6 75%),linear-gradient(#f6a8c6 25%,transparent 25%,transparent 75%,#f6a8c6 75%);background-size:48px 48px;background-position:0 0,0 0;border-top:5px solid white}
#pig{position:absolute;z-index:3;bottom:5%;left:50%;transform:translateX(-50%);width:112px;height:140px;touch-action:none}
.food{position:absolute;z-index:2;width:43px;height:48px}
.food svg{width:100%;height:100%;overflow:visible}
#overlay{position:absolute;z-index:5;inset:0;background:#fff0f2eF;display:flex;align-items:center;justify-content:center;padding:18px}
.panel{background:#fff9fb;border:3px dashed #f18ab3;border-radius:28px;padding:20px 12px;width:100%;max-width:310px;box-shadow:0 4px 0 #f8c1d4}
.panel h2{margin:8px 0;font-size:27px}
.panel p{line-height:1.5}
button{background:#ef70a1;border:3px solid white;color:white;font-size:19px;font-weight:bold;border-radius:25px;padding:12px 25px;box-shadow:0 4px #cb527f}
button:active{transform:translateY(2px);box-shadow:0 2px #cb527f}
footer{padding:12px;font-size:13px}
</style>
</head>
<body>
<header>
<h1>♡ PIGGY PICNIC ♡</h1>
<p>¡Un picnic lleno de premios!</p>
</header>
<div class="stats">
<div class="stat">🪙 Monedas: <span id="coins">0</span></div>
<div class="stat">⏰ Tiempo: <span id="time">30</span>s</div>
</div>
<div id="game">
<div class="cloud c1"></div><div class="cloud c2"></div>
<div class="bush b1"></div><div class="bush b2"></div>
<div class="fence"></div><div id="blanket"></div>

<div id="pig">
<svg viewBox="0 0 120 145" xmlns="http://www.w3.org/2000/svg">
<g stroke="#35202b" stroke-width="3.5" stroke-linejoin="round">
<path fill="#f8b0ca" d="M27 32 Q5 -4 4 27 L13 48 M93 32 Q115 -4 116 27 L107 48"/>
<ellipse fill="#ffc0d4" cx="60" cy="52" rx="48" ry="43"/>
<ellipse fill="#ed8eae" stroke="none" cx="28" cy="61" rx="9" ry="5"/>
<ellipse fill="#ed8eae" stroke="none" cx="92" cy="61" rx="9" ry="5"/>
<ellipse fill="#f49bb9" cx="60" cy="61" rx="19" ry="14"/>
<ellipse fill="#f8d2df" cx="54" cy="60" rx="3" ry="4" stroke="none"/>
<ellipse fill="#f8d2df" cx="66" cy="60" rx="3" ry="4" stroke="none"/>
<ellipse fill="#35202b" stroke="none" cx="39" cy="45" rx="4" ry="5"/>
<ellipse fill="#35202b" stroke="none" cx="81" cy="45" rx="4" ry="5"/>
<path fill="none" d="M47 77 Q60 89 73 77"/>
<path fill="#f8b0ca" d="M23 95 L11 117 Q7 124 16 128 L29 119 M97 95 L109 117 Q113 124 104 128 L91 119"/>
<path fill="#3676cb" d="M28 91 L39 99 L81 99 L92 91 L96 129 Q94 138 84 138 L36 138 Q26 138 24 129 Z"/>
<path fill="#f8b0ca" d="M36 134 L35 141 L22 142 Q16 142 17 136 L22 131 M84 134 L85 141 L98 142 Q104 142 103 136 L98 131"/>
<path fill="none" d="M39 97 L43 119 M81 97 L77 119"/>
<path fill="#f5c64d" d="M51 115 L69 115 L69 127 Q60 133 51 127 Z"/>
<path fill="#fff0a0" stroke="none" d="M60 117 L62 122 L67 122 L63 125 L64 130 L60 127 L56 130 L57 125 L53 122 L58 122 Z"/>
</g></svg>
</div>

<div id="overlay">
<div class="panel">
<div style="font-size:42px">🧺</div>
<h2 id="message">¡Hora de picnic!</h2>
<p id="instructions">Mové el cerdito con tu dedo.<br>¡Cada comida atrapada vale una moneda!</p>
<button id="start">¡JUGAR! ♡</button>
</div>
</div>
</div>
<footer>♡ Deslizá el dedo para mover al cerdito ♡</footer>

<script>
const game=document.getElementById("game");
const pig=document.getElementById("pig");
const overlay=document.getElementById("overlay");
const coinsEl=document.getElementById("coins");
const timeEl=document.getElementById("time");
const start=document.getElementById("start");
let coins=0,time=30,playing=false,foods=[],spawn,clock,raf,last=0;

const drawings=[
`<svg viewBox="0 0 44 48"><path d="M22 12 Q8 2 7 19 Q5 35 22 44 Q39 35 37 19 Q36 2 22 12" fill="#ed5576" stroke="#a83250" stroke-width="2.5"/><path d="M22 12 Q16 4 25 3 Q31 3 32 8" fill="#66b85d" stroke="#397b43" stroke-width="2.5"/><g fill="#ffd5a0"><circle cx="16" cy="20" r="1.5"/><circle cx="28" cy="23" r="1.5"/><circle cx="20" cy="31" r="1.5"/><circle cx="30" cy="33" r="1.5"/></g></svg>`,
`<svg viewBox="0 0 44 48"><path d="M23 11 Q9 5 7 23 Q7 41 22 44 Q39 42 38 24 Q37 8 23 11" fill="#ed6a72" stroke="#a73b49" stroke-width="2.5"/><path d="M23 12 Q20 4 28 3 L36 7 L29 15" fill="#70b85a" stroke="#397b43" stroke-width="2.5"/><path d="M16 19 Q21 15 25 19" fill="none" stroke="#ffb1a4" stroke-width="2"/></svg>`,
`<svg viewBox="0 0 44 48"><path d="M7 11 Q22 5 37 11 L40 37 Q22 45 4 37 Z" fill="#d99a56" stroke="#8b522c" stroke-width="2.5"/><g fill="#75452c"><circle cx="15" cy="18" r="3"/><circle cx="29" cy="17" r="3"/><circle cx="22" cy="28" r="3"/><circle cx="12" cy="34" r="2.5"/><circle cx="32" cy="34" r="2.5"/></g><g fill="#ffe1a0"><circle cx="14" cy="15" r="1"/><circle cx="28" cy="14" r="1"/></g></svg>`,
`<svg viewBox="0 0 44 48"><path d="M9 8 L35 8 L40 38 Q22 46 4 38 Z" fill="#f6bd55" stroke="#a96b35" stroke-width="2.5"/><path d="M10 15 Q22 24 34 15" fill="none" stroke="#ed7250" stroke-width="5"/><path d="M12 10 L15 3 L23 8 L30 2 L34 11" fill="#5d9b4d" stroke="#397b43" stroke-width="2.5"/></svg>`
];

function move(x){
 const r=game.getBoundingClientRect();
 pig.style.left=Math.max(56,Math.min(r.width-56,x-r.left))+"px";
}
game.addEventListener("pointerdown",e=>{if(playing){move(e.clientX);e.preventDefault()}});
game.addEventListener("pointermove",e=>{if(playing && (e.buttons===1||e.pointerType==="touch")){move(e.clientX);e.preventDefault()}});
function spawnFood(){
 if(!playing)return;
 const el=document.createElement("div");el.className="food";
 el.innerHTML=drawings[Math.floor(Math.random()*drawings.length)];
 const x=Math.random()*(game.clientWidth-44);
 el.style.left=x+"px";game.appendChild(el);
 foods.push({el,x,y:-48,speed:115+Math.random()*70});
}
function frame(now){
 if(!playing)return;
 const dt=last?Math.min((now-last)/1000,.04):0;last=now;
 const a=pig.offsetLeft,b=pig.offsetTop,c=a+pig.offsetWidth,d=b+pig.offsetHeight;
 for(let i=foods.length-1;i>=0;i--){
  const f=foods[i];f.y+=f.speed*dt;f.el.style.top=f.y+"px";
  if(f.x+38>a+8&&f.x+8<c-8&&f.y+38>b+8&&f.y+8<d){
   coins++;coinsEl.textContent=coins;f.el.remove();foods.splice(i,1);
  }else if(f.y>game.clientHeight){f.el.remove();foods.splice(i,1)}
 }
 raf=requestAnimationFrame(frame);
}
function endGame(){
 playing=false;clearInterval(spawn);clearInterval(clock);cancelAnimationFrame(raf);
 foods.forEach(f=>f.el.remove());foods=[];
 overlay.style.display="flex";
 document.getElementById("message").textContent="¡Picnic terminado!";
 document.getElementById("instructions").innerHTML="Juntaste <b>"+coins+" monedas</b> ♡<br>¡Vamos por otra partida!";
 start.textContent="JUGAR OTRA VEZ";
}
function startGame(){
 clearInterval(spawn);clearInterval(clock);cancelAnimationFrame(raf);
 foods.forEach(f=>f.el.remove());foods=[];
 coins=0;time=30;last=0;coinsEl.textContent=0;timeEl.textContent=30;
 overlay.style.display="none";playing=true;
musica.play().catch(()=>{});
 spawn=setInterval(spawnFood,850);
 clock=setInterval(()=>{if(!playing)return;time--;timeEl.textContent=time;if(time<=0)endGame()},1000);
 raf=requestAnimationFrame(frame);
}
 // Música de fondo de Piggy Picnic
const musica = new Audio(
  "https://cdn.pixabay.com/audio/2022/10/25/audio_946b7e3b5c.mp3"
);
musica.loop = true;
musica.volume = 0.35;
start.onclick=startGame;
</script>
</body>
</html>

