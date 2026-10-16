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
    personalLine.textContent = saved.replace(/(?:US\$\s*)?(?:29|34)\.90/g, 'US$ 6.90');
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

  const video = document.getElementById('camila-vsl');
  const soundButton = document.getElementById('camila-sound');
  const playError = document.getElementById('camila-play-error');
  if (video) {
    // Mobile browsers usually allow autoplay only while muted.
    video.defaultMuted = true;
    video.muted = true;
    const tryAutoplay = () => {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => {
          if (playError) playError.hidden = false;
        });
      }
    };
    video.addEventListener('playing', () => { if (playError) playError.hidden = true; });
    video.addEventListener('loadedmetadata', tryAutoplay, {once: true});
    if (video.readyState >= 1) tryAutoplay();

    soundButton?.addEventListener('click', () => {
      video.muted = !video.muted;
      soundButton.textContent = video.muted ? '🔊 ACTIVAR SONIDO' : '🔇 SILENCIAR';
      soundButton.setAttribute('aria-pressed', String(!video.muted));
      if (video.paused) tryAutoplay();
    });
  }

})();