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

// Mobile menu
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
document.querySelectorAll('.nav__links a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

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
