const root = document.documentElement;

// localStorage can throw (private mode, blocked storage): never let that break the page
const store = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ } },
};

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Theme: follows the system until the visitor picks one; the choice is saved.
// The inline script in <head> applies a saved choice before first paint.
const themeBtn = document.querySelector('.theme-toggle');
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = () => root.dataset.theme || (darkQuery.matches ? 'dark' : 'light');
const syncThemeBtn = () => themeBtn && themeBtn.setAttribute('aria-pressed', currentTheme() === 'dark');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('theme', next);
    syncThemeBtn();
  });
  darkQuery.addEventListener('change', syncThemeBtn);
  syncThemeBtn();
}

// Language (en / es). Text lives in the HTML as <span data-l="en"> / <span data-l="es">
// pairs that CSS shows or hides from <html data-lang>; the inline script in <head>
// picks the language before first paint (saved choice, else the browser language).
// Here we only handle the switch, the <title> and translatable attributes.
const UI = {
  en: { openMenu: 'Open menu', closeMenu: 'Close menu' },
  es: { openMenu: 'Abrir menú', closeMenu: 'Cerrar menú' },
};
const ATTRS = ['aria-label', 'alt', 'placeholder', 'title']; // use data-en-<attr> / data-es-<attr>
const currentLang = () => (root.dataset.lang === 'es' ? 'es' : 'en');

function applyLang(lang) {
  root.lang = lang;
  root.dataset.lang = lang;
  const title = document.querySelector('title');
  if (title && title.dataset[lang]) document.title = title.dataset[lang];
  ATTRS.forEach((attr) =>
    document.querySelectorAll(`[data-${lang}-${attr}]`).forEach((el) =>
      el.setAttribute(attr, el.getAttribute(`data-${lang}-${attr}`))
    )
  );
  document.querySelectorAll('[data-set-lang]').forEach((btn) =>
    btn.setAttribute('aria-pressed', btn.dataset.setLang === lang)
  );
  syncMenuLabel();
}
document.querySelectorAll('[data-set-lang]').forEach((btn) =>
  btn.addEventListener('click', () => {
    store.set('lang', btn.dataset.setLang);
    applyLang(btn.dataset.setLang);
  })
);

// Mobile menu
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');
function syncMenuLabel() {
  const open = nav.classList.contains('is-open');
  toggle.setAttribute('aria-label', UI[currentLang()][open ? 'closeMenu' : 'openMenu']);
}
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  syncMenuLabel();
});
document.querySelectorAll('.nav__links a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    syncMenuLabel();
  })
);

applyLang(currentLang());

// Nav border on scroll
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Highlight "Projects" in the nav while it is on screen (home page only)
const projLink = document.querySelector('.nav__links a[href$="#projects"]');
const projSection = document.getElementById('projects');
if (projLink && projSection && 'IntersectionObserver' in window) {
  new IntersectionObserver(
    ([e]) => projLink.classList.toggle('is-active', e.isIntersecting),
    { rootMargin: '-45% 0px -50% 0px' }
  ).observe(projSection);
}
