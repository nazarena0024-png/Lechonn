from pathlib import Path
import zipfile, shutil, os

base = Path("/mnt/data/piggy_picnic")
base.mkdir(exist_ok=True)
html = r'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Piggy Picnic</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:"Trebuchet MS",sans-serif;background:#ffe6ef;color:#873c58;text-align:center;overflow:hidden}
h1{margin:12px 0 5px;font-size:clamp(28px,7vw,42px);color:#d65b8b;text-shadow:2px 2px #fff}
#top{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:8px}
.stat{background:#fff8fb;border:2px solid #f4a9c5;border-radius:18px;padding:7px 14px;font-weight:bold;box-shadow:0 3px 0 #efbfd0}
#game{position:relative;width:94vw;max-width:440px;height:min(65vh,580px);min-height:360px;margin:10px auto;background:linear-gradient(#fff7fa,#ffe0eb);border:4px solid #f3a5c2;border-radius:25px;overflow:hidden;box-shadow:0 6px 0 #e8a3bd;touch-action:none}
#game:before{content:"";position:absolute;inset:0;background:radial-gradient(#fff 1.5px,transparent 2px);background-size:28px 28px;opacity:.55;pointer-events:none}
#basket{position:absolute;bottom:13px;left:50%;transform:translateX(-50%);font-size:57px;line-height:1;z-index:3;filter:drop-shadow(0 3px 1px #d58ba7)}
.food{position:absolute;top:-50px;font-size:34px;z-index:2;user-select:none}
#overlay{position:absolute;inset:0;background:#fff0f6ed;z-index:5;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:22px}
#overlay h2{font-size:30px;margin:0 0 8px;color:#d65b8b}
#overlay p{font-size:17px;line-height:1.4;margin:7px 0 16px}
button{border:0;border-radius:22px;background:#e96f9e;color:white;font-weight:bold;font-size:18px;padding:12px 25px;box-shadow:0 4px 0 #bd527d;cursor:pointer}
button:active{transform:translateY(3px);box-shadow:0 1px 0 #bd527d}
#hint{font-size:13px;margin:8px;color:#a65a78}
</style>
</head>
<body>
<h1>🐷 Piggy Picnic 🎀</h1>
<div id="top">
  <div class="stat">🪙 Monedas: <span id="score">0</span></div>
  <div class="stat">⏰ Tiempo: <span id="time">90</span>s</div>
</div>
<div id="game">
  <div id="basket">🐷🧺</div>
  <div id="overlay">
    <h2>¡Picnic time! 🍓</h2>
    <p>Atrapá la comida con tu canastita.<br>Cada alimento vale 1 moneda.<br>¡Tenés 1 minuto y 30 segundos!</p>
    <button id="start">¡Jugar!</button>
  </div>
</div>
<div id="hint">Mové el cerdito con el dedo o el mouse para atrapar la comida 💗</div>
<audio id="music" src="music.mp3" loop preload="auto"></audio>
<script>
const game=document.getElementById("game");
const basket=document.getElementById("basket");
const scoreEl=document.getElementById("score");
const timeEl=document.getElementById("time");
const overlay=document.getElementById("overlay");
const music=document.getElementById("music");
const foods=["🍓","🍎","🍒","🍉","🥕","🍪","🧁","🍇","🍐"];
let score=0,seconds=90,playing=false,spawnTimer=null,clockTimer=null,items=[],lastTime=0;

function moveBasket(clientX){
  const rect=game.getBoundingClientRect();
  const half=basket.offsetWidth/2;
  let x=clientX-rect.left;
  x=Math.max(half,Math.min(rect.width-half,x));
  basket.style.left=x+"px";
}
game.addEventListener("pointermove",e=>{if(playing)moveBasket(e.clientX)});
game.addEventListener("pointerdown",e=>{if(playing)moveBasket(e.clientX)});

function makeFood(){
  if(!playing)return;
  const el=document.createElement("div");
  el.className="food";
  el.textContent=foods[Math.floor(Math.random()*foods.length)];
  const max=Math.max(0,game.clientWidth-42);
  const x=Math.random()*max;
  el.style.left=x+"px";
  game.appendChild(el);
  items.push({el,x,y:-45,speed:2.1+Math.random()*1.5});
}
function update(){
  if(!playing)return;
  const basketRect=basket.getBoundingClientRect();
  const gameRect=game.getBoundingClientRect();
  const bx=basketRect.left-gameRect.left, by=basketRect.top-gameRect.top;
  items=items.filter(item=>{
    item.y+=item.speed;
    item.el.style.top=item.y+"px";
    const itemCenter=item.x+18;
    const caught=item.y+32>=by && item.y+8<=by+58 && itemCenter>=bx-8 && itemCenter<=bx+basket.offsetWidth+8;
    if(caught){
      score++;scoreEl.textContent=score;item.el.remove();return false;
    }
    if(item.y>game.clientHeight){item.el.remove();return false;}
    return true;
  });
  requestAnimationFrame(update);
}
function endGame(){
  playing=false;clearInterval(spawnTimer);clearInterval(clockTimer);
  music.pause();
  overlay.innerHTML=`<h2>¡Terminó el picnic! 🌸</h2><p>Juntaste <b>${score}</b> ${score===1?"moneda":"monedas"} 🪙<br>¡Buen trabajo!</p><button id="again">Volver a jugar</button>`;
  overlay.style.display="flex";
  document.getElementById("again").addEventListener("click",startGame);
}
function startGame(){
  items.forEach(item=>item.el.remove());items=[];
  score=0;seconds=90;scoreEl.textContent=score;timeEl.textContent=seconds;
  overlay.style.display="none";playing=true;
  music.currentTime=0;music.play().catch(()=>{});
  clearInterval(spawnTimer);clearInterval(clockTimer);
  spawnTimer=setInterval(makeFood,720);
  clockTimer=setInterval(()=>{seconds--;timeEl.textContent=seconds;if(seconds<=0)endGame()},1000);
  requestAnimationFrame(update);
}
document.getElementById("start").addEventListener("click",startGame);
</script>
</body>
</html>'''
html_path = base / "index.html"
html_path.write_text(html, encoding="utf-8")
audio_src = Path("/mnt/data/u_60prvfn0xb-spring-in-my-step-copyright-free-music-for-youtube-320726.mp3")
audio_dst = base / "music.mp3"
shutil.copy2(audio_src, audio_dst)
zip_path = Path("/mnt/data/Piggy_Picnic_completo.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(html_path, "index.html")
    z.write(audio_dst, "music.mp3")
print(f"Creado: {zip_path} ({zip_path.stat().st_size} bytes)")
