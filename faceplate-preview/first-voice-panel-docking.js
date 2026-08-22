(() => {
  "use strict";

  const reverbState = {
    mix: 0,
    size: 0.45,
  };

  const reverbLimits = {
    mix: [0, 1],
    size: [0.1, 1],
  };

  let uiRetryCount = 0;

  function dockFirstVoicePanel() {
    if (document.querySelector("#first-voice-panel-docking-styles")) return;

    const style = document.createElement("style");
    style.id = "first-voice-panel-docking-styles";
    style.textContent = `
      .audio-voice-panel {
        position: static !important;
        width: 1680px !important;
        max-width: none !important;
        max-height: none !important;
        overflow: visible !important;
        margin: 12px auto !important;
      }

      .reverb-module .reverb-control-wrap {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
        margin-top: 6px;
      }

      .reverb-module input[type="range"] {
        width: 100%;
        accent-color: #d7b884;
      }

      .reverb-readout {
        color: #d6c8b5;
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }

      body.is-audio-started .reverb-module .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }
    `;

    document.head.append(style);
  }

  function clamp(value, key) {
    const [min, max] = reverbLimits[key];
    const number = Number(value);
    if (!Number.isFinite(number)) return reverbState[key];
    return Math.min(max, Math.max(min, number));
  }

  function applyReverbParameters() {
    window.MerrinLabEffectsOutputGraph?.setParameters("reverb", {
      mix: clamp(reverbState.mix, "mix"),
      size: clamp(reverbState.size, "size"),
    });
  }

  function formatReverbValue(key) {
    if (key === "mix") return `${Math.round(reverbState.mix * 100)}%`;
    return `${Math.round(reverbState.size * 100)}%`;
  }

  function syncReverbControls() {
    ["mix", "size"].forEach((key) => {
      document.querySelectorAll(`[data-reverb-control="${key}"]`).forEach((control) => {
        control.value = String(reverbState[key]);
      });

      document.querySelectorAll(`[data-reverb-readout="${key}"]`).forEach((readout) => {
        readout.textContent = formatReverbValue(key);
      });
    });
  }

  function handleReverbInput(event) {
    const control = event.target.closest("[data-reverb-control]");
    if (!control) return;

    const key = control.dataset.reverbControl;
    reverbState[key] = clamp(control.value, key);
    syncReverbControls();
    applyReverbParameters();
  }

  function createFirstVoiceReverbControls() {
    const panel = document.querySelector(".audio-voice-panel");
    if (!panel || panel.querySelector(".merrinlab-reverb-panel")) return false;

    const group = document.createElement("section");
    group.className = "audio-control-group merrinlab-reverb-panel";
    group.innerHTML = `
      <h3 class="audio-group-title">Reverb</h3>
      <label class="audio-slider-row">
        <span>Reverb Mix</span>
        <input type="range" min="0" max="1" step="0.01" value="0" data-reverb-control="mix">
        <output data-reverb-readout="mix">0%</output>
      </label>
      <label class="audio-slider-row">
        <span>Reverb Size</span>
        <input type="range" min="0.1" max="1" step="0.01" value="0.45" data-reverb-control="size">
        <output data-reverb-readout="size">45%</output>
      </label>
    `;

    const outputGroup = Array.from(panel.querySelectorAll(".audio-control-group")).find((section) => {
      return section.querySelector(".audio-group-title")?.textContent === "Output";
    });

    if (outputGroup) {
      panel.insertBefore(group, outputGroup);
    } else {
      panel.append(group);
    }

    return true;
  }

  function createFaceplateReverbControls() {
    if (document.querySelector(".reverb-module")) return true;

    const delayModule = document.querySelector(".delay-module");
    const repeatModule = document.querySelector(".repeat-module");
    const ultimateGrid = document.querySelector(".ultimate-grid");
    if (!ultimateGrid) return false;

    const reverbModule = document.createElement("article");
    reverbModule.className = "module reverb-module compact-source-module";
    reverbModule.innerHTML = `
      <div class="module-header"><span class="status-light"></span><h2>Reverb</h2></div>
      <div class="control-grid two-up">
        <div class="control is-audio-linked">
          <div class="control-label">Mix</div>
          <div class="knob knob-large"></div>
          <div class="reverb-control-wrap">
            <input type="range" min="0" max="1" step="0.01" value="0" data-reverb-control="mix">
            <output class="reverb-readout" data-reverb-readout="mix">0%</output>
          </div>
        </div>
        <div class="control is-audio-linked">
          <div class="control-label">Size</div>
          <div class="knob knob-large"></div>
          <div class="reverb-control-wrap">
            <input type="range" min="0.1" max="1" step="0.01" value="0.45" data-reverb-control="size">
            <output class="reverb-readout" data-reverb-readout="size">45%</output>
          </div>
        </div>
      </div>
    `;

    if (delayModule) {
      delayModule.insertAdjacentElement("afterend", reverbModule);
    } else if (repeatModule) {
      repeatModule.insertAdjacentElement("afterend", reverbModule);
    } else {
      ultimateGrid.append(reverbModule);
    }

    return true;
  }

  function installReverbUi() {
    const panelReady = createFirstVoiceReverbControls();
    const faceplateReady = createFaceplateReverbControls();
    syncReverbControls();

    if ((!panelReady || !faceplateReady) && uiRetryCount < 30) {
      uiRetryCount += 1;
      window.setTimeout(installReverbUi, 100);
    }
  }

  function loadDebugEnginePanelCollapse() {
    if (document.querySelector('script[src="debug-engine-panel-collapse.js"]')) return;

    const script = document.createElement("script");
    script.src = "debug-engine-panel-collapse.js";
    script.defer = true;
    document.head.append(script);
  }

  function loadArGeneratorBridge() {
    if (document.querySelector('script[src="ar-generator-visible-controls.js"]')) return;

    const script = document.createElement("script");
    script.src = "ar-generator-visible-controls.js";
    script.defer = true;
    document.head.append(script);
  }

  document.addEventListener("input", handleReverbInput);
  document.addEventListener("change", handleReverbInput);

  document.addEventListener("DOMContentLoaded", () => {
    dockFirstVoicePanel();
    installReverbUi();
    loadDebugEnginePanelCollapse();
    loadArGeneratorBridge();
  });
})();
