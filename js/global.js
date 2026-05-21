// ===== SOUND ENGINE (Web Audio API - no files needed) =====
const SFX = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function tone(freq, type, duration, vol = 0.3, delay = 0) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      gain.gain.setValueAtTime(0, c.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration);
    } catch(e) {}
  }

  return {
    correct() {
      tone(523, 'sine', 0.12, 0.35);
      tone(659, 'sine', 0.12, 0.35, 0.12);
      tone(784, 'sine', 0.2,  0.35, 0.24);
    },
    wrong() {
      tone(300, 'sawtooth', 0.08, 0.2);
      tone(250, 'sawtooth', 0.15, 0.2, 0.1);
    },
    click() {
      tone(800, 'sine', 0.06, 0.15);
    },
    star() {
      [523,659,784,1047].forEach((f,i) => tone(f,'sine',0.15,0.3,i*0.1));
    },
    complete() {
      [392,523,659,784,1047,784,1047].forEach((f,i) => tone(f,'sine',0.18,0.35,i*0.09));
    },
    select() {
      tone(660, 'sine', 0.08, 0.2);
    },
    tab() {
      tone(440, 'triangle', 0.1, 0.2);
    }
  };
})();

// ===== GLOBAL STATE =====
const OVA = {
  progress: JSON.parse(localStorage.getItem('ova2_progress') || '{}'),
  score: parseInt(localStorage.getItem('ova2_score') || '0'),
  saveProgress(moduleId, stars) {
    const prev = this.progress[moduleId] || 0;
    if (stars > prev) {
      this.progress[moduleId] = stars;
      localStorage.setItem('ova2_progress', JSON.stringify(this.progress));
    }
    this.score = Object.values(this.progress).reduce((a, b) => a + b, 0);
    localStorage.setItem('ova2_score', this.score);
    return this.progress[moduleId];
  },
  getStars(moduleId) { return this.progress[moduleId] || 0; },
  reset() { localStorage.removeItem('ova2_progress'); localStorage.removeItem('ova2_score'); location.reload(); }
};

// ===== CHISPA MASCOT SVG =====
function chispaSVG(mood = 'normal', size = 90) {
  const moods = {
    normal:  { eyes: 'M34,38 Q36,34 38,38  M62,38 Q64,34 66,38', mouth: 'M38,58 Q50,68 62,58', brow: '', color1:'#FFE66D', color2:'#FDCB6E' },
    happy:   { eyes: 'M34,36 Q36,30 38,36  M62,36 Q64,30 66,36', mouth: 'M36,56 Q50,72 64,56', brow: '', color1:'#FFE66D', color2:'#FF8B94' },
    wow:     { eyes: 'M32,35 A6,6 0 1 1 44,35  M56,35 A6,6 0 1 1 68,35', mouth: 'M40,62 A10,10 0 1 0 60,62', brow: 'M32,28 L42,26  M58,26 L68,28', color1:'#FFE66D', color2:'#4ECDC4' },
    sad:     { eyes: 'M34,40 Q36,36 38,40  M62,40 Q64,36 66,40', mouth: 'M38,66 Q50,56 62,66', brow: 'M32,30 L42,34  M58,34 L68,30', color1:'#A0C4FF', color2:'#74B9FF' },
    think:   { eyes: 'M34,38 Q36,34 38,38  M62,36 A4,3 0 1 1 70,36', mouth: 'M40,62 Q50,58 55,62', brow: 'M58,28 L70,26', color1:'#FFE66D', color2:'#DFE6E9' },
    cheer:   { eyes: 'M34,36 Q36,30 38,36  M62,36 Q64,30 66,36', mouth: 'M34,55 Q50,75 66,55', brow: 'M30,26 L42,30  M58,30 L70,26', color1:'#FF8B94', color2:'#FF6B6B' },
  };
  const m = moods[mood] || moods.normal;
  return `<svg class="chispa-svg" width="${size}" height="${size}" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="115" rx="22" ry="5" fill="rgba(0,0,0,.1)"/>
  <ellipse cx="50" cy="52" rx="36" ry="38" fill="${m.color1}"/>
  <ellipse cx="50" cy="50" rx="34" ry="36" fill="${m.color2}" opacity=".3"/>
  <ellipse cx="36" cy="30" rx="8" ry="5" fill="rgba(255,255,255,.5)" transform="rotate(-20,36,30)"/>
  <path d="M14,60 Q6,72 14,82" stroke="${m.color1}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M86,60 Q94,72 86,82" stroke="${m.color1}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="${m.eyes}" stroke="#2D3436" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${m.brow ? `<path d="${m.brow}" stroke="#2D3436" stroke-width="3" fill="none" stroke-linecap="round"/>` : ''}
  <ellipse cx="27" cy="55" rx="8" ry="5" fill="#FF8B94" opacity=".5"/>
  <ellipse cx="73" cy="55" rx="8" ry="5" fill="#FF8B94" opacity=".5"/>
  <path d="${m.mouth}" stroke="#2D3436" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <text x="44" y="98" font-size="16" fill="#6C63FF" font-weight="900">⚡</text>
</svg>`;
}

