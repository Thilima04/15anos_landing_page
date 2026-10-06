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
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  elements.forEach(element => observer.observe(element));
}

const card = document.querySelector('.invite-card');
const canvas = document.getElementById('sparkles');
const ctx = canvas.getContext('2d');
let width = 0, height = 0, frame = 0, previous = 0;
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
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}
new ResizeObserver(resize).observe(card);
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
  ctx.save();
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.translate(x, y);
  ctx.fillStyle = '#fff6cb';
  ctx.shadowColor = '#e6b74b'; ctx.shadowBlur = size * 4;
  ctx.beginPath();
  ctx.moveTo(0, -size * 2.4); ctx.quadraticCurveTo(size * .3, -size * .3, size * 1.7, 0);
  ctx.quadraticCurveTo(size * .3, size * .3, 0, size * 2.4);
  ctx.quadraticCurveTo(-size * .3, size * .3, -size * 1.7, 0);
  ctx.quadraticCurveTo(-size * .3, -size * .3, 0, -size * 2.4);
  ctx.fill(); ctx.restore();
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
  const elapsed = Math.min((now - previous) / 1000, 0.05);
  previous = now;
  effectTime += elapsed;
  ctx.clearRect(0, 0, width, height);
  // Três pontos de luz percorrem a moldura com uma cauda dourada.
  for (let light = 0; light < 3; light++) {
    const progress = effectTime / 34 + light / 3;
    for (let i = 22; i >= 0; i--) {
      const point = framePoint(progress - i * .0009);
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
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, 'rgba(255,249,217,0.5)');
    glow.addColorStop(.35, 'rgba(250,213,123,0.18)');
    glow.addColorStop(1, 'rgba(250,213,123,0)');
    ctx.globalAlpha = .35 + (Math.sin(effectTime + light.phase) + 1) * .22;
    ctx.fillStyle = glow; ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
  });
  // Um halo difuso acompanha o cursor sem esconder as letras.
  if (pointer.x >= 0) {
    const halo = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 110);
    halo.addColorStop(0, 'rgba(255,225,141,0.12)');
    halo.addColorStop(1, 'rgba(255,225,141,0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = halo;
    ctx.fillRect(pointer.x - 110, pointer.y - 110, 220, 220);
  }
  petals.forEach(p => {
    p.y += p.speed * elapsed;
    if (p.y > 1.03) p.y = -0.03;
    const breeze = Math.sin(now * 0.0006 + p.phase);
    const edge = Math.max(0.02, p.x + breeze * 0.015);
    const x = (p.side ? 1 - edge : edge) * width;
    ctx.save();
    ctx.translate(x, p.y * height);
    ctx.rotate(p.phase + now * 0.00025 + breeze * .35);
    ctx.scale(0.7 + Math.abs(breeze) * 0.3, 1);
    ctx.globalAlpha = 0.58;
    ctx.shadowColor = '#7e6d3533'; ctx.shadowBlur = 3; ctx.shadowOffsetY = 2;
    const petal = ctx.createLinearGradient(-p.size, 0, p.size, p.size * 2);
    petal.addColorStop(0, '#fffef4');
    petal.addColorStop(1, '#ddc88a');
    ctx.fillStyle = petal;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 1.3, -p.size * 0.3, p.size, p.size * 1.3, 0, p.size * 1.7);
    ctx.bezierCurveTo(-p.size, p.size * 0.7, -p.size * 0.7, -p.size * 0.4, 0, -p.size);
    ctx.fill();
    ctx.restore();
  });
  particles.forEach(p => {
    p.y -= p.speed * elapsed;
    if (p.y < 0) p.y = 1;
    // Concentra os brilhos nas bordas para manter o texto legível.
    const x = (p.x < 0.5 ? p.x * 0.29 : 1 - (1 - p.x) * 0.29) * width;
    const y = p.y * height;
    const nearby = Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 130);
    const flicker = (Math.sin(now * 0.0014 + p.phase) + 1) / 2;
    const alpha = 0.14 + flicker * 0.48 + nearby * 0.2;
    const r = p.radius * (1 + nearby);
    ctx.globalAlpha = alpha;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 7);
    glow.addColorStop(0, 'rgba(255,239,174,0.75)');
    glow.addColorStop(1, 'rgba(246,211,116,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - r * 7, y - r * 7, r * 14, r * 14);
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
  frame = requestAnimationFrame(animate);
}
function updateMotion() {
  cancelAnimationFrame(frame);
  document.documentElement.classList.toggle('motion-paused', document.hidden);
  if (ctx && !document.hidden) {
    previous = performance.now();
    frame = requestAnimationFrame(animate);
  } else if (ctx) {
    ctx.clearRect(0, 0, width, height);
    trail = [];
    bursts = [];
  }
}
document.addEventListener('visibilitychange', updateMotion);
resize();
updateMotion();
