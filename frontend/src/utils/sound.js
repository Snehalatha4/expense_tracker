// Cute Web Audio API Sound Synthesizers (100% offline, lightweight, no external files)

class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  // Cute coin deposit sound (when adding savings to a goal)
  playCoin() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Audio autoplay policy or failure - fail silently
    }
  }

  // Joyful celebratory victory fanfare (when a target is reached / winning!)
  playVictoryFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const notes = [
        { f: 523.25, time: 0, dur: 0.12 }, // C5
        { f: 659.25, time: 0.12, dur: 0.12 }, // E5
        { f: 783.99, time: 0.24, dur: 0.14 }, // G5
        { f: 1046.50, time: 0.38, dur: 0.3 }, // C6
        { f: 1318.51, time: 0.65, dur: 0.5 } // E6 (grand finale!)
      ];

      const baseNow = this.ctx.currentTime + 0.05;

      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, baseNow + n.time);

        gain.gain.setValueAtTime(0.2, baseNow + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, baseNow + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(baseNow + n.time);
        osc.stop(baseNow + n.time + n.dur);
      });
    } catch (e) {
      // Audio autoplay policy or failure - fail silently
    }
  }
}

export const sound = new SoundFX();
