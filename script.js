// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

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

// Highlight the current section in the nav
const links = [...document.querySelectorAll('.nav__links a:not(.pill)')];
const sections = links.map((l) => document.querySelector(l.getAttribute('href')));
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((s) => s && spy.observe(s));
