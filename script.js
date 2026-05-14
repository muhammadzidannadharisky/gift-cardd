const messages = [
  {
    img: "pirr.jpg",
    text: "Di antara semua hal yang mungkin sedang lu hadapi sekarang, gw cuma berharap dihari spesial lu ini bisa jadi jeda kecil yang membuat hati lu sedikit lebih tenang. dan semoga setelah semua hal berat yang berhasil lu lewati, hidup perlahan mulai menghadirkan banyak hal baik yang selama ini pantas buat lu dapetin."
  },
  {
    img: "pirji.jpg",
    text: "Dan mungkin lu bakal bingung siapa yang nyiapin semua ini diam-diam. tapi ga usah terlalu nyari tau siapa orangnya, anggep aja ini cuma pengingat kecil kalau kadang, seseorang bisa jadi berarti lewat hal-hal sederhana yang bahkan ga pernah mereka sadari."
  },
  {
    img: "gie.jpg",
    text: "Happy birthday yaa yang ke-20. Semoga yang lu baca barusan bisa merasa lu jadi kek seakan-akan masih punya sosok yang masih care sama lu, dan semoga suatu hari nanti lu bisa ngerasain itu sepenuhnya. I'm glad you Happy."
  }
];

let currentSection = 0;
let currentMsg     = 0;
let confettiAnim   = null;

const sections = document.querySelectorAll('.section');
const navDots  = document.querySelectorAll('.nav-dot');

// ===== LOADING =====
window.addEventListener('load', function () {
  var audio = document.getElementById('bgm');
  audio.volume = 1.0;

  var playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(function () {
      var events = ['touchstart', 'touchend', 'click', 'keydown'];
      function tryPlay() {
        audio.play().catch(function(){});
        events.forEach(function(e) {
          document.removeEventListener(e, tryPlay);
        });
      }
      events.forEach(function(e) {
        document.addEventListener(e, tryPlay, { once: true, passive: true });
      });
    });
  }

  setTimeout(function () {
    var ls = document.getElementById('loading-screen');
    ls.classList.add('hide');
    setTimeout(function () { ls.style.display = 'none'; }, 1000);
  }, 3400);
});

// ===== NAVIGATION =====
function goTo(idx) {
  if (idx === currentSection) return;
  sections[currentSection].classList.remove('active');
  navDots[currentSection].classList.remove('active');
  currentSection = idx;
  sections[idx].classList.add('active');
  navDots[idx].classList.add('active');
  onSectionEnter(idx);
}

function onSectionEnter(idx) {
  if (idx === 1) startCountdown();
  if (idx === 5) startConfetti();
  else           stopConfetti();
}

setTimeout(function () {
  if (currentSection === 0) goTo(1);
}, 6500);

// ===== COUNTDOWN =====
function startCountdown() {
  var el = document.getElementById('countdown-num');
  var n  = 3;
  el.textContent = n;
  el.style.animation = 'countSpin 1s ease both';
  function tick() {
    n--;
    if (n <= 0) { setTimeout(function () { goTo(2); }, 800); return; }
    el.style.animation = 'none';
    void el.offsetWidth;
    el.textContent = n;
    el.style.animation = 'countSpin 1s ease both';
    setTimeout(tick, 1000);
  }
  setTimeout(tick, 1000);
}

