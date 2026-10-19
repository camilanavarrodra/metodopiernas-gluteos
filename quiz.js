(() => {
  const questions = [
    { t: '¿QUÉ QUIERES CAMBIAR?', s: '', o: ['Glúteos con más forma', 'Piernas más firmes', 'Ambos'] },
    { t: '¿QUÉ TE DETIENE?', s: '', o: ['No sé qué hacer', 'No tengo tiempo', 'No soy constante'] },
    { t: '¿DÓNDE ENTRENARÍAS?', s: '', o: ['En casa', 'En poco espacio', 'Donde pueda'] },
    { t: '¿CUÁNTO TIEMPO TIENES?', s: '', o: ['10–20 minutos', '20–30 minutos', 'Depende del día'] },
    { t: '¿CUÁL ES TU NIVEL?', s: '', o: ['Principiante', 'Intermedio', 'Estoy retomando'] },
    { t: '¿QUÉ TE FRUSTRA MÁS?', s: '', o: ['No ver progreso', 'Abandonar la rutina', 'No saber si lo hago bien'] },
    { t: '¿QUÉ TE AYUDARÍA?', s: '', o: ['Guía paso a paso', 'Ejercicios sencillos', 'Rutinas rápidas'] },
    { t: '¿CÓMO PREFIERES AVANZAR?', s: '', o: ['A mi ritmo', 'Con un camino claro', 'Con sesiones cortas'] },
    { t: '¿QUIERES VER TU RECOMENDACIÓN?', s: '', o: ['¡Sí, ahora!', 'Quiero empezar', 'Muéstrame mi enfoque'] }
  ];

  // El programa de 4 semanas es el mismo; la recomendación orienta
  // sobre la prioridad elegida, no promete una rutina creada individualmente.
  const profiles = {
    glutes: {
      title: 'TU ENFOQUE: GLÚTEOS MÁS FUERTES',
      desc: 'Un programa de 4 semanas en casa, para empezar con una rutina clara.'
    },
    legs: {
      title: 'TU ENFOQUE: PIERNAS MÁS FIRMES',
      desc: 'Un programa de 4 semanas en casa, con sesiones cortas y progresivas.'
    },
    both: {
      title: 'TU ENFOQUE: PIERNAS Y GLÚTEOS',
      desc: 'Un programa de 4 semanas en casa para entrenar ambas zonas.'
    }
  };

  const floatAction = document.getElementById('quizFloatAction');
  const mainCard = document.querySelector('.quiz-main-card');
  const setStage = (stage) => {
    document.body.setAttribute('data-quiz-stage',stage);
    if (floatAction) floatAction.textContent = stage === 'result' ? 'VER PLAN →' : 'DESCUBRIR MI PLAN →';
    if (stage !== 'intro' && mainCard && window.matchMedia('(max-width: 760px)').matches) {
      mainCard.scrollIntoView({behavior:'smooth',block:'start'});
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
    if (step) step.textContent = `${idx + 1} DE ${questions.length}`;
    next.textContent = idx === questions.length - 1 ? 'VER MI RECOMENDACIÓN →' : 'SEGUIR →';
    bar.style.width = `${((idx + 1) / questions.length) * 100}%`;
    qt.textContent = q.t;
    qs.textContent = q.s;
    qs.hidden = !q.s;
    opts.innerHTML = '';
    q.o.forEach((opt, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option' + (answers[idx] === i ? ' active' : '');
      const icon = document.createElement('span');
      icon.className = 'quiz-choice-icon';
      icon.textContent = '✓';
      icon.setAttribute('aria-hidden','true');
      const label = document.createElement('span');
      label.className = 'quiz-option-text';
      label.textContent = opt;
      const arrow = document.createElement('span');
      arrow.className = 'quiz-option-arrow';
      arrow.textContent = '›';
      arrow.setAttribute('aria-hidden','true');
      button.append(icon,label,arrow);
      button.setAttribute('aria-pressed',String(answers[idx] === i));
      button.onclick = () => {
        answers[idx] = i;
        [...opts.children].forEach(el => el.classList.remove('active'));
        button.classList.add('active');
        [...opts.children].forEach(el => el.setAttribute('aria-pressed',String(el === button)));
        next.disabled = false;
      };
      opts.appendChild(button);
    });
    next.disabled = answers[idx] == null;
    prev.style.visibility = idx === 0 ? 'hidden' : 'visible';
  };

  const chooseProfile = () => {
    // Recomendación transparente: se basa en el objetivo elegido.
    if (answers[0] === 0) return profiles.glutes;
    if (answers[0] === 1) return profiles.legs;
    return profiles.both;
  };

  const showResult = () => {
    const p = chooseProfile();
    quest.classList.add('hidden');
    result.classList.remove('hidden');
    next.disabled = true;
    setStage('result');
    // Dispara Lead apenas quando as 9 respostas foram concluídas.
    // Evita contar várias vezes no mesmo navegador e sessão.
    try {
      if (!sessionStorage.getItem('piernas_quiz_lead_sent_v1')) {
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead');
          sessionStorage.setItem('piernas_quiz_lead_sent_v1', '1');
        }
      }
    } catch (_) {
      if (typeof window.fbq === 'function' && !window.__quizLeadTracked) {
        window.fbq('track', 'Lead');
        window.__quizLeadTracked = true;
      }
    }
    rt.textContent = '¡ENCONTRAMOS TU ENFOQUE!';
    rd.textContent = 'Abriendo tu plan…';
    rl.innerHTML = '';
    try {
      localStorage.setItem('quiz_offer_line', p.title);
      localStorage.setItem('quiz_offer_desc', p.desc);
    } catch (_) {
      // El bloqueo del almacenamiento no debe impedir el acceso a la oferta.
    }
    // Redirige automáticamente, sin un clic adicional.
    // Breve margen para que el evento Lead del Pixel pueda enviarse.
    window.setTimeout(() => {
      window.location.assign('./');
    }, 750);
  };

  start?.addEventListener('click', () => {
    intro.classList.add('hidden');
    quest.classList.remove('hidden');
    setStage('questions');
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
    setStage('intro');
  });

  seeOffer?.addEventListener('click', () => {
    window.location.href = './';
  });
  floatAction?.addEventListener('click', () => {
    if (document.body.getAttribute('data-quiz-stage') === 'result') window.location.href = './';
    else start?.click();
  });
})();