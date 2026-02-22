const sections = document.querySelectorAll('section');
const sectionTitles = ['Welcome 💖', 'Celebration Zone 🎉', 'Music Lounge 🎶', 'Life Clock ⏳', 'Challenge Game 🎮'];
const progressBar = document.getElementById('progressBar');
const sectionLabel = document.getElementById('sectionLabel');
const swipeHint = document.getElementById('swipeHint');
const quickNavDots = document.querySelectorAll('.quick-dot');
const pageLoader = document.getElementById('pageLoader');
const sectionTransition = document.getElementById('sectionTransition');
let currentIndex = 0;
let swipeStartX = null;
let isSectionTransitioning = false;

function updateNavUI() {
  const progress = ((currentIndex + 1) / sections.length) * 100;
  progressBar.style.width = `${progress}%`;
  sectionLabel.textContent = sectionTitles[currentIndex] || 'Birthday Journey';
  quickNavDots.forEach(dot => dot.classList.toggle('active', Number(dot.dataset.index) === currentIndex));
  localStorage.setItem('gift_current_section', String(currentIndex));
}

function showSection(index) {
  if (isSectionTransitioning) return;
  if (index < 0 || index >= sections.length) return;
  isSectionTransitioning = true;
  sectionTransition.classList.add('show');

  setTimeout(() => {
  sections[currentIndex].classList.remove('active');
  sections[index].classList.add('active');
  currentIndex = index;
  updateNavUI();
  }, 160);

  setTimeout(() => {
    sectionTransition.classList.remove('show');
    isSectionTransitioning = false;
  }, 320);
}

function nextSection() { showSection(currentIndex + 1); }
function prevSection() { showSection(currentIndex - 1); }
window.nextSection = nextSection;
window.prevSection = prevSection;

quickNavDots.forEach(dot => dot.addEventListener('click', () => showSection(Number(dot.dataset.index))));

document.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'touch') return;
  if (e.target.closest('#gameBox') || e.target.closest('#musicBox')) return;
  swipeStartX = e.clientX;
});

document.addEventListener('pointerup', e => {
  if (e.pointerType !== 'touch' || swipeStartX === null) return;
  if (e.target.closest('#gameBox') || e.target.closest('#musicBox')) { swipeStartX = null; return; }
  const deltaX = e.clientX - swipeStartX;
  swipeStartX = null;
  if (Math.abs(deltaX) < 60) return;
  deltaX < 0 ? nextSection() : prevSection();
});

setTimeout(() => { swipeHint.style.opacity = '0'; swipeHint.style.transition = 'opacity .7s ease'; }, 5000);
updateNavUI();

const text = 'Happy Birthday, my love! 💖 You are the brightest part of my world, the reason behind my smile, and the most beautiful chapter of my story. On your special day, I wish you endless joy, magical moments, and dreams that come true. May this year bring you all the love and happiness you deserve — because you truly deserve the best. I’m so grateful to walk this journey with you, today and always.';
const messageBox = document.getElementById('messageBox');
const pauseTypingBtn = document.getElementById('pauseTypingBtn');
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseLine = document.getElementById('surpriseLine');
const surpriseLines = [
  'You are my today and all my tomorrows 💕',
  'Every moment with you feels like magic ✨',
  'Your smile is my favorite place to be 😊',
  'Forever grateful for your love, Arpita Dey ❤️'
];

let charIndex = 0;
let isTypingPaused = false;
function typeWriter() {
  if (isTypingPaused) return;
  if (charIndex < text.length) {
    messageBox.innerHTML += text.charAt(charIndex++);
    setTimeout(typeWriter, 55);
  }
}

pauseTypingBtn.addEventListener('click', () => {
  isTypingPaused = !isTypingPaused;
  pauseTypingBtn.textContent = isTypingPaused ? 'Resume Message' : 'Pause Message';
  if (!isTypingPaused && charIndex < text.length) typeWriter();
});

surpriseBtn.addEventListener('click', () => {
  surpriseLine.textContent = surpriseLines[Math.floor(Math.random() * surpriseLines.length)];
});

