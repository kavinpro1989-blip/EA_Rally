/**
 * @file /ui_and_integration/core/audio_synthesizer.js
 * @description Procedural Web Audio Engine & AI Co-Driver Voice Synthesizer
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import { eventBus, RALLY_EVENTS } from './event_bus.js';
import { stateStore } from './state_store.js';

export class RallyAudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.masterGain = null;

    // Engine Nodes
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineFilter = null;
    this.engineGain = null;

    // Turbo Nodes
    this.turboOsc = null;
    this.turboGain = null;
    this.turboFilter = null;

    // Gravel & Tire Noise Nodes
    this.gravelNoiseNode = null;
    this.gravelGain = null;
    this.tireSquealNode = null;
    this.tireSquealGain = null;

    // State Tracking
    this.lastThrottle = 0;
    this.lastBoost = 0;
    this.lastShiftTime = 0;
    this.speechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

    this._setupEventListeners();
  }

  /**
   * Initializes Web Audio Context on first user interaction to comply with browser autoplay policies.
   */
  initAudioContext() {
    if (this.audioCtx) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      // Master output
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      this._initEngineAudio();
      this._initTurboAudio();
      this._initGravelAudio();
      this._initTireAudio();
    } catch (e) {
      console.warn('[RallyAudio] Web Audio initialization failed or blocked:', e);
    }
  }

  _initEngineAudio() {
    // 4-cylinder engine fundamental & harmonic oscillators
    this.engineOsc1 = this.audioCtx.createOscillator();
    this.engineOsc1.type = 'sawtooth';
    this.engineOsc1.frequency.setValueAtTime(50, this.audioCtx.currentTime);

    this.engineOsc2 = this.audioCtx.createOscillator();
    this.engineOsc2.type = 'triangle';
    this.engineOsc2.frequency.setValueAtTime(100, this.audioCtx.currentTime);

    this.engineFilter = this.audioCtx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
    this.engineFilter.Q.setValueAtTime(3.5, this.audioCtx.currentTime);

    this.engineGain = this.audioCtx.createGain();
    this.engineGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);

    this.engineOsc1.connect(this.engineFilter);
    this.engineOsc2.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.engineOsc1.start();
    this.engineOsc2.start();
  }

  _initTurboAudio() {
    // High-pitched turbo spool sound
    this.turboOsc = this.audioCtx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);

    this.turboFilter = this.audioCtx.createBiquadFilter();
    this.turboFilter.type = 'bandpass';
    this.turboFilter.frequency.setValueAtTime(2200, this.audioCtx.currentTime);
    this.turboFilter.Q.setValueAtTime(8.0, this.audioCtx.currentTime);

    this.turboGain = this.audioCtx.createGain();
    this.turboGain.gain.setValueAtTime(0.0, this.audioCtx.currentTime);

    this.turboOsc.connect(this.turboFilter);
    this.turboFilter.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);

    this.turboOsc.start();
  }

  _createNoiseBuffer() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  _initGravelAudio() {
    const buffer = this._createNoiseBuffer();
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const bandpass = this.audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1800, this.audioCtx.currentTime);
    bandpass.Q.setValueAtTime(1.8, this.audioCtx.currentTime);

    this.gravelGain = this.audioCtx.createGain();
    this.gravelGain.gain.setValueAtTime(0.0, this.audioCtx.currentTime);

    noiseSource.connect(bandpass);
    bandpass.connect(this.gravelGain);
    this.gravelGain.connect(this.masterGain);

    noiseSource.start();
  }

  _initTireAudio() {
    const buffer = this._createNoiseBuffer();
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const highpass = this.audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(900, this.audioCtx.currentTime);

    this.tireSquealGain = this.audioCtx.createGain();
    this.tireSquealGain.gain.setValueAtTime(0.0, this.audioCtx.currentTime);

    noiseSource.connect(highpass);
    highpass.connect(this.tireSquealGain);
    this.tireSquealGain.connect(this.masterGain);

    noiseSource.start();
  }

  _setupEventListeners() {
    // Listen to telemetry updates for real-time sound modulation
    eventBus.on(RALLY_EVENTS.TELEMETRY_UPDATE, (telemetry) => {
      this.updateFromTelemetry(telemetry);
    });

    // Backfire pops on gear shifts or overrun
    eventBus.on(RALLY_EVENTS.BACKFIRE_POP, () => {
      this.triggerBackfirePop();
    });

    // Turbo blow-off flutter
    eventBus.on(RALLY_EVENTS.TURBO_BLOWOFF, () => {
      this.triggerBlowOffValve();
    });

    // AI Co-driver pacenote verbal call
    eventBus.on(RALLY_EVENTS.PACENOTE_TRIGGER, (pacenote) => {
      this.speakPacenote(pacenote);
    });
  }

  /**
   * Modulate engine, turbo, tire, and gravel sounds based on live physics telemetry.
   * @param {Object} telemetry
   */
  updateFromTelemetry(telemetry) {
    if (!this.audioCtx || this.isMuted) return;

    const now = this.audioCtx.currentTime;
    const { vehicle, tires, gForces } = telemetry;

    // 1. Engine frequency & filter
    const rpm = vehicle.engineRpm || 1200;
    const throttle = vehicle.throttle || 0;
    const fundamental = (rpm / 60) * 2; // 4-cylinder four-stroke engine pulses

    this.engineOsc1.frequency.setTargetAtTime(fundamental, now, 0.04);
    this.engineOsc2.frequency.setTargetAtTime(fundamental * 2, now, 0.04);

    const filterFreq = 250 + (rpm / 8000) * 1200 + throttle * 800;
    this.engineFilter.frequency.setTargetAtTime(filterFreq, now, 0.04);

    const targetGain = 0.12 + throttle * 0.22 + (rpm / 8000) * 0.15;
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.04);

    // 2. Turbo spool pitch & volume
    const boost = vehicle.turboBoostBar || 0;
    const turboFreq = 1100 + boost * 2800;
    this.turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.06);
    this.turboGain.gain.setTargetAtTime(Math.max(0, boost * 0.18), now, 0.06);

    // Check for blowoff valve condition (throttle released quickly under high boost)
    if (this.lastThrottle > 0.65 && throttle < 0.15 && this.lastBoost > 0.8) {
      this.triggerBlowOffValve();
    }
    this.lastThrottle = throttle;
    this.lastBoost = boost;

    // 3. Tire squeal / lateral slip noise
    const maxSlip = Math.max(
      Math.abs(tires.fl?.slipAngleDeg || 0),
      Math.abs(tires.fr?.slipAngleDeg || 0),
      Math.abs(tires.rl?.slipAngleDeg || 0),
      Math.abs(tires.rr?.slipAngleDeg || 0)
    );
    const slipRatio = Math.min(1.0, maxSlip / 20.0);
    this.tireSquealGain.gain.setTargetAtTime(slipRatio * 0.28, now, 0.05);

    // 4. Gravel pelt noise based on vehicle speed
    const speed = vehicle.speedKph || 0;
    const gravelVolume = Math.min(0.24, (speed / 160) * 0.24 * (1 + slipRatio));
    this.gravelGain.gain.setTargetAtTime(gravelVolume, now, 0.1);
  }

  /**
   * Synthesize a crisp turbo blow-off valve (BOV) flutter / whoosh
   */
  triggerBlowOffValve() {
    if (!this.audioCtx || this.isMuted) return;

    const now = this.audioCtx.currentTime;
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = this._createNoiseBuffer();

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.35);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.45);
  }

  /**
   * Synthesize an anti-lag exhaust backfire crack/pop
   */
  triggerBackfirePop() {
    if (!this.audioCtx || this.isMuted) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = this._createNoiseBuffer();

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    noise.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    noise.start(now);
    osc.stop(now + 0.16);
    noise.stop(now + 0.16);
  }

  /**
   * Speaks the pacenote using the Web Speech Synthesis API or radio chime.
   * @param {Object} pacenote
   */
  speakPacenote(pacenote) {
    if (!stateStore.hudSettings.audioCoDriverEnabled || this.isMuted) return;

    if (this.speechAvailable && window.speechSynthesis) {
      try {
        // Cancel previous utterances to avoid speech backlog
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(pacenote.call || '');
        utterance.rate = 1.35; // Rally co-drivers speak briskly
        utterance.pitch = 1.05;
        utterance.volume = stateStore.hudSettings.coDriverVolume || 0.85;

        // Try selecting an English voice
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[RallyAudio] Speech synthesis error:', err);
      }
    } else {
      // Fallback: Radio intercom beep
      this.playRadioChime();
    }
  }

  /**
   * Fallback rally intercom chime
   */
  playRadioChime() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1174, now + 0.08);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.audioCtx?.currentTime || 0);
    }
    return this.isMuted;
  }
}

export const rallyAudio = new RallyAudioSynthesizer();
