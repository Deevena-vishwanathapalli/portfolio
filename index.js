document.addEventListener('DOMContentLoaded', () => {

  /* ──  nav  ── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  /* ── Scroll reveal (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealIO  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealIO.observe(el));

  /* ── Skill bar animation ── */
  const skillBars = document.querySelectorAll('.skill-fill');
  const barIO     = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.w + '%';
        barIO.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  skillBars.forEach(bar => barIO.observe(bar));

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const navIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => navIO.observe(sec));

  /* ── Contact form ── */
  const sendBtn = document.getElementById('send-btn');
  const formMsg = document.getElementById('form-msg');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name    = document.getElementById('f-name').value.trim();
      const email   = document.getElementById('f-email').value.trim();
      const message = document.getElementById('f-message').value.trim();
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        showError('f-name', 'Please enter your name.');
        return;
      }
      if (!email || !emailRx.test(email)) {
        showError('f-email', 'Please enter a valid email address.');
        return;
      }
      if (!message) {
        showError('f-message', 'Please enter your message.');
        return;
      }

      /* Success state */
      sendBtn.disabled    = true;
      sendBtn.textContent = 'Sending…';

      setTimeout(() => {
        sendBtn.textContent = 'Message sent ✓';
        formMsg.style.display = 'block';

        /* Reset form */
        ['f-name','f-email','f-subject','f-message'].forEach(id => {
          document.getElementById(id).value = '';
        });

        setTimeout(() => {
          sendBtn.disabled    = false;
          sendBtn.textContent = 'Send message';
          formMsg.style.display = 'none';
        }, 5000);
      }, 900);
    });
  }

  function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    field.focus();
    field.style.borderColor = '#f85149';
    field.style.boxShadow   = '0 0 0 3px rgba(248,81,73,0.15)';

    const existing = field.parentElement.querySelector('.field-error');
    if (!existing) {
      const err = document.createElement('p');
      err.className   = 'field-error';
      err.textContent = msg;
      err.style.cssText = 'font-size:0.78rem;color:#f85149;margin-top:4px;font-family:var(--font-head)';
      field.parentElement.appendChild(err);
    }

    field.addEventListener('input', () => {
      field.style.borderColor = '';
      field.style.boxShadow   = '';
      const errEl = field.parentElement.querySelector('.field-error');
      if (errEl) errEl.remove();
    }, { once: true });
  }


  const typedEl = document.getElementById('typed-role');
  if (typedEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting  = false;
    let paused    = false;

    function type() {
      if (paused) return;
      const current = roles[roleIndex];

      if (!deleting) {
        typedEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          paused = true;
          setTimeout(() => { paused = false; deleting = true; setTimeout(type, 80); }, 1800);
          return;
        }
        setTimeout(type, 75);
      } else {
        typedEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting   = false;
          roleIndex  = (roleIndex + 1) % roles.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 40);
      }
    }

    type();
  }

});
