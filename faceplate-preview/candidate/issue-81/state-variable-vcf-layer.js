(() => {
  "use strict";

  const CUTOFF_MIN = 90;
  const DEFAULT_CUTOFF_MAX = 8500;
  const BANDPASS_CUTOFF_MAX = 16000;
  const CUTOFF_SLIDER_MAX = 1000;
  const MONITOR_POSITION_KEY = "merrinlab-sv-vcf-monitor-position";

  const state = { mode: "bandpass", cutoff: 900, resonance: 0.7, bpWidth: 0.55, level: 0 };
  let previousConnect = null;
  let activeSvf = null;
  let monitorPanel = null;
  let monitorRaf = null;
  let dragState = null;

  function clamp(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function isDestinationNode(node) {
    return Boolean(node && (
      (typeof AudioDestinationNode !== "undefined" && node instanceof AudioDestinationNode) ||
      node.constructor?.name === "AudioDestinationNode"
    ));
  }

  function isMainSynthOutputNode(node) {
    return Boolean(node && (
      (typeof DynamicsCompressorNode !== "undefined" && node instanceof DynamicsCompressorNode) ||
      node.constructor?.name === "DynamicsCompressorNode"
    ));
  }

  function safeParam(param, value, time, speed = 0.04) {
    param.cancelScheduledValues(time);
    param.setTargetAtTime(value, time, speed);
  }

  function cutoffMaxForMode() {
    return state.mode === "bandpass" ? BANDPASS_CUTOFF_MAX : DEFAULT_CUTOFF_MAX;
  }

  function cutoff() {
    return clamp(state.cutoff, CUTOFF_MIN, cutoffMaxForMode(), 900);
  }

  function labelForMode(mode) {
    if (mode === "highpass") return "HP";
    if (mode === "lowpass") return "LP";
    return "BP";
  }

  function filterTypeForMode(mode) {
    if (mode === "highpass") return "highpass";
    if (mode === "lowpass") return "lowpass";
    return "bandpass";
  }

  function frequencyToSlider(frequency, maxCutoff = cutoffMaxForMode()) {
    const safeFrequency = clamp(frequency, CUTOFF_MIN, maxCutoff, 900);
    const position = (Math.log(safeFrequency) - Math.log(CUTOFF_MIN)) / (Math.log(maxCutoff) - Math.log(CUTOFF_MIN));
    return Math.round(clamp(position, 0, 1, 0) * CUTOFF_SLIDER_MAX);
  }

  function sliderToFrequency(sliderValue, maxCutoff = cutoffMaxForMode()) {
    const position = clamp(sliderValue, 0, CUTOFF_SLIDER_MAX, 0) / CUTOFF_SLIDER_MAX;
    return Math.exp(Math.log(CUTOFF_MIN) + position * (Math.log(maxCutoff) - Math.log(CUTOFF_MIN)));
  }

  function cutoffPosition(maxCutoff = cutoffMaxForMode()) {
    const position = (Math.log(cutoff()) - Math.log(CUTOFF_MIN)) / (Math.log(maxCutoff) - Math.log(CUTOFF_MIN));
    return clamp(position, 0, 1, 0);
  }

  function resonanceAmount() {
    return clamp((clamp(state.resonance, 0.1, 24, 0.7) - 0.1) / (24 - 0.1), 0, 1, 0);
  }

  function bpWidthAmount() {
    return clamp(state.bpWidth, 0, 1, 0.55);
  }

  function modeQ() {
    const amount = resonanceAmount();
    const position = cutoffPosition(DEFAULT_CUTOFF_MAX);
    if (state.mode === "lowpass") return 0.7 + Math.pow(amount, 1.2) * 16 * (0.32 + Math.pow(position, 0.8) * 0.68);
    if (state.mode === "highpass") return 0.5 + Math.pow(amount, 1.7) * 7 * (0.03 + Math.pow(position, 1.45) * 0.97);
    return 0.707;
  }

  function modeGain() {
    const position = cutoffPosition(DEFAULT_CUTOFF_MAX);
    if (state.mode === "lowpass") return 1.04 + (1 - position) * 0.12;
    if (state.mode === "highpass") return 0.34 + Math.pow(position, 0.75) * 0.72;
    return 1;
  }

  function bpEdges() {
    const width = bpWidthAmount();
    const centre = cutoff();
    const octaveWidth = 0.05 + Math.pow(width, 1.15) * 3.1;
    const ratio = Math.pow(2, octaveWidth / 2);
    return {
      centre,
      lowEdge: clamp(centre / ratio, CUTOFF_MIN, BANDPASS_CUTOFF_MAX, CUTOFF_MIN),
      highEdge: clamp(centre * ratio, CUTOFF_MIN, BANDPASS_CUTOFF_MAX, BANDPASS_CUTOFF_MAX),
    };
  }

  function bpFrequencyMakeup() {
    const position = cutoffPosition(BANDPASS_CUTOFF_MAX);
    const lowTame = 0.65 + Math.pow(position, 0.5) * 0.35;
    const highLift = 1 + Math.pow(position, 2) * 2.2;
    return lowTame * highLift;
  }

  function bpWindowGain() {
    const width = bpWidthAmount();
    const amount = resonanceAmount();
    const baseGain = 0.08 + Math.pow(width, 0.7) * 0.55 + amount * 0.12;
    return baseGain * bpFrequencyMakeup();
  }

  function bpPeakQ() {
    return 0.8 + Math.pow(resonanceAmount(), 1.1) * 15;
  }

  function bpPeakGain() {
    return Math.pow(resonanceAmount(), 0.9) * 19;
  }

  function applySvfParameters() {
    if (!activeSvf) return;
    const now = activeSvf.context.currentTime;
    const isBp = state.mode === "bandpass";
    const wetAmount = clamp(state.level, 0, 1, 0);
    const edges = bpEdges();

    activeSvf.modeFilter.type = filterTypeForMode(state.mode);
    safeParam(activeSvf.modeFilter.frequency, cutoff(), now);
    safeParam(activeSvf.modeFilter.Q, modeQ(), now);
    safeParam(activeSvf.modeFilterGain.gain, isBp ? 0 : 1, now, 0.02);

    safeParam(activeSvf.bpHighpass.frequency, edges.lowEdge, now);
    safeParam(activeSvf.bpHighpass.Q, 0.72, now);
    safeParam(activeSvf.bpLowpass.frequency, edges.highEdge, now);
    safeParam(activeSvf.bpLowpass.Q, 0.72, now);
    safeParam(activeSvf.bpPeak.frequency, edges.centre, now);
    safeParam(activeSvf.bpPeak.Q, bpPeakQ(), now);
    safeParam(activeSvf.bpPeak.gain, bpPeakGain(), now);
    safeParam(activeSvf.bpGain.gain, isBp ? bpWindowGain() : 0, now, 0.025);

    safeParam(activeSvf.dryGain.gain, 1 - wetAmount, now, 0.035);
    safeParam(activeSvf.wetGain.gain, wetAmount * modeGain(), now, 0.035);
  }

  function createSvfLayer(context, source, destination) {
    if (activeSvf && activeSvf.context === context) return;
    if (!previousConnect || !isMainSynthOutputNode(source)) return;

    const input = context.createGain();
    const dryGain = context.createGain();
    const modeFilter = context.createBiquadFilter();
    const modeFilterGain = context.createGain();
    const bpHighpass = context.createBiquadFilter();
    const bpLowpass = context.createBiquadFilter();
    const bpPeak = context.createBiquadFilter();
    const bpGain = context.createGain();
    const wetGain = context.createGain();
    const analyser = context.createAnalyser();
    const outputBus = context.createGain();

    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.78;
    analyser.minDecibels = -95;
    analyser.maxDecibels = -12;
    bpHighpass.type = "highpass";
    bpLowpass.type = "lowpass";
    bpPeak.type = "peaking";
    dryGain.gain.value = 1;
    wetGain.gain.value = 0;

    previousConnect.call(source, input);
    previousConnect.call(input, dryGain);
    previousConnect.call(input, modeFilter);
    previousConnect.call(modeFilter, modeFilterGain);
    previousConnect.call(modeFilterGain, wetGain);
    previousConnect.call(input, bpHighpass);
    previousConnect.call(bpHighpass, bpLowpass);
    previousConnect.call(bpLowpass, bpPeak);
    previousConnect.call(bpPeak, bpGain);
    previousConnect.call(bpGain, wetGain);
    previousConnect.call(wetGain, analyser);
    previousConnect.call(analyser, outputBus);
    previousConnect.call(dryGain, outputBus);
    previousConnect.call(outputBus, destination);

    activeSvf = { context, dryGain, modeFilter, modeFilterGain, bpHighpass, bpLowpass, bpPeak, bpGain, wetGain, analyser, outputBus };
    applySvfParameters();
    startMonitorDrawing();
  }

  function patchConnect() {
    if (!window.AudioNode || window.AudioNode.prototype.__merrinlabStateVariableVcfPatched) return;
    previousConnect = window.AudioNode.prototype.connect;
    window.AudioNode.prototype.connect = function connectWithStateVariableVcf(destination, ...rest) {
      try {
        if (isDestinationNode(destination) && isMainSynthOutputNode(this)) {
          createSvfLayer(this.context, this, destination);
          return destination;
        }
      } catch (_error) {}
      return previousConnect.call(this, destination, ...rest);
    };
    window.AudioNode.prototype.__merrinlabStateVariableVcfPatched = true;
  }

  function findModule() {
    return document.querySelector(".state-variable-vcf-module");
  }

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function findControlByLabel(label) {
    const module = findModule();
    if (!module) return null;
    return Array.from(module.querySelectorAll(".control")).find((control) => normalizeText(control.querySelector(".control-label")?.textContent) === label) || null;
  }

  function setReadout(selector, value) {
    document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  }

  function updateReadouts() {
    const hz = Math.round(cutoff());
    document.querySelectorAll('[data-svf-control="mode"]').forEach((control) => { control.value = state.mode; });
    document.querySelectorAll('[data-svf-control="cutoff"]').forEach((control) => {
      control.min = "0";
      control.max = String(CUTOFF_SLIDER_MAX);
      control.step = "1";
      control.value = String(frequencyToSlider(hz));
    });
    document.querySelectorAll('[data-svf-control="resonance"]').forEach((control) => { control.value = String(state.resonance.toFixed(1)); });
    document.querySelectorAll('[data-svf-control="bpWidth"]').forEach((control) => { control.value = String(Math.round(bpWidthAmount() * 100)); });
    document.querySelectorAll('[data-svf-control="level"]').forEach((control) => { control.value = String(Math.round(state.level * 100)); });

    setReadout('[data-svf-readout="mode"]', `${labelForMode(state.mode)} active`);
    setReadout('[data-svf-readout="cutoff"]', `${hz} Hz`);
    setReadout('[data-svf-readout="resonance"]', `${state.resonance.toFixed(1)} Q`);
    setReadout('[data-svf-readout="bpWidth"]', state.mode === "bandpass" ? `${Math.round(bpWidthAmount() * 100)}% wide` : "BP only");
    setReadout('[data-svf-readout="level"]', `${Math.round(state.level * 100)}%`);
    updateMonitorText();
  }

  function addRangeControl(targetControl, key, min, max, step, value, readout) {
    if (!targetControl || targetControl.querySelector(`[data-svf-control="${key}"]`)) return;
    targetControl.classList.add("is-audio-linked");
    const wrapper = document.createElement("div");
    wrapper.className = "svf-control-wrap";
    wrapper.innerHTML = `<input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-svf-control="${key}"><output class="svf-readout" data-svf-readout="${key}">${readout}</output>`;
    targetControl.append(wrapper);
  }

  function addExtraControl(key, label, value, readout) {
    const module = findModule();
    if (!module || module.querySelector(`[data-svf-control="${key}"]`)) return;
    const grid = module.querySelector(".control-grid.three-up");
    if (!grid) return;
    const control = document.createElement("div");
    control.className = `control is-audio-linked state-variable-vcf-${key}-control`;
    control.innerHTML = `<div class="control-label">${label}</div><div class="knob"></div><div class="svf-control-wrap"><input type="range" min="0" max="100" step="1" value="${value}" data-svf-control="${key}"><output class="svf-readout" data-svf-readout="${key}">${readout}</output></div>`;
    grid.append(control);
  }

  function addModeControl() {
    const module = findModule();
    if (!module || module.querySelector('[data-svf-control="mode"]')) return;
    const selector = module.querySelector(".selector");
    if (!selector) return;
    selector.classList.add("is-audio-linked", "state-variable-vcf-mode-selector");
    selector.innerHTML = `<select class="svf-mode-select" data-svf-control="mode" aria-label="State Variable VCF output mode"><option value="highpass">HP</option><option value="bandpass">BP</option><option value="lowpass">LP</option></select><output class="svf-readout" data-svf-readout="mode">BP active</output>`;
  }

  function installControls() {
    const module = findModule();
    if (!module) {
      window.setTimeout(installControls, 100);
      return false;
    }
    addRangeControl(findControlByLabel("Initial COF"), "cutoff", 0, CUTOFF_SLIDER_MAX, 1, frequencyToSlider(state.cutoff), `${state.cutoff} Hz`);
    addRangeControl(findControlByLabel("Resonance"), "resonance", 0.1, 24, 0.1, state.resonance, `${state.resonance.toFixed(1)} Q`);
    addExtraControl("level", "Level", 0, "0%");
    addExtraControl("bpWidth", "BP Width", 55, "55% wide");
    addModeControl();
    module.classList.add("is-state-variable-vcf-active");
    updateReadouts();
    return true;
  }

  function labelGateOffButton() {
    const button = document.querySelector('[data-audio-action="gate-off"]');
    if (!button) {
      window.setTimeout(labelGateOffButton, 100);
      return;
    }
    button.textContent = "Gate Off / Release";
    button.title = "Close the gate and let the envelope release";
  }

  function monitorPosition() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(MONITOR_POSITION_KEY) || "null");
      if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) return saved;
    } catch (_error) {}
    return { left: 24, top: 96 };
  }

  function createFloatingMonitor() {
    if (monitorPanel) return monitorPanel;
    const position = monitorPosition();
    monitorPanel = document.createElement("aside");
    monitorPanel.className = "svf-floating-monitor";
    monitorPanel.style.left = `${position.left}px`;
    monitorPanel.style.top = `${position.top}px`;
    monitorPanel.innerHTML = `<div class="svf-floating-monitor-header" data-svf-monitor-drag><strong>SV VCF Monitor</strong><span>drag</span></div><div class="svf-monitor-readouts"><span data-svf-monitor-readout="mode">BP</span><span data-svf-monitor-readout="cutoff">900 Hz</span><span data-svf-monitor-readout="width">55% wide</span><span data-svf-monitor-readout="resonance">0.7 Q</span><span data-svf-monitor-readout="level">0%</span></div><label>Wet waveform</label><canvas class="svf-monitor-canvas" data-svf-monitor-waveform width="280" height="82"></canvas><label>Wet spectrum</label><canvas class="svf-monitor-canvas" data-svf-monitor-spectrum width="280" height="104"></canvas>`;
    document.body.append(monitorPanel);
    installMonitorDrag(monitorPanel);
    updateMonitorText();
    return monitorPanel;
  }

  function installMonitorDrag(panel) {
    const handle = panel.querySelector("[data-svf-monitor-drag]");
    if (!handle) return;
    handle.addEventListener("pointerdown", (event) => {
      const rect = panel.getBoundingClientRect();
      dragState = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const left = clamp(event.clientX - dragState.offsetX, 0, Math.max(0, window.innerWidth - panel.offsetWidth), 0);
      const top = clamp(event.clientY - dragState.offsetY, 0, Math.max(0, window.innerHeight - panel.offsetHeight), 0);
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
    });
    handle.addEventListener("pointerup", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const rect = panel.getBoundingClientRect();
      try { window.localStorage.setItem(MONITOR_POSITION_KEY, JSON.stringify({ left: rect.left, top: rect.top })); } catch (_error) {}
      dragState = null;
    });
  }

  function updateMonitorText() {
    if (!monitorPanel) return;
    const set = (key, value) => {
      const target = monitorPanel.querySelector(`[data-svf-monitor-readout="${key}"]`);
      if (target) target.textContent = value;
    };
    set("mode", labelForMode(state.mode));
    set("cutoff", `${Math.round(cutoff())} Hz`);
    set("width", state.mode === "bandpass" ? `${Math.round(bpWidthAmount() * 100)}% wide` : "BP only");
    set("resonance", `${state.resonance.toFixed(1)} Q`);
    set("level", `${Math.round(state.level * 100)}% wet`);
  }

  function canvasContext(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(11, 14, 18, 0.92)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return ctx;
  }

  function drawWaveform(canvas, analyser) {
    const ctx = canvasContext(canvas);
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);
    ctx.strokeStyle = "rgba(147, 211, 108, 0.96)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * canvas.width;
      const y = (value / 255) * canvas.height;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.strokeStyle = "rgba(215, 184, 132, 0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  function drawSpectrum(canvas, analyser) {
    const ctx = canvasContext(canvas);
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const nyquist = analyser.context.sampleRate / 2;
    const minLog = Math.log(CUTOFF_MIN);
    const maxLog = Math.log(nyquist);
    const barCount = 84;
    ctx.fillStyle = "rgba(215, 184, 132, 0.72)";
    for (let index = 0; index < barCount; index += 1) {
      const frequency = Math.exp(minLog + (index / (barCount - 1)) * (maxLog - minLog));
      const bin = clamp(Math.round((frequency / nyquist) * data.length), 0, data.length - 1, 0);
      const height = (data[bin] / 255) * canvas.height;
      ctx.fillRect((index / barCount) * canvas.width, canvas.height - height, Math.ceil(canvas.width / barCount), height);
    }
    const markerX = clamp((Math.log(cutoff()) - minLog) / (maxLog - minLog), 0, 1, 0) * canvas.width;
    ctx.strokeStyle = "rgba(147, 211, 108, 0.95)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(markerX, 0);
    ctx.lineTo(markerX, canvas.height);
    ctx.stroke();
  }

  function drawMonitorFrame() {
    if (monitorPanel && activeSvf?.analyser) {
      const waveform = monitorPanel.querySelector("[data-svf-monitor-waveform]");
      const spectrum = monitorPanel.querySelector("[data-svf-monitor-spectrum]");
      if (waveform) drawWaveform(waveform, activeSvf.analyser);
      if (spectrum) drawSpectrum(spectrum, activeSvf.analyser);
      updateMonitorText();
    }
    monitorRaf = window.requestAnimationFrame(drawMonitorFrame);
  }

  function startMonitorDrawing() {
    createFloatingMonitor();
    if (monitorRaf === null) monitorRaf = window.requestAnimationFrame(drawMonitorFrame);
  }

  function handleInput(event) {
    const control = event.target.closest("[data-svf-control]");
    if (!control) return;
    const key = control.dataset.svfControl;
    if (key === "mode") {
      state.mode = control.value;
      state.cutoff = cutoff();
    }
    if (key === "cutoff") state.cutoff = sliderToFrequency(control.value, cutoffMaxForMode());
    if (key === "resonance") state.resonance = clamp(control.value, 0.1, 24, state.resonance);
    if (key === "bpWidth") state.bpWidth = clamp(Number(control.value) / 100, 0, 1, state.bpWidth);
    if (key === "level") state.level = clamp(Number(control.value) / 100, 0, 1, state.level);
    updateReadouts();
    applySvfParameters();
  }

  function addStyles() {
    if (document.querySelector("#state-variable-vcf-layer-styles")) return;
    const style = document.createElement("style");
    style.id = "state-variable-vcf-layer-styles";
    style.textContent = `
      .state-variable-vcf-module.is-state-variable-vcf-active .status-light { background: #93d36c; box-shadow: 0 0 10px rgba(147, 211, 108, 0.65); }
      .state-variable-vcf-module .svf-control-wrap { display: grid; gap: 4px; margin-top: 6px; }
      .state-variable-vcf-module input[type="range"] { width: 100%; accent-color: #d7b884; }
      .svf-readout { color: #d6c8b5; font-size: 0.62rem; font-variant-numeric: tabular-nums; text-align: center; white-space: nowrap; }
      .state-variable-vcf-mode-selector { align-items: center; display: grid; gap: 6px; grid-template-columns: minmax(0, 1fr) auto; }
      .svf-mode-select { background: #211913; border: 1px solid rgba(215, 184, 132, 0.38); border-radius: 999px; color: #f3e8da; font: inherit; font-size: 0.76rem; padding: 5px 8px; text-align: center; width: 100%; }
      .svf-mode-select:focus { border-color: rgba(147, 211, 108, 0.86); box-shadow: 0 0 0 2px rgba(147, 211, 108, 0.18); outline: none; }
      .svf-floating-monitor { background: rgba(24, 18, 14, 0.96); border: 1px solid rgba(215, 184, 132, 0.52); border-radius: 14px; box-shadow: 0 18px 42px rgba(0, 0, 0, 0.42); color: #f3e8da; display: grid; gap: 7px; left: 24px; padding: 9px; position: fixed; top: 96px; width: 300px; z-index: 9999; }
      .svf-floating-monitor-header { align-items: center; cursor: move; display: flex; justify-content: space-between; letter-spacing: 0.08em; text-transform: uppercase; user-select: none; }
      .svf-floating-monitor-header strong { color: #f3e8da; font-size: 0.72rem; }
      .svf-floating-monitor-header span { color: #d6c8b5; font-size: 0.58rem; }
      .svf-monitor-readouts { display: grid; gap: 4px; grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .svf-monitor-readouts span { background: rgba(11, 14, 18, 0.72); border: 1px solid rgba(215, 184, 132, 0.18); border-radius: 7px; color: #d6c8b5; font-size: 0.56rem; overflow: hidden; padding: 4px 3px; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
      .svf-floating-monitor label { color: #d7b884; font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; }
      .svf-monitor-canvas { background: #0b0e12; border: 1px solid rgba(215, 184, 132, 0.2); border-radius: 8px; display: block; height: auto; width: 100%; }
    `;
    document.head.append(style);
  }

  function initStateVariableVcf() {
    patchConnect();
    addStyles();
    installControls();
    labelGateOffButton();
    createFloatingMonitor();
  }

  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleInput);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initStateVariableVcf);
  else initStateVariableVcf();
})();
