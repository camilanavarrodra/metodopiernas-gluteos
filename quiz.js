(() => {
  const questions = [
    { t: '¿QUÉ QUIERES CAMBIAR?', s: '', o: ['Glúteos con más forma', 'Piernas más firmes', 'Ambos'] },
    { t: '¿QUÉ TE DETIENE?', s: '', o: ['No sé qué hacer', 'No tengo tiempo', 'No soy constante'] },
    { t: '¿CUÁNTO TIEMPO TIENES?', s: '', o: ['10–20 minutos', '20–30 minutos', 'Depende del día'] },
    { t: '¿CUÁL ES TU NIVEL?', s: '', o: ['Principiante', 'Intermedio', 'Estoy retomando'] }
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

  const quest = document.getElementById('quest');
  const qt = document.getElementById('qt');
  const qs = document.getElementById('qs');
  const opts = document.getElementById('opts');
  const prev = document.getElementById('prev');
  const bar = document.getElementById('bar');

  let idx = 0;
  let answers = new Array(questions.length).fill(null);
  let transitioning = false;

  // Eventos de funil: cada etapa é contabilizada apenas uma vez por sessão.
  // O evento padrão Lead permanece reservado à conclusão do quiz.
  const trackedCustomEvents = new Set();
  function trackCustomOnce(eventName, params = {}) {
    if (typeof window.fbq !== 'function' || trackedCustomEvents.has(eventName)) return;
    const key = 'piernas_gluteos_pixel_' + eventName.toLowerCase() + '_v1';
    try {
      if (sessionStorage.getItem(key) === '1') return;
    } catch (_) {
      // Alguns navegadores bloqueiam armazenamento; o controle em memória continua.
    }
    window.fbq('trackCustom', eventName, params);
    trackedCustomEvents.add(eventName);
    try { sessionStorage.setItem(key, '1'); } catch (_) {}
  }

  const render = () => {
    transitioning = false;
    const q = questions[idx];
    if (idx === 2) trackCustomOnce('QuizMidpoint', {step_reached: 3, questions_total: questions.length});
    const progressPercent = Math.round((idx / questions.length) * 100);
    bar.style.width = `${progressPercent}%`;
    bar.parentElement?.setAttribute("aria-valuenow", String(progressPercent));
    qt.textContent = q.t;
    qs.textContent = q.s;
    qs.hidden = !q.s;
    opts.replaceChildren();

    q.o.forEach((opt, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option' + (answers[idx] === i ? ' active' : '');
      const icon = document.createElement('span');
      icon.className = 'quiz-choice-icon';
      icon.textContent = '✓';
      icon.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'quiz-option-text';
      label.textContent = opt;
      const arrow = document.createElement('span');
      arrow.className = 'quiz-option-arrow';
      arrow.textContent = '›';
      arrow.setAttribute('aria-hidden', 'true');
      button.append(icon, label, arrow);
      button.setAttribute('aria-pressed', String(answers[idx] === i));

      button.addEventListener('click', () => {
        // Evita avanço duplo ao tocar repetidamente na opção.
        if (transitioning) return;
        transitioning = true;
        // Sin pantalla de introducción: contamos QuizStart con la primera respuesta,
        // no con una simple visita a la página.
        if (idx === 0) trackCustomOnce('QuizStart', {questions_total: questions.length});
        answers[idx] = i;
        [...opts.children].forEach(el => {
          el.classList.toggle('active', el === button);
          el.setAttribute('aria-pressed', String(el === button));
        });
        if (prev) prev.disabled = true;
        // Feedback visual curto; sem exigir clique adicional em "Seguir".
        window.setTimeout(() => {
          if (idx === questions.length - 1) {
            showResult();
          } else {
            idx += 1;
            render();
          }
        }, 220);
      });
      opts.appendChild(button);
    });
    prev.disabled = false;
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
    transitioning = true;
    // Completa el quiz sin mostrar otra pantalla intermedia.
    // Dispara Lead apenas quando as 4 respostas forem concluídas.
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
    bar.style.width = '100%';
    bar.parentElement?.setAttribute('aria-valuenow', '100');
    trackCustomOnce('QuizComplete', {questions_total: questions.length});
    try {
      localStorage.setItem('quiz_offer_line', p.title);
      localStorage.setItem('quiz_offer_desc', p.desc);
    } catch (_) {
      // El bloqueo del almacenamiento no debe impedir el acceso a la oferta.
    }
    // Al terminar las cuatro respuestas, continúa directamente a la oferta.
    // Una breve pausa permite enviar los eventos del Pixel antes de navegar.
    window.setTimeout(() => {
      window.location.assign('./');
    }, 850);
  };

  // La primera pregunta se presenta inmediatamente al abrir la URL.
  render();

  prev?.addEventListener('click', () => {
    if (!transitioning && idx > 0) {
      idx -= 1;
      render();
    }
  });

})();