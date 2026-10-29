import './page.js';
import { reducedMotion } from './theme.js';

// ---------- table of contents ----------

const toc = document.querySelector('.toc');
if (toc) {
  const links = [...toc.querySelectorAll('a')];
  const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
  const bar = toc.querySelector('.toc-indicator');
  let active = null;

  // The current section is the last one whose heading has passed the top third of the screen.
  const update = () => {
    let i = -1;
    heads.forEach((h, k) => {
      if (h && h.getBoundingClientRect().top < innerHeight * 0.3) i = k;
    });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) i = heads.length - 1;
    if (i === active) return;
    active = i;
    links.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
    bar.classList.toggle('on', i >= 0);
    if (i < 0) return;
    bar.style.transform = `translateY(${links[i].offsetTop}px)`;
    bar.style.height = `${links[i].offsetHeight}px`;
  };
  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }, { passive: true });
  addEventListener('resize', () => {
    active = null;
    update();
  });
  update();

  // Jump smoothly to a section, unless the reader prefers less motion.
  toc.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    document.getElementById(decodeURIComponent(a.hash.slice(1)))?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.hash);
  });
}
