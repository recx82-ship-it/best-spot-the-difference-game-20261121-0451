// Keyboard and pointer input. Clicks are reported in the canvas's logical
// (1280x720) coordinates; one-shot keys (start, pause, hint, mute, next)
// are queued as bit flags and taken once by the loop, so a press between
// two frames is never lost and never counted twice.
export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_MUTE = 8;
export const ACTION_NEXT = 16;

const CONFIRM = new Set(['Space', 'Enter']);
const PAUSE = new Set(['KeyP', 'Escape']);
const HINT = new Set(['KeyH']);
const MUTE = new Set(['KeyM']);
const NEXT = new Set(['KeyN']);

export function createInput(canvas, onClick) {
  let actions = 0;

  window.addEventListener('keydown', (event) => {
    if (CONFIRM.has(event.code)) {
      if (!event.repeat) actions |= ACTION_CONFIRM;
    } else if (PAUSE.has(event.code)) {
      if (!event.repeat) actions |= ACTION_PAUSE;
    } else if (HINT.has(event.code)) {
      if (!event.repeat) actions |= ACTION_HINT;
    } else if (MUTE.has(event.code)) {
      if (!event.repeat) actions |= ACTION_MUTE;
    } else if (NEXT.has(event.code)) {
      if (!event.repeat) actions |= ACTION_NEXT;
    } else {
      return;
    }
    event.preventDefault();
  });

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    // Convert device pixels back to logical 1280x720 coordinates.
    const view = canvas.__view;
    if (view) onClick((x - view.x) / view.scale, (y - view.y) / view.scale);
  });

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
  };
}
