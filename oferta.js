(() => {
  const cfg = window.SITE_CONFIG || {};
  const checkout = cfg.checkoutUrl || '#';
  document.querySelectorAll('[data-checkout]').forEach(a => {
    a.setAttribute('href', checkout);
    // Abre o pagamento na mesma aba para evitar nova janela no celular.
    a.setAttribute('target', '_self');
    a.removeAttribute('rel');
    // Clique no checkout não significa checkout iniciado nem compra confirmada.
    // Eventos padrão InitiateCheckout/Purchase devem vir da plataforma de pagamento.
    a.addEventListener('click', () => {
      const key = 'piernas_gluteos_pixel_checkout_click_v1';
      if (typeof window.fbq !== 'function') return;
      try {
        if (sessionStorage.getItem(key) === '1') return;
      } catch (_) {}
      if (window.__piernasCheckoutClickTracked) return;
      window.fbq('trackCustom', 'CheckoutClick', {destination: 'kiwify'});
      window.__piernasCheckoutClickTracked = true;
      try { sessionStorage.setItem(key, '1'); } catch (_) {}
    });
  });

  const personalLine = document.getElementById('personalLine');
  try {
    const saved = localStorage.getItem('quiz_offer_line');
    if (personalLine && saved && saved.startsWith('TU ENFOQUE: ')) {
      personalLine.textContent = saved;
      personalLine.hidden = false;
    }
  } catch (_) {
    // Sin almacenamiento, mostramos la oferta general.
  }

  // Temporizador de sesión: conserva su fin al recargar, no reinicia en 00:00
  // y no afirma que el checkout o el precio caduquen al terminar.
  const timerElements = ['timer-top','timer','timer2'].map(id => document.getElementById(id)).filter(Boolean);
  const durationMs = 5 * 60 * 1000;
  const sessionKey = 'piernas_gluteos_session_countdown_5m_v1';
  let endTime;
  try {
    const saved = Number(sessionStorage.getItem(sessionKey));
    endTime = Number.isFinite(saved) && saved > 0 ? saved : Date.now() + durationMs;
    if (!saved || !Number.isFinite(saved)) sessionStorage.setItem(sessionKey, String(endTime));
  } catch (err) {
    endTime = Date.now() + durationMs;
  }
  function updateTimer() {
    const seconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    const display = String(Math.floor(seconds / 60)).padStart(2,'0') + ':' + String(seconds % 60).padStart(2,'0');
    timerElements.forEach(el => { el.textContent = display; });
    document.body.classList.toggle('session-ended',seconds===0);
    if (seconds === 0) clearInterval(tickHandle);
  }
  const tickHandle = setInterval(updateTimer, 500);
  updateTimer();


})();