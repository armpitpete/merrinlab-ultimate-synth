(() => {
  "use strict";

  const MAX_WET_GAIN = 0.48;

  const state = {
    mix: 0,
    drive: 0.35,
    tone: 0.55,
  };

  let previousConnect = null;
  let activeDrive = null;

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

  function safeParam(param, value, time, speed = 0.05) {
    param.cancelScheduledValues(time);
    param.setTargetAtTime(value, time, speed);
  }

  function makeSoftDriveCurve(amount) {
    const samples = 2048;
    const curve = new Float32Array(samples);
    const drive = 1 + clamp(amount, 0, 1, 0.35) * 16;

    for (let i = 0; i < samples; i += 1) {
      const x = (i / (samples - 1)) * 2 - 1;
      curve[i] = Math.tanh(x * drive) / Math.tanh(drive);
    }

    return curve;
  }

  function applyDriveParameters() {
    if (!activeDrive) return;

    const { context, inputGain, shaper, toneFilter, wetGain } = activeDrive;
    const now = context.currentTime;
    const mix = clamp(state.mix, 0, 1, 0);
    const drive = clamp(state.drive, 0, 1, 0.35);
    const tone = clamp(state.tone, 0, 1, 0.55);

    shaper.curve = makeSoftDriveCurve(drive);
    shaper.oversample = "2x";

    safeParam(inputGain.gain, 0.55 + drive * 0.95, now, 0.04);
    safeParam(toneFilter.frequency, 900 + tone * 5200, now, 0.08);
    safeParam(wetGain.gain, mix * MAX_WET_GAIN, now, 0.04);
  }

  function createDriveLayer(context, source, destination) {
    if (activeDrive && activeDrive.context === context) return;
    if (!previousConnect) return;

    const input = context.createGain();
    const inputGain = context.createGain();
    const shaper = context.createWaveShaper();
    const toneFilter = context.createBiquadFilter();
    const wetGain = context.createGain();

    inputGain.gain.value = 0.8;
    shaper.curve = makeSoftDriveCurve(state.drive);
    shaper.oversample = "2x";
    toneFilter.type = "lowpass";
    toneFilter.frequency.value = 3600;
    wetGain.gain.value = 0;

    previousConnect.call(source, input);
    previousConnect.call(input, inputGain);
    previousConnect.call(inputGain, shaper);
    previousConnect.call(shaper, toneFilter);
    previousConnect.call(toneFilter, wetGain);
    previousConnect.call(wetGain, destination);

    activeDrive = {
      context,
      inputGain,
      shaper,
      toneFilter,
      wetGain,
    };

    applyDriveParameters();
  }

  function patchConnect() {
    if (!window.AudioNode || window.AudioNode.prototype.__merrinlabDrivePatched) return;

    previousConnect = window.AudioNode.prototype.connect;

    window.AudioNode.prototype.connect = function connectWithDrive(destination, ...rest) {
      const result = previousConnect.call(this, destination, ...rest);

      try {
        if (isDestinationNode(destination)) {
          createDriveLayer(this.context, this, destination);
        }
      } catch (_error) {
        // Drive is optional. The dry synth path must keep working.
      }

      return result;
    };

    window.AudioNode.prototype.__merrinlabDrivePatched = true;
  }

  function formatReadout(key) {
    if (key === "mix") return `${Math.round(state.mix * 100)}%`;
    if (key === "drive") return `${Math.round(state.drive * 100)}%`;
    if (key === "tone") return `${Math.round(state.tone * 100)}%`;
    return "";
  }

  function syncDriveControls() {
    document.querySelectorAll('[data-drive-control="mix"]').forEach((control) => {
      control.value = String(Math.round(state.mix * 100));
    });
    document.querySelectorAll('[data-drive-control="drive"]').forEach((control) => {
      control.value = String(Math.round(state.drive * 100));
    });
    document.querySelectorAll('[data-drive-control="tone"]').forEach((control) => {
      control.value = String(Math.round(state.tone * 100));
    });

    document.querySelectorAll('[data-drive-readout="mix"]').forEach((readout) => {
      readout.textContent = formatReadout("mix");
    });
    document.querySelectorAll('[data-drive-readout="drive"]').forEach((readout) => {
      readout.textContent = formatReadout("drive");
    });
    document.querySelectorAll('[data-drive-readout="tone"]').forEach((readout) => {
      readout.textContent = formatReadout("tone");
    });
  }

  function handleDriveInput(event) {
    const control = event.target.closest("[data-drive-control]");
    if (!control) return;

    const key = control.dataset.driveControl;
    if (key === "mix") state.mix = clamp(Number(control.value) / 100, 0, 1, state.mix);
    if (key === "drive") state.drive = clamp(Number(control.value) / 100, 0, 1, state.drive);
    if (key === "tone") state.tone = clamp(Number(control.value) / 100, 0, 1, state.tone);

    syncDriveControls();
    applyDriveParameters();
  }

  function createDriveModule() {
    const effectsGrid = document.querySelector(".effects-section-grid");
    if (!effectsGrid) return false;
    if (document.querySelector(".drive-module")) return true;

    const driveModule = document.createElement("article");
    driveModule.className = "module drive-module effect-child-module compact-source-module";
    driveModule.innerHTML = `
      <div class="module-header"><span class="status-light"></span><h2>Drive</h2></div>
      <div class="control-grid three-up">
        <div class="control is-audio-linked">
          <div class="control-label">Mix</div>
          <div class="knob knob-large"></div>
          <div class="drive-control-wrap">
            <input type="range" min="0" max="100" step="1" value="0" data-drive-control="mix">
            <output class="drive-readout" data-drive-readout="mix">0%</output>
          </div>
        </div>
        <div class="control is-audio-linked">
          <div class="control-label">Drive</div>
          <div class="knob knob-large"></div>
          <div class="drive-control-wrap">
            <input type="range" min="0" max="100" step="1" value="35" data-drive-control="drive">
            <output class="drive-readout" data-drive-readout="drive">35%</output>
          </div>
        </div>
        <div class="control is-audio-linked">
          <div class="control-label">Tone</div>
          <div class="knob knob-large"></div>
          <div class="drive-control-wrap">
            <input type="range" min="0" max="100" step="1" value="55" data-drive-control="tone">
            <output class="drive-readout" data-drive-readout="tone">55%</output>
          </div>
        </div>
      </div>
    `;

    effectsGrid.prepend(driveModule);
    syncDriveControls();
    return true;
  }

  function addStyles() {
    if (document.querySelector("#drive-effect-layer-styles")) return;

    const style = document.createElement("style");
    style.id = "drive-effect-layer-styles";
    style.textContent = `
      .drive-module .drive-control-wrap {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
        margin-top: 6px;
      }

      .drive-module input[type="range"] {
        width: 100%;
        accent-color: #d7b884;
      }

      .drive-readout {
        color: #d6c8b5;
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }

      body.is-audio-started .drive-module .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }

      .effects-section-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    `;

    document.head.append(style);
  }

  function loadEnvelopeFollowerLayer() {
    if (document.querySelector('script[src="envelope-follower-dynamic-modulation-layer.js"]')) return;

    const script = document.createElement("script");
    script.src = "envelope-follower-dynamic-modulation-layer.js";
    script.defer = true;
    document.head.append(script);
  }

  function initDrive() {
    patchConnect();
    addStyles();

    if (!createDriveModule()) {
      window.setTimeout(initDrive, 100);
      return;
    }

    syncDriveControls();
    loadEnvelopeFollowerLayer();
  }

  document.addEventListener("input", handleDriveInput);
  document.addEventListener("change", handleDriveInput);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDrive);
  } else {
    initDrive();
  }
})();
