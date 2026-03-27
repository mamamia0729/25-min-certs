// ========================================
// 25 Min Certs — Interactivity
// ========================================

// --- Diagram replay ---
function replay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const clone = el.cloneNode(true);
  el.parentNode.replaceChild(clone, el);
  if (id === 'compare1') startClickCounter();
}

// --- Click counter for "10 Servers" diagram ---
function startClickCounter() {
  const counter = document.getElementById('clickCount');
  if (!counter) return;
  const delays = [800, 2000, 3200, 4400, 5600, 6800, 8000, 9200, 10400, 11600];
  delays.forEach((ms, i) => {
    setTimeout(() => {
      counter.textContent = `click ${i + 1} of 10...`;
      if (i === 9) {
        setTimeout(() => { counter.textContent = 'finally done.'; }, 800);
      }
    }, ms);
  });
}
// Auto-start if the diagram exists on the page
if (document.getElementById('clickCount')) startClickCounter();

// --- Flashcard toggle ---
document.addEventListener('click', function(e) {
  const card = e.target.closest('.flashcard');
  if (card) {
    card.classList.toggle('flipped');
  }
});

// --- Flashcard deck navigation ---
document.querySelectorAll('.flashcard-deck').forEach(deck => {
  const cards = deck.querySelectorAll('.flashcard');
  const counter = deck.querySelector('.flashcard-counter');
  const prevBtn = deck.querySelector('.fc-prev');
  const nextBtn = deck.querySelector('.fc-next');
  let current = 0;

  if (cards.length <= 1) return;

  function showCard(idx) {
    cards.forEach((c, i) => {
      c.style.display = i === idx ? 'block' : 'none';
      c.classList.remove('flipped');
    });
    if (counter) counter.textContent = `${idx + 1} / ${cards.length}`;
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === cards.length - 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (current > 0) showCard(--current);
  });

  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (current < cards.length - 1) showCard(++current);
  });

  showCard(0);
});

// --- 25-Minute Timer ---
document.querySelectorAll('.timer-bar').forEach(timer => {
  const display = timer.querySelector('.timer-display');
  const btn = timer.querySelector('.timer-btn');
  let seconds = 25 * 60;
  let interval = null;
  let running = false;

  function format(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  display.textContent = format(seconds);

  btn.addEventListener('click', () => {
    if (running) {
      clearInterval(interval);
      btn.textContent = 'Resume';
      running = false;
    } else {
      running = true;
      btn.textContent = 'Pause';
      interval = setInterval(() => {
        seconds--;
        display.textContent = format(seconds);
        if (seconds <= 0) {
          clearInterval(interval);
          display.textContent = "Done!";
          btn.textContent = 'Reset';
          btn.onclick = () => {
            seconds = 25 * 60;
            display.textContent = format(seconds);
            btn.textContent = 'Start';
            running = false;
          };
        }
      }, 1000);
    }
  });
});
