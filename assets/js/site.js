/* site.js — mobile nav, service-hours pill, photo fallbacks,
   testimonial carousel, reveal-on-scroll, quote-bar prefill,
   WhatsApp quote form. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ne = document.documentElement.lang.indexOf('ne') === 0;

  /* ---- Mobile menu ----------------------------------------------------- */
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('.mt-label').textContent = ne ? (open ? 'बन्द गर्नुहोस्' : 'मेनु') : (open ? 'Close' : 'Menu');
    });
  }

  /* ---- Service-hours pill — reads Nepal Time (UTC+5:45), open 05–21 ---- */
  function updatePill() {
    var els = document.querySelectorAll('.night-pill');
    if (!els.length) return;
    var now = new Date();
    var utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
    var nptMin = (utcMin + 345) % 1440;
    var h = Math.floor(nptMin / 60);
    var live = (h >= 5 && h < 21);
    Array.prototype.forEach.call(els, function (el) {
      el.classList.toggle('is-live', live);
      var txt = el.querySelector('.np-text');
      if (txt) {
        // The visit window is confirmed; specific operating days are not.
        txt.textContent = ne ? 'भ्रमण बिहान ५–बेलुका ९ बजे' : 'Visits 05:00–21:00 NPT';
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
  ['facility_type', 'area_sqft', 'service_city', 'request_type', 'pest_type'].forEach(function (key) {
    var val = params.get(key);
    if (!val) return;
    var el = document.querySelector('[name="' + key + '"]');
    if (el) el.value = val;
  });

  /* ---- Quote form → WhatsApp -------------------------------------------
     There is no form backend: the form composes a WhatsApp message to the
     business number and opens it. Nothing is sent until the visitor presses
     send in WhatsApp. Without JS the form still opens the chat. */
  var quote = document.getElementById('quote-form');
  if (quote) {
    quote.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = quote.elements;
      var lines = [ne ? 'kavachpest.com बाट लागत अनुरोध' : 'Quote request from kavachpest.com'];
      [['facility_type', 'Facility'], ['service_city', 'City'], ['request_type', 'Request'],
       ['pest_type', 'Pest'], ['area_sqft', 'Area / total rooms'], ['name', 'Name'],
       ['location', 'Location / area'], ['notes', 'What we have seen']].forEach(function (pair) {
        var el = f[pair[0]];
        var v = el && el.value.trim();
        if (v) lines.push(pair[1] + ': ' + v);
      });
      if (window.KavachEnquiries) {
        var attribution = window.KavachEnquiries.attribution();
        lines.push('Website entry: ' + attribution.landing);
        lines.push('Source clue: ' + attribution.source + ' / ' + attribution.medium + (attribution.campaign ? ' / ' + attribution.campaign : ''));
        var buckets = { 'Restaurant / F&B': 'restaurant', 'Hotel / Guesthouse': 'hotel', 'Warehouse / Godown': 'warehouse', 'Office / Retail': 'office_retail', 'Residential': 'residential' };
        var cities = { Kathmandu: 'kathmandu', Lalitpur: 'lalitpur', Bhaktapur: 'bhaktapur', Other: 'other' };
        var requests = { 'Recurring programme': 'programme', 'One-off treatment': 'treatment', 'Not sure': 'not_sure' };
        window.KavachEnquiries.track('quote_handoff', {
          facility_bucket: buckets[f.facility_type.value] || 'unknown',
          service_city: cities[f.service_city && f.service_city.value] || 'unknown',
          request_type: requests[f.request_type && f.request_type.value] || 'unknown'
        });
      }
      var url = 'https://wa.me/' + quote.getAttribute('data-wa') +
                '?text=' + encodeURIComponent(lines.join('\n'));
      window.location.href = url;
    });
  }

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
