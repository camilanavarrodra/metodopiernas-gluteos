(() => {
  const video = document.getElementById('vsl-camila-player');
  const placeholder = document.getElementById('vsl-placeholder');
  if (!video || !placeholder) return;
  const local = 'assets/vsl-camila-final.mp4';
  const temporary = "https://files2.heygen.ai/aws_pacific/avatar_tmp/8a85200e09a3494a9c796a4a4a1f76d9/330338ebfde711a185b5577f83c6c7b6.mp4?Expires=1792765271&Signature=QZBRHv5p96NsGVaS7pUUOFEhQSJ1NLrjwRzy7y6slAD-318Ia7jDJenPr2pJDbaSJ1OzHFF-Qha2Gi8uquoF~X0T0w6QDforkctQ8OYrPZR65-kND5-iLcd6relFC7xovdsdxxFrAcyTw8H7UlFnp200LYvz~lOTGFH0Hs0ugyHlETcOrgj0RgDKbX-naMIHatZm1r-bvD3XVz1aulhOWPx9bHga452yUX2NlNaLbcqZPRTDxDs7~sh7eR4AR5fDhbwB8Eh13ZMfRhEoHu7j9NT3lPvQWA-NinkZKhMK8WV6tRpgzzz4UBaTlUoC9MYAyML6iAmlKZcaIMoCOF8B0w__&Key-Pair-Id=K38HBHX5LX3X2H";
  let usingRemote = false;

  const setVideo = (url) => {
    video.pause();
    video.src = url;
    video.hidden = false;
    placeholder.hidden = true;
    video.load();
  };
  const fallback = () => {
    video.hidden = true;
    placeholder.hidden = false;
    const copy = placeholder.querySelector('.vsl-overlay-copy span');
    if (copy) copy.textContent = 'No se pudo cargar el vídeo. Inténtalo más tarde.';
  };
  video.addEventListener('error', () => {
    if (!usingRemote) {
      usingRemote = true;
      setVideo(temporary);
    } else {
      fallback();
    }
  });
  fetch(local, { method:'HEAD', cache:'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('not_uploaded');
      setVideo(local);
    })
    .catch(() => {
      usingRemote = true;
      setVideo(temporary);
    });
})();