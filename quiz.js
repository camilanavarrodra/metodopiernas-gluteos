(() => {
  const questions = [
    { t: '¿QUÉ QUIERES MEJORAR?', s: 'Elige tu prioridad.', o: ['Glúteos con más forma', 'Piernas con más firmeza', 'Ambas zonas'] },
    { t: '¿QUÉ TE FRENA HOY?', s: 'Busquemos un comienzo sencillo.', o: ['No sé por dónde empezar', 'Me falta tiempo', 'Me cuesta ser constante'] },
    { t: '¿DÓNDE TE GUSTA ENTRENAR?', s: 'Que encaje con tu rutina.', o: ['En casa', 'En poco espacio', 'Donde me resulte práctico'] },
    { t: '¿PUEDES RESERVAR 20 MINUTOS?', s: 'Una sesión breve puede encajar en tu día.', o: ['Sí, cada día', 'Sí, algunos días', 'Quiero intentarlo'] },
    { t: '¿CUÁL ES TU NIVEL?', s: 'Para saber por dónde empezar.', o: ['Estoy empezando', 'Ya he entrenado antes', 'Quiero retomar'] },
    { t: '¿QUÉ TE MOTIVA MÁS?', s: 'Elige lo que buscas.', o: ['Más firmeza', 'Más fuerza', 'Ser más constante'] },
    { t: '¿QUÉ TE AYUDARÍA A SEGUIR?', s: 'Lo simple es más fácil de mantener.', o: ['Guía paso a paso', 'Ejercicios sencillos', 'Rutinas cortas'] },
    { t: '¿QUÉ NECESITAS PARA EMPEZAR?', s: 'Estamos cerca de tu recomendación.', o: ['Un camino claro', 'Un plan que pueda sostener', 'Una opción accesible'] },
    { t: '¿LISTA PARA VER TU RECOMENDACIÓN?', s: 'Te mostraremos el enfoque según tus respuestas.', o: ['Sí, muéstramela', 'Sí, quiero empezar', 'Quiero descubrir mi plan'] }
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
    if (floatAction) floatAction.textContent = stage === 'result' ? 'VER PLAN →' : 'QUIERO MI RECOMENDACIÓN →';
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
    if (step) step.textContent = `PREGUNTA ${idx + 1} DE ${questions.length}`;
    next.textContent = idx === questions.length - 1 ? 'VER MI RECOMENDACIÓN →' : 'SEGUIR →';
    bar.style.width = `${((idx + 1) / questions.length) * 100}%`;
    qt.textContent = q.t;
    qs.textContent = q.s;
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
    rd.textContent = 'Abriendo tu recomendación…';
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