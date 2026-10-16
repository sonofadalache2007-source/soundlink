/**
 * Interactive Studio Audio Synthesizer Engine
 * Uses Web Audio API to generate realistic audio playback
 * for A/B preview (Raw vs Mastered) without external asset dependencies.
 */

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private mode: 'raw' | 'master' = 'master';
  private timer: number | null = null;
  private currentTime = 102; // Initial 01:42 (102s) out of 210s (03:30)
  private totalDuration = 210;
  private onTimeUpdate?: (time: number) => void;
  private onPlaybackEnd?: () => void;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private stepIndex = 0;

  // Modern R&B / Pop Chord progression: Dm9 - Bbmaj7 - Gm7 - Am7
  private chords = [
    [146.83, 220.00, 261.63, 329.63], // Dm9
    [116.54, 174.61, 220.00, 293.66], // Bbmaj7
    [98.00, 146.83, 174.61, 261.63],  // Gm7
    [110.00, 164.81, 220.00, 329.63], // Am7
  ];
  private bassNotes = [73.42, 58.27, 49.00, 55.00];

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private setupGraph() {
    const ctx = this.getAudioContext();
    if (this.masterGain) return;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.35, ctx.currentTime);

    // Warm Analog style Compressor
    this.compressorNode = ctx.createDynamicsCompressor();
    this.compressorNode.threshold.setValueAtTime(-24, ctx.currentTime);
    this.compressorNode.knee.setValueAtTime(30, ctx.currentTime);
    this.compressorNode.ratio.setValueAtTime(12, ctx.currentTime);
    this.compressorNode.attack.setValueAtTime(0.003, ctx.currentTime);
    this.compressorNode.release.setValueAtTime(0.25, ctx.currentTime);

    // Filter Node for Raw vs Mastered toggle
    this.filterNode = ctx.createBiquadFilter();
    this.applyModeSettings();

    this.filterNode.connect(this.compressorNode);
    this.compressorNode.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);
  }

  public setMode(mode: 'raw' | 'master') {
    this.mode = mode;
    this.applyModeSettings();
  }

  private applyModeSettings() {
    if (!this.filterNode || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.mode === 'raw') {
      // Raw: Bandpass / telephone-ish dry vocal stem sound, no wide stereo or punch
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.setTargetAtTime(1000, now, 0.05);
      this.filterNode.Q.setTargetAtTime(1.5, now, 0.05);
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0.28, now, 0.05);
      }
    } else {
      // Master: Full broadband punch, pristine high-end air & rich lows
      this.filterNode.type = 'peaking';
      this.filterNode.frequency.setTargetAtTime(3200, now, 0.05);
      this.filterNode.gain.setTargetAtTime(4, now, 0.05);
      this.filterNode.Q.setTargetAtTime(1.0, now, 0.05);
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0.4, now, 0.05);
      }
    }
  }

  private triggerSynthBeat() {
    if (!this.isPlaying) return;
    const ctx = this.getAudioContext();
    const chordIndex = Math.floor(this.stepIndex / 4) % this.chords.length;
    const chord = this.chords[chordIndex];
    const bass = this.bassNotes[chordIndex];
    const beatInBar = this.stepIndex % 4;

    // Kick / Sub on beat 0 and 2
    if (beatInBar === 0 || beatInBar === 2) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      if (this.filterNode) gain.connect(this.filterNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }

    // Hi-hat / Percussion on every beat + syncopation
    {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(5000 + (beatInBar * 500), ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      if (this.filterNode) gain.connect(this.filterNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }

    // Chord Pad (Warm Rhodes / Synth)
    if (beatInBar === 0) {
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(gain);
        if (this.filterNode) gain.connect(this.filterNode);
        osc.start();
        osc.stop(ctx.currentTime + 1.25);
      });

      // Bass note
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bass, ctx.currentTime);
      bassGain.gain.setValueAtTime(0.09, ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 1.1);

      bassOsc.connect(bassGain);
      if (this.filterNode) bassGain.connect(this.filterNode);
      bassOsc.start();
      bassOsc.stop(ctx.currentTime + 1.15);
    }

    this.stepIndex++;
  }

  public play(onUpdate?: (time: number) => void, onEnd?: () => void) {
    if (this.isPlaying) return;
    this.setupGraph();
    this.isPlaying = true;
    this.onTimeUpdate = onUpdate;
    this.onPlaybackEnd = onEnd;

    // Tick every 320ms (~94 BPM quarter note)
    const tickInterval = 320;
    this.timer = window.setInterval(() => {
      this.triggerSynthBeat();
      this.currentTime += 0.32;
      if (this.currentTime >= this.totalDuration) {
        this.currentTime = 0;
      }
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentTime);
      }
    }, tickInterval);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(this.totalDuration, seconds));
    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.currentTime);
    }
  }

  public seekRelative(delta: number) {
    this.seek(this.currentTime + delta);
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getTotalDuration(): number {
    return this.totalDuration;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const studioAudio = new StudioAudioEngine();

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
