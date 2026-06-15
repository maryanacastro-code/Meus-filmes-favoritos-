/* =====================================================
   PRETENDENTE SURPRESA — DoramaTV
   app.js · Filtros, Pesquisa, Modal
   ===================================================== */

'use strict';

// ─── Seletores ────────────────────────────────────────
const grid        = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const noResults   = document.getElementById('noResults');
const searchTerm  = document.getElementById('searchTerm');
const modal       = document.getElementById('modal');
const modalIframe = document.getElementById('modalIframe');
const modalTitle  = document.getElementById('modalTitle');
const modalChannel= document.getElementById('modalChannel');

// ─── Estado atual do filtro ───────────────────────────
let currentEpFilter = 'all';

// ─── Filtro por episódio ──────────────────────────────
function filterByEp(ep, btn) {
  currentEpFilter = ep;

  // Atualiza botões ativos
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('filter-tab--active'));
  btn.classList.add('filter-tab--active');

  applyFilters();
}

// ─── Filtro por pesquisa ──────────────────────────────
function filterCards() {
  applyFilters();
}

// ─── Aplica ambos os filtros combinados ───────────────
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const cards  = grid.querySelectorAll('.card');
  let visible  = 0;

  cards.forEach(card => {
    const ep    = card.dataset.ep;
    const title = card.dataset.title.toLowerCase();

    const matchEp    = currentEpFilter === 'all' || ep === currentEpFilter;
    const matchQuery = query === '' || title.includes(query);

    if (matchEp && matchQuery) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  // Mensagem de sem resultados
  if (visible === 0) {
    noResults.style.display = 'block';
    searchTerm.textContent  = query || currentEpFilter;
  } else {
    noResults.style.display = 'none';
  }
}

// ─── Pesquisa ao digitar (debounce) ───────────────────
let debounceTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(applyFilters, 280);
});

// ─── Pesquisa ao pressionar Enter ─────────────────────
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') applyFilters();
});

// ─── Modal: abrir ao clicar no card ───────────────────
grid.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;

  // Evita abrir modal se o clique foi direto no iframe
  if (e.target.tagName === 'IFRAME') return;

  const iframe  = card.querySelector('iframe');
  const title   = card.querySelector('.card__title').textContent;
  const channel = card.querySelector('.card__channel').textContent;
  const src     = iframe.src;

  // Adiciona autoplay ao abrir no modal
  const autoplaySrc = src.includes('?')
    ? src + '&autoplay=1'
    : src + '?autoplay=1';

  modalIframe.src  = autoplaySrc;
  modalTitle.textContent   = title;
  modalChannel.textContent = channel;

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
});

// ─── Modal: fechar ────────────────────────────────────
function closeModal() {
  modal.classList.remove('is-open');
  modalIframe.src = '';
  document.body.style.overflow = '';
}

// Fechar com tecla Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
});

// ─── Scroll suave para a seção de episódios ───────────
document.querySelector('.hero__btn')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('episodes').scrollIntoView({ behavior: 'smooth' });
});

// ─── Animação de entrada escalonada nos cards ─────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(card => {
  card.style.animationPlayState = 'paused';
  observer.observe(card);
});

// ─── Tooltip de duração ao hover no iframe-wrap ───────
document.querySelectorAll('.card__iframe-wrap').forEach(wrap => {
  wrap.addEventListener('mouseenter', () => {
    wrap.style.cursor = 'pointer';
  });
});

// ─── Destaque de pesquisa: pisca o campo ──────────────
document.querySelector('.hero__btn')?.addEventListener('click', () => {
  setTimeout(() => {
    const field = searchInput;
    if (field) {
      field.focus();
      field.style.transition = 'box-shadow .3s';
    }
  }, 800);
});

console.log('%c▶ DoramaTV — Pretendente Surpresa', 'color:#e91e63;font-size:14px;font-weight:bold;');
console.log('%cSite criado com HTML, CSS e JavaScript puro.', 'color:#aaa;font-size:12px;');