// ===== CHISPA MESSAGES =====
const CHISPA_MSG = {
  correct: ['¡Genial! ¡Lo lograste! 🌟','¡Wow, eres increíble! ✨','¡Perfecto! 🎉','¡Excelente! 🏆','¡Eres un campeón! 🌈','¡Así se hace! 💪'],
  wrong:   ['¡Casi! Inténtalo de nuevo 💪','No te rindas, ¡tú puedes! 🤗','¡Buen intento! Lee la pista 📚','¡Los errores nos enseñan! 😊','¡Ánimo! La práctica hace al maestro 🌟'],
  start:   ['¡Hola! Soy Chispa ⚡ ¡Vamos a aprender!','¡Bienvenido! ¡Hoy aprenderemos algo genial! 🚀','¿Listo para una aventura? 🎯','¡Tú puedes con todo! ✨'],
  finish:  ['¡Lo terminaste! ¡Eres increíble! 🎉','¡Módulo completado! ¡Qué talento! 🌟','¡Aprendiste algo nuevo hoy! 🏆'],
  almost:  ['¡Muy bien! ¡Sigue practicando! 💫','¡Ya casi lo dominas! 🌱','¡Buen trabajo! ¡Vuelve a intentarlo! 🔄'],
};
function chispaMsg(type) {
  const list = CHISPA_MSG[type] || CHISPA_MSG.start;
  return list[Math.floor(Math.random() * list.length)];
}

// ===== CHISPA COMPONENT =====
function renderChispa(containerId, mood = 'normal', msg = null) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const message = msg || chispaMsg(mood === 'happy' ? 'correct' : mood === 'sad' ? 'wrong' : 'start');
  el.innerHTML = `<div class="chispa-wrap">
    ${chispaSVG(mood, 80)}
    <div class="chispa-bubble">${message}</div>
  </div>`;
}

function updateChispa(containerId, mood, msg) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="chispa-wrap">
    ${chispaSVG(mood, 80)}
    <div class="chispa-bubble">${msg || chispaMsg(mood === 'happy' ? 'correct' : mood === 'sad' ? 'wrong' : 'start')}</div>
  </div>`;
}

// ===== CONFETTI BURST =====
function spawnConfetti(x, y) {
  const colors = ['#FF6B6B','#FFE66D','#4ECDC4','#6C63FF','#FF8B94','#A8E6CF'];
  const container = document.body;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = `
      position:fixed; width:10px; height:10px; border-radius:${Math.random()>0.5?'50%':'2px'};
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${x}px; top:${y}px; pointer-events:none; z-index:9999;
      animation: confetti-fly 1s ease-out forwards;
      --dx:${(Math.random()-0.5)*200}px;
      --dy:${-(Math.random()*180+60)}px;
      --rot:${Math.random()*720}deg;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }
}