// ===== STARS =====
function initStars(canvasId) {
  var c = document.getElementById(canvasId);
  if (!c) return;
  var ctx = c.getContext('2d');
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  var stars = [];
  for (var i = 0; i < 180; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2
    });
  }
  function draw(t) {
    ctx.clearRect(0, 0, c.width, c.height);
    stars.forEach(function (s) {
      var alpha = 0.2 + 0.6 * Math.sin(t * s.speed * 60 + s.phase);
      ctx.beginPath();
      ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240,230,200,' + alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// ===== BOKEH =====
function initBokeh(canvasId) {
  var c = document.getElementById(canvasId);
  if (!c) return;
  var ctx = c.getContext('2d');
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  var orbs = [];
  for (var i = 0; i < 14; i++) {
    orbs.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 160 + 80,
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00015,
      h: 35 + Math.random() * 15,
      s: 15 + Math.random() * 15,
      l: 18 + Math.random() * 12,
      a: 0.06 + Math.random() * 0.1
    });
  }
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, c.width, c.height);
    orbs.forEach(function (o) {
      o.x = (o.x + o.vx + 1) % 1;
      o.y = (o.y + o.vy + 1) % 1;
      var cx = o.x * c.width;
      var cy = o.y * c.height;
      var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
      grd.addColorStop(0, 'hsla(' + o.h + ',' + o.s + '%,' + o.l + '%,' + o.a + ')');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// ===== CONFETTI =====
function startConfetti() {
  var c = document.getElementById('confetti-canvas');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  var ctx = c.getContext('2d');
  var particles = [];

  for (var i = 0; i < 90; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 9 + 3;
    particles.push({
      x: c.width/2, y: c.height/2,
      vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed - 5,
      size: Math.random()*5+2,
      color: ['#c8a96e','#e8c882','#fff8e7','#d4b896','#f0d080'][Math.floor(Math.random()*5)],
      alpha:1, decay: Math.random()*0.014+0.007,
      type: Math.random()>0.5?'circle':'rect',
      rot: Math.random()*360, rspeed:(Math.random()-0.5)*4
    });
  }

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    particles.forEach(function(p) {
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.1;
      p.rot+=p.rspeed; p.alpha-=p.decay;
      if (p.y>c.height && p.decay<0.004) {
        p.y=-10; p.x=Math.random()*c.width; p.alpha=0.9;
      }
      ctx.save();
      ctx.globalAlpha=Math.max(0,p.alpha);
      ctx.fillStyle=p.color;
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot*Math.PI/180);
      if (p.type==='circle') {
        ctx.beginPath(); ctx.arc(0,0,p.size,0,Math.PI*2); ctx.fill();
      } else {
        ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*2);
      }
      ctx.restore();
    });
    confettiAnim = requestAnimationFrame(draw);
  }
  draw();
}

function stopConfetti() {
  if (confettiAnim) { cancelAnimationFrame(confettiAnim); confettiAnim=null; }
  var c = document.getElementById('confetti-canvas');
  c.getContext('2d').clearRect(0,0,c.width,c.height);
}

// ===== MESSAGE CAROUSEL =====
function buildDots() {
  var track = document.getElementById('dot-track');
  track.innerHTML = '';
  messages.forEach(function(_, i) {
    var d = document.createElement('div');
    d.className = 'msg-dot'+(i===currentMsg?' active':'');
    d.onclick = function(){ setMsg(i); };
    track.appendChild(d);
  });
}

function setMsg(i) {
  currentMsg = i;
  document.getElementById('msg-img').src = messages[i].img;
  document.getElementById('msg-p').textContent = messages[i].text;
  document.querySelectorAll('.msg-dot').forEach(function(d,j){
    d.classList.toggle('active', j===i);
  });
}

function prevMsg() { setMsg((currentMsg-1+messages.length)%messages.length); }
function nextMsg() { setMsg((currentMsg+1)%messages.length); }

buildDots();
setMsg(0);

// ===== GOLD BORDER — hover via CSS, klik via JS =====
document.querySelectorAll('.photo-cell').forEach(function(cell) {
  cell.addEventListener('click', function() {
    document.querySelectorAll('.photo-cell').forEach(function(c) {
      c.classList.remove('selected');
    });
    this.classList.add('selected');
  });
});

// ===== REPLAY =====
function replayAll() {
  stopConfetti();
  goTo(0);
  setTimeout(function(){ goTo(1); }, 800);
}

