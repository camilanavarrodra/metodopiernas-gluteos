(() => {
  const cfg = window.SITE_CONFIG || {};
  const checkout = cfg.checkoutUrl || '#';
  document.querySelectorAll('[data-checkout]').forEach(a => {
    a.setAttribute('href', checkout);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

  const personalLine = document.getElementById('personalLine');
  const saved = localStorage.getItem('quiz_offer_line');
  if (personalLine && saved) {
    personalLine.textContent = saved;
  }

})();