function spawnConfettiBurst() {
  const w = window.innerWidth, h = window.innerHeight;
  [w*0.25, w*0.5, w*0.75].forEach((x,i) => {
    setTimeout(() => spawnConfetti(x, h*0.4), i*120);
  });
}

// ===== FLOATING SCORE POPUP =====
function showScorePopup(text, color = '#6C63FF') {
  const el = document.createElement('div');
  el.className = 'score-popup';
  el.textContent = text;
  el.style.cssText = `color:${color};`;
  document.body.appendChild(el);
  const pill = document.getElementById('score-pill');
  if (pill) {
    const r = pill.getBoundingClientRect();
    el.style.left = r.left + 'px';
    el.style.top  = r.top  + 'px';
  } else {
    el.style.right = '40px';
    el.style.top = '80px';
  }
  setTimeout(() => el.remove(), 1000);
}

// ===== QUESTION ENGINE =====
class QuizEngine {
  constructor(questions, moduleId, colorClass, rootPath) {
    this.questions = questions;
    this.moduleId = moduleId;
    this.colorClass = colorClass;
    this.rootPath = rootPath || '../..';
    this.current = 0;
    this.answers = new Array(questions.length).fill(null);
    this.score = 0;
    this.done = false;
  }

  render() {
    this.renderProgress();
    this.renderQuestion();
    this.renderNav();
  }

  renderProgress() {
    const el = document.getElementById('quiz-progress');
    if (!el) return;
    const done = this.answers.filter(a => a !== null).length;
    const pct = (done / this.questions.length) * 100;
    el.innerHTML = `<div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>`;
    const pd = document.getElementById('progress-dots');
    if (!pd) return;
    pd.innerHTML = this.questions.map((_, i) => {
      let cls = 'q-dot';
      if (i === this.current) cls += ' current';
      else if (this.answers[i] === true)  cls += ' correct';
      else if (this.answers[i] === false) cls += ' wrong';
      return `<div class="${cls}" onclick="quiz.goTo(${i})">${i + 1}</div>`;
    }).join('');
  }

  renderQuestion() {
    const q = this.questions[this.current];
    const answered = this.answers[this.current] !== null;
    const container = document.getElementById('question-area');
    if (!container) return;

    let html = `<div class="question-card question-animate">${q.q}</div>`;

    if (q.type === 'choice' || !q.type) {
      html += `<div class="options-grid">`;
      const letters = ['A','B','C','D','E'];
      q.opts.forEach((opt, i) => {
        let cls = 'option-btn';
        if (answered) {
          if (i === q.ans) cls += ' correct';
          else if (this.answers[this.current] === false && i === q.selected) cls += ' wrong';
          else cls += ' disabled';
        }
        html += `<button class="${cls}" data-letter="${letters[i]}" ${answered ? 'disabled' : ''} onclick="quiz.answer(${i})">${opt}</button>`;
      });
      html += `</div>`;
    } else if (q.type === 'input') {
      const val = q.userAnswer || '';
      const inputCls = answered ? (this.answers[this.current] ? 'correct' : 'wrong') : '';
      html += `<input id="q-input" class="text-input ${inputCls}" type="text" placeholder="${q.placeholder || 'Escribe aquí...'}" value="${val}" ${answered ? 'disabled' : ''} />`;
      if (!answered) html += `<button class="btn btn-secondary" onclick="quiz.answerInput()">✓ Verificar</button>`;
    }

    if (answered) {
      const ok = this.answers[this.current] === true;
      html += `<div class="explanation-box show ${ok ? 'success' : 'error'}">
        <span class="exp-icon">${ok ? '✅' : '💡'}</span>
        <strong>${ok ? chispaMsg('correct') : chispaMsg('wrong')}</strong>
        <p>${q.exp || ''}</p>
      </div>`;
      if (this.colorClass) updateChispa('chispa-container', ok ? 'happy' : 'sad', ok ? chispaMsg('correct') : chispaMsg('wrong'));
    }

    container.innerHTML = html;
  }

