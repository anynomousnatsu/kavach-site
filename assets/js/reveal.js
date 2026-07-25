/* reveal.js — section reveal + number count-up, once, respects reduced motion */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-countup]');

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-countup'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      io.unobserve(el);
      if (el.hasAttribute('data-countup')) {
        countUp(el);
      } else {
        el.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(function (el) { io.observe(el); });
  counters.forEach(function (el) { io.observe(el); });

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-countup'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 900, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();
