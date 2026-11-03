// Configure o telefone com DDI + DDD, apenas números, antes de publicar.
const WHATSAPP_NUMBER = '5531988776013';
const confirmation = document.getElementById('whatsappBtn');
confirmation.addEventListener('click', () => {
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    const status = document.getElementById('rsvp-status');
    status.textContent = 'A confirmação estará disponível em breve. Aguarde o contato da família.';
    status.hidden = false;
    return;
  }
  const message = encodeURIComponent('Olá! Quero confirmar minha presença nos 15 anos da Júlia Lima. Meu nome é: ');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
});

const elements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      } else if (entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? window.innerHeight)) {
        entry.target.classList.add('reveal-pending');
      }
    });
  }, { threshold: 0.08 });
  // Usa a geometria já calculada pelo navegador, sem forçar um layout síncrono.
  elements.forEach(element => observer.observe(element));
}

function startEffects() {
const card = document.querySelector('.invite-card');
const canvas = document.getElementById('sparkles');
const ctx = canvas.getContext('2d');
if (!ctx) return;
let width = 0, height = 0, frame = 0, previous = 0;
let viewportTop = 0, viewportHeight = 0, viewportDirty = true, dpr = 1;
let inView = true;
const frameInterval = 1000 / 30;
function sprite(size, paint) {
  const image = document.createElement('canvas');
  image.width = image.height = size;
  paint(image.getContext('2d'), size);
  return image;
}
const glowSprite = sprite(64, (paint, size) => {
  const glow = paint.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, 'rgba(255,244,190,.85)');
  glow.addColorStop(.2, 'rgba(250,213,123,.3)');
  glow.addColorStop(1, 'rgba(250,213,123,0)');
  paint.fillStyle = glow; paint.fillRect(0, 0, size, size);
});
const starSprite = sprite(64, paint => {
  paint.translate(32, 32); paint.fillStyle = '#fff6cb';
  paint.shadowColor = '#e6b74b'; paint.shadowBlur = 8;
  paint.beginPath(); paint.moveTo(0, -24);
  paint.quadraticCurveTo(3, -3, 17, 0); paint.quadraticCurveTo(3, 3, 0, 24);
  paint.quadraticCurveTo(-3, 3, -17, 0); paint.quadraticCurveTo(-3, -3, 0, -24);
  paint.fill();
});
const petalSprite = sprite(48, paint => {
  paint.translate(24, 18);
  const petal = paint.createLinearGradient(-10, 0, 10, 20);
  petal.addColorStop(0, '#fffef4'); petal.addColorStop(1, '#ddc88a');
  paint.fillStyle = petal; paint.shadowColor = '#7e6d3533'; paint.shadowBlur = 3;
  paint.beginPath(); paint.moveTo(0, -10);
  paint.bezierCurveTo(13, -3, 10, 13, 0, 17);
  paint.bezierCurveTo(-10, 7, -7, -4, 0, -10); paint.fill();
});
function nearViewport(y, radius = 30) {
  return y >= viewportTop - radius && y <= viewportTop + viewportHeight + radius;
}
let pointer = { x: -1000, y: -1000 };
let trail = [];
let lastTrail = 0;
let bursts = [];
let lastBurst = 0;
let effectTime = 0;
const lights = Array.from({ length: 9 }, () => ({
  side: Math.random() < 0.5, y: Math.random(), phase: Math.random() * Math.PI * 2,
  size: 8 + Math.random() * 16
}));
const petals = Array.from({ length: 18 }, () => ({
  side: Math.random() < 0.5 ? 0 : 1, x: Math.random() * 0.12,
  y: Math.random(), size: 5 + Math.random() * 6,
  phase: Math.random() * Math.PI * 2, speed: 0.012 + Math.random() * 0.012
}));
const particles = Array.from({ length: 64 }, () => ({
  x: Math.random(), y: Math.random(), radius: 0.6 + Math.random() * 1.4,
  phase: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.013
}));
function resize() {
  width = card.clientWidth;
  height = card.clientHeight;
  viewportHeight = Math.min(height, window.innerHeight);
  dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(viewportHeight * dpr);
  canvas.style.height = `${viewportHeight}px`;
  viewportDirty = true;
}
new ResizeObserver(resize).observe(card);
window.addEventListener('resize', resize, {passive:true});
window.addEventListener('scroll', () => { viewportDirty = true; }, {passive:true});
card.addEventListener('pointermove', event => {
  const rect = card.getBoundingClientRect();
  pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  const now = performance.now();
  if (event.pointerType !== 'touch' && now - lastTrail > 55) {
    trail.push({ x: pointer.x, y: pointer.y, life: 1, vx: (Math.random() - 0.5) * 10, vy: -8 - Math.random() * 10 });
    if (trail.length > 24) trail.shift();
    lastTrail = now;
  }
});
card.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; });
card.addEventListener('pointerdown', event => {
  if (event.target.closest('button, a') || performance.now() - lastBurst < 300) return;
  lastBurst = performance.now();
  const rect = card.getBoundingClientRect();
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const speed = 22 + Math.random() * 42;
    bursts.push({ x: event.clientX - rect.left, y: event.clientY - rect.top,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 16,
      life: 1, size: 1.2 + Math.random() * 1.8 });
  }
  bursts = bursts.slice(-72);
});
function star(x, y, size, alpha) {
  if (!nearViewport(y, size * 4)) return;
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.drawImage(starSprite, x - size * 3.2, y - size * 3.2, size * 6.4, size * 6.4);
}
function framePoint(progress) {
  const left = width * .044, top = height * .023;
  const w = width * .912, h = height * .955;
  let distance = ((progress % 1 + 1) % 1) * (2 * (w + h));
  if (distance < w) return {x: left + distance, y: top};
  distance -= w;
  if (distance < h) return {x: left + w, y: top + distance};
  distance -= h;
  if (distance < w) return {x: left + w - distance, y: top + h};
  return {x: left, y: top + h - (distance - w)};
}
function animate(now) {
  frame = requestAnimationFrame(animate);
  if (now - previous < frameInterval - .5) return;
  const elapsed = Math.min((now - previous) / 1000, 0.05);
  previous = now;
  effectTime += elapsed;
  if (viewportDirty) {
    viewportTop = Math.max(0, Math.min(height - viewportHeight, -card.getBoundingClientRect().top));
    canvas.style.transform = `translateY(${viewportTop}px)`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, -viewportTop * dpr);
    viewportDirty = false;
  }
  ctx.clearRect(0, viewportTop, width, viewportHeight);
  // Três pontos de luz percorrem a moldura com uma cauda dourada.
  for (let light = 0; light < 3; light++) {
    const progress = effectTime / 34 + light / 3;
    for (let i = 22; i >= 0; i--) {
      const point = framePoint(progress - i * .0009);
      if (!nearViewport(point.y)) continue;
      ctx.globalAlpha = (1 - i / 23) * .45;
      ctx.fillStyle = '#e4bb58';
      ctx.beginPath(); ctx.arc(point.x, point.y, 1.1, 0, Math.PI * 2); ctx.fill();
    }
    const head = framePoint(progress);
    star(head.x, head.y, 3.2, .85);
  }
  lights.forEach(light => {
    const x = width * (light.side ? .085 : .915) + Math.sin(effectTime * .23 + light.phase) * 9;
    const y = light.y * height + Math.sin(effectTime * .19 + light.phase) * 20;
    const radius = light.size * Math.min(width / 600, 1);
    if (!nearViewport(y, radius)) return;
    ctx.globalAlpha = .35 + (Math.sin(effectTime + light.phase) + 1) * .22;
    ctx.drawImage(glowSprite, x-radius,y-radius,radius*2,radius*2);
  });
  // Um halo difuso acompanha o cursor sem esconder as letras.
  if (pointer.x >= 0) {
    ctx.globalAlpha = .15;
    ctx.drawImage(glowSprite, pointer.x - 110, pointer.y - 110, 220, 220);
  }
  petals.forEach(p => {
    p.y += p.speed * elapsed;
    if (p.y > 1.03) p.y = -0.03;
    const breeze = Math.sin(now * 0.0006 + p.phase);
    const edge = Math.max(0.02, p.x + breeze * 0.015);
    const x = (p.side ? 1 - edge : edge) * width;
    if (!nearViewport(p.y * height, p.size * 3)) return;
    ctx.save();
    ctx.translate(x, p.y * height);
    ctx.rotate(p.phase + now * 0.00025 + breeze * .35);
    ctx.scale(0.7 + Math.abs(breeze) * 0.3, 1);
    ctx.globalAlpha = 0.58;
    ctx.drawImage(petalSprite, -p.size * 2.4, -p.size * 1.8, p.size * 4.8, p.size * 4.8);
    ctx.restore();
  });
  particles.forEach(p => {
    p.y -= p.speed * elapsed;
    if (p.y < 0) p.y = 1;
    // Concentra os brilhos nas bordas para manter o texto legível.
    const x = (p.x < 0.5 ? p.x * 0.29 : 1 - (1 - p.x) * 0.29) * width;
    const y = p.y * height;
    if (!nearViewport(y)) return;
    const nearby = Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 130);
    const flicker = (Math.sin(now * 0.0014 + p.phase) + 1) / 2;
    const alpha = 0.14 + flicker * 0.48 + nearby * 0.2;
    const r = p.radius * (1 + nearby);
    ctx.globalAlpha = alpha;
    ctx.drawImage(glowSprite, x - r * 7, y - r * 7, r * 14, r * 14);
    ctx.fillStyle = '#b88d24';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    if (flicker > 0.86) {
      ctx.strokeStyle = '#fff4bf'; ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - r * 4, y); ctx.lineTo(x + r * 4, y);
      ctx.moveTo(x, y - r * 5); ctx.lineTo(x, y + r * 5);
      ctx.stroke();
      star(x, y, r * 1.5, (flicker - .86) * 4);
    }
  });
  bursts = bursts.filter(p => p.life > 0);
  bursts.forEach(p => {
    p.life -= elapsed * .65;
    p.x += p.vx * elapsed; p.y += p.vy * elapsed;
    p.vy += elapsed * 12;
    star(p.x, p.y, p.size * Math.max(.2, p.life), p.life * .7);
  });
  trail = trail.filter(p => p.life > 0);
  trail.forEach(p => {
    p.life -= elapsed * 1.1;
    p.x += p.vx * elapsed; p.y += p.vy * elapsed;
    ctx.globalAlpha = Math.max(0, p.life) * 0.5;
    ctx.fillStyle = '#c5a049';
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.1, p.life * 1.8), 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;
}
function updateMotion() {
  cancelAnimationFrame(frame);
  document.documentElement.classList.toggle('motion-paused', document.hidden || !inView);
  if (!document.hidden && inView) {
    previous = performance.now();
    frame = requestAnimationFrame(animate);
  } else if (ctx) {
    ctx.clearRect(0, viewportTop, width, viewportHeight);
    trail = [];
    bursts = [];
  }
}
document.addEventListener('visibilitychange', updateMotion);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    updateMotion();
  }).observe(card);
}
resize();
updateMotion();
}

function scheduleEffects() {
  if ('requestIdleCallback' in window) window.requestIdleCallback(startEffects, {timeout:1500});
  else setTimeout(startEffects, 100);
}
if (document.readyState === 'complete') scheduleEffects();
else window.addEventListener('load', scheduleEffects, {once:true});
