(() => {
  "use strict";

  const CUTOFF_MIN = 90;
  const DEFAULT_CUTOFF_MAX = 8500;
  const BANDPASS_CUTOFF_MAX = 16000;
  const CUTOFF_SLIDER_MIN = 0;
  const CUTOFF_SLIDER_MAX = 1000;

  const state = {
    mode: "bandpass",
    cutoff: 900,
    resonance: 0.7,
    bpWidth: 0.55,
    level: 0,
  };

  let previousConnect = null;
  let activeSvf = null;

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

  function safeParam(param, value, time, speed = 0.045) {
    param.cancelScheduledValues(time);
    param.setTargetAtTime(value, time, speed);
  }

  function filterTypeForMode(mode) {
    if (mode === "highpass") return "highpass";
    if (mode === "lowpass") return "lowpass";
    return "bandpass";
  }

  function labelForMode(mode) {
    if (mode === "highpass") return "HP";
    if (mode === "lowpass") return "LP";
    return "BP";
  }

  function cutoffMaxForMode() {
    return state.mode === "bandpass" ? BANDPASS_CUTOFF_MAX : DEFAULT_CUTOFF_MAX;
  }

  function cutoff() {
    return clamp(state.cutoff, CUTOFF_MIN, cutoffMaxForMode(), 900);
  }

  function frequencyToCutoffSlider(frequency, maxCutoff = cutoffMaxForMode()) {
    const safeFrequency = clamp(frequency, CUTOFF_MIN, maxCutoff, 900);
    const minLog = Math.log(CUTOFF_MIN);
    const maxLog = Math.log(maxCutoff);
    const position = (Math.log(safeFrequency) - minLog) / (maxLog - minLog);
    return Math.round(clamp(position, 0, 1, 0) * CUTOFF_SLIDER_MAX);
  }

  function cutoffSliderToFrequency(sliderValue, maxCutoff = cutoffMaxForMode()) {
    const position = clamp(sliderValue, CUTOFF_SLIDER_MIN, CUTOFF_SLIDER_MAX, 0) / CUTOFF_SLIDER_MAX;
    const minLog = Math.log(CUTOFF_MIN);
    const maxLog = Math.log(maxCutoff);
    return Math.exp(minLog + position * (maxLog - minLog));
  }

  function cutoffPosition(maxCutoff = cutoffMaxForMode()) {
    const minLog = Math.log(CUTOFF_MIN);
    const maxLog = Math.log(maxCutoff);
    const currentLog = Math.log(cutoff());
    return clamp((currentLog - minLog) / (maxLog - minLog), 0, 1, 0);
  }

  function resonanceAmount() {
    const uiQ = clamp(state.resonance, 0.1, 24, 0.7);
    return clamp((uiQ - 0.1) / (24 - 0.1), 0, 1, 0);
  }

  function bpWidthAmount() {
    return clamp(state.bpWidth, 0, 1, 0.55);
  }

  function lowpassQ() {
    const amount = resonanceAmount();
    const position = cutoffPosition(DEFAULT_CUTOFF_MAX);
    const lowCutoffGuard = 0.32 + Math.pow(position, 0.8) * 0.68;
    return 0.7 + Math.pow(amount, 1.2) * 16 * lowCutoffGuard;
  }

  function highpassQ() {
    const amount = resonanceAmount();
    const position = cutoffPosition(DEFAULT_CUTOFF_MAX);
    const lowCutoffGuard = 0.03 + Math.pow(position, 1.45) * 0.97;
    return 0.5 + Math.pow(amount, 1.7) * 7 * lowCutoffGuard;
  }

  function bandpassQ() {
    const amount = resonanceAmount();
    const narrowness = 1 - bpWidthAmount();
    const widthQ = 0.85 + Math.pow(narrowness, 1.35) * 16;
    const resonanceQ = Math.pow(amount, 1.25) * (2.2 + Math.pow(narrowness, 0.8) * 7.3);
    return clamp(widthQ + resonanceQ, 0.85, 30, 4);
  }

  function effectiveQ() {
    if (state.mode === "lowpass") return lowpassQ();
    if (state.mode === "highpass") return highpassQ();
    return bandpassQ();
  }

  function modeGain() {
    const amount = resonanceAmount();
    const width = bpWidthAmount();
    const position = cutoffPosition(DEFAULT_CUTOFF_MAX);

    if (state.mode === "lowpass") {
      return 1.04 + (1 - position) * 0.12;
    }

    if (state.mode === "highpass") {
      return 0.34 + Math.pow(position, 0.75) * 0.72;
    }

    return 4.4 + Math.pow(width, 0.8) * 2.7 + Math.pow(amount, 0.7) * 1.1;
  }

  function levelAmount() {
    return clamp(state.level, 0, 1, 0);
  }

  function applySvfParameters() {
    if (!activeSvf) return;

    const { context, filter, dryGain, wetGain } = activeSvf;
    const now = context.currentTime;
    const amount = levelAmount();

    filter.type = filterTypeForMode(state.mode);
    safeParam(filter.frequency, cutoff(), now, 0.04);
    safeParam(filter.Q, effectiveQ(), now, 0.04);
    safeParam(dryGain.gain, 1 - amount, now, 0.035);
    safeParam(wetGain.gain, amount * modeGain(), now, 0.035);
  }

  function createSvfLayer(context, source, destination) {
    if (activeSvf && activeSvf.context === context) return;
    if (!previousConnect || !isMainSynthOutputNode(source)) return;

    const input = context.createGain();
    const dryGain = context.createGain();
    const filter = context.createBiquadFilter();
    const wetGain = context.createGain();
    const outputBus = context.createGain();

    filter.type = filterTypeForMode(state.mode);
    filter.frequency.value = cutoff();
    filter.Q.value = effectiveQ();
    dryGain.gain.value = 1;
    wetGain.gain.value = 0;
    outputBus.gain.value = 1;

    previousConnect.call(source, input);
    previousConnect.call(input, dryGain);
    previousConnect.call(input, filter);
    previousConnect.call(filter, wetGain);
    previousConnect.call(dryGain, outputBus);
    previousConnect.call(wetGain, outputBus);
    previousConnect.call(outputBus, destination);

    activeSvf = {
      context,
      filter,
      dryGain,
      wetGain,
      outputBus,
    };

    applySvfParameters();
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
      } catch (_error) {
        // If insertion fails, fall back to the normal dry output.
      }

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

    return Array.from(module.querySelectorAll(".control")).find((control) => {
      return normalizeText(control.querySelector(".control-label")?.textContent) === label;
    }) || null;
  }

  function updateReadouts() {
    const currentCutoff = cutoff();
    const maxCutoff = cutoffMaxForMode();
    const cutoffSliderValue = frequencyToCutoffSlider(currentCutoff, maxCutoff);

    document.querySelectorAll('[data-svf-control="mode"]').forEach((control) => {
      control.value = state.mode;
    });

    document.querySelectorAll('[data-svf-control="cutoff"]').forEach((control) => {
      control.min = String(CUTOFF_SLIDER_MIN);
      control.max = String(CUTOFF_SLIDER_MAX);
      control.step = "1";
      control.value = String(cutoffSliderValue);
    });

    document.querySelectorAll('[data-svf-control="resonance"]').forEach((control) => {
      control.value = String(state.resonance.toFixed(1));
    });

    document.querySelectorAll('[data-svf-control="bpWidth"]').forEach((control) => {
      control.value = String(Math.round(bpWidthAmount() * 100));
    });

    document.querySelectorAll('[data-svf-control="level"]').forEach((control) => {
      control.value = String(Math.round(state.level * 100));
    });

    document.querySelectorAll('[data-svf-readout="mode"]').forEach((readout) => {
      readout.textContent = `${labelForMode(state.mode)} active`;
    });

    document.querySelectorAll('[data-svf-readout="cutoff"]').forEach((readout) => {
      readout.textContent = `${Math.round(currentCutoff)} Hz`;
    });

    document.querySelectorAll('[data-svf-readout="resonance"]').forEach((readout) => {
      readout.textContent = `${state.resonance.toFixed(1)} Q`;
    });

    document.querySelectorAll('[data-svf-readout="bpWidth"]').forEach((readout) => {
      readout.textContent = state.mode === "bandpass" ? `${Math.round(bpWidthAmount() * 100)}% wide` : "BP only";
    });

    document.querySelectorAll('[data-svf-readout="level"]').forEach((readout) => {
      readout.textContent = `${Math.round(state.level * 100)}%`;
    });
  }

  function addRangeControl(targetControl, key, min, max, step, value, readout) {
    if (!targetControl || targetControl.querySelector(`[data-svf-control="${key}"]`)) return;

    targetControl.classList.add("is-audio-linked");

    const wrapper = document.createElement("div");
    wrapper.className = "svf-control-wrap";
    wrapper.innerHTML = `
      <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-svf-control="${key}">
      <output class="svf-readout" data-svf-readout="${key}">${readout}</output>
    `;

    targetControl.append(wrapper);
  }

  function addLevelControl() {
    const module = findModule();
    if (!module || module.querySelector('[data-svf-control="level"]')) return;

    const grid = module.querySelector(".control-grid.three-up");
    if (!grid) return;

    const levelControl = document.createElement("div");
    levelControl.className = "control is-audio-linked state-variable-vcf-level-control";
    levelControl.innerHTML = `
      <div class="control-label">Level</div>
      <div class="knob"></div>
      <div class="svf-control-wrap">
        <input type="range" min="0" max="100" step="1" value="0" data-svf-control="level">
        <output class="svf-readout" data-svf-readout="level">0%</output>
      </div>
    `;

    grid.append(levelControl);
  }

  function addBpWidthControl() {
    const module = findModule();
    if (!module || module.querySelector('[data-svf-control="bpWidth"]')) return;

    const grid = module.querySelector(".control-grid.three-up");
    if (!grid) return;

    const widthControl = document.createElement("div");
    widthControl.className = "control is-audio-linked state-variable-vcf-width-control";
    widthControl.innerHTML = `
      <div class="control-label">BP Width</div>
      <div class="knob"></div>
      <div class="svf-control-wrap">
        <input type="range" min="0" max="100" step="1" value="55" data-svf-control="bpWidth">
        <output class="svf-readout" data-svf-readout="bpWidth">55% wide</output>
      </div>
    `;

    grid.append(widthControl);
  }

  function addModeControl() {
    const module = findModule();
    if (!module || module.querySelector('[data-svf-control="mode"]')) return;

    const selector = module.querySelector(".selector");
    if (!selector) return;

    selector.classList.add("is-audio-linked", "state-variable-vcf-mode-selector");
    selector.innerHTML = `
      <select class="svf-mode-select" data-svf-control="mode" aria-label="State Variable VCF output mode">
        <option value="highpass">HP</option>
        <option value="bandpass">BP</option>
        <option value="lowpass">LP</option>
      </select>
      <output class="svf-readout" data-svf-readout="mode">BP active</output>
    `;
  }

  function installControls() {
    const module = findModule();
    if (!module) {
      window.setTimeout(installControls, 100);
      return false;
    }

    const cutoffControl = findControlByLabel("Initial COF");
    const resonanceControl = findControlByLabel("Resonance");
    const cutoffSliderValue = frequencyToCutoffSlider(state.cutoff, cutoffMaxForMode());

    addRangeControl(cutoffControl, "cutoff", CUTOFF_SLIDER_MIN, CUTOFF_SLIDER_MAX, 1, cutoffSliderValue, `${state.cutoff} Hz`);
    addRangeControl(resonanceControl, "resonance", 0.1, 24, 0.1, state.resonance, `${state.resonance.toFixed(1)} Q`);
    addLevelControl();
    addBpWidthControl();
    addModeControl();

    module.classList.add("is-state-variable-vcf-active");
    updateReadouts();
    return true;
  }

  function labelGateOffButton() {
    const gateOffButton = document.querySelector('[data-audio-action="gate-off"]');
    if (!gateOffButton) {
      window.setTimeout(labelGateOffButton, 100);
      return;
    }

    gateOffButton.textContent = "Gate Off / Release";
    gateOffButton.title = "Close the gate and let the envelope release";
  }

  function handleInput(event) {
    const control = event.target.closest("[data-svf-control]");
    if (!control) return;

    const key = control.dataset.svfControl;

    if (key === "mode") {
      state.mode = control.value;
      state.cutoff = cutoff();
    }

    if (key === "cutoff") state.cutoff = cutoffSliderToFrequency(control.value, cutoffMaxForMode());
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
      .state-variable-vcf-module.is-state-variable-vcf-active .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }

      .state-variable-vcf-module .svf-control-wrap {
        display: grid;
        gap: 4px;
        margin-top: 6px;
      }

      .state-variable-vcf-module input[type="range"] {
        width: 100%;
        accent-color: #d7b884;
      }

      .svf-readout {
        color: #d6c8b5;
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
        white-space: nowrap;
      }

      .state-variable-vcf-mode-selector {
        align-items: center;
        display: grid;
        gap: 6px;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .svf-mode-select {
        background: #211913;
        border: 1px solid rgba(215, 184, 132, 0.38);
        border-radius: 999px;
        color: #f3e8da;
        font: inherit;
        font-size: 0.76rem;
        padding: 5px 8px;
        text-align: center;
        width: 100%;
      }

      .svf-mode-select:focus {
        border-color: rgba(147, 211, 108, 0.86);
        box-shadow: 0 0 0 2px rgba(147, 211, 108, 0.18);
        outline: none;
      }
    `;

    document.head.append(style);
  }

  function initStateVariableVcf() {
    patchConnect();
    addStyles();
    installControls();
    labelGateOffButton();
  }

  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleInput);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStateVariableVcf);
  } else {
    initStateVariableVcf();
  }
})();
