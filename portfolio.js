const projects = [
  {
    name: 'M&R Consultores',
    category: 'Página web corporativa',
    description: 'Sitio web corporativo desarrollado para una empresa de asesoría contable, tributaria y laboral, con un diseño profesional, navegación intuitiva y acceso a sus servicios.',
    image: './images/myr-consultores.webp',
    imageAlt: 'Captura completa del sitio de M&R Consultores',
    url: 'https://myrconsultores.cl/'
  }
];

const contacts = [
  { label: 'WhatsApp', url: '', icon: 'M4 20l1.4-4a8 8 0 1 1 3 2.8L4 20zm6-12c-2 1 1 6 4 6l1-1' },
  { label: 'Correo electrónico', url: '', icon: 'M3 6h18v12H3z M3 7l9 6 9-6' },
  { label: 'Instagram', url: '', icon: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm1.5-4.5h.01' }
];

const projectList = document.querySelector('#project-list');
const projectTemplate = document.querySelector('#project-template');

for (const project of projects) {
  const card = document.importNode(projectTemplate.content, true);
  const link = card.querySelector('a');
  link.href = project.url;
  link.setAttribute('aria-label', `Visitar sitio web de ${project.name} (abre en otra pestaña)`);
  card.querySelector('h3').textContent = project.name;
  card.querySelector('.category').textContent = project.category;
  card.querySelector('.project-description').textContent = project.description;
  const fallback = card.querySelector('.preview-fallback');
  fallback.textContent = new URL(project.url).hostname;

  if (project.image) {
    const preview = card.querySelector('.preview-scroll');
    const hint = card.querySelector('.preview-hint');
    const image = document.createElement('img');
    image.alt = project.imageAlt;
    image.width = 1895;
    image.height = 6637;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.className = 'pending';
    image.addEventListener('load', () => {
      image.classList.remove('pending');
      fallback.hidden = true;
      preview.tabIndex = 0;
      preview.setAttribute('role', 'region');
      preview.setAttribute('aria-label', `Vista previa desplazable de ${project.name}`);
      hint.hidden = false;
      preview.addEventListener('scroll', () => hint.classList.add('dismissed'), { once: true, passive: true });
    }, { once: true });
    image.addEventListener('error', () => image.remove(), { once: true });
    image.src = project.image;
    preview.append(image);
  }

  projectList.append(card);
}

const contactLinks = document.querySelector('#contact-links');
const svgNamespace = 'http://www.w3.org/2000/svg';

for (const contact of contacts.filter(({ url }) => url.trim())) {
  const link = document.createElement('a');
  link.className = 'button secondary';
  link.href = contact.url;
  const icon = document.createElementNS(svgNamespace, 'svg');
  const path = document.createElementNS(svgNamespace, 'path');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('viewBox', '0 0 24 24');
  path.setAttribute('d', contact.icon);
  icon.append(path);
  link.append(icon, contact.label);
  contactLinks.append(link);
}

if (contactLinks.childElementCount) {
  contactLinks.hidden = false;
  document.querySelector('#contact-status').hidden = true;
}

const navLinks = [...document.querySelectorAll('nav a')];
const sections = navLinks.map(link => document.querySelector(link.hash));
const header = document.querySelector('.header');

function updateNavigation() {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
  const distanceToEnd = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
  const current = window.scrollY > 0 && distanceToEnd < 2
    ? sections.at(-1)
    : sections.findLast(section => section.getBoundingClientRect().top <= 120) ?? sections[0];
  for (const link of navLinks) {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

let scrollFrame;
window.addEventListener('scroll', () => {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(updateNavigation);
}, { passive: true });
updateNavigation();

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('enter');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.intro, .service-grid, .project-card, .about, .contact > div').forEach(element => reveal.observe(element));
}