const birthDate = new Date(2007, 1, 23, 18, 38, 0);

function diffParts(fromDate, toDate) {
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();
  let hours = toDate.getHours() - fromDate.getHours();
  let minutes = toDate.getMinutes() - fromDate.getMinutes();
  let seconds = toDate.getSeconds() - fromDate.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  return { years, months, days, hours, minutes, seconds };
}

function updateClocks() {
  const now = new Date();
  const age = diffParts(birthDate, now);
  document.getElementById('ageClock').innerText = `${age.years} years, ${age.months} months, ${age.days} days, ${age.hours}h ${age.minutes}m ${age.seconds}s old ❤️`;

  let nextBirthday = new Date(now.getFullYear(), 1, 23, 18, 38, 0);
  if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
  const msLeft = nextBirthday - now;
  const d = Math.floor(msLeft / (1000 * 60 * 60 * 24));
  const h = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
  const m = Math.floor((msLeft / (1000 * 60)) % 60);
  const s = Math.floor((msLeft / 1000) % 60);
  document.getElementById('nextBirthday').innerText = `Next birthday in: ${d}d ${h}h ${m}m ${s}s 🎂`;
}

const music = document.getElementById('bgMusic');
const volumeControl = document.getElementById('volumeControl');
const savedVolume = Number(localStorage.getItem('gift_music_volume') ?? '0.5');
music.volume = Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.5;
volumeControl.value = String(music.volume);

function toggleMusic() {
  if (music.paused) music.play().catch(() => {});
  else music.pause();
}
window.toggleMusic = toggleMusic;

volumeControl.addEventListener('input', e => {
  music.volume = Number(e.target.value);
  localStorage.setItem('gift_music_volume', String(music.volume));
});

const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
const autoConfettiBtn = document.getElementById('autoConfettiBtn');
let confettiParticles = [];
let confettiAnimationId = null;
let autoBurstInterval = null;

function resizeConfettiCanvas() {
  confettiCanvas.width = confettiCanvas.offsetWidth;
  confettiCanvas.height = confettiCanvas.offsetHeight;
}

function addConfettiParticles(count = 90) {
  for (let p = 0; p < count; p++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: confettiCanvas.height + Math.random() * 120,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      size: Math.random() * 14 + 8,
      speedY: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 1.2,
      type: ['balloon', 'confetti', 'heart'][Math.floor(Math.random() * 3)]
    });
  }
}

function drawHeart(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
  ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.fill();
  ctx.restore();
}

function renderConfettiFrame() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles = confettiParticles.filter(p => p.y > -60);

  confettiParticles.forEach(p => {
    confettiCtx.fillStyle = p.color;
    if (p.type === 'balloon') {
      confettiCtx.beginPath();
      confettiCtx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    } else if (p.type === 'heart') {
      drawHeart(confettiCtx, p.x, p.y, p.size, p.color);
    } else {
      confettiCtx.fillRect(p.x, p.y, p.size, p.size);
    }
    p.y -= p.speedY;
    p.x += p.speedX;
  });

  confettiAnimationId = requestAnimationFrame(renderConfettiFrame);
}

function launchConfetti() {
  resizeConfettiCanvas();
  addConfettiParticles(120);
  if (!confettiAnimationId) renderConfettiFrame();
}
window.launchConfetti = launchConfetti;

autoConfettiBtn.addEventListener('click', () => {
  if (autoBurstInterval) {
    clearInterval(autoBurstInterval);
    autoBurstInterval = null;
    autoConfettiBtn.textContent = 'Auto Burst: Off';
    return;
  }
  launchConfetti();
  autoConfettiBtn.textContent = 'Auto Burst: On';
  autoBurstInterval = setInterval(launchConfetti, 2000);
});

