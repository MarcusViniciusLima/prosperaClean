// =============================================
//  PRÓSPERA CLEAN & CARE — main.js
// =============================================

const SUPABASE_URL = 'https://eesjzoygbmrhsvtesdrp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlc2p6b3lnYm1yaHN2dGVzZHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDY1NjgsImV4cCI6MjA5MjEyMjU2OH0.7O7CW9rGPWqBSCHiupdYmmOqK4ZYsIbrf5lTKYwlNro';

const API = (path) => `${SUPABASE_URL}/rest/v1${path}`;
const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

// ---------- HEADER SCROLL ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ---------- MENU MOBILE ----------
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// ---------- PARTÍCULAS ----------
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth < 640 ? 20 : 45;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.width = (Math.random() * 2 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = Math.random() * 0.6 + 0.2;
    container.appendChild(p);
  }
}
createParticles();

// ---------- REVEAL ON SCROLL ----------
function setupReveal() {
  const targets = document.querySelectorAll(
    '.service-card, .diferencial, .section__header, .booking__wrapper, .contact-item'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  targets.forEach(el => observer.observe(el));
}
setupReveal();

// ---------- DATA MÍNIMA ----------
const dataInput = document.getElementById('data');
if (dataInput) {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  dataInput.min = today.toISOString().split('T')[0];
}

// ---------- FORMULÁRIO DE AGENDAMENTO ----------
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
const submitBtn = document.getElementById('submitBtn');

const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
  telefoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length >= 7) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length >= 3) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    e.target.value = v;
  });
}

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Enviando...`;
    const formData = {
      nome: document.getElementById('nome').value,
      telefone: document.getElementById('telefone').value,
      servico: document.getElementById('servico').value,
      data: document.getElementById('data').value,
      periodo: document.getElementById('periodo').value,
      endereco: document.getElementById('endereco').value,
      mensagem: document.getElementById('mensagem').value,
    };
    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) showBookingSuccess();
      else sendToWhatsApp(formData);
    } catch {
      sendToWhatsApp(formData);
    }
  });
}

function showBookingSuccess() {
  bookingForm.style.display = 'none';
  bookingSuccess.style.display = 'flex';
  bookingSuccess.style.flexDirection = 'column';
  bookingSuccess.style.alignItems = 'center';
}

function sendToWhatsApp(data) {
  const servicoLabels = { estofado: 'Higienização de Estofados', veiculo: 'Higienização Interna de Veículos', carpete: 'Carpetes e Tapetes', combo: 'Combo' };
  const dataFormatada = data.data ? new Date(data.data + 'T12:00:00').toLocaleDateString('pt-BR') : 'A definir';
  const msg = [
    `*Novo Agendamento — Próspera Clean & Care*`, ``,
    `👤 *Nome:* ${data.nome}`,
    `📞 *WhatsApp:* ${data.telefone}`,
    `🧹 *Serviço:* ${servicoLabels[data.servico] || data.servico}`,
    `📅 *Data:* ${dataFormatada} (${data.periodo === 'manha' ? 'Manhã' : 'Tarde'})`,
    data.endereco ? `📍 *Endereço:* ${data.endereco}` : '',
    data.mensagem ? `💬 *Obs:* ${data.mensagem}` : '',
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/5585992949513?text=${encodeURIComponent(msg)}`, '_blank');
  showBookingSuccess();
}

// ---------- ESTILOS DINÂMICOS ----------
const dynStyle = document.createElement('style');
dynStyle.textContent = `
  .spin{animation:spin .8s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
`;
document.head.appendChild(dynStyle);

// ---------- SMOOTH SCROLL ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// =============================================
//  SISTEMA DE AVALIAÇÕES — SUPABASE
// =============================================

const REVIEWS_PER_PAGE = 6;
let allReviews = [];
let visibleCount = REVIEWS_PER_PAGE;

// Busca avaliações do Supabase
async function fetchReviews() {
  try {
    const res = await fetch(API('/avaliacoes?order=criado_em.desc'), { headers: HEADERS });
    allReviews = await res.json();
    if (!Array.isArray(allReviews)) allReviews = [];
  } catch {
    allReviews = [];
  }
  renderReviews();
}

