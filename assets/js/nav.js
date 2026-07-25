/* nav.js — mobile menu + night-shift indicator */
(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'CLOSE' : 'MENU';
    });
  }

  // Night-shift indicator — reads Nepal Time (UTC+5:45)
  function updateIndicator() {
    var els = document.querySelectorAll('.night-indicator');
    if (!els.length) return;
    var now = new Date();
    var utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
    var nptMin = (utcMin + 345) % 1440; // UTC+5:45
    var h = Math.floor(nptMin / 60);
    var m = nptMin % 60;
    var hh = (h < 10 ? '0' : '') + h;
    var mm = (m < 10 ? '0' : '') + m;
    var live = (h >= 22 || h < 5); // 22:00–05:00 NPT
    els.forEach(function (el) {
      el.classList.toggle('is-live', live);
      var txt = el.querySelector('.ni-text');
      if (txt) {
        txt.textContent = live
          ? 'Servicing now · ' + hh + ':' + mm + ' NPT'
          : 'Next night shift 22:00 NPT';
      }
    });
  }
  updateIndicator();
  setInterval(updateIndicator, 60000);
})();
