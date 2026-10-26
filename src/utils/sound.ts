// Web Audio API lightweight synthesizer (SFX) + HTML5 Audio (BGM)
class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  public sfxEnabled: boolean = true;
  public bgmEnabled: boolean = true;
  public isBgmPlaying: boolean = false;

  get enabled(): boolean {
    return this.sfxEnabled;
  }
  set enabled(val: boolean) {
    this.sfxEnabled = val;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  private initBgm() {
    if (!this.bgmAudio && typeof window !== 'undefined') {
      this.bgmAudio = new Audio('/audio/Before_the_Strike.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.35; // Suara latar nyaman & tidak memekakkan telinga

      this.bgmAudio.addEventListener('play', () => {
        this.isBgmPlaying = true;
      });
      this.bgmAudio.addEventListener('pause', () => {
        this.isBgmPlaying = false;
      });
    }
  }

  public startBGM() {
    if (!this.bgmEnabled) return;
    this.initBgm();
    if (this.bgmAudio && this.bgmAudio.paused) {
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isBgmPlaying = true;
          })
          .catch(() => {
            // Browser autoplay restrictions require user interaction first
            this.isBgmPlaying = false;
          });
      }
    }
  }

  public pauseBGM() {
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
      this.isBgmPlaying = false;
    }
  }

  public toggleBGM(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBGM();
    } else {
      this.pauseBGM();
    }
    return this.bgmEnabled;
  }

  public setBGMVolume(val: number) {
    if (this.bgmAudio) {
      this.bgmAudio.volume = Math.max(0, Math.min(1, val));
    }
  }

  public playClick() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  public playSelect() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  public playStartGame() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.25);
      });
    } catch {}
  }
}

export const sound = new SoundManager();
