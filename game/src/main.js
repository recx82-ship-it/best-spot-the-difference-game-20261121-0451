// Boot and the one loop: input is read every frame, the clock ticks while
// playing, and the renderer paints what is there. The game moves between
// six screens: title, play, paused, level complete, time up and win.
//
// ?shot=start|play|play2|end (with &seed=N) stages that scene instead of
// running the loop, paints it twice and sets window.__shotReady for a
// screenshot — the frame is a real game state, not a mock-up.
import { BEST_KEY, FIELD, HINTS_PER_LEVEL, HINT_COST, LEVEL_TIME, PANEL, POINTS_PER_DIFF, TIME_BONUS_PER_SECOND, WRONG_PENALTY } from './config.js';
import { SCENES } from './scenes.js';
import { createAudio } from './audio.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_NEXT, ACTION_PAUSE, createInput } from './input.js';
import { SCREEN_LEVEL, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN, createRenderer } from './render.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : 1;

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const audio = createAudio();
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best then lasts this visit only.
  }
}

function freshState() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    levelCount: SCENES.length,
    scene: SCENES[0],
    nextSceneName: SCENES[1].name,
    found: new Set(),
    score: 0,
    best: readBest(),
    timeLeft: LEVEL_TIME,
    levelTime: LEVEL_TIME,
    hintsLeft: HINTS_PER_LEVEL,
    hint: null,
    flashes: [],
    message: '',
    messageGood: true,
    messageUntil: 0,
  };
}

const state = freshState();

function announce(message) {
  status.textContent = message;
}

function showMessage(message, good, seconds = 2.5) {
  state.message = message;
  state.messageGood = good;
  state.messageUntil = performance.now() / 1000 + seconds;
}

function startLevel(index) {
  state.levelIndex = index;
  state.scene = SCENES[index];
  state.nextSceneName = index + 1 < SCENES.length ? SCENES[index + 1].name : '';
  state.found = new Set();
  state.timeLeft = LEVEL_TIME;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hint = null;
  state.flashes = [];
  state.message = '';
  state.screen = SCREEN_PLAY;
  announce(`Level ${index + 1}: ${state.scene.name}. Find 7 differences.`);
}

function startGame() {
  state.score = 0;
  startLevel(0);
}

function finishLevel() {
  const bonus = Math.ceil(state.timeLeft) * TIME_BONUS_PER_SECOND;
  state.score += bonus;
  state.screen = SCREEN_LEVEL;
  audio.levelClear();
  announce(`Level complete. Time bonus ${bonus}. Score ${state.score}.`);
}

function finishGame() {
  state.screen = SCREEN_WIN;
  if (state.score > state.best) {
    state.best = state.score;
    saveBest(state.best);
  }
  audio.win();
  announce(`You found them all! Final score ${state.score}.`);
}

function timeUp() {
  state.screen = SCREEN_OVER;
  if (state.score > state.best) {
    state.best = state.score;
    saveBest(state.best);
  }
  audio.wrong();
  announce(`Time up. Score ${state.score}.`);
}

/** Which panel (0 left, 1 right) a logical point is in, and its scene coords. */
function pickPanel(x, y) {
  if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
  if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) {
    return { side: 0, sx: x - PANEL.leftX, sy: y - PANEL.y };
  }
  if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) {
    return { side: 1, sx: x - PANEL.rightX, sy: y - PANEL.y };
  }
  return null;
}

