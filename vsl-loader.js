(()=>{
 const video=document.getElementById('vsl-camila-player');
 const holder=document.getElementById('vsl-final-player');
 const status=document.getElementById('vsl-status');
 const label=document.getElementById('vsl-version');
 if(!video||!holder)return;
 const finalFile='assets/vsl-camila-final.mp4';
 // Use a permanent local file. Never put a HeyGen signed URL here.
 fetch(finalFile,{method:'HEAD'}).then(r=>{
   const type=r.headers.get('content-type')||'';
   if(!r.ok || /text\/html/.test(type))return;
   const s=video.querySelector('source');
   if(!s)return;
   s.src=finalFile;
   video.load();
   holder.classList.add('is-portrait');
   if(status)status.textContent='Vídeo con la presentadora · El resultado puede variar de persona a persona.';
   if(label)label.textContent='VSL COMPLETA';
 }).catch(()=>{});
})();
