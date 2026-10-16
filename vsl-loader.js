(() => {
  const video = document.getElementById('vsl-camila-player');
  const placeholder = document.getElementById('vsl-placeholder');
  if (!video || !placeholder) return;

  const source = video.querySelector('source');
  if (!source) return;

  fetch(source.getAttribute('src'), { method: 'HEAD' })
    .then(r => {
      if (!r.ok) throw new Error('missing');
      placeholder.hidden = true;
      video.hidden = false;
    })
    .catch(() => {
      video.hidden = true;
      placeholder.hidden = false;
    });
})();