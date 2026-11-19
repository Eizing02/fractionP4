/**
 * soundFx.js
 * Gentle, classroom-friendly synthesized Web Audio sound effects.
 * Zero external audio assets; respects mute toggle gracefully.
 */

class SoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  ensureContext() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) this.tap();
    return this.enabled;
  }

  playTone(freq, duration = 0.12, type = 'sine', volume = 0.12, delay = 0) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  tap() {
    this.playTone(520, 0.06, 'triangle', 0.08);
  }

  slice() {
    // Crisp light snick sound for slicing jelly
    this.playTone(680, 0.07, 'triangle', 0.09, 0);
    this.playTone(920, 0.08, 'sine', 0.07, 0.04);
  }

  match() {
    // Bright rising fifth when denominators become equal
    this.playTone(523.25, 0.14, 'sine', 0.11, 0);
    this.playTone(659.25, 0.14, 'sine', 0.11, 0.08);
    this.playTone(783.99, 0.22, 'sine', 0.12, 0.16);
  }

  merge() {
    // Cheerful arpeggio when combining/scooping jelly
    this.playTone(440, 0.11, 'triangle', 0.1, 0);
    this.playTone(554.37, 0.11, 'triangle', 0.1, 0.07);
    this.playTone(659.25, 0.16, 'sine', 0.11, 0.14);
    this.playTone(880, 0.25, 'sine', 0.11, 0.22);
  }

  gentleNudge() {
    // Soft neutral wooden bump (never harsh buzzer!)
    this.playTone(260, 0.1, 'triangle', 0.08, 0);
    this.playTone(220, 0.12, 'triangle', 0.07, 0.08);
  }

  celebrate() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.playTone(n, 0.2, 'sine', 0.11, i * 0.08);
    });
  }
}

export const soundFx = new SoundFX();
