/* ==============================================
   PORTFOLIO — index.js
   Libraries integrated:
     • GSAP + ScrollTrigger  → cinematic scroll effects (gsap.com)
     • Motion (motion.dev)   → zero-setup auto-animations
   ============================================== */

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
  backToTopButton.style.opacity   = visible ? 1 : 0;
  backToTopButton.style.transform = visible
    ? 'scale(1) rotate(45deg)'
    : 'scale(0) rotate(45deg)';
};

window.addEventListener('scroll', () => {
  toggleBackToTop(window.scrollY > 700);
});

/* -----------------------------------------
   Glitch effect on heading (subtle)
 ---------------------------------------- */
const heading = document.querySelector('.heading-primary');

if (heading) {
  setInterval(() => {
    heading.style.textShadow = `${Math.random() * 4 - 2}px 0 #00ff88`;
    setTimeout(() => { heading.style.textShadow = 'none'; }, 80);
  }, 4000);
}

/* -----------------------------------------
   Work card tilt effect
 ---------------------------------------- */
document.querySelectorAll('.work__card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
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
    cursor.textContent = '\u2588';
    cursor.style.cssText = `
      color: var(--accent);
      animation: blink 1s step-end infinite;
      font-size: 1.2rem;
      margin-left: 0.3rem;
    `;
    lastLine.appendChild(cursor);
  }
}

/* ================================================================
   MOTION.DEV — Zero-setup auto-animations
   https://motion.dev
   animate() fires automatically — no IntersectionObserver boiler.
   inView() triggers once when element enters the viewport.
   ================================================================ */
