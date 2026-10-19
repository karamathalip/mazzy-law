// Site behaviour: mobile menu, palette preview switch, map loader, contact form.
// Everything is progressive enhancement; the pages read fine without JavaScript.
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      root.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) setOpen(false);
    });
  }

  /* ---- Header shadow once the page is scrolled -------------------------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Palette preview switch ------------------------------------------- */
  var switcher = document.querySelector('[data-theme-switch]');
  if (switcher) {
    var buttons = switcher.querySelectorAll('[data-theme-value]');
    var sync = function () {
      var current = root.getAttribute('data-theme');
      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-theme-value') === current));
      });
    };
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-theme-value');
        root.setAttribute('data-theme', value);
        try {
          window.localStorage.setItem('mazzy-theme', value);
        } catch (e) {
          /* storage unavailable: the choice lasts for this page only */
        }
        sync();
      });
    });
    sync();
  }

  /* ---- Map: loaded only when the visitor asks for it -------------------- */
  var mapButton = document.querySelector('[data-map-load]');
  if (mapButton) {
    mapButton.addEventListener('click', function () {
      var holder = document.querySelector('[data-map]');
      var frame = document.createElement('iframe');
      frame.src = mapButton.getAttribute('data-map-src');
      frame.title = mapButton.getAttribute('data-map-title');
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.setAttribute('allowfullscreen', '');
      holder.innerHTML = '';
      holder.appendChild(frame);
      holder.classList.add('is-loaded');
    });
  }

  /* ---- Contact form ------------------------------------------------------ */
  // The form only becomes active when a Formspree form ID is set in
  // src/data/site.json. Until then the fields are disabled in the HTML and
  // this block does nothing.
  var form = document.querySelector('[data-contact-form]');
  if (form && form.getAttribute('data-active') === 'true') {
    var status = form.querySelector('[data-form-status]');
    var submit = form.querySelector('[type="submit"]');
    var say = function (message, state) {
      status.textContent = message;
      status.setAttribute('data-state', state);
    };
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      submit.disabled = true;
      say('Sending your message…', 'pending');
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          form.reset();
          say('Thank you. Your message has been sent.', 'success');
        })
        .catch(function () {
          say(form.getAttribute('data-error-message'), 'error');
        })
        .then(function () {
          submit.disabled = false;
        });
    });
  }
})();
