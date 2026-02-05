const tocLinks = Array.from(document.querySelectorAll('.toc a'));
const sections = tocLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      tocLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    });
  },
  { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 }
);

sections.forEach((section) => observer.observe(section));

const scrollBtn = document.querySelector('[data-scroll]');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    const target = document.querySelector(scrollBtn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
