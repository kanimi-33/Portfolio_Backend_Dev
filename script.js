// ---------- Smooth scroll for in-page links ----------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.getElementById(anchor.getAttribute('href').slice(1));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ---------- Seamless tech-stack carousel (duplicate items once) ----------
(function () {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  Array.from(track.children).forEach((item) => track.appendChild(item.cloneNode(true)));
})();

// ---------- Custom cursor (desktop only) ----------
(function () {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;
  if (window.matchMedia('(hover: none)').matches) { cursor.remove(); return; }

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let posX = mouseX, posY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.opacity = '1';
  }, { passive: true });
  document.addEventListener('mousedown', () => cursor.classList.add('custom-cursor--active'));
  document.addEventListener('mouseup', () => cursor.classList.remove('custom-cursor--active'));

  (function animate() {
    posX += (mouseX - posX) * 0.18;
    posY += (mouseY - posY) * 0.18;
    cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  })();
})();

// ---------- Resume preview modal ----------
(function () {
  const resumeBtn = document.getElementById('resumeBtn');
  const modal = document.getElementById('resumeModal');
  const iframe = document.getElementById('resumeIframe');
  if (!resumeBtn || !modal || !iframe) return;

  const closeBtn = document.getElementById('resumeClose');
  const overlay = modal.querySelector('.resume-modal__overlay');
  const viewer = modal.querySelector('.resume-modal__viewer');
  const resumeUrl = resumeBtn.getAttribute('href');

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    iframe.src = resumeUrl;
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    iframe.src = '';
  }

  // Reuse for the mobile drawer's cloned Resume link
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href$="Sainath_Resume_Developer.pdf"]:not(.resume-download)');
    if (!link) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    openModal();
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Some browsers (and mobile) can't preview PDFs in an iframe: show a hint
  setTimeout(() => {
    if (!viewer.querySelector('.resume-modal__fallback') && /Mobi|Android/i.test(navigator.userAgent)) {
      const note = document.createElement('div');
      note.className = 'resume-modal__fallback';
      note.textContent = 'Preview may not work on this device. Use "Download Resume" below.';
      viewer.appendChild(note);
    }
  }, 0);
})();

// ---------- Mobile side drawer ----------
(function () {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (!navToggle || !navLinks) return;

  let drawer = null, overlay = null;

  function closeDrawer() {
    if (drawer) {
      const d = drawer;
      d.classList.remove('open');
      setTimeout(() => d.remove(), 260);
      drawer = null;
    }
    overlay?.remove();
    overlay = null;
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function openDrawer() {
    drawer = document.createElement('div');
    drawer.className = 'side-drawer';
    navLinks.querySelectorAll('a').forEach((a) => {
      const clone = a.cloneNode(true);
      clone.removeAttribute('id');
      clone.addEventListener('click', closeDrawer);
      drawer.appendChild(clone);
    });
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.addEventListener('click', closeDrawer);
    document.body.append(overlay, drawer);
    requestAnimationFrame(() => drawer?.classList.add('open'));
    navToggle.setAttribute('aria-expanded', 'true');
  }

  navToggle.addEventListener('click', () => (drawer ? closeDrawer() : openDrawer()));
  window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeDrawer(); });
})();

// ---------- Scroll reveal ----------
(function () {
  const els = document.querySelectorAll('.section, .stack-card, .project-card, .experience-card, .stat-card, .website-card');
  if (!('IntersectionObserver' in window)) return;
  els.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--active');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach((el) => io.observe(el));
})();