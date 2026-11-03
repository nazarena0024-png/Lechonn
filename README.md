<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Piggy Picnic</title>

<style>
*{box-sizing:border-box}

body{
  margin:0;
  font-family:"Trebuchet MS",sans-serif;
  background:#fff0f5;
  color:#75445a;
  text-align:center;
}

h1{
  margin:10px 0 5px;
  color:#d96e9c;
  font-size:27px;
}

#stats{
  display:flex;
  justify-content:center;
  gap:12px;
  margin:10px;
}

.stat{
  background:#fff;
  border:2px solid #efabc8;
  border-radius:20px;
  padding:9px 17px;
  font-weight:bold;
  box-shadow:0 3px 0 #e9a1bd;
}

#game{
  position:relative;
  width:96vw;
  max-width:500px;
  height:76vh;
  min-height:430px;
  max-height:680px;
  margin:auto;
  overflow:hidden;
  border:4px solid #eaa4c1;
  border-radius:22px;
  background:#9bd2ef;
  touch-action:none;
}

canvas{
  width:100%;
  height:100%;
  display:block;
}

#overlay{
  position:absolute;
  inset:0;
  background:rgba(255,241,247,.91);
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding:22px;
}

#overlay h2{
  color:#d76e9a;
  font-size:32px;
  margin:8px;
}

#overlay p{
  max-width:280px;
  line-height:1.5;
}

button{
  border:3px solid white;
  border-radius:30px;
  background:#e980aa;
  color:white;
  font-size:19px;
  font-weight:bold;
  padding:13px 28px;
  box-shadow:0 4px 0 #bd6088;
  cursor:pointer;
}

button:active{
  transform:translateY(3px);
  box-shadow:none;
}
</style>
</head>

<body>

<h1>Piggy Picnic</h1>

<div id="stats">
  <div class="stat">Monedas: <span id="coins">0</span></div>
  <div class="stat">Tiempo: <span id="time">90</span>s</div>
</div>

<div id="game">
  <canvas id="canvas"></canvas>

  <div id="overlay">
    <h2>Piggy Picnic</h2>
    <p>¡Es hora de preparar un picnic delicioso!</p>
    <p>Mové al cerdito y atrapá las frutas para juntar monedas.</p>
    <button onclick="startGame()">¡JUGAR!</button>
  </div>
</div>

<audio id="music" src="music.mp3" loop></audio>

<script>
const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");

let W,H;
let coins=0;
let time=90;
let playing=false;
let foods=[];
let pigX=0;
let timer;
let animation;
let lastSpawn=0;

function resize(){
  const r=canvas.getBoundingClientRect();
  W=r.width;
  H=r.height;
  canvas.width=W*devicePixelRatio;
  canvas.height=H*devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  if(!pigX)pigX=W/2;
}
window.addEventListener("resize",resize);
resize();

function ellipse(x,y,rx,ry,color){
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
  ctx.fill();
}

function round(x,y,w,h,r,color){
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,r);
  ctx.fill();
}

function line(x1,y1,x2,y2,color,width){
  ctx.strokeStyle=color;
  ctx.lineWidth=width;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}

// PARQUE

function cloud(x,y,s){
  ellipse(x,y,25*s,15*s,"#fff");
  ellipse(x+20*s,y-10*s,24*s,19*s,"#fff");
  ellipse(x+43*s,y,25*s,15*s,"#fff");
}

function tree(x,y,s){
  round(x-9*s,y,18*s,70*s,5,"#956247");
  ellipse(x,y-25*s,42*s,45*s,"#4e9b57");
  ellipse(x-28*s,y-5*s,28*s,29*s,"#61ad60");
  ellipse(x+28*s,y-5*s,28*s,29*s,"#39874b");
  ellipse(x,y-53*s,25*s,26*s,"#72b966");
}

function flower(x,y,color){
  for(let i=0;i<5;i++){
    let a=i*Math.PI*2/5;
    ellipse(x+Math.cos(a)*6,y+Math.sin(a)*6,4,4,color);
  }
  ellipse(x,y,3,3,"#e8bd50");
}

function drawBackground(){
  // Cielo
  let sky=ctx.createLinearGradient(0,0,0,H*.6);
  sky.addColorStop(0,"#8ccff2");
  sky.addColorStop(1,"#d8effa");
  ctx.fillStyle=sky;
  ctx.fillRect(0,0,W,H);

  cloud(W*.15,H*.14,.7);
  cloud(W*.68,H*.20,.65);

  // Colinas
  ellipse(W*.15,H*.48,W*.48,H*.19,"#79b967");
  ellipse(W*.85,H*.47,W*.48,H*.18,"#8bc876");

  // Césped
  ctx.fillStyle="#79b966";
  ctx.fillRect(0,H*.45,W,H*.55);

  tree(W*.08,H*.39,.8);
  tree(W*.92,H*.39,.9);
  tree(W*.28,H*.42,.48);
  tree(W*.75,H*.43,.52);

  // Flores
  for(let i=0;i<16;i++){
    let x=(i*73+22)%W;
    let y=H*.60+(i%4)*15;
    flower(x,y,["#fff0f5","#ffe28c","#fff"][i%3]);
  }

  // Manta de picnic
  drawBlanket();
}