const canvasGame = document.getElementById('gameCanvas');
const ctxGame = canvasGame.getContext('2d');
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const restartGameBtn = document.getElementById('restartGameBtn');
const pauseGameBtn = document.getElementById('pauseGameBtn');
const turboModeBtn = document.getElementById('turboModeBtn');
const scoreEl = document.getElementById('score');
const winnerMessageEl = document.getElementById('winnerMessage');
const livesEl = document.getElementById('lives');
const bestScoreEl = document.getElementById('bestScore');
const speedEl = document.getElementById('speed');

let ballX = 0, ballY = 0, ballDX = 2, ballDY = -2;
const ballRadius = 10, paddleHeight = 10;
let paddleWidth = 82, paddleX = 0, rightPressed = false, leftPressed = false;
let score = 0, lives = 3, gameOver = false, isGamePaused = false, turboMode = false, paddleStep = 7, hasGameInit = false;
let bestScore = Number(localStorage.getItem('arpita_best_score') || 0);

function speedValue() { return Math.sqrt(ballDX * ballDX + ballDY * ballDY).toFixed(1); }
function updateGameMeta() {
  scoreEl.innerText = `Score: ${score}`;
  livesEl.innerText = `Lives: ${lives}`;
  bestScoreEl.innerText = `Best: ${bestScore}`;
  speedEl.innerText = `Speed: ${speedValue()}`;
}

function resetBall() {
  ballX = canvasGame.width / 2;
  ballY = canvasGame.height - 30;
  ballDX = (Math.random() > 0.5 ? 1 : -1) * 2;
  ballDY = -2;
}

function restartGame() {
  score = 0; lives = 3; gameOver = false; isGamePaused = false;
  pauseGameBtn.textContent = 'Pause';
  paddleWidth = 82;
  paddleX = (canvasGame.width - paddleWidth) / 2;
  winnerMessageEl.innerText = '';
  resetBall();
  updateGameMeta();
}

function resizeGameCanvas() {
  const containerWidth = canvasGame.parentElement.clientWidth;
  const nextWidth = Math.max(260, Math.min(500, Math.floor(containerWidth - 10)));
  const nextHeight = Math.floor(nextWidth * 0.8);
  canvasGame.width = nextWidth;
  canvasGame.height = nextHeight;

  if (!hasGameInit) {
    paddleX = (canvasGame.width - paddleWidth) / 2;
    resetBall();
    hasGameInit = true;
  } else {
    paddleX = Math.max(0, Math.min(paddleX, canvasGame.width - paddleWidth));
    ballX = Math.max(ballRadius, Math.min(ballX, canvasGame.width - ballRadius));
    ballY = Math.max(ballRadius, Math.min(ballY, canvasGame.height - ballRadius));
  }
}

function bindHoldControl(button, direction) {
  const start = e => {
    e.preventDefault();
    if (direction === 'left') { leftPressed = true; rightPressed = false; }
    else { rightPressed = true; leftPressed = false; }
  };
  const end = () => {
    if (direction === 'left') leftPressed = false;
    if (direction === 'right') rightPressed = false;
  };
  button.addEventListener('pointerdown', start);
  button.addEventListener('pointerup', end);
  button.addEventListener('pointercancel', end);
  button.addEventListener('pointerleave', end);
}

function movePaddleToTouch(clientX) {
  const rect = canvasGame.getBoundingClientRect();
  paddleX = clientX - rect.left - paddleWidth / 2;
  paddleX = Math.max(0, Math.min(paddleX, canvasGame.width - paddleWidth));
}

function drawBall() {
  ctxGame.beginPath();
  ctxGame.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctxGame.fillStyle = '#ff6ec4';
  ctxGame.shadowColor = '#ff6ec4';
  ctxGame.shadowBlur = 20;
  ctxGame.fill();
  ctxGame.closePath();
}

function drawPaddle() {
  ctxGame.beginPath();
  ctxGame.rect(paddleX, canvasGame.height - paddleHeight, paddleWidth, paddleHeight);
  ctxGame.fillStyle = '#4adede';
  ctxGame.shadowColor = '#4adede';
  ctxGame.shadowBlur = 15;
  ctxGame.fill();
  ctxGame.closePath();
}

