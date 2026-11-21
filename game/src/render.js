// Drawing only: the game state and the current screen in, pixels out.
// The 1280x720 playfield is scaled to fit the window and centred, the
// margin filled with the backdrop colour. Both pictures are drawn from the
// scene's own draw function, variant 0 on the left and variant 1 on the
// right, then green rings mark the differences already found.
import { FIELD, FOOTER, FONT, HEADER, PALETTE, PANEL } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL = 'level';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

const PANEL_LABELS = ['Picture A', 'Picture B'];

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio);
    const height = Math.round(window.innerHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
    canvas.__view = view;
  }

  const fonts = new Map();
  function text(value, x, y, size, color, align = 'left', weight = 'bold') {
    const key = `${weight} ${size}`;
    if (!fonts.has(key)) fonts.set(key, `${weight} ${size}px ${FONT}`);
    context.font = fonts.get(key);
    context.fillStyle = color;
    context.textAlign = align;
    context.textBaseline = 'alphabetic';
    context.fillText(value, x, y);
  }

  function panelOrigin(side) {
    return { x: side === 0 ? PANEL.leftX : PANEL.rightX, y: PANEL.y };
  }

  function drawPicture(scene, side, found, hint, flashes, now) {
    const origin = panelOrigin(side);
    context.save();
    context.beginPath();
    context.rect(origin.x, origin.y, PANEL.width, PANEL.height);
    context.clip();
    context.translate(origin.x, origin.y);
    scene.draw(context, side);
    context.restore();
    // Border and a label chip inside the picture's top-left corner.
    context.strokeStyle = PALETTE.panelBorder;
    context.lineWidth = 3;
    context.strokeRect(origin.x, origin.y, PANEL.width, PANEL.height);
    context.fillStyle = 'rgba(13, 16, 23, 0.78)';
    context.fillRect(origin.x + 8, origin.y + 8, 108, 28);
    text(PANEL_LABELS[side], origin.x + 16, origin.y + 28, 17, PALETTE.text);
    // Green rings on the differences already found.
    for (const index of found) {
      const d = scene.diffs[index];
      context.strokeStyle = PALETTE.good;
      context.lineWidth = 4;
      context.beginPath();
      context.arc(origin.x + d.x, origin.y + d.y, d.r + 5, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = PALETTE.good;
      context.font = `bold 15px ${FONT}`;
      context.textAlign = 'center';
      context.fillText('✓', origin.x + d.x, origin.y + d.y - d.r - 10);
    }
    // Pulsing hint ring.
    if (hint && hint.index >= 0 && hint.until > now) {
      const d = scene.diffs[hint.index];
      const pulse = 1 + 0.12 * Math.sin(now * 6);
      context.strokeStyle = PALETTE.hint;
      context.lineWidth = 3;
      context.setLineDash([8, 6]);
      context.beginPath();
      context.arc(origin.x + d.x, origin.y + d.y, (d.r + 8) * pulse, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
    }
    // Wrong-click flashes (red X) on this side only.
    for (const flash of flashes) {
      if (flash.side !== side || flash.until <= now) continue;
      const fx = origin.x + flash.x;
      const fy = origin.y + flash.y;
      const a = Math.min(1, (flash.until - now) / 0.3);
      context.strokeStyle = `rgba(248, 113, 113, ${a})`;
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(fx - 14, fy - 14);
      context.lineTo(fx + 14, fy + 14);
      context.moveTo(fx + 14, fy - 14);
      context.lineTo(fx - 14, fy + 14);
      context.stroke();
    }
  }

  function drawHeader(state) {
    context.fillStyle = PALETTE.header;
    context.fillRect(0, 0, FIELD.width, HEADER.height);
    text('DOUBLE TAKE', 24, 42, 30, PALETTE.accent);
    text('spot the difference', 232, 42, 18, PALETTE.muted);
    text(`Level ${state.levelIndex + 1} of ${state.levelCount} — ${state.scene.name}`, FIELD.width / 2, 42, 20, PALETTE.text, 'center');
    const low = state.timeLeft <= 15 && state.screen === SCREEN_PLAY;
    text(`⏱ ${fmtTime(state.timeLeft)}`, FIELD.width - 320, 42, 24, low ? PALETTE.timerLow : PALETTE.text, 'right');
    text(`Score ${state.score}`, FIELD.width - 24, 42, 24, PALETTE.text, 'right');
    // Timer bar.
    const frac = Math.max(0, state.timeLeft / state.levelTime);
    context.fillStyle = '#2a3040';
    context.fillRect(0, HEADER.height - 6, FIELD.width, 6);
    context.fillStyle = low ? PALETTE.timerLow : PALETTE.accent;
    context.fillRect(0, HEADER.height - 6, FIELD.width * frac, 6);
  }

  function drawFooter(state) {
    const y = FOOTER.y;
    const found = state.found.size;
    const total = state.scene.diffs.length;
    text(`Found ${found} of ${total}`, 24, y + 34, 30, found === total ? PALETTE.good : PALETTE.text);
    // Pips for each difference.
    for (let i = 0; i < total; i += 1) {
      const cx = 260 + i * 34;
      context.fillStyle = state.found.has(i) ? PALETTE.good : '#2a3040';
      context.beginPath();
      context.arc(cx, y + 24, 11, 0, Math.PI * 2);
      context.fill();
      if (state.found.has(i)) text('✓', cx, y + 29, 13, '#0d1017', 'center');
    }
    text(`Hints ${state.hintsLeft}  (H)`, 540, y + 34, 20, PALETTE.muted);
    text(`Best ${state.best}`, FIELD.width - 24, y + 34, 20, PALETTE.muted, 'right');
    // The help line and the message share the second row: the message wins.
    if (state.message) text(state.message, FIELD.width / 2, y + 78, 22, state.messageGood ? PALETTE.good : PALETTE.bad, 'center');
    else text('Click a difference in either picture  •  H hint  •  P pause  •  M sound', FIELD.width / 2, y + 78, 18, PALETTE.muted, 'center');
  }

  function drawPanel(title, lines, prompt, accent = PALETTE.accent) {
    const width = 640;
    const height = 120 + lines.length * 36 + 70;
    const x = (FIELD.width - width) / 2;
    const y = (FIELD.height - height) / 2;
    context.fillStyle = 'rgba(13, 16, 23, 0.94)';
    context.fillRect(x, y, width, height);
    context.strokeStyle = PALETTE.panelBorder;
    context.lineWidth = 2;
    context.strokeRect(x, y, width, height);
    text(title, FIELD.width / 2, y + 64, 44, PALETTE.text, 'center');
    for (let i = 0; i < lines.length; i += 1) {
      text(lines[i], FIELD.width / 2, y + 118 + i * 36, 21, '#c7cdd9', 'center');
    }
    text(prompt, FIELD.width / 2, y + height - 34, 22, accent, 'center');
  }

  function draw(state, now) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = PALETTE.backdrop;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);

    drawHeader(state);
    const showPictures = state.screen !== SCREEN_TITLE;
    if (showPictures) {
      drawPicture(state.scene, 0, state.found, state.hint, state.flashes, now);
      drawPicture(state.scene, 1, state.found, state.hint, state.flashes, now);
      drawFooter(state);
    } else {
      // Title screen: the pictures show behind the panel, dimmed.
      context.save();
      context.globalAlpha = 0.45;
      drawPicture(state.scene, 0, new Set(), null, [], now);
      drawPicture(state.scene, 1, new Set(), null, [], now);
      context.restore();
    }

    if (state.screen === SCREEN_TITLE) {
      drawPanel(
        'DOUBLE TAKE',
        [
          'Two pictures, seven differences. Find them all before the clock runs out!',
          'Click a difference in either picture — a green ring marks each one you spot.',
          'A wrong click costs 5 seconds. H shows a hint (3 per level, −50 points).',
          'Five scenes: Sunny Garden, Cosy Kitchen, Moonlit Camp, Toy Room, Snowy Village.',
        ],
        'Press Space or click to start',
      );
    } else if (state.screen === SCREEN_PAUSED) {
      drawPanel('Paused', ['Take a breath — the clock is stopped.'], 'Press P or click to resume');
    } else if (state.screen === SCREEN_LEVEL) {
      const bonus = Math.ceil(state.timeLeft) * 10;
      drawPanel(
        `Level ${state.levelIndex + 1} complete!`,
        [
          `All 7 differences found in ${state.scene.name}.`,
          `Time bonus +${bonus}  •  Score ${state.score}`,
          state.levelIndex + 1 < state.levelCount ? `Next up: ${state.nextSceneName}` : 'That was the last scene!',
        ],
        state.levelIndex + 1 < state.levelCount ? 'Press N or click for the next level' : 'Press N or click to see your score',
      );
    } else if (state.screen === SCREEN_OVER) {
      drawPanel(
        'Time up!',
        [
          `You found ${state.found.size} of ${state.scene.diffs.length} differences in ${state.scene.name}.`,
          `Score ${state.score}  •  Best ${state.best}`,
        ],
        'Press Space or click to try again',
      );
    } else if (state.screen === SCREEN_WIN) {
      drawPanel(
        'You found them all!',
        [
          'Every difference in all five scenes — nicely spotted.',
          `Final score ${state.score}  •  Best ${state.best}`,
          state.score >= state.best && state.score > 0 ? 'A new best score!' : 'Can you beat your best next time?',
        ],
        'Press Space or click to play again',
      );
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw, panelOrigin };
}