window.addEventListener('DOMContentLoaded', () => {

  /* Wait for deferred Motion script to be available */
  function waitForMotion(cb, attempts) {
    attempts = attempts || 0;
    if (window.Motion && window.Motion.animate) {
      cb(window.Motion);
    } else if (attempts < 60) {
      requestAnimationFrame(() => waitForMotion(cb, attempts + 1));
    }
  }

  /* ---- Motion.dev: page-load fade-ups (zero manual setup) ---- */
  waitForMotion(function(M) {
    var animate = M.animate;
    var inView  = M.inView;
    var stagger = M.stagger;

    /* Prevent flash of un-animated content */
    var motionFadeEls = document.querySelectorAll('[data-motion-fade]');
    motionFadeEls.forEach(function(el) {
      var delay = parseFloat(el.getAttribute('data-motion-delay') || '0');
      el.style.opacity   = '0';
      el.style.transform = 'translateY(18px)';
      /* Animate automatically on load — zero manual setup */
      animate(el,
        { opacity: 1, transform: 'translateY(0px)' },
        { duration: 0.65, delay: delay, easing: [0.16, 1, 0.3, 1] }
      );
    });

    /* Section tags slide in from left when visible */
    document.querySelectorAll('[data-gsap-section] .section-tag').forEach(function(tag) {
      inView(tag, function() {
        animate(tag, { opacity: [0, 1], x: [-30, 0] }, { duration: 0.6, easing: 'ease-out' });
        return function() {
          animate(tag, { opacity: 0, x: -30 }, { duration: 0.3 });
        };
      }, { amount: 0.5 });
      var h2 = tag.parentElement.querySelector('h2');
      if (h2) {
        inView(h2, function() {
          animate(h2, { opacity: [0, 1], y: [40, 0] }, { duration: 0.75, delay: 0.15, easing: [0.16, 1, 0.3, 1] });
          return function() {
            animate(h2, { opacity: 0, y: 40 }, { duration: 0.3 });
          };
        }, { amount: 0.3 });
      }
    });

    /* Skills strip items pop in sequentially */
    var skillItems = document.querySelectorAll('.skills-strip__track span');
    if (skillItems.length) {
      inView('.skills-strip', function() {
        animate(skillItems,
          { opacity: [0, 1], y: [10, 0] },
          { duration: 0.4, delay: stagger(0.03), easing: 'ease-out' }
        );
        return function() {
          animate(skillItems, { opacity: 0, y: 10 }, { duration: 0.2 });
        };
      }, { amount: 0.2 });
    }

    /* About photo frame scale reveal — no exit (GSAP handles that) */
    if (document.querySelector('.about__photo-frame')) {
      inView('.about__photo-frame', function() {
        animate('.about__photo-frame',
          { opacity: [0, 1], scale: [0.96, 1] },
          { duration: 0.8, easing: [0.16, 1, 0.3, 1] }
        );
        /* no return fn — GSAP owns the exit animation */
      }, { amount: 0.1 });
    }

    /* Contact email shimmers in from left */
    if (document.querySelector('.contact__email')) {
      inView('.contact__email', function() {
        animate('.contact__email',
          { opacity: [0, 1], x: [-20, 0] },
          { duration: 0.6, easing: 'ease-out' }
        );
        return function() {
          animate('.contact__email', { opacity: 0, x: -20 }, { duration: 0.3 });
        };
      }, { amount: 0.3 });
    }

    /* Contact social links stagger */
    var socialLinks = document.querySelectorAll('.contact__social');
    if (socialLinks.length) {
      inView('.contact__links', function() {
        animate(socialLinks,
          { opacity: [0, 1], y: [12, 0] },
          { duration: 0.45, delay: stagger(0.12), easing: 'ease-out' }
        );
        return function() {
          animate(socialLinks, { opacity: 0, y: 12 }, { duration: 0.25 });
        };
      }, { amount: 0.5 });
    }

  }); /* end waitForMotion */

  /* ================================================================
     GSAP + ScrollTrigger — Cinematic scroll effects
     https://gsap.com/docs/v3/Plugins/ScrollTrigger/
     ================================================================ */
  function waitForGSAP(cb, attempts) {
    attempts = attempts || 0;
    if (window.gsap && window.ScrollTrigger) {
      cb();
    } else if (attempts < 80) {
      requestAnimationFrame(() => waitForGSAP(cb, attempts + 1));
    }
  }

  waitForGSAP(function() {
    gsap.registerPlugin(ScrollTrigger);

    /* ── Zoom / resize fix: recalculate all scroll positions ── */
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        ScrollTrigger.refresh();
      }, 200);
    });

    /* 1. Hero title: clip-path cinematic entrance */
    gsap.from('#gsap-hero-title', {
      clipPath: 'inset(100% 0% 0% 0%)',
      y:         60,
      opacity:   0,
      duration:  1.2,
      delay:     0.25,
      ease:      'expo.out',
    });

    /* 2. Hero parallax: title drifts up as page scrolls */
    gsap.to('#gsap-hero-title', {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.header',
        start:   'top top',
        end:     'bottom top',
        scrub:   true,
      },
    });

    /* 3. Background grid slow parallax */
    gsap.to('.bg-grid', {
      backgroundPositionY: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start:   'top top',
        end:     'bottom top',
        scrub:   1.5,
      },
    });

    /* 4. Work cards: animate ONCE on load/scroll-in, stay visible forever */
    gsap.utils.toArray('[data-gsap-card]').forEach(function(card, i) {
      gsap.from(card, {
        y:        70,
        opacity:  0,
        rotateX:  6,
        scale:    0.96,
        duration: 0.85,
        ease:     'expo.out',
        delay:    (i % 2) * 0.15,
        scrollTrigger: {
          trigger:      card,
          start:        'top 88%',
          /* no 'end' + toggleActions play-once → card stays visible on scroll back up */
          toggleActions: 'play none none none',
          once:          true,
        },
      });
    });

    /* 5. Section headers: slide in on enter, reverse only on scroll back up */
    gsap.utils.toArray('[data-gsap-section]').forEach(function(section) {
      gsap.from(section, {
        xPercent: -5,
        opacity:  0,
        duration: 0.8,
        ease:     'power3.out',
        scrollTrigger: {
          trigger:      section,
          start:        'top 85%',
          /* 'play none none reverse':
             onEnter=play | onLeave=nothing | onEnterBack=nothing | onLeaveBack=reverse
             → stays visible while scrolling down, only hides when you scroll back up PAST trigger */
          toggleActions: 'play none none reverse',
        },
      });
    });

    /* 6. About: split left/right cinematic entrance
       Stays fully visible while reading — only exits when scrolling back UP past trigger */
    if (document.querySelector('.about__photo-container')) {
      gsap.from('.about__photo-container', {
        x:        -60,
        opacity:  0,
        duration: 1.0,
        ease:     'expo.out',
        scrollTrigger: {
          trigger:      '.about__content',
          start:        'top 82%',
          /* onLeaveBack=reverse: only reverses when you scroll back UP above the trigger */
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (document.querySelector('.about__text')) {
      gsap.from('.about__text', {
        x:        60,
        opacity:  0,
        duration: 1.0,
        delay:    0.1,
        ease:     'expo.out',
        scrollTrigger: {
          trigger:      '.about__content',
          start:        'top 82%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    /* 7. Skills strip: scale in from center */
    gsap.from('.skills-strip', {
      scaleX:  0.85,
      opacity: 0,
      duration: 0.9,
      ease:    'expo.out',
      scrollTrigger: {
        trigger:      '.skills-strip',
        start:        'top 90%',
        end:          'top 50%',
        toggleActions: 'play reverse play reverse',
      },
    });

    /* 8. Contact heading: scrub-based scale on scroll */
    if (document.querySelector('.contact h2')) {
      gsap.to('.contact h2', {
        scale: 1.04,
        ease:  'none',
        scrollTrigger: {
          trigger: '.contact',
          start:   'top bottom',
          end:     'center center',
          scrub:   1,
        },
      });
    }

    /* 9. Footer: fade-up on scroll */
    gsap.from('.footer', {
      y:       30,
      opacity: 0,
      duration: 0.7,
      ease:    'power2.out',
      scrollTrigger: {
        trigger:      '.footer',
        start:        'top 95%',
        end:          'top 70%',
        toggleActions: 'play reverse play reverse',
      },
    });

    /* 10. Scroll hint line: animates width as hero scrolls away */
    if (document.querySelector('.scroll-line')) {
      gsap.to('.scroll-line', {
        width:   '12rem',
        opacity: 0.6,
        ease:    'none',
        scrollTrigger: {
          trigger: '.header',
          start:   'top top',
          end:     'bottom top',
          scrub:   true,
        },
      });
    }

  }); /* end waitForGSAP */

}); /* end DOMContentLoaded */
