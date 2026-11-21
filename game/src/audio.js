// Tiny synthesized sounds (Web Audio, no audio files): a happy chime when
// a difference is found, a low buzz for a wrong click, a fanfare for a
// finished level. The context is created on the first user gesture, so
// browsers never block it.
export function createAudio() {
  let context = null;
  let muted = false;

  function ensure() {
    if (!context) {
      try {
        context = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        context = null;
      }
    }
    if (context && context.state === 'suspended') context.resume();
    return context;
  }

  function tone(freq, start, duration, type = 'sine', volume = 0.12) {
    if (muted) return;
    const ac = ensure();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ac.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + start);
    osc.stop(ac.currentTime + start + duration);
  }

  return {
    unlock() {
      ensure();
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    click() {
      tone(660, 0, 0.06, 'triangle', 0.06);
    },
    found() {
      tone(523, 0, 0.12, 'sine', 0.12);
      tone(659, 0.08, 0.12, 'sine', 0.12);
      tone(784, 0.16, 0.2, 'sine', 0.12);
    },
    wrong() {
      tone(160, 0, 0.18, 'sawtooth', 0.08);
      tone(120, 0.1, 0.2, 'sawtooth', 0.08);
    },
    hint() {
      tone(880, 0, 0.1, 'sine', 0.08);
      tone(1175, 0.08, 0.14, 'sine', 0.08);
    },
    levelClear() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.22, 'triangle', 0.12));
    },
    win() {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.13, 0.26, 'triangle', 0.12));
    },
    tick() {
      tone(980, 0, 0.05, 'square', 0.04);
    },
  };
}
