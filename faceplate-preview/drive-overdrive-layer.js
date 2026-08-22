(() => {
  "use strict";

  const state = {
    mix: 0,
    drive: 0.35,
    tone: 0.55,
  };

  function clamp(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function applyDriveParameters() {
    window.MerrinLabEffectsOutputGraph?.setParameters("drive", state);
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
