(() => {
  const video = document.getElementById('vsl-camila-player');
  const placeholder = document.getElementById('vsl-placeholder');
  if (!video || !placeholder) return;

  const source = 'assets/vsl-camila-final.mp4';
  const unavailable = () => {
    video.hidden = true;
    placeholder.hidden = false;
    const label = placeholder.querySelector('.vsl-overlay-copy span');
    if (label) label.textContent = 'El vídeo no está disponible en este momento.';
  };

  video.addEventListener('error', unavailable);
  fetch(source, { method: 'HEAD', cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('video_not_found');
      video.src = source;
      video.hidden = false;
      placeholder.hidden = true;
      video.load();
    })
    .catch(unavailable);
})();