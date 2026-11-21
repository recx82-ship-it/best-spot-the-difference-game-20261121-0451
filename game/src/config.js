// Every tuning number and colour in one place. The playfield is a fixed
// 1280x720 logical area; the renderer scales it to the window, so no rule
// below depends on the screen size. Each picture panel is 600x440 and the
// scenes are drawn in that same 600x440 space, so a difference's (x, y)
// is its spot in either picture.
export const FIELD = { width: 1280, height: 720 };

export const HEADER = { height: 64 };
export const PANEL = { width: 600, height: 440, y: 76, leftX: 20, rightX: 660 };
export const FOOTER = { y: 528 };

export const LEVEL_TIME = 90; // seconds on the clock for each level
export const WRONG_PENALTY = 5; // seconds lost on a wrong click
export const HINTS_PER_LEVEL = 3;
export const HINT_COST = 50;
export const POINTS_PER_DIFF = 100;
export const TIME_BONUS_PER_SECOND = 10;

export const PALETTE = {
  backdrop: '#141821',
  header: '#1d2330',
  panel: '#0d1017',
  panelBorder: '#3a4356',
  text: '#f2f4f8',
  muted: '#9aa3b5',
  accent: '#ffd166',
  good: '#4ade80',
  bad: '#f87171',
  hint: '#38bdf8',
  timerLow: '#f87171',
  button: '#2b6cb0',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'double-take.best';
