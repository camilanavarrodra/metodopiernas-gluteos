(() => {
  const questions = [
    { t: '¿Qué quieres mejorar más ahora?', s: 'Elige lo que más te importa.', o: ['Glúteos más trabajados', 'Piernas más firmes', 'Ambos por igual'] },
    { t: '¿Dónde prefieres entrenar?', s: 'Queremos adaptarnos a tu rutina.', o: ['En casa', 'En cualquier lugar', 'Tengo poco tiempo y necesito algo práctico'] },
    { t: '¿Cuánto tiempo puedes dedicar?', s: 'Sé realista para personalizar tu oferta.', o: ['10 a 20 min', '20 a 30 min', 'Lo que sea más fácil de sostener'] },
    { t: '¿Qué te frena hoy?', s: 'La idea es darte un camino viable.', o: ['Falta de constancia', 'No saber por dónde empezar', 'Rutinas largas y aburridas'] },
    { t: '¿Cuál es tu nivel actual?', s: 'Esto nos ayuda a ajustar el enfoque.', o: ['Estoy empezando', 'Ya intenté antes', 'Quiero retomar ya'] },
    { t: '¿Qué tipo de cambio te motiva más?', s: 'Piensa en lo que quieres sentir al mirarte.', o: ['Más firmeza', 'Más confianza', 'Más definición'] },
    { t: '¿Te interesa una opción simple?', s: 'Sin complicaciones ni vueltas.', o: ['Sí, cuanto más simple mejor', 'Sí, si puedo empezar hoy', 'Sí, si me guía paso a paso'] },
    { t: '¿Qué valoras más en una oferta?', s: 'Tu respuesta activa la propuesta.', o: ['Que sea clara', 'Que se sienta personalizada', 'Que tenga precio accesible'] },
    { t: '¿Quieres desbloquear tu oferta ahora?', s: 'Estás a un paso de verla.', o: ['Sí, quiero verla', 'Sí, para empezar hoy', 'Sí, si es por tiempo limitado'] }
  ];

  const profiles = {
    start: {
      title: 'Tu oferta ideal es: Empezar fácil y con foco',
      desc: 'Una ruta clara para comenzar sin sentirte abrumada.',
      bullets: ['Plan simple', 'En casa', 'Acceso por US$ 6.90']
    },
    shape: {
      title: 'Tu oferta ideal es: Más firmeza y constancia',
      desc: 'Un enfoque pensado para sostener el hábito y sentir progreso.',
      bullets: ['4 semanas', 'Sesiones cortas', 'Oferta disponible']
    },
    fast: {
      title: 'Tu oferta ideal es: Entrar hoy y aprovechar la promo',
      desc: 'Vimos que encajas muy bien con una propuesta directa y práctica.',
      bullets: ['Acceso inmediato', 'Enfoque en piernas y glúteos', 'Acceso por US$ 6.90']
    }
  };

  const start = document.getElementById('start');
  const intro = document.getElementById('intro');
  const quest = document.getElementById('quest');
  const result = document.getElementById('result');
  const qt = document.getElementById('qt');
  const qs = document.getElementById('qs');
  const opts = document.getElementById('opts');
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');
  const step = document.getElementById('step');
  const bar = document.getElementById('bar');
  const rt = document.getElementById('rt');
  const rd = document.getElementById('rd');
  const rl = document.getElementById('rl');
  const restart = document.getElementById('restart');
  const seeOffer = document.getElementById('seeOffer');

  let idx = 0;
  let answers = new Array(questions.length).fill(null);

  const render = () => {
    const q = questions[idx];
    if (step) step.textContent = `${String(idx + 1).padStart(2,'0')} / ${String(questions.length).padStart(2,'0')}`;
    bar.style.width = `${((idx + 1) / questions.length) * 100}%`;
    qt.textContent = q.t;
    qs.textContent = q.s;
    opts.innerHTML = '';
    q.o.forEach((opt, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option' + (answers[idx] === i ? ' active' : '');
      button.textContent = opt;
      button.onclick = () => {
        answers[idx] = i;
        [...opts.children].forEach(el => el.classList.remove('active'));
        button.classList.add('active');
        next.disabled = false;
      };
      opts.appendChild(button);
    });
    next.disabled = answers[idx] == null;
    prev.style.visibility = idx === 0 ? 'hidden' : 'visible';
  };

  const chooseProfile = () => {
    const score = answers.reduce((sum, val) => sum + (val ?? 0), 0);
    if (score <= 7) return profiles.start;
    if (score <= 12) return profiles.shape;
    return profiles.fast;
  };

  const showResult = () => {
    const p = chooseProfile();
    quest.classList.add('hidden');
    result.classList.remove('hidden');
    rt.textContent = p.title;
    rd.textContent = p.desc;
    rl.innerHTML = p.bullets.map(x => `<li>${x}</li>`).join('');
    localStorage.setItem('quiz_offer_line', p.title);
    localStorage.setItem('quiz_offer_desc', p.desc);
  };

  start?.addEventListener('click', () => {
    intro.classList.add('hidden');
    quest.classList.remove('hidden');
    render();
  });

  next?.addEventListener('click', () => {
    if (answers[idx] == null) return;
    if (idx < questions.length - 1) {
      idx += 1;
      render();
    } else {
      showResult();
    }
  });

  prev?.addEventListener('click', () => {
    if (idx > 0) {
      idx -= 1;
      render();
    }
  });

  restart?.addEventListener('click', () => {
    idx = 0;
    answers = new Array(questions.length).fill(null);
    result.classList.add('hidden');
    intro.classList.remove('hidden');
    quest.classList.add('hidden');
  });

  seeOffer?.addEventListener('click', () => {
    window.location.href = 'oferta.html';
  });
})();