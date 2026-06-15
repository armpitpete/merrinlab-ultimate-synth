(() => {
  "use strict";

  const MAX_WET_GAIN = 0.95;
  const MAX_EFFECTIVE_Q = 64;

  const state = {
    mode: "bandpass",
    cutoff: 900,
    resonance: 0.7,
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

  function safeParam(param, value, time, speed = 0.05) {
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

  function effectiveQ() {
    const uiQ = clamp(state.resonance, 0.1, 24, 0.7);
    const normalized = clamp((uiQ - 0.1) / (24 - 0.1), 0, 1, 0);
    return 0.1 + Math.pow(normalized, 2.15) * MAX_EFFECTIVE_Q;
  }

  function applySvfParameters() {
    if (!activeSvf) return;

    const { context, filter, wetGain } = activeSvf;
    const now = context.currentTime;

    filter.type = filterTypeForMode(state.mode);
    safeParam(filter.frequency, clamp(state.cutoff, 40, 8500, 900), now, 0.04);
    safeParam(filter.Q, effectiveQ(), now, 0.04);
    safeParam(wetGain.gain, clamp(state.level, 0, 1, 0) * MAX_WET_GAIN, now, 0.04);
  }

  function createSvfLayer(context, source, destination) {
    if (activeSvf && activeSvf.context === context) return;
    if (!previousConnect || !isMainSynthOutputNode(source)) return;

    const input = context.createGain();
    const filter = context.createBiquadFilter();
    const wetGain = context.createGain();

    filter.type = filterTypeForMode(state.mode);
    filter.frequency.value = state.cutoff;
    filter.Q.value = effectiveQ();
    wetGain.gain.value = 0;

    previousConnect.call(source, input);
    previousConnect.call(input, filter);
    previousConnect.call(filter, wetGain);
    previousConnect.call(wetGain, destination);

    activeSvf = {
      context,
      filter,
      wetGain,
    };

    applySvfParameters();
  }

  function patchConnect() {
    if (!window.AudioNode || window.AudioNode.prototype.__merrinlabStateVariableVcfPatched) return;

    previousConnect = window.AudioNode.prototype.connect;

    window.AudioNode.prototype.connect = function connectWithStateVariableVcf(destination, ...rest) {
      const result = previousConnect.call(this, destination, ...rest);

      try {
        if (isDestinationNode(destination) && isMainSynthOutputNode(this)) {
          createSvfLayer(this.context, this, destination);
        }
      } catch (_error) {
        // State Variable VCF is optional. The dry synth path must keep working.
      }

      return result;
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
    document.querySelectorAll('[data-svf-control="mode"]').forEach((control) => {
      control.value = state.mode;
    });

    document.querySelectorAll('[data-svf-control="cutoff"]').forEach((control) => {
      control.value = String(Math.round(state.cutoff));
    });

    document.querySelectorAll('[data-svf-control="resonance"]').forEach((control) => {
      control.value = String(state.resonance.toFixed(1));
    });

    document.querySelectorAll('[data-svf-control="level"]').forEach((control) => {
      control.value = String(Math.round(state.level * 100));
    });

    document.querySelectorAll('[data-svf-readout="mode"]').forEach((readout) => {
      readout.textContent = `${labelForMode(state.mode)} active`;
    });

    document.querySelectorAll('[data-svf-readout="cutoff"]').forEach((readout) => {
      readout.textContent = `${Math.round(state.cutoff)} Hz`;
    });

    document.querySelectorAll('[data-svf-readout="resonance"]').forEach((readout) => {
      readout.textContent = `${state.resonance.toFixed(1)} Q`;
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

    addRangeControl(cutoffControl, "cutoff", 40, 8500, 1, state.cutoff, `${state.cutoff} Hz`);
    addRangeControl(resonanceControl, "resonance", 0.1, 24, 0.1, state.resonance, `${state.resonance.toFixed(1)} Q`);
    addLevelControl();
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

    if (key === "mode") state.mode = control.value;
    if (key === "cutoff") state.cutoff = clamp(control.value, 40, 8500, state.cutoff);
    if (key === "resonance") state.resonance = clamp(control.value, 0.1, 24, state.resonance);
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