  renderNav() {
    const el = document.getElementById('quiz-nav');
    if (!el) return;
    const total = this.questions.length;
    const answered = this.answers[this.current] !== null;
    const allDone = this.answers.every(a => a !== null);

    el.innerHTML = `
      <div class="q-actions">
        <button class="btn btn-ghost" onclick="quiz.goTo(${this.current - 1})" ${this.current === 0 ? 'disabled' : ''}>← Anterior</button>
        ${answered && !allDone ? `<button class="btn btn-secondary" onclick="quiz.next()">Siguiente →</button>` : ''}
        ${allDone && !this.done ? `<button class="btn btn-primary" onclick="quiz.showResults()">Ver resultados 🏆</button>` : ''}
        ${answered && this.answers[this.current] === false ? `<button class="btn btn-retry" onclick="quiz.retry()">🔄 Reintentar</button>` : ''}
        <button class="btn btn-ghost" onclick="quiz.goTo(${this.current + 1})" ${this.current >= total - 1 ? 'disabled' : ''}>Siguiente →</button>
      </div>`;
  }

  answer(optIndex) {
    if (this.answers[this.current] !== null) return;
    SFX.select();
    const q = this.questions[this.current];
    q.selected = optIndex;
    const correct = optIndex === q.ans;
    this.answers[this.current] = correct;
    if (correct) {
      this.score++;
      setTimeout(() => { SFX.correct(); }, 80);
      const btn = document.querySelectorAll('.option-btn')[optIndex];
      if (btn) {
        const r = btn.getBoundingClientRect();
        spawnConfetti(r.left + r.width/2, r.top + r.height/2);
      }
      showScorePopup('+10 ⭐', '#00B894');
    } else {
      setTimeout(() => SFX.wrong(), 80);
    }
    this.render();
    updateChispa('chispa-container', correct ? 'happy' : 'sad', correct ? chispaMsg('correct') : chispaMsg('wrong'));
    updateScoreDisplay();
  }

  answerInput() {
    const inp = document.getElementById('q-input');
    if (!inp) return;
    const q = this.questions[this.current];
    const val = inp.value.trim().toLowerCase();
    const correct = Array.isArray(q.ans) ? q.ans.some(a => a.toLowerCase() === val) : val === q.ans.toLowerCase();
    q.userAnswer = inp.value;
    this.answers[this.current] = correct;
    if (correct) {
      this.score++;
      SFX.correct();
      spawnConfetti(window.innerWidth/2, window.innerHeight/2);
      showScorePopup('+10 ⭐', '#00B894');
    } else {
      SFX.wrong();
    }
    this.render();
    updateChispa('chispa-container', correct ? 'happy' : 'sad', correct ? chispaMsg('correct') : chispaMsg('wrong'));
    updateScoreDisplay();
  }

  retry() {
    this.answers[this.current] = null;
    this.questions[this.current].selected = undefined;
    this.questions[this.current].userAnswer = undefined;
    SFX.click();
    this.render();
    updateChispa('chispa-container', 'think', '¡Inténtalo de nuevo! Puedes hacerlo 💪');
  }

  goTo(i) {
    if (i < 0 || i >= this.questions.length) return;
    SFX.click();
    this.current = i;
    this.render();
    updateChispa('chispa-container', 'normal', chispaMsg('start'));
  }

  next() {
    if (this.current < this.questions.length - 1) {
      SFX.click();
      this.current++;
      this.render();
    }
  }

