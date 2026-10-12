/* Enquiry attribution. No personal form values enter analytics.
   Optional GA4 stays off until a real ID is configured AND a visitor opts in. */
(function () {
  'use strict';
  var config = window.KAVACH_ANALYTICS || {};
  var ne = document.documentElement.lang.indexOf('ne') === 0;
  var permitted = false;
  var loaded = false;
  var key = 'kavach_entry_v1';
  var source = { source: 'unknown', medium: 'unknown', campaign: '', landing: '/' };
  var paths = /^\/(?:[a-z0-9-]+)?$/;
  function safePath(path) { return paths.test(path) ? path : '/'; }
  function storage(store, method, name, value) {
    try { return window[store][method](name, value); } catch (_) { return null; }
  }
  function classify() {
    var result = { source: 'direct', medium: 'none', campaign: '', landing: safePath(location.pathname) };
    var params = new URLSearchParams(location.search);
    var campaign = params.get('utm_campaign');
    if (params.has('gclid') || params.has('gbraid') || params.has('wbraid') || /^(cpc|ppc|paid|paid_search|paid_social)$/i.test(params.get('utm_medium') || '')) {
      result.source = 'paid_campaign'; result.medium = 'paid'; return result;
    }
    if (params.get('utm_source') === 'google' && params.get('utm_medium') === 'organic' && campaign === 'gbp') {
      result.source = 'google'; result.medium = 'organic'; result.campaign = 'gbp'; return result;
    }
    if (params.has('utm_source') || params.has('utm_medium')) {
      result.source = 'campaign'; result.medium = 'unknown'; return result;
    }
    if (document.referrer) {
      try {
        var host = new URL(document.referrer).hostname;
        if (host === location.hostname) { result.source = 'internal'; result.medium = 'unknown'; }
        else if (/(^|\.)google\.[a-z.]+$/.test(host)) { result.source = 'google'; result.medium = 'organic'; }
        else if (/(^|\.)bing\.com$/.test(host)) { result.source = 'bing'; result.medium = 'organic'; }
        else if (/(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai)$/.test(host)) { result.source = 'ai_referral'; result.medium = 'referral'; }
        else { result.source = 'referral'; result.medium = 'referral'; }
      } catch (_) { result.source = 'unknown'; result.medium = 'unknown'; }
    }
    return result;
  }
  try {
    var saved = JSON.parse(storage('sessionStorage', 'getItem', key) || 'null');
    var known = ['direct', 'google', 'bing', 'ai_referral', 'referral', 'internal', 'campaign', 'paid_campaign', 'unknown'];
    if (saved && known.indexOf(saved.source) !== -1 && ['none','organic','referral','paid','unknown'].indexOf(saved.medium) !== -1 && paths.test(saved.landing)) {
      source = { source: saved.source, medium: saved.medium, campaign: saved.campaign === 'gbp' ? 'gbp' : '', landing: saved.landing };
    } else { source = classify(); storage('sessionStorage', 'setItem', key, JSON.stringify(source)); }
  } catch (_) { source = classify(); }

  function loadAnalytics() {
    if (loaded || !permitted || !/^G-[A-Z0-9]+$/.test(config.measurementId || '')) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.measurementId, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      page_location: 'https://kavachpest.com' + safePath(location.pathname), page_referrer: '',
      campaign_source: source.source, campaign_medium: source.medium, campaign_name: source.campaign || '(not set)'
    });
    window.gtag('event', 'page_view', { page_location: 'https://kavachpest.com' + safePath(location.pathname), page_title: document.title });
    var script = document.createElement('script');
    script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.measurementId;
    document.head.appendChild(script);
  }
  function track(name, details) {
    if (!permitted || !loaded || typeof window.gtag !== 'function') return;
    var data = { page_path: safePath(location.pathname), landing_page: source.landing, entry_source: source.source, entry_medium: source.medium, entry_campaign: source.campaign, language: ne ? 'ne' : 'en' };
    /* Values must come from enumerated controls, never names/addresses/notes. */
    ['facility_bucket','service_city','request_type','cta_location'].forEach(function (field) {
      if (details && typeof details[field] === 'string' && /^[a-z_]{1,30}$/.test(details[field])) data[field] = details[field];
    });
    window.gtag('event', name, data);
  }
  window.KavachEnquiries = {
    track: track,
    attribution: function () { return { source: source.source, medium: source.medium, campaign: source.campaign, landing: source.landing }; }
  };

  var idValid = /^G-[A-Z0-9]+$/.test(config.measurementId || '');
  var privateSignal = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  if (idValid && !privateSignal) {
    var choice = storage('localStorage', 'getItem', 'kavach_analytics_consent');
    if (choice === 'yes') { permitted = true; loadAnalytics(); }
    else if (choice !== 'no') {
      var panel = document.createElement('aside'); panel.className = 'consent-panel'; panel.setAttribute('aria-label', ne ? 'विश्लेषण कुकीको रोजाइ' : 'Analytics preference');
      var p = document.createElement('p'); p.textContent = ne ? 'वैकल्पिक विश्लेषण कुकी प्रयोग गर्न दिनुहुन्छ? यसले वेबसाइट सुधार्न मद्दत गर्छ।' : 'Allow optional analytics cookies to help us improve the site?'; panel.appendChild(p);
      var link = document.createElement('a'); link.href = '/privacy'; link.textContent = ne ? 'गोपनीयता' : 'Privacy details'; panel.appendChild(link);
      ['yes','no'].forEach(function (value) {
        var button = document.createElement('button'); button.type = 'button'; button.className = 'btn btn--sm ' + (value === 'yes' ? 'btn--lime' : 'btn--ghost');
        button.textContent = ne ? (value === 'yes' ? 'अनुमति दिनुहोस्' : 'अनुमति नदिनुहोस्') : (value === 'yes' ? 'Allow analytics' : 'Decline');
        button.addEventListener('click', function () { storage('localStorage','setItem','kavach_analytics_consent',value); permitted = value === 'yes'; if (permitted) loadAnalytics(); panel.remove(); }); panel.appendChild(button);
      });
      document.body.appendChild(panel);
    }
  }
  document.addEventListener('click', function (event) {
    var a = event.target.closest && event.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var position = a.closest('header') ? 'header' : a.closest('footer') ? 'footer' : a.closest('.call-bar') ? 'mobile_bar' : 'content';
    if (href.indexOf('tel:') === 0) track('phone_click', { cta_location: position });
    if (/^https:\/\/(?:wa\.me|api\.whatsapp\.com)\//.test(href)) track('whatsapp_click', { cta_location: position });
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest || !event.target.closest('[data-reset-analytics]')) return;
    storage('localStorage','removeItem','kavach_analytics_consent');
    if (idValid) location.reload();
  });
})();
