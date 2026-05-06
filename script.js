// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// Formulario → Google Sheets + WhatsApp
const formContacto = document.getElementById('formContacto');
if (formContacto) {
  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxrFwAvvSHoLiBzQAfsEIdniZMzklFxPXWitrpe-qh208xFeOyORSLWYLdfjea7XORq/exec';
  const WA_URL = 'https://wa.me/541125884458?text=' + encodeURIComponent('Hola! Estoy interesado en la cotización de mi prepaga.');
  const submitBtn = formContacto.querySelector('[type="submit"]');
  const originalBtnHTML = submitBtn.innerHTML;

  function clearErrors() {
    formContacto.querySelectorAll('.form-error').forEach(el => el.remove());
    formContacto.querySelectorAll('input.has-error').forEach(el => el.classList.remove('has-error'));
  }

  function showError(id, msg) {
    const input = document.getElementById(id);
    input.classList.add('has-error');
    const span = document.createElement('span');
    span.className = 'form-error';
    span.textContent = msg;
    input.parentNode.appendChild(span);
  }

  function validate(nombre, telefono, edad, email) {
    let ok = true;
    if (!nombre)   { showError('nombre',   'Ingresá tu nombre y apellido.'); ok = false; }
    if (!telefono) { showError('telefono', 'Ingresá tu número de teléfono.'); ok = false; }
    if (!edad)     { showError('edad',     'Ingresá tu edad.'); ok = false; }
    if (!email)         { showError('email', 'Ingresá tu email.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'El email no es válido.'); ok = false; }
    return ok;
  }

  formContacto.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearErrors();

    const nombre   = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const edad     = document.getElementById('edad').value.trim();
    const email    = document.getElementById('email').value.trim();

    if (!validate(nombre, telefono, edad, email)) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, edad, email }),
      });
    } catch (_) {
      // error al guardar — WhatsApp abre igual para no perder el lead
    }

    window.open(WA_URL, '_blank');
    formContacto.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;
  });
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Animate elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.card, .testimonio-card, .marca-card, .visual-step, .solucion-list li, .faq-item'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Inject fade-in CSS once
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }
  .fade-in.visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);
