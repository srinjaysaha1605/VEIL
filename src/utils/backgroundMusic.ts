/**
 * Background Music Manager for VEIL
 * Pulls directly from /music.mp3 in public folder.
 * Fallbacks to an ambient cyber-pad synthesizer if music.mp3 is not yet present.
 */

class BackgroundMusicController {
  private audioElement: HTMLAudioElement | null = null;
  private isPlayingMusic: boolean = false;
  private volume: number = 0.18; // Low, non-intrusive background volume
  private synthAudioCtx: AudioContext | null = null;
  private synthGainNode: GainNode | null = null;
  private synthOscillators: OscillatorNode[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio('/music.mp3');
      this.audioElement.loop = true;
      this.audioElement.volume = this.volume;

      // Handle audio loading or error
      this.audioElement.addEventListener('error', () => {
        // music.mp3 not found or unplayable, synth fallback ready
      });
    }
  }

  /**
   * Start playing background music after user interaction
   */
  public startMusic(): void {
    if (!this.audioElement) return;

    // Try playing HTML5 audio from public/music.mp3
    this.audioElement
      .play()
      .then(() => {
        this.isPlayingMusic = true;
      })
      .catch(() => {
        // If music.mp3 fails (e.g. 404), activate atmospheric synth loop fallback
        this.startSynthAmbient();
      });
  }

  /**
   * Toggle music on or off
   */
  public toggleMusic(): boolean {
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public stopMusic(): void {
    this.isPlayingMusic = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthAmbient();
  }

  public getIsPlaying(): boolean {
    return this.isPlayingMusic;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    if (this.synthGainNode && this.synthAudioCtx) {
      this.synthGainNode.gain.setValueAtTime(this.volume * 0.15, this.synthAudioCtx.currentTime);
    }
  }

  /**
   * Procedural dark ambient background pad synthesizer fallback
   */
  private startSynthAmbient(): void {
    if (typeof window === 'undefined') return;
    if (this.synthAudioCtx) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.synthAudioCtx = new AudioCtx();
      const ctx = this.synthAudioCtx;

      this.synthGainNode = ctx.createGain();
      this.synthGainNode.gain.setValueAtTime(this.volume * 0.12, ctx.currentTime);
      this.synthGainNode.connect(ctx.destination);

      // Deep minor chord frequencies for ambient dark vibe (C2, G2, Eb3)
      const freqs = [65.41, 98.0, 155.56];
      this.synthOscillators = freqs.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);

        osc.connect(filter);
        filter.connect(this.synthGainNode!);
        osc.start();
        return osc;
      });

      this.isPlayingMusic = true;
    } catch {
      // AudioContext disallowed or failed
    }
  }

  private stopSynthAmbient(): void {
    if (this.synthOscillators.length > 0) {
      this.synthOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.synthOscillators = [];
    }
    if (this.synthAudioCtx) {
      try {
        this.synthAudioCtx.close();
      } catch {
        // ignore
      }
      this.synthAudioCtx = null;
    }
  }
}

export const bgMusic = new BackgroundMusicController();