// ===== GOLDEN DUST RISING =====
function initSpiral(canvasId) {
  var c = document.getElementById(canvasId);
  if (!c) return;
  var ctx = c.getContext('2d');
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  var dust = [];
  for (var i = 0; i < 160; i++) dust.push(makeDust(c, true));

  function makeDust(c, randomY) {
    return {
      x: Math.random() * c.width,
      y: randomY ? Math.random() * c.height : c.height + 10,
      r: Math.random() * 2.5 + 0.5,
      vy: -(Math.random() * 0.7 + 0.25),
      vx: (Math.random() - 0.5) * 0.4,
      alpha: 0,
      maxAlpha: Math.random() * 0.75 + 0.3,
      fadeIn: true,
      life: 0,
      maxLife: Math.random() * 280 + 180
    };
  }

  var twinkles = [];
  for (var j = 0; j < 90; j++) {
    twinkles.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.018 + 0.005,
      gold: Math.random() > 0.4
    });
  }

  var shoots = [];
  var shootTimer = 0;

  function makeShoot(c) {
    var startX = Math.random() * c.width * 0.7 + c.width * 0.1;
    var startY = Math.random() * c.height * 0.4;
    return {
      x: startX, y: startY,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 6,
      angle: Math.PI / 5 + Math.random() * 0.3,
      alpha: 1,
      life: 0,
      maxLife: 40
    };
  }

  var ringAlpha = 0;

  function draw(t) {
    ctx.clearRect(0, 0, c.width, c.height);

    if (ringAlpha < 0.22) ringAlpha += 0.001;
    var cx = c.width / 2, cy = c.height / 2;
    var rr = Math.min(c.width, c.height) * 0.26;
    var ringGrad = ctx.createRadialGradient(cx, cy, rr * 0.6, cx, cy, rr * 1.2);
    ringGrad.addColorStop(0, 'transparent');
    ringGrad.addColorStop(0.5, 'rgba(210,175,100,' + ringAlpha + ')');
    ringGrad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, rr * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = ringGrad;
    ctx.fill();

    twinkles.forEach(function(s) {
      var alpha = 0.15 + 0.85 * Math.abs(Math.sin(t * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold
        ? 'rgba(220,185,100,' + alpha + ')'
        : 'rgba(255,250,220,' + alpha * 0.7 + ')';
      ctx.fill();
    });

    shootTimer++;
    if (shootTimer > 90 + Math.random() * 80) {
      shoots.push(makeShoot(c));
      shootTimer = 0;
    }
    for (var si = shoots.length - 1; si >= 0; si--) {
      var sh = shoots[si];
      sh.life++;
      sh.x += Math.cos(sh.angle) * sh.speed;
      sh.y += Math.sin(sh.angle) * sh.speed;
      sh.alpha = 1 - sh.life / sh.maxLife;
      if (sh.life >= sh.maxLife) { shoots.splice(si, 1); continue; }
      var tx = sh.x - Math.cos(sh.angle) * sh.len;
      var ty = sh.y - Math.sin(sh.angle) * sh.len;
      var sg = ctx.createLinearGradient(tx, ty, sh.x, sh.y);
      sg.addColorStop(0, 'rgba(255,230,130,0)');
      sg.addColorStop(1, 'rgba(255,230,130,' + sh.alpha + ')');
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(sh.x, sh.y);
      ctx.strokeStyle = sg;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      d.x += d.vx + Math.sin(d.life * 0.04) * 0.2;
      d.y += d.vy;
      d.life++;
      if (d.fadeIn) {
        d.alpha += 0.015;
        if (d.alpha >= d.maxAlpha) d.fadeIn = false;
      } else {
        d.alpha -= 0.004;
      }
      if (d.life > d.maxLife || d.alpha <= 0 || d.y < -10) {
        dust[i] = makeDust(c, false);
        continue;
      }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220,185,110,' + Math.max(0, d.alpha) + ')';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// ===== INIT =====
initStars('stars1');
initBokeh('bokeh2');
initBokeh('bokeh3');
initBokeh('bokeh4');
initBokeh('bokeh5');
initBokeh('bokeh6');
initSpiral('spiral-canvas');