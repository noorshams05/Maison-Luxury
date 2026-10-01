/* Maison by MS Luxury — interactions */
(function () {
  'use strict';

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () { preloader.classList.add('done'); }, 500);
  });
  // Fallback in case load is delayed
  setTimeout(function () { preloader.classList.add('done'); }, 3500);

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', function () { menu.classList.toggle('open'); });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); });
  });

  /* ---------- Hero parallax (rAF, transform-only) ---------- */
  var heroBg = document.getElementById('heroBg');
  var ticking = false;
  function parallax() {
    var y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      heroBg.style.transform = 'translate3d(0,' + (y * 0.28) + 'px,0)';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(parallax); ticking = true; }
  }, { passive: true });

  /* ---------- Scroll reveals with stagger ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('visible'); }, delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- Quote form -> email ---------- */
  // Static sites can't send email on their own. This composes a pre-filled
  // email to the Maison team and opens the visitor's mail app.
  // To send server-side instead, point this form at Formspree (see README).
  var FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/your-id'
  var TEAM_EMAIL = 'sarahi@msluxuryhomes.com';

  var form = document.getElementById('quoteForm');
  var note = document.getElementById('formNote');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('qName');
    var email = document.getElementById('qEmail');
    var phone = document.getElementById('qPhone');

    if (!name.value.trim() || !email.value.trim() || !phone.value.trim()) {
      note.textContent = 'Please fill in your name, email and phone number.';
      note.classList.remove('sent');
      [name, email, phone].forEach(function (f) {
        if (!f.value.trim()) f.style.borderColor = '#c0392b';
      });
      return;
    }
    [name, email, phone].forEach(function (f) { f.style.borderColor = ''; });

    var data = {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      company: document.getElementById('qCompany').value.trim(),
      occasion: document.getElementById('qOccasion').value,
      quantity: document.getElementById('qQty').value,
      message: document.getElementById('qMsg').value.trim()
    };

    var subject = 'Quote Request — ' + data.name + (data.company ? ' (' + data.company + ')' : '');
    var body = [
      'New quote request from maison website:',
      '',
      'Name: ' + data.name,
      'Email: ' + data.email,
      'Phone: ' + data.phone,
      'Company / Organization: ' + (data.company || '—'),
      'Occasion: ' + data.occasion,
      'Estimated quantity: ' + data.quantity,
      '',
      'Vision / details:',
      data.message || '—'
    ].join('\n');

    if (FORM_ENDPOINT) {
      // Server-side delivery via Formspree (or any form endpoint)
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (res.ok) {
          note.textContent = 'Thank you — your request has been sent. Our team will be in touch shortly.';
          note.classList.add('sent');
          form.reset();
        } else {
          throw new Error('send failed');
        }
      }).catch(function () {
        note.textContent = 'Something went wrong sending the form — please email us directly at ' + TEAM_EMAIL + '.';
        note.classList.remove('sent');
      });
    } else {
      // Fallback: open the visitor's email app with everything pre-filled
      var mailto = 'mailto:' + TEAM_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
      note.textContent = 'Opening your email app to send the request…';
      note.classList.add('sent');
    }
  });
})();
