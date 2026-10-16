
(function(){
 const cfg=window.SITE_CONFIG||{};
 const price=document.getElementById('offer-price');
 const old=document.getElementById('offer-old');
 const cap=document.getElementById('offer-price-caption');
 if(price&&cfg.productPrice) price.textContent=cfg.productPrice;
 if(old&&cfg.oldPrice) old.textContent=cfg.oldPrice;
 if(cap&&cfg.priceCaption) cap.textContent=cfg.priceCaption;
 const result=document.getElementById('quizResultLine');
 try{const raw=localStorage.getItem('piernasGluteosQuiz'); if(raw&&result){const p=JSON.parse(raw); result.textContent=p.title;}}catch(e){}
 const checkoutLinks=document.querySelectorAll('[data-checkout]');
 const checkoutMsg=document.getElementById('checkout-message');
 checkoutLinks.forEach(a=>{
   if(cfg.checkoutUrl){a.href=cfg.checkoutUrl;a.target='_blank';a.rel='noopener';}
   else {a.href='#oferta'; a.onclick=(ev)=>{ev.preventDefault(); checkoutMsg.hidden=false; checkoutMsg.scrollIntoView({behavior:'smooth',block:'center'});};}
 });
 const timer=document.getElementById('timer');
 if(timer){let sec=(Number(cfg.countdownMinutes)||0)*60+(Number(cfg.countdownSeconds)||0); function tick(){const m=Math.floor(sec/60).toString().padStart(2,'0'); const s=(sec%60).toString().padStart(2,'0'); timer.textContent=`${m}:${s}`; if(sec>0){sec--; setTimeout(tick,1000);}} tick();}
})();
