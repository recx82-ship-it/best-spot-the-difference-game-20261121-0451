// The screenshot scenes behind ?shot=start|play|play2|end. Each one sets a
// real game state — a level, a set of differences already found, a clock
// and a score — so the frame is what a genuine game really looks like.
// The same seed always gives the same frame.
import { SCENES } from './scenes.js';
import { LEVEL_TIME } from './config.js';
import { SCREEN_LEVEL, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';

/**
 * Put `state` into the named scene (start, play, play2 or end; any other
 * name is start) and return the scene's name for the page title.
 */
export function stageShot(name, state, seed) {
  if (name === 'play') {
    // Sunny Garden, mid-game: three differences found (rings on both
    // pictures), four still to find, clock running, score on the board.
    state.screen = SCREEN_PLAY;
    state.levelIndex = 0;
    state.scene = SCENES[0];
    state.nextSceneName = SCENES[1].name;
    state.found = new Set([0, 2, 4]);
    state.score = 300;
    state.best = 1250;
    state.timeLeft = 62;
    state.levelTime = LEVEL_TIME;
    state.hintsLeft = 2;
    state.hint = null;
    state.flashes = [];
    state.message = 'Found it — Curtains!  3 of 7';
    state.messageGood = true;
    state.messageUntil = Infinity;
    return 'play';
  }
  if (name === 'play2') {
    // Cosy Kitchen, mid-game: two found, five still hidden.
    state.screen = SCREEN_PLAY;
    state.levelIndex = 1;
    state.scene = SCENES[1];
    state.nextSceneName = SCENES[2].name;
    state.found = new Set([1, 5]);
    state.score = 900;
    state.best = 1250;
    state.timeLeft = 74;
    state.levelTime = LEVEL_TIME;
    state.hintsLeft = 3;
    state.hint = { index: 3, until: Infinity };
    state.flashes = [];
    state.message = 'Found it — Cat!  2 of 7';
    state.messageGood = true;
    state.messageUntil = Infinity;
    return 'play2';
  }
  if (name === 'end') {
    // The win screen after all five scenes, with the final score.
    state.screen = SCREEN_WIN;
    state.levelIndex = 4;
    state.scene = SCENES[4];
    state.nextSceneName = '';
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.score = 4150;
    state.best = 4150;
    state.timeLeft = 23;
    state.levelTime = LEVEL_TIME;
    state.hintsLeft = 0;
    state.hint = null;
    state.flashes = [];
    state.message = '';
    return 'end';
  }
  if (name === 'level') {
    // A level-complete screen, shown after Sunny Garden.
    state.screen = SCREEN_LEVEL;
    state.levelIndex = 0;
    state.scene = SCENES[0];
    state.nextSceneName = SCENES[1].name;
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.score = 940;
    state.best = 1250;
    state.timeLeft = 24;
    state.levelTime = LEVEL_TIME;
    state.hintsLeft = 3;
    state.hint = null;
    state.flashes = [];
    state.message = '';
    return 'level';
  }
  // Start: the title screen over the garden pictures, dimmed.
  state.screen = SCREEN_TITLE;
  state.levelIndex = 0;
  state.scene = SCENES[0];
  state.nextSceneName = SCENES[1].name;
  state.found = new Set();
  state.score = 0;
  state.best = 1250;
  state.timeLeft = LEVEL_TIME;
  state.levelTime = LEVEL_TIME;
  state.hintsLeft = 3;
  state.hint = null;
  state.flashes = [];
  state.message = '';
  return 'start';
}
