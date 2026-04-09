// =============================================
//  PRÓSPERA CLEAN & CARE — main.js
//  Interações: nav, partículas, scroll, form
// =============================================

// ---------- HEADER SCROLL ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ---------- MENU MOBILE ----------
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// Fechar ao clicar em link
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
    p.style.left     = Math.random() * 100 + '%';
    p.style.width    = (Math.random() * 2 + 1) + 'px';
    p.style.height   = p.style.width;
    p.style.animationDuration  = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay     = (Math.random() * 10) + 's';
    p.style.opacity  = Math.random() * 0.6 + 0.2;
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
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
}
setupReveal();

// ---------- DATA MÍNIMA NO AGENDAMENTO ----------
const dataInput = document.getElementById('data');
if (dataInput) {
  const today = new Date();
  today.setDate(today.getDate() + 1); // mínimo amanhã
  const yyyy = today.getFullYear();
  const mm   = String(today.getMonth() + 1).padStart(2, '0');
  const dd   = String(today.getDate()).padStart(2, '0');
  dataInput.min = `${yyyy}-${mm}-${dd}`;
}

// ---------- FORMULÁRIO DE AGENDAMENTO ----------
const bookingForm    = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
const submitBtn      = document.getElementById('submitBtn');

// Máscara de telefone
const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
  telefoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length >= 7) {
      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length >= 3) {
      v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    }
    e.target.value = v;
  });
}

// Submit
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Feedback visual no botão
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      Enviando...
    `;

    const formData = {
      nome:      document.getElementById('nome').value,
      telefone:  document.getElementById('telefone').value,
      servico:   document.getElementById('servico').value,
      data:      document.getElementById('data').value,
      periodo:   document.getElementById('periodo').value,
      endereco:  document.getElementById('endereco').value,
      mensagem:  document.getElementById('mensagem').value,
    };

    try {
      // Envia para o backend (quando o servidor estiver rodando)
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccess();
      } else {
        // Se backend não disponível, redireciona para WhatsApp
        sendToWhatsApp(formData);
      }
    } catch (err) {
      // Fallback: WhatsApp direto (funciona mesmo sem backend)
      sendToWhatsApp(formData);
    }
  });
}

function showSuccess() {
  bookingForm.style.display = 'none';
  bookingSuccess.style.display = 'flex';
  bookingSuccess.style.flexDirection = 'column';
  bookingSuccess.style.alignItems = 'center';
}

function sendToWhatsApp(data) {
  const servicoLabels = {
    estofado: 'Higienização de Estofados',
    veiculo:  'Higienização Interna de Veículos',
    carpete:  'Carpetes e Tapetes',
    combo:    'Combo (mais de um serviço)',
  };

  const dataFormatada = data.data
    ? new Date(data.data + 'T12:00:00').toLocaleDateString('pt-BR')
    : 'A definir';

  const msg = [
    `*Novo Agendamento — Próspera Clean & Care*`,
    ``,
    `👤 *Nome:* ${data.nome}`,
    `📞 *WhatsApp:* ${data.telefone}`,
    `🧹 *Serviço:* ${servicoLabels[data.servico] || data.servico}`,
    `📅 *Data:* ${dataFormatada} (${data.periodo === 'manha' ? 'Manhã' : 'Tarde'})`,
    data.endereco ? `📍 *Endereço:* ${data.endereco}` : '',
    data.mensagem ? `💬 *Obs:* ${data.mensagem}` : '',
  ].filter(Boolean).join('\n');

  window.open(`https://wa.me/5585992949513?text=${encodeURIComponent(msg)}`, '_blank');
  showSuccess();
}

// ---------- ANIMAÇÃO SPIN ----------
const style = document.createElement('style');
style.textContent = `
  .spin { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

// ---------- SMOOTH SCROLL PARA ÂNCORAS ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // altura do header fixo
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

console.log('✅ Próspera Clean & Care — Sistema carregado.');