function drawGameLoop() {
  ctxGame.clearRect(0, 0, canvasGame.width, canvasGame.height);
  drawBall();
  drawPaddle();

  if (!gameOver && !isGamePaused) {
    if (ballX + ballDX > canvasGame.width - ballRadius || ballX + ballDX < ballRadius) ballDX = -ballDX;

    if (ballY + ballDY < ballRadius) ballDY = -ballDY;
    else if (ballY + ballDY > canvasGame.height - ballRadius) {
      if (ballX > paddleX && ballX < paddleX + paddleWidth) {
        const impact = (ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
        ballDY = -Math.abs(ballDY) * 1.03;
        ballDX += impact * 0.35;
        score++;

        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem('arpita_best_score', String(bestScore));
        }

        if (score % 5 === 0) paddleWidth = Math.max(60, paddleWidth - 3);
        if (score >= 25) winnerMessageEl.innerText = 'Mega Win! Arpita is unstoppable! 👑❤️';
        updateGameMeta();
      } else {
        lives--;
        if (lives <= 0) {
          gameOver = true;
          winnerMessageEl.innerText = 'Game Over 💔 Tap Restart and conquer it!';
        } else {
          resetBall();
          paddleX = (canvasGame.width - paddleWidth) / 2;
          winnerMessageEl.innerText = `Life lost! ${lives} left 💪`;
        }
        updateGameMeta();
      }
    }

    ballX += ballDX;
    ballY += ballDY;
    if (rightPressed && paddleX < canvasGame.width - paddleWidth) paddleX += paddleStep;
    else if (leftPressed && paddleX > 0) paddleX -= paddleStep;
  }

  requestAnimationFrame(drawGameLoop);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
  else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
});

document.addEventListener('keyup', e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
  else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
});

bindHoldControl(btnLeft, 'left');
bindHoldControl(btnRight, 'right');

canvasGame.addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') { e.preventDefault(); movePaddleToTouch(e.clientX); }
});

canvasGame.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') { e.preventDefault(); movePaddleToTouch(e.clientX); }
});

restartGameBtn.addEventListener('click', restartGame);

pauseGameBtn.addEventListener('click', () => {
  if (gameOver) return;
  isGamePaused = !isGamePaused;
  pauseGameBtn.textContent = isGamePaused ? 'Resume' : 'Pause';
  if (isGamePaused) winnerMessageEl.innerText = 'Paused ⏸️';
  else if (winnerMessageEl.innerText === 'Paused ⏸️') winnerMessageEl.innerText = '';
});

turboModeBtn.addEventListener('click', () => {
  turboMode = !turboMode;
  paddleStep = turboMode ? 10 : 7;
  ballDX *= turboMode ? 1.08 : 0.92;
  ballDY *= turboMode ? 1.08 : 0.92;
  turboModeBtn.textContent = turboMode ? 'Turbo: On' : 'Turbo: Off';
  updateGameMeta();
});

document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if (['input', 'textarea'].includes((e.target.tagName || '').toLowerCase())) return;
  if (key === 'n') nextSection();
  else if (key === 'p') prevSection();
  else if (key === 'm') toggleMusic();
  else if (key === 'c') launchConfetti();
  else if (key === 'g') showSection(sections.length - 1);
  else if (key === ' ' && currentIndex === sections.length - 1) { e.preventDefault(); pauseGameBtn.click(); }
});

window.addEventListener('resize', () => {
  resizeGameCanvas();
  resizeConfettiCanvas();
});

window.onload = () => {
  const savedSectionIndex = Number(localStorage.getItem('gift_current_section') || '0');
  if (savedSectionIndex >= 0 && savedSectionIndex < sections.length) showSection(savedSectionIndex);
  typeWriter();
  updateClocks();
  setInterval(updateClocks, 1000);
  resizeConfettiCanvas();
  resizeGameCanvas();
  updateGameMeta();
  drawGameLoop();

  setTimeout(() => {
    pageLoader.classList.add('hidden');
  }, 1100);
};
