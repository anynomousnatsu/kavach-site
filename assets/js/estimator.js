/* estimator.js — instant price estimator. Pricing hardcoded from the business plan rate card. */
(function () {
  'use strict';
  var root = document.querySelector('[data-estimator]');
  if (!root) return;

  var PHONE = root.getAttribute('data-phone') || '9779818499308';
  var typeInputs = root.querySelectorAll('input[name="est-type"]');
  var pressureInputs = root.querySelectorAll('input[name="est-pressure"]');
  var slider = root.querySelector('#est-size');
  var sliderOut = root.querySelector('#est-size-out');
  var sliderLabel = root.querySelector('#est-size-label');
  var out = {
    ref: root.querySelector('#qs-ref'),
    date: root.querySelector('#qs-date'),
    plan: root.querySelector('#qs-plan'),
    visits: root.querySelector('#qs-visits'),
    monthly: root.querySelector('#qs-monthly'),
    annual: root.querySelector('#qs-annual'),
    note: root.querySelector('#qs-note'),
    wa: root.querySelector('#qs-wa'),
    hidden: document.querySelector('#form-estimate') // optional hidden form field
  };

  // Slider config per premises type
  var sliderCfg = {
    restaurant: { label: 'Floor area', min: 300, max: 8000, step: 50, start: 1850, unit: ' sq ft' },
    hotel:      { label: 'Number of rooms', min: 5, max: 120, step: 1, start: 40, unit: ' rooms' },
    warehouse:  { label: 'Floor area', min: 1000, max: 30000, step: 250, start: 6000, unit: ' sq ft' },
    home:       { label: 'Size (BHK)', min: 1, max: 6, step: 1, start: 3, unit: ' BHK' }
  };

  function fmt(n) { return 'NPR ' + n.toLocaleString('en-IN'); }

  function estRef() {
    var n = 4000 + Math.floor(Math.random() * 5000);
    return 'KVC-EST-' + n;
  }
  var refNo = estRef();

  function getType() {
    var el = root.querySelector('input[name="est-type"]:checked');
    return el ? el.value : 'restaurant';
  }
  function getPressure() {
    var el = root.querySelector('input[name="est-pressure"]:checked');
    return el ? el.value : 'prevent';
  }

  function applySlider(type) {
    var c = sliderCfg[type];
    slider.min = c.min; slider.max = c.max; slider.step = c.step; slider.value = c.start;
    sliderLabel.textContent = c.label;
    renderSlider();
  }
  function renderSlider() {
    var c = sliderCfg[getType()];
    sliderOut.textContent = parseInt(slider.value, 10).toLocaleString('en-IN') + c.unit;
  }

  function calc() {
    var type = getType();
    var size = parseInt(slider.value, 10);
    var pressure = getPressure();
    var r = { plan: '', visits: '', monthly: '', annual: '', note: '' };

    if (type === 'restaurant') {
      if (size < 1000)      { r.plan = 'KITCHEN SHIELD — TIER S'; r.visits = '12 per year'; r.m = 2500; }
      else if (size <= 2500){ r.plan = 'KITCHEN SHIELD — TIER M'; r.visits = '12 per year'; r.m = 4500; }
      else if (size <= 6000){ r.plan = 'KITCHEN SHIELD — TIER L'; r.visits = '24 per year'; r.m = 9000; }
      else {
        r.plan = 'KITCHEN SHIELD — TIER XL'; r.visits = '24–48 per year';
        r.monthly = 'NPR 1.2–1.8 / sq ft / visit'; r.annual = 'Contact us for a site quote';
      }
    } else if (type === 'hotel') {
      var q = Math.max(size * 180, 6000);
      r.plan = 'ROOM SHIELD — ' + size + ' ROOMS';
      r.visits = '4 per year (every room, every quarter)';
      r.monthly = fmt(Math.round(q / 3)) + ' / month equiv.';
      r.annual = fmt(q * 4) + ' / year';
      r.note = 'Positive bed bug rooms: NPR 2,500 per room for the full 3-visit eradication protocol. Add Kitchen Shield for your kitchen — bundled pricing on one account.';
    } else if (type === 'warehouse') {
      var m;
      if (size < 3000) m = 6000;
      else if (size < 8000) m = 9000;
      else if (size < 15000) m = 14000;
      else m = 20000;
      r.plan = 'STORE SHIELD'; r.visits = '12 per year'; r.m = m;
    } else { // home
      var y;
      if (size <= 2) y = 7000; else if (size === 3) y = 9000; else y = 12000;
      r.plan = 'HOME SHIELD — ' + size + ' BHK';
      r.visits = '4 per year + unlimited callbacks';
      r.monthly = '—';
      r.annual = fmt(y) + ' / year';
    }

    if (r.m) {
      r.monthly = fmt(r.m) + ' / month';
      r.annual = fmt(r.m * 12) + ' / year';
    }
    if (pressure === 'active' && (type === 'restaurant' || type === 'warehouse')) {
      r.note = 'Active infestation: a one-time knockdown treatment of NPR 6,000 applies in month 1, then the monthly rate.';
    } else if (pressure === 'active' && type === 'home') {
      r.note = 'Active infestation: a one-time knockdown treatment applies first — see one-off treatment prices.';
    }
    return r;
  }

  function render() {
    var r = calc();
    var today = new Date().toISOString().slice(0, 10);
    out.ref.textContent = 'ESTIMATE NO. ' + refNo;
    out.date.textContent = today;
    out.plan.textContent = r.plan;
    out.visits.textContent = r.visits;
    out.monthly.textContent = r.monthly;
    out.annual.textContent = r.annual;
    out.note.textContent = r.note;
    out.note.style.display = r.note ? 'block' : 'none';

    var msg = 'Hi Kavach, I used your estimator (' + refNo + '). ' +
      getType() + ', ' + sliderOut.textContent + ', quoted: ' + r.plan +
      ' at ' + r.monthly + '. I’d like a free inspection.';
    if (out.wa) out.wa.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    if (out.hidden) out.hidden.value = refNo + ' | ' + r.plan + ' | ' + r.monthly;
  }

  typeInputs.forEach(function (el) {
    el.addEventListener('change', function () { applySlider(getType()); render(); });
  });
  pressureInputs.forEach(function (el) { el.addEventListener('change', render); });
  slider.addEventListener('input', function () { renderSlider(); render(); });

  applySlider(getType());
  render();
})();
