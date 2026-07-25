/* pests.js — pest library filter chips + detail panels */
(function () {
  'use strict';
  var grid = document.querySelector('.pest-grid');
  if (!grid) return;
  var chips = document.querySelectorAll('.filter-chips button');
  var cards = grid.querySelectorAll('.pest-card');
  var details = document.querySelectorAll('.pest-detail');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      var f = chip.getAttribute('data-filter');
      cards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(' ');
        card.hidden = f !== 'all' && tags.indexOf(f) === -1;
      });
      details.forEach(function (d) { d.hidden = true; });
    });
  });

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var id = card.getAttribute('data-pest');
      details.forEach(function (d) {
        d.hidden = d.getAttribute('data-pest') !== id;
      });
      var open = document.querySelector('.pest-detail[data-pest="' + id + '"]');
      if (open) open.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      // Support deep links
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    });
  });

  // Open from URL fragment
  if (location.hash) {
    var target = document.querySelector('.pest-detail[data-pest="' + location.hash.slice(1) + '"]');
    if (target) target.hidden = false;
  }
})();
