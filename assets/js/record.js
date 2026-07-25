/* record.js — service record viewer: tabs, visit-log expansion, station map tooltips */
(function () {
  'use strict';

  // --- Tab controller (works for any [data-tabs] group) ---
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = group.querySelectorAll('[role="tab"]');
    var panes = group.querySelectorAll('[role="tabpanel"]');
    function select(tab) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      panes.forEach(function (p) { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var next;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) { next.focus(); select(next); e.preventDefault(); }
      });
    });
  });

  // --- Visit log row expansion ---
  document.querySelectorAll('.visit-row').forEach(function (row) {
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
    function toggle() {
      var detail = row.nextElementSibling;
      if (detail && detail.classList.contains('visit-detail')) {
        detail.hidden = !detail.hidden;
        row.setAttribute('aria-expanded', detail.hidden ? 'false' : 'true');
      }
    }
    row.addEventListener('click', toggle);
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // --- Station map tooltips ---
  var tooltip = document.querySelector('.station-tooltip');
  document.querySelectorAll('.station-dot').forEach(function (dot) {
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('role', 'button');
    function show() {
      if (tooltip) tooltip.textContent = dot.getAttribute('data-info');
    }
    dot.addEventListener('mouseenter', show);
    dot.addEventListener('focus', show);
    dot.addEventListener('click', show);
    dot.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
    });
  });

  // --- Hotel per-room record grid (room-shield page) ---
  var roomOut = document.querySelector('.room-record-out');
  document.querySelectorAll('.room-cell').forEach(function (cell) {
    function show() {
      if (!roomOut) return;
      roomOut.textContent = cell.getAttribute('data-record');
      document.querySelectorAll('.room-cell').forEach(function (c) { c.classList.remove('is-active'); });
      cell.classList.add('is-active');
    }
    cell.addEventListener('click', show);
    cell.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
    });
  });
})();