function drawBlanket(){
  let top=H*.70;
  let bottom=H+20;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(W*.04,top);
  ctx.lineTo(W*.96,top);
  ctx.lineTo(W*1.04,bottom);
  ctx.lineTo(-W*.04,bottom);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle="#ee9fbd";
  ctx.fillRect(0,top,W,H-top);

  const size=30;
  for(let y=top;y<bottom;y+=size){
    for(let x=0;x<W;x+=size){
      if((Math.floor(x/size)+Math.floor(y/size))%2===0){
        ctx.fillStyle="#fff4f7";
        ctx.fillRect(x,y,size,size);
      }
    }
  }

  ctx.restore();

  line(W*.04,top,W*.96,top,"#fff7fa",5);

  // Pliegues y bordes
  line(W*.04,top,W*.01,H,"#d77f9f",3);
  line(W*.96,top,W*.99,H,"#d77f9f",3);
  line(W*.15,H*.94,W*.85,H*.94,"rgba(184,94,131,.25)",2);
}

// CERDITO ILUSTRADO

function drawPig(){
  const x=pigX;
  const y=H-148;

  ctx.save();
  ctx.translate(x,y);

  // Sombra
  ellipse(0,120,61,11,"rgba(89,65,50,.17)");

  // Piernas
  round(-37,70,25,43,10,"#e995ad");
  round(12,70,25,43,10,"#e995ad");

  // Zapatos
  ellipse(-25,111,19,9,"#f6c1cf");
  ellipse(25,111,19,9,"#f6c1cf");

  // Cuerpo
  ellipse(0,44,47,51,"#f5a9c1");

  // Jardinero
  round(-43,30,86,57,17,"#3979bd");
  round(-22,35,44,35,7,"#2865a5");

  // Tirantes
  line(-29,43,-25,4,"#3979bd",11);
  line(29,43,25,4,"#3979bd",11);

  // Botones
  ellipse(-25,34,4,4,"#f5d879");
  ellipse(25,34,4,4,"#f5d879");

  // Bolsillo
  round(-13,53,26,22,5,"#285e9c");
  ctx.strokeStyle="#8db7dc";
  ctx.lineWidth=1.5;
  ctx.strokeRect(-13,53,26,22);

  // Brazos
  line(-38,22,-56,58,"#f5a9c1",13);
  line(38,22,56,58,"#f5a9c1",13);

  // Orejas
  ctx.save();
  ctx.rotate(-.35);
  ellipse(-38,-48,15,25,"#f5a9c1");
  ellipse(-38,-48,7,15,"#e985a8");
  ctx.restore();

  ctx.save();
  ctx.rotate(.35);
  ellipse(38,-48,15,25,"#f5a9c1");
  ellipse(38,-48,7,15,"#e985a8");
  ctx.restore();

  // Cabeza
  ellipse(0,-26,55,49,"#f5a9c1");

  // Mejillas
  ellipse(-35,-16,10,6,"#ee8ca9");
  ellipse(35,-16,10,6,"#ee8ca9");

  // Ojos
  ellipse(-20,-34,3.5,5,"#38232b");
  ellipse(20,-34,3.5,5,"#38232b");

  // Hocico
  ellipse(0,-12,21,15,"#ee8ca9");
  ellipse(-7,-13,3,4,"#713c50");
  ellipse(7,-13,3,4,"#713c50");

  // Sonrisa
  ctx.strokeStyle="#754454";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.arc(0,-2,8,.2,Math.PI-.2);
  ctx.stroke();

  // Cola
  ctx.strokeStyle="#f5a9c1";
  ctx.lineWidth=5;
  ctx.beginPath();
  ctx.arc(49,56,10,0,Math.PI*1.7);
  ctx.stroke();

  ctx.restore();
}

// FRUTAS DIBUJADAS

function drawStrawberry(x,y){
  ctx.save();
  ctx.translate(x,y);

  ctx.fillStyle="#e94e65";
  ctx.beginPath();
  ctx.moveTo(-13,-9);
  ctx.bezierCurveTo(-19,-23,-5,-25,0,-14);
  ctx.bezierCurveTo(12,-27,21,-16,12,-5);
  ctx.lineTo(0,18);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle="#39884c";
  ctx.beginPath();
  ctx.moveTo(-10,-17);
  ctx.lineTo(-17,-25);
  ctx.lineTo(-4,-22);
  ctx.lineTo(0,-30);
  ctx.lineTo(5,-21);
  ctx.lineTo(16,-25);
  ctx.lineTo(10,-15);
  ctx.fill();

  ctx.fillStyle="#ffe4a1";
  for(let i=0;i<5;i++) ellipse(-7+i*4,-6+i%2*7,1.2,2,"#ffe6a2");
  ctx.restore();
}

