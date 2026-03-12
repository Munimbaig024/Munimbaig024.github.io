/* -----------------------------------------
  Keyboard / mouse focus handling
 ---------------------------------------- */
const handleFirstTab = (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce);
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing');
  window.removeEventListener('mousedown', handleMouseDownOnce);
  window.addEventListener('keydown', handleFirstTab);
};

window.addEventListener('keydown', handleFirstTab);

/* -----------------------------------------
  Back to top button
 ---------------------------------------- */
const backToTopButton = document.querySelector('.back-to-top');

const toggleBackToTop = (visible) => {
  backToTopButton.style.visibility = visible ? 'visible' : 'hidden';
  backToTopButton.style.opacity = visible ? 1 : 0;
  backToTopButton.style.transform = visible
    ? 'scale(1) rotate(45deg)'
    : 'scale(0) rotate(45deg)';
};

window.addEventListener('scroll', () => {
  toggleBackToTop(window.scrollY > 700);
});

/* -----------------------------------------
  Scroll reveal
 ---------------------------------------- */
const revealElements = document.querySelectorAll(
  '.work__card, .about__content, .contact__content, .section-header'
);

revealElements.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach((el) => observer.observe(el));

/* -----------------------------------------
  Glitch effect on heading (subtle)
 ---------------------------------------- */
const heading = document.querySelector('.heading-primary');

if (heading) {
  setInterval(() => {
    heading.style.textShadow = `${Math.random() * 4 - 2}px 0 #00ff88`;
    setTimeout(() => {
      heading.style.textShadow = 'none';
    }, 80);
  }, 4000);
}

/* -----------------------------------------
  Work card tilt effect
 ---------------------------------------- */
document.querySelectorAll('.work__card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  });
});

/* -----------------------------------------
  Typing cursor blink in terminal
 ---------------------------------------- */
const terminalBody = document.querySelector('.terminal__body');
if (terminalBody) {
  const lastLine = terminalBody.lastElementChild;
  if (lastLine) {
    const cursor = document.createElement('span');
    cursor.textContent = '█';
    cursor.style.cssText = `
      color: var(--accent);
      animation: blink 1s step-end infinite;
      font-size: 1.2rem;
      margin-left: 0.3rem;
    `;
    lastLine.appendChild(cursor);
  }
}
