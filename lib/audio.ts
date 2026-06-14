"use client";

class AudioSystem {
  context: AudioContext | null = null;
  masterGain: GainNode | null = null;

  init() {
    if (typeof window === "undefined") return;
    if (!this.context) {
      const WebkitAudioContext = (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.context = new (window.AudioContext || WebkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.masterGain.gain.value = 0.6; // Master volume
    }
    if (this.context.state === "suspended") {
      this.context.resume();
    }
  }

  // Very subtle high-end glass tick for hovers
  playHover() {
    if (!this.context || !this.masterGain) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.015, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.04);
  }

  // Firmer tick for clicks
  playClick() {
    if (!this.context || !this.masterGain) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.08);
  }

  // Deep cinematic sub-bass hit for the shutter opening
  playCinematicBass() {
    if (!this.context || !this.masterGain) return;
    const duration = 5.0;
    
    // Sub bass oscillator
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(90, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.context.currentTime + duration);
    
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, this.context.currentTime);
    
    // Volume envelope: sharp attack, slow decay
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(1.0, this.context.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.context.currentTime + duration);
    
    // Add a high-freq metallic "shing" at the start
    const noise = this.context.createBufferSource();
    const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * 0.5, this.context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = noiseBuffer;
    
    const noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 4000;
    
    const noiseGain = this.context.createGain();
    noiseGain.gain.setValueAtTime(0.06, this.context.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.6);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noise.start();
  }

  // Mechanical hum/rumble for car swap
  playMechanicalSwap() {
    if (!this.context || !this.masterGain) return;
    const duration = 0.6;
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, this.context.currentTime);
    osc.frequency.linearRampToValueAtTime(30, this.context.currentTime + duration);
    
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, this.context.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + duration);
    
    gain.gain.setValueAtTime(0.0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.context.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.0, this.context.currentTime + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.context.currentTime + duration);
  }
}

export const sfx = new AudioSystem();