function drawApple(x,y){
  ctx.save();
  ctx.translate(x,y);

  ellipse(-7,0,10,13,"#e84955");
  ellipse(7,0,10,13,"#f25d60");
  ellipse(0,-3,8,10,"#ed4d58");

  line(0,-13,2,-22,"#79503a",3);

  ctx.fillStyle="#4b9c59";
  ctx.beginPath();
  ctx.ellipse(8,-19,7,3,-.5,0,Math.PI*2);
  ctx.fill();

  ellipse(-8,-4,3,5,"rgba(255,255,255,.35)");
  ctx.restore();
}

function drawCherry(x,y){
  ctx.save();
  ctx.translate(x,y);

  line(-7,-3,0,-24,"#39864b",2);
  line(7,-3,0,-24,"#39864b",2);

  ellipse(-8,4,10,11,"#c92e4c");
  ellipse(9,4,10,11,"#e44c60");
  ellipse(-11,0,3,4,"#ffb1b8");

  ctx.restore();
}

function drawCupcake(x,y){
  ctx.save();
  ctx.translate(x,y);

  ctx.fillStyle="#d78a5c";
  ctx.beginPath();
  ctx.moveTo(-13,-3);
  ctx.lineTo(-10,17);
  ctx.lineTo(10,17);
  ctx.lineTo(13,-3);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle="#f8b4cf";
  ctx.beginPath();
  ctx.arc(0,-5,14,Math.PI,0);
  ctx.arc(9,-3,8,Math.PI*1.5,Math.PI*.5);
  ctx.arc(-9,-3,8,Math.PI*.5,Math.PI*1.5);
  ctx.fill();

  ellipse(0,-18,4,4,"#e94e65");
  ctx.restore();
}

function drawFood(food){
  if(food.type===0)drawStrawberry(food.x,food.y);
  if(food.type===1)drawApple(food.x,food.y);
  if(food.type===2)drawCherry(food.x,food.y);
  if(food.type===3)drawCupcake(food.x,food.y);
}

function spawnFood(){
  foods.push({
    x:25+Math.random()*(W-50),
    y:-25,
    speed:2+Math.random()*1.5,
    type:Math.floor(Math.random()*4)
  });
}

function updateFoods(){
  for(let i=foods.length-1;i>=0;i--){
    let f=foods[i];
    f.y+=f.speed;

    if(
      f.y>H-185 &&
      f.y<H-25 &&
      Math.abs(f.x-pigX)<57
    ){
      coins++;
      document.getElementById("coins").textContent=coins;
      foods.splice(i,1);
      continue;
    }

    if(f.y>H+30)foods.splice(i,1);
  }
}

function frame(timestamp){
  if(!playing)return;

  drawBackground();

  if(timestamp-lastSpawn>850){
    spawnFood();
    lastSpawn=timestamp;
  }

  updateFoods();
  foods.forEach(drawFood);
  drawPig();

  animation=requestAnimationFrame(frame);
}

// CONTROLES

function movePig(clientX){
  const rect=canvas.getBoundingClientRect();
  pigX=Math.max(62,Math.min(W-62,clientX-rect.left));
}

canvas.addEventListener("pointerdown",e=>{
  if(playing)movePig(e.clientX);
});

canvas.addEventListener("pointermove",e=>{
  if(playing && e.pressure>0)movePig(e.clientX);
});

// INICIO Y FINAL

function startGame(){
  cancelAnimationFrame(animation);
  clearInterval(timer);

  coins=0;
  time=90;
  foods=[];
  pigX=W/2;
  lastSpawn=0;
  playing=true;

  document.getElementById("coins").textContent=0;
  document.getElementById("time").textContent=90;
  document.getElementById("overlay").style.display="none";

  const music=document.getElementById("music");
  music.currentTime=0;
  music.play().catch(()=>{});

  timer=setInterval(()=>{
    if(!playing)return;

    time--;
    document.getElementById("time").textContent=time;

    if(time<=0)endGame();
  },1000);

  animation=requestAnimationFrame(frame);
}

function endGame(){
  playing=false;
  clearInterval(timer);
  cancelAnimationFrame(animation);

  const music=document.getElementById("music");
  music.pause();
  music.currentTime=0;

  const overlay=document.getElementById("overlay");
  overlay.style.display="flex";

  overlay.innerHTML=`
    <h2>¡Picnic terminado!</h2>
    <p>¡Juntaste ${coins} monedas!</p>
    <p>¡El cerdito está muy feliz!</p>
    <button onclick="startGame()">JUGAR DE NUEVO</button>
  `;

  document.getElementById("time").textContent=0;
}

drawBackground();
drawPig();
</script>

</body>
</html>