// Salva nova avaliação no Supabase
async function postReview(data) {
  const res = await fetch(API('/avaliacoes'), {
    method: 'POST',
    headers: { ...HEADERS, 'Prefer': 'return=representation' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao salvar');
  return res.json();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function getInitials(name) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function starsHTML(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}
function timeAgo(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days === 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  if (days < 365) return `há ${Math.floor(days / 30)} meses`;
  return `há ${Math.floor(days / 365)} anos`;
}

function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  const loadMoreWrapper = document.getElementById('loadMoreWrapper');
  if (!grid) return;

  grid.innerHTML = '';

  if (allReviews.length === 0) {
    grid.innerHTML = `<div class="reviews__empty"><div class="reviews__empty-icon">💬</div><p>Ainda não há avaliações. Seja o primeiro!</p></div>`;
    if (loadMoreWrapper) loadMoreWrapper.style.display = 'none';
    updateSummary([]);
    return;
  }

  allReviews.slice(0, visibleCount).forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML = `
      <div class="review-card__header">
        <div class="review-card__avatar">${getInitials(r.nome)}</div>
        <div class="review-card__meta">
          <div class="review-card__name">${escapeHtml(r.nome)}</div>
          <div class="review-card__service">${escapeHtml(r.servico)}</div>
        </div>
      </div>
      <div class="review-card__stars">${starsHTML(r.rating)}</div>
      <div class="review-card__text">${escapeHtml(r.texto)}</div>
      <div class="review-card__date">${timeAgo(r.criado_em)}</div>
    `;
    grid.appendChild(card);
  });

  if (loadMoreWrapper) {
    loadMoreWrapper.style.display = allReviews.length > visibleCount ? 'block' : 'none';
  }

  updateSummary(allReviews);
}

function updateSummary(reviews) {
  if (reviews.length === 0) {
    document.getElementById('avgScore').textContent = '—';
    document.getElementById('avgStars').textContent = '★★★★★';
    document.getElementById('reviewCount').textContent = '0';
    [1, 2, 3, 4, 5].forEach(n => {
      document.getElementById(`bar${n}`).style.width = '0%';
      document.getElementById(`count${n}`).textContent = '0';
    });
    return;
  }
  const total = reviews.length;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / total;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => counts[r.rating]++);

  document.getElementById('avgScore').textContent = avg.toFixed(1);
  document.getElementById('reviewCount').textContent = total;
  const full = Math.round(avg);
  document.getElementById('avgStars').textContent = '★'.repeat(full) + '☆'.repeat(5 - full);
  [1, 2, 3, 4, 5].forEach(n => {
    document.getElementById(`bar${n}`).style.width = (counts[n] / total * 100) + '%';
    document.getElementById(`count${n}`).textContent = counts[n];
  });
}

// Load more
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    visibleCount += REVIEWS_PER_PAGE;
    renderReviews();
  });
}

// ---------- SELETOR DE ESTRELAS ----------
let selectedRating = 0;
const starLabels = ['', 'Ruim', 'Regular', 'Bom', 'Ótimo', 'Excelente'];
const starPicker = document.getElementById('starPicker');
const starLabel = document.getElementById('starLabel');
const stars = document.querySelectorAll('.star-pick');

stars.forEach(star => {
  star.addEventListener('mouseenter', () => highlightStars(parseInt(star.dataset.value)));
  star.addEventListener('mouseleave', () => highlightStars(selectedRating));
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.value);
    highlightStars(selectedRating);
    starLabel.textContent = starLabels[selectedRating];
  });
});

function highlightStars(val) {
  stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= val));
}

// ---------- CONTADOR DE CARACTERES ----------
const reviewText = document.getElementById('reviewText');
const charCounter = document.getElementById('charCount');
if (reviewText) {
  reviewText.addEventListener('input', () => {
    charCounter.textContent = reviewText.value.length;
  });
}

// ---------- SUBMIT DA AVALIAÇÃO ----------
const submitReview = document.getElementById('submitReview');
const reviewSuccess = document.getElementById('reviewSuccess');
const reviewFormEl = document.getElementById('reviewForm');
const newReviewBtn = document.getElementById('newReviewBtn');

if (submitReview) {
  submitReview.addEventListener('click', async () => {
    const nome = document.getElementById('reviewName').value.trim();
    const servico = document.getElementById('reviewService').value;
    const texto = reviewText.value.trim();

    if (!nome) { shake(document.getElementById('reviewName')); return; }
    if (!servico) { shake(document.getElementById('reviewService')); return; }
    if (!selectedRating) { shake(starPicker); return; }
    if (!texto) { shake(reviewText); return; }

    submitReview.disabled = true;
    submitReview.textContent = 'Publicando...';

    try {
      await postReview({
        nome: nome.slice(0, 40),
        servico,
        rating: selectedRating,
        texto: texto.slice(0, 300),
      });

      await fetchReviews(); // atualiza a lista

      reviewFormEl.style.display = 'none';
      reviewSuccess.style.display = 'flex';
    } catch {
      alert('Erro ao publicar. Tente novamente.');
    } finally {
      submitReview.disabled = false;
      submitReview.textContent = 'Publicar Avaliação';
    }
  });
}

if (newReviewBtn) {
  newReviewBtn.addEventListener('click', () => {
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewService').value = '';
    reviewText.value = '';
    charCounter.textContent = '0';
    selectedRating = 0;
    highlightStars(0);
    starLabel.textContent = 'Selecione uma nota';
    reviewSuccess.style.display = 'none';
    reviewFormEl.style.display = 'flex';
  });
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  el.style.borderColor = '#ff4d4d';
  el.style.boxShadow = '0 0 0 3px rgba(255,77,77,0.2)';
  setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 1200);
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

// ---------- INICIALIZAR ----------
fetchReviews();

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 400);
  }, 800);
});

console.log('✅ Próspera Clean & Care — Sistema carregado.');