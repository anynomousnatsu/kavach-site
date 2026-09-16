/* site.js — mobile nav, night-shift pill, photo fallbacks,
   testimonial carousel, reveal-on-scroll, quote-bar prefill. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile menu ----------------------------------------------------- */
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('.mt-label').textContent = open ? 'Close' : 'Menu';
    });
  }

  /* ---- Night-shift pill — reads Nepal Time (UTC+5:45) ------------------ */
  function updatePill() {
    var els = document.querySelectorAll('.night-pill');
    if (!els.length) return;
    var now = new Date();
    var utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
    var nptMin = (utcMin + 345) % 1440;
    var h = Math.floor(nptMin / 60);
    var m = nptMin % 60;
    var hh = (h < 10 ? '0' : '') + h;
    var mm = (m < 10 ? '0' : '') + m;
    var live = (h >= 22 || h < 5);
    Array.prototype.forEach.call(els, function (el) {
      el.classList.toggle('is-live', live);
      var txt = el.querySelector('.np-text');
      if (txt) {
        txt.textContent = live
          ? 'Servicing now · ' + hh + ':' + mm + ' NPT'
          : 'Next night shift 22:00 NPT';
      }
    });
  }
  updatePill();
  setInterval(updatePill, 60000);

  /* ---- Photo fallbacks -------------------------------------------------
     Every .shot points at its final filename. Until that file exists the
     tile keeps its aspect ratio and names the file it's waiting for, so
     dropping the image in is the only step needed — no markup change. */
  Array.prototype.forEach.call(document.querySelectorAll('.shot img'), function (img) {
    function markEmpty() {
      var shot = img.closest('.shot');
      if (!shot) return;
      shot.classList.add('is-empty');
      shot.setAttribute('data-file', (img.getAttribute('src') || '').split('/').pop());
    }
    img.addEventListener('error', markEmpty);
    if (img.complete && img.naturalWidth === 0) markEmpty();
  });

  /* ---- Testimonial carousel -------------------------------------------- */
  var track = document.querySelector('.quotes-track');
  if (track) {
    var prev = document.querySelector('[data-quotes="prev"]');
    var next = document.querySelector('[data-quotes="next"]');
    var count = document.querySelector('[data-quotes="count"]');

    /* Page-based paging: one click moves exactly one viewport of the
       track, so the counter and the scroll position can never disagree. */
    function sync() {
      var max = track.scrollWidth - track.clientWidth;
      var total = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth));
      var page = max <= 0 ? 1 : Math.round((track.scrollLeft / max) * (total - 1)) + 1;
      if (count) count.textContent = Math.min(page, total) + ' / ' + total;
      if (prev) prev.disabled = track.scrollLeft < 8;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollLeft -= track.clientWidth; });
    if (next) next.addEventListener('click', function () { track.scrollLeft += track.clientWidth; });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  /* ---- Quote-bar → contact form prefill --------------------------------- */
  var params = new URLSearchParams(window.location.search);
  ['facility_type', 'area_sqft'].forEach(function (key) {
    var val = params.get(key);
    if (!val) return;
    var el = document.querySelector('[name="' + key + '"]');
    if (el) el.value = val;
  });

  /* ---- Reveal on scroll ------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });
  Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
})();