  showResults() {
    this.done = true;
    const total = this.questions.length;
    const pct = this.score / total;
    const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
    OVA.saveProgress(this.moduleId, stars);

    if (pct >= 0.7) {
      SFX.complete();
      spawnConfettiBurst();
    } else {
      SFX.wrong();
    }

    const mood = pct >= 0.7 ? 'cheer' : pct >= 0.4 ? 'normal' : 'sad';
    const msg = pct >= 0.9 ? chispaMsg('finish') : pct >= 0.6 ? chispaMsg('almost') : '¡Sigue practicando! 💪';
    updateChispa('chispa-container', mood, msg);

    const reviewHtml = this.questions.map((q, i) => {
      const ok = this.answers[i] === true;
      const selectedTxt = q.type === 'input' ? (q.userAnswer || '—') : (q.opts ? q.opts[q.selected] || '—' : '—');
      const correctTxt  = q.type === 'input' ? (Array.isArray(q.ans) ? q.ans[0] : q.ans) : (q.opts ? q.opts[q.ans] : '—');
      return `<div class="answer-item ${ok ? 'ok' : 'bad'}">
        <span>${ok ? '✅' : '❌'}</span>
        <div>
          <strong>${q.q}</strong><br>
          <span style="font-weight:600;font-size:.85rem;">${ok ? 'Tu respuesta: ' + selectedTxt : 'Tu respuesta: <span style=\'color:var(--error)\'>' + selectedTxt + '</span> → Correcta: <span style=\'color:var(--success)\'>' + correctTxt + '</span>'}</span>
        </div>
      </div>`;
    }).join('');

    const starsHtml = [1,2,3].map(n => `<div class="star ${n <= stars ? 'lit' : ''}">⭐</div>`).join('');
    const btnColor = this.colorClass || 'btn-primary';

    document.getElementById('results-panel').innerHTML = `
      <div class="confetti-burst">${pct >= 0.7 ? '🎉🎊🌟' : '💫'}</div>
      <div class="results-score">${this.score}/${total}</div>
      <div class="results-label">${pct >= 0.9 ? '¡Perfecto! Eres un genio 🏆' : pct >= 0.6 ? '¡Muy bien hecho! 🌟' : '¡Sigue practicando! 💪'}</div>
      <div class="stars-row">${starsHtml}</div>
      <div class="q-actions" style="justify-content:center;margin-bottom:20px;">
        <button class="btn ${btnColor}" onclick="location.href='${this.rootPath}/index.html'">🏠 Inicio</button>
        <button class="btn btn-ghost" onclick="quiz.restartAll()">🔄 Repetir módulo</button>
      </div>
      <div class="answers-review"><h4>📋 Revisión de respuestas:</h4>${reviewHtml}</div>`;
    document.getElementById('results-panel').classList.add('show');
    document.getElementById('results-panel').scrollIntoView({ behavior: 'smooth' });
  }

  restartAll() {
    this.answers = new Array(this.questions.length).fill(null);
    this.questions.forEach(q => { q.selected = undefined; q.userAnswer = undefined; });
    this.score = 0;
    this.done = false;
    this.current = 0;
    SFX.click();
    document.getElementById('results-panel').classList.remove('show');
    this.render();
    updateChispa('chispa-container', 'think', '¡Empecemos de nuevo! Tú puedes 💪');
  }
}

// ===== HELPERS =====
function renderStars(containerId, count) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = [1,2,3].map(n => `<span class="star ${n <= count ? 'lit' : ''}">⭐</span>`).join('');
}

function updateScoreDisplay() {
  document.querySelectorAll('.score-pill').forEach(el => {
    el.textContent = '⭐ ' + OVA.score + ' pts';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateScoreDisplay();

  // Animate cards on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('card-visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.module-card').forEach(c => observer.observe(c));

  // Sound on nav links/tabs
  document.querySelectorAll('.subject-tab, .nav-links a').forEach(el => {
    el.addEventListener('click', () => SFX.tab());
  });
});
