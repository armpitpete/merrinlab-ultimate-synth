(() => {
  "use strict";

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  const state = {
    pitch: 220,
    vcoLevel: 0.35,
    cutoff: 900,
    resonance: 0.7,
    attack: 0.03,
    release: 0.45,
    output: 0.08,
  };

  let audioContext = null;
  let oscillator = null;
  let vcoGain = null;
  let filter = null;
  let mainVca = null;
  let masterGain = null;
  let limiter = null;
  let isGateOpen = false;

  const limits = {
    pitch: [110, 440],
    vcoLevel: [0, 0.7],
    cutoff: [180, 5200],
    resonance: [0.1, 6],
    attack: [0.005, 1.5],
    release: [0.02, 2.5],
    output: [0, 0.16],
  };

  const labels = {
    pitch: "Pitch",
    vcoLevel: "VCO 1 Level",
    cutoff: "Filter Cutoff",
    resonance: "Resonance",
    attack: "Attack",
    release: "Release",
    output: "Output",
  };

  const units = {
    pitch: "Hz",
    vcoLevel: "",
    cutoff: "Hz",
    resonance: "Q",
    attack: "s",
    release: "s",
    output: "",
  };

  function clamp(value, key) {
    const [min, max] = limits[key];
    return Math.min(max, Math.max(min, Number(value)));
  }

  function safeRamp(param, value, time, rampTime = 0.02) {
    param.cancelScheduledValues(time);
    param.setTargetAtTime(value, time, rampTime);
  }

  function createAudioGraph() {
    if (!AudioContextClass) {
      setStatus("Web Audio unavailable in this browser");
      return false;
    }

    if (audioContext && audioContext.state !== "closed") {
      return true;
    }

    audioContext = new AudioContextClass();

    oscillator = audioContext.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.frequency.value = state.pitch;

    vcoGain = audioContext.createGain();
    vcoGain.gain.value = state.vcoLevel;

    filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = state.cutoff;
    filter.Q.value = state.resonance;

    mainVca = audioContext.createGain();
    mainVca.gain.value = 0;

    masterGain = audioContext.createGain();
    masterGain.gain.value = state.output;

    limiter = audioContext.createDynamicsCompressor();
    limiter.threshold.value = -24;
    limiter.knee.value = 12;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.12;

    oscillator.connect(vcoGain);
    vcoGain.connect(filter);
    filter.connect(mainVca);
    mainVca.connect(masterGain);
    masterGain.connect(limiter);
    limiter.connect(audioContext.destination);

    oscillator.start();
    return true;
  }

  async function startAudio() {
    if (!createAudioGraph()) return;

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    document.body.classList.add("is-audio-started");
    setStatus("Audio ready · VCO 1 only · press Gate Note");
    applyAllParameters();
  }

  async function gateOn() {
    await startAudio();
    if (!audioContext || !mainVca) return;

    const now = audioContext.currentTime;
    const target = 0.55;
    const attack = clamp(state.attack, "attack");

    isGateOpen = true;
    document.body.classList.add("is-audio-gated");
    mainVca.gain.cancelScheduledValues(now);
    mainVca.gain.setValueAtTime(Math.max(0.0001, mainVca.gain.value), now);
    mainVca.gain.linearRampToValueAtTime(target, now + attack);
    setStatus("Gate open · safe output active");
  }

  function gateOff() {
    if (!audioContext || !mainVca) return;

    const now = audioContext.currentTime;
    const release = clamp(state.release, "release");

    isGateOpen = false;
    document.body.classList.remove("is-audio-gated");
    mainVca.gain.cancelScheduledValues(now);
    mainVca.gain.setValueAtTime(Math.max(0.0001, mainVca.gain.value), now);
    mainVca.gain.linearRampToValueAtTime(0.0001, now + release);
    setStatus("Gate released");
  }

  async function panicStop() {
    document.body.classList.remove("is-audio-started", "is-audio-gated");
    isGateOpen = false;

    if (mainVca && audioContext) {
      mainVca.gain.cancelScheduledValues(audioContext.currentTime);
      mainVca.gain.setValueAtTime(0, audioContext.currentTime);
    }

    if (masterGain && audioContext) {
      masterGain.gain.cancelScheduledValues(audioContext.currentTime);
      masterGain.gain.setValueAtTime(0, audioContext.currentTime);
    }

    try {
      if (oscillator) oscillator.stop();
    } catch (_error) {
      // Oscillator may already be stopped. Panic still succeeds.
    }

    try {
      if (audioContext && audioContext.state !== "closed") {
        await audioContext.close();
      }
    } catch (_error) {
      // Closing is best-effort; graph references are still cleared below.
    }

    audioContext = null;
    oscillator = null;
    vcoGain = null;
    filter = null;
    mainVca = null;
    masterGain = null;
    limiter = null;

    setStatus("Panic stopped · silent");
  }

  function applyAllParameters() {
    if (!audioContext) return;
    applyParameter("pitch");
    applyParameter("vcoLevel");
    applyParameter("cutoff");
    applyParameter("resonance");
    applyParameter("output");
  }

  function applyParameter(key) {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    const value = clamp(state[key], key);

    if (key === "pitch" && oscillator) {
      safeRamp(oscillator.frequency, value, now, 0.015);
    }

    if (key === "vcoLevel" && vcoGain) {
      safeRamp(vcoGain.gain, value, now, 0.02);
    }

    if (key === "cutoff" && filter) {
      safeRamp(filter.frequency, value, now, 0.025);
    }

    if (key === "resonance" && filter) {
      safeRamp(filter.Q, value, now, 0.025);
    }

    if (key === "output" && masterGain) {
      safeRamp(masterGain.gain, value, now, 0.02);
    }
  }

  function setStatus(message) {
    const status = document.querySelector("[data-audio-status]");
    if (status) status.textContent = message;
  }

  function formatValue(key, value) {
    if (key === "pitch" || key === "cutoff") return `${Math.round(value)} ${units[key]}`;
    if (key === "attack" || key === "release") return `${Number(value).toFixed(2)} ${units[key]}`;
    if (key === "resonance") return `${Number(value).toFixed(1)} ${units[key]}`;
    return Number(value).toFixed(2);
  }

  function createSlider(key, min, max, step) {
    const row = document.createElement("label");
    row.className = "audio-slider-row";
    row.innerHTML = `
      <span>${labels[key]}</span>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}" data-audio-control="${key}">
      <output data-audio-readout="${key}">${formatValue(key, state[key])}</output>
    `;
    return row;
  }

  function createPanel() {
    const style = document.createElement("style");
    style.textContent = `
      .audio-voice-panel {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 50;
        width: min(340px, calc(100vw - 36px));
        padding: 14px;
        border: 1px solid rgba(215, 184, 132, 0.42);
        border-radius: 18px;
        background: rgba(18, 14, 11, 0.94);
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
        color: #f1e7d9;
        font-family: inherit;
      }

      .audio-voice-panel h2 {
        margin: 0 0 4px;
        font-size: 0.82rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .audio-voice-panel p {
        margin: 0 0 12px;
        color: #cdbda7;
        font-size: 0.72rem;
      }

      .audio-button-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 12px;
      }

      .audio-button-row button {
        border: 1px solid rgba(215, 184, 132, 0.48);
        border-radius: 999px;
        padding: 8px 10px;
        background: #2a211a;
        color: #f3e8da;
        font: inherit;
        font-size: 0.72rem;
        font-weight: 800;
        cursor: pointer;
      }

      .audio-button-row button[data-audio-action="panic"] {
        border-color: rgba(255, 134, 99, 0.72);
      }

      .audio-slider-row {
        display: grid;
        grid-template-columns: 92px 1fr 58px;
        align-items: center;
        gap: 8px;
        margin: 8px 0;
        font-size: 0.7rem;
      }

      .audio-slider-row input {
        accent-color: #d7b884;
      }

      .audio-slider-row output {
        text-align: right;
        color: #d6c8b5;
        font-variant-numeric: tabular-nums;
      }

      body.is-audio-started .vco-bank .vco-module:first-child .status-light,
      body.is-audio-started .filter-lp-module .status-light,
      body.is-audio-started .main-vca-module .status-light,
      body.is-audio-started .output-module .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }

      body.is-audio-gated .main-vca-module .status-light {
        background: #ffd36c;
        box-shadow: 0 0 12px rgba(255, 211, 108, 0.7);
      }
    `;

    const panel = document.createElement("section");
    panel.className = "audio-voice-panel";
    panel.setAttribute("aria-label", "First safe audible voice controls");
    panel.innerHTML = `
      <h2>First Voice v0.1</h2>
      <p data-audio-status>Stopped · VCO 1 only · safe output</p>
      <div class="audio-button-row">
        <button type="button" data-audio-action="start">Start Audio</button>
        <button type="button" data-audio-action="gate-on">Gate Note</button>
        <button type="button" data-audio-action="gate-off">Release</button>
        <button type="button" data-audio-action="panic">Panic Stop</button>
      </div>
    `;

    panel.append(
      createSlider("pitch", 110, 440, 1),
      createSlider("vcoLevel", 0, 0.7, 0.01),
      createSlider("cutoff", 180, 5200, 1),
      createSlider("resonance", 0.1, 6, 0.1),
      createSlider("attack", 0.005, 1.5, 0.005),
      createSlider("release", 0.02, 2.5, 0.01),
      createSlider("output", 0, 0.16, 0.005),
    );

    document.head.append(style);
    document.body.append(panel);

    panel.addEventListener("input", (event) => {
      const input = event.target.closest("[data-audio-control]");
      if (!input) return;

      const key = input.dataset.audioControl;
      state[key] = clamp(input.value, key);

      const readout = panel.querySelector(`[data-audio-readout="${key}"]`);
      if (readout) readout.textContent = formatValue(key, state[key]);

      applyParameter(key);
    });

    panel.addEventListener("click", (event) => {
      const button = event.target.closest("[data-audio-action]");
      if (!button) return;

      const action = button.dataset.audioAction;
      if (action === "start") startAudio();
      if (action === "gate-on") gateOn();
      if (action === "gate-off") gateOff();
      if (action === "panic") panicStop();
    });
  }

  document.addEventListener("DOMContentLoaded", createPanel);
})();
