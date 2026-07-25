/* kitchenmap.js — kitchen risk map hotspot panels */
(function () {
  'use strict';
  var panel = document.querySelector('.riskmap-panel');
  if (!panel) return;
  var title = panel.querySelector('.rm-title');
  var body = panel.querySelector('.rm-body');
  var treat = panel.querySelector('.rm-treat');

  var SPOTS = {
    1: {
      t: '01 · DRAWER RUNNERS',
      b: 'The metal channels under every kitchen drawer collect grease and crumbs and are almost never dismantled for cleaning. German cockroach nymphs live their entire lives inside them.',
      x: 'Gel bait dotted along each runner, drawers pulled and voids inspected, monitor placed in the worst cabinet and logged.'
    },
    2: {
      t: '02 · EQUIPMENT MOTOR HOUSINGS',
      b: 'Fridge, freezer and dishwasher motor housings run warm day and night. A single housing can hold hundreds of cockroaches within weeks of introduction on a delivery box.',
      x: 'Housings opened where safe, vacuumed if heavily infested, gel bait applied to internal voids — never spray near a motor.'
    },
    3: {
      t: '03 · UNDER THE COLD ROOM COMPRESSOR',
      b: 'Warm, dark, undisturbed, and almost never cleaned. The single most common German cockroach harbourage in Kathmandu kitchens. Grease film provides a food source; the motor keeps the temperature at 28–32°C year-round.',
      x: 'Gel bait applied to the void, non-repellent residual to the surrounding floor edge, monitor placed and logged as a numbered station.'
    },
    4: {
      t: '04 · FLOOR DRAIN COVERS',
      b: 'Kathmandu’s open drainage means every floor drain is a highway for American cockroaches and a breeding site for drain flies. The biofilm inside the pipe is the food source.',
      x: 'Foaming drain treatment to strip the biofilm, residual band around the cover, mesh recommendation where covers are missing.'
    },
    5: {
      t: '05 · DRY STORE SHELVING JOINTS',
      b: 'Rice, flour and lentil sacks against wooden shelving. The joints and wall gaps behind them harbour stored-product beetles and give rodents cover to feed unseen.',
      x: 'Shelving pulled on rotation, joints treated, pheromone monitors for stored-product insects placed and read monthly.'
    },
    6: {
      t: '06 · GAP UNDER THE BACK DOOR',
      b: 'A gap the width of a pencil admits a mouse; the width of a thumb admits a rat. Back doors onto service lanes are the number one rodent entry point in the Valley.',
      x: 'Documented in the report with a photo, door sweep and threshold proofing quoted — the only fix that is permanent.'
    },
    7: {
      t: '07 · BEHIND THE TANDOOR / RANGE',
      b: 'The gap between cooking equipment and the wall is warm, greasy and undisturbed during service. Cockroaches feed on the grease film at night and retreat here by day.',
      x: 'Crack-and-crevice residual (non-repellent) into the gap, degreasing recommendation logged for the client.'
    },
    8: {
      t: '08 · DISHWASHER PLINTH',
      b: 'Constant warmth and moisture — the two things a German cockroach needs. Plinth voids also collect food sludge that sustains a colony indefinitely.',
      x: 'Plinth void baited, moisture noted in the logbook, drain-fly monitor placed if flies observed.'
    },
    9: {
      t: '09 · CARDBOARD DELIVERY BOXES',
      b: 'Corrugated cardboard is how cockroaches arrive. The flutes are ideal egg-laying sites, and boxes stored in the dry store seed a new infestation each delivery.',
      x: 'Flagged on every visit. We recommend decanting to sealed bins and removing cardboard the same day — written into your corrective actions.'
    }
  };

  document.querySelectorAll('.hotspot').forEach(function (h) {
    h.setAttribute('tabindex', '0');
    h.setAttribute('role', 'button');
    function show() {
      var s = SPOTS[h.getAttribute('data-spot')];
      if (!s) return;
      title.textContent = s.t;
      body.textContent = s.b;
      treat.textContent = s.x;
      panel.hidden = false;
      document.querySelectorAll('.hotspot circle').forEach(function (c) { c.setAttribute('fill', '#1D4E63'); });
      var c = h.querySelector('circle');
      if (c) c.setAttribute('fill', '#C8752A');
    }
    h.addEventListener('click', show);
    h.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
    });
  });
})();