function handleClick(x, y) {
  audio.unlock();
  if (state.screen === SCREEN_TITLE) {
    startGame();
    return;
  }
  if (state.screen === SCREEN_PAUSED) {
    state.screen = SCREEN_PLAY;
    return;
  }
  if (state.screen === SCREEN_LEVEL) {
    if (state.levelIndex + 1 < SCENES.length) startLevel(state.levelIndex + 1);
    else finishGame();
    return;
  }
  if (state.screen === SCREEN_OVER || state.screen === SCREEN_WIN) {
    startGame();
    return;
  }
  if (state.screen !== SCREEN_PLAY) return;

  const pick = pickPanel(x, y);
  if (!pick) return;
  const now = performance.now() / 1000;
  const diffs = state.scene.diffs;
  for (let i = 0; i < diffs.length; i += 1) {
    if (state.found.has(i)) continue;
    const d = diffs[i];
    const dx = pick.sx - d.x;
    const dy = pick.sy - d.y;
    if (dx * dx + dy * dy <= (d.r + 6) * (d.r + 6)) {
      state.found.add(i);
      state.score += POINTS_PER_DIFF;
      state.flashes = state.flashes.filter((f) => f.until > now);
      audio.found();
      showMessage(`Found it — ${d.label}!  ${state.found.size} of ${diffs.length}`, true);
      announce(`Found ${d.label}. ${state.found.size} of ${diffs.length}.`);
      if (state.found.size === diffs.length) finishLevel();
      return;
    }
  }
  // A wrong click: lose time and mark the spot.
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY);
  state.flashes.push({ side: pick.side, x: pick.sx, y: pick.sy, until: now + 0.6 });
  audio.wrong();
  showMessage(`Not a difference — 5 seconds lost!`, false);
  announce('Not a difference. 5 seconds lost.');
}

function useHint() {
  if (state.screen !== SCREEN_PLAY) return;
  if (state.hintsLeft <= 0) {
    showMessage('No hints left on this level.', false);
    return;
  }
  const remaining = state.scene.diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  state.hint = { index: pick, until: performance.now() / 1000 + 3 };
  audio.hint();
  showMessage(`Hint: look inside the blue ring (−${HINT_COST} points)`, true);
  announce('Hint shown.');
}

function runShot(name) {
  const staged = stageShot(name, state, seed);
  let painted = 0;
  function paint() {
    renderer.draw(state, performance.now() / 1000);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else {
      window.__shotReady = true;
      document.title = `Double Take — ${staged}`;
    }
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, handleClick);
  let last = performance.now();
  let lastWholeSecond = Math.ceil(LEVEL_TIME);

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_MUTE) {
      const muted = audio.toggleMute();
      showMessage(muted ? 'Sound off' : 'Sound on', true, 1.2);
      return;
    }
    if (actions & ACTION_CONFIRM) {
      if (state.screen === SCREEN_TITLE || state.screen === SCREEN_OVER || state.screen === SCREEN_WIN) startGame();
      else if (state.screen === SCREEN_PAUSED) state.screen = SCREEN_PLAY;
      else if (state.screen === SCREEN_LEVEL) {
        if (state.levelIndex + 1 < SCENES.length) startLevel(state.levelIndex + 1);
        else finishGame();
      }
    }
    if (actions & ACTION_PAUSE) {
      if (state.screen === SCREEN_PLAY) {
        state.screen = SCREEN_PAUSED;
        announce('Paused.');
      } else if (state.screen === SCREEN_PAUSED) {
        state.screen = SCREEN_PLAY;
        announce('Playing.');
      }
    }
    if (actions & ACTION_HINT) useHint();
    if (actions & ACTION_NEXT && state.screen === SCREEN_LEVEL) {
      if (state.levelIndex + 1 < SCENES.length) startLevel(state.levelIndex + 1);
      else finishGame();
    }
  }

  function frame(nowMs) {
    requestAnimationFrame(frame);
    const now = nowMs / 1000;
    const dt = Math.min(0.25, (nowMs - last) / 1000);
    last = nowMs;
    handleActions();
    if (state.screen === SCREEN_PLAY) {
      state.timeLeft -= dt;
      const whole = Math.ceil(state.timeLeft);
      if (whole !== lastWholeSecond) {
        lastWholeSecond = whole;
        if (whole <= 5 && whole > 0) audio.tick();
      }
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        timeUp();
      }
    }
    if (state.message && now > state.messageUntil) state.message = '';
    if (state.hint && now > state.hint.until) state.hint = null;
    state.flashes = state.flashes.filter((f) => f.until > now);
    renderer.draw(state, now);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.screen === SCREEN_PLAY) {
      state.screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Double Take. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
