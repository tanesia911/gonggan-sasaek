// ── 햄버거 메뉴 ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── 스무스 스크롤 ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('main-nav').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── 위로가기 버튼 ──
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── 스크롤 reveal ──
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      obs.observe(el);
    }
  });
}
setTimeout(initReveal, 80);

// ── 이메일 표시 ──
const emailEl = document.getElementById('email-reveal');
if (emailEl) emailEl.textContent = 'gonggan-sasaek' + '@' + 'naver.com';

// ── today.json 로드 ──
async function loadToday() {
  try {
    const res = await fetch('./today.json?v=' + Date.now());
    if (!res.ok) throw new Error('fetch failed');
    const d = await res.json();

    const dateEl = document.getElementById('today-date-el');
    const themeEl = document.getElementById('today-theme-el');
    const musicEl = document.getElementById('today-music-el');
    const coffeeNameEl = document.getElementById('brew-coffee-name');
    const coffeeNoteEl = document.getElementById('brew-coffee-note');
    const teaNameEl = document.getElementById('brew-tea-name');
    const teaNoteEl = document.getElementById('brew-tea-note');
    const pairingEl = document.getElementById('today-pairing-el');

    if (dateEl) dateEl.textContent = d.date + (d.weather ? ' · ' + d.weather : '');
    if (themeEl) themeEl.textContent = d.theme || '';

    if (musicEl && d.playlist && d.playlist.length) {
      const show = d.playlist.slice(0, 5);
      musicEl.innerHTML = show.map(t =>
        '<div class="today-music-item">' +
        '<span class="tm-time">' + t.time + '</span>' +
        '<span class="tm-artist">' + t.artist + '</span>' +
        '<span class="tm-album">&nbsp;' + t.album + '</span>' +
        '</div>'
      ).join('') + (d.playlist.length > 5
        ? '<div style="font-size:.66rem;color:var(--ink-faint);padding:.4rem 0 0;">외 ' + (d.playlist.length - 5) + '곡</div>'
        : '');
    }

    if (d.coffee) {
      if (coffeeNameEl) coffeeNameEl.textContent = d.coffee.origin || '—';
      if (coffeeNoteEl) coffeeNoteEl.textContent = d.coffee.note || '';
    }
    if (d.tea) {
      if (teaNameEl) teaNameEl.textContent = d.tea.name || '—';
      if (teaNoteEl) teaNoteEl.textContent = d.tea.note || '';
    }
    if (pairingEl && d.pairing_reason) pairingEl.textContent = d.pairing_reason;

  } catch (err) {
    const dateEl = document.getElementById('today-date-el');
    if (dateEl) dateEl.textContent = '오늘의 큐레이션을 준비 중입니다.';
  }
}

loadToday();
