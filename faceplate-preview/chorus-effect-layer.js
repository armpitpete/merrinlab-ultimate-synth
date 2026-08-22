(() => {
  "use strict";

  const state = {
    mix: 0,
    rate: 0.8,
    depth: 0.35,
  };

  function clamp(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function applyChorusParameters() {
    window.MerrinLabEffectsOutputGraph?.setParameters("chorus", state);
  }

  function formatReadout(key) {
    if (key === "mix") return `${Math.round(state.mix * 100)}%`;
    if (key === "rate") return `${state.rate.toFixed(2)} Hz`;
    if (key === "depth") return `${Math.round(state.depth * 100)}%`;
    return "";
  }

  function syncChorusControls() {
    document.querySelectorAll('[data-chorus-control="mix"]').forEach((control) => {
      control.value = String(Math.round(state.mix * 100));
    });
    document.querySelectorAll('[data-chorus-control="rate"]').forEach((control) => {
      control.value = String(state.rate);
    });
    document.querySelectorAll('[data-chorus-control="depth"]').forEach((control) => {
      control.value = String(Math.round(state.depth * 100));
    });

    document.querySelectorAll('[data-chorus-readout="mix"]').forEach((readout) => {
      readout.textContent = formatReadout("mix");
    });
    document.querySelectorAll('[data-chorus-readout="rate"]').forEach((readout) => {
      readout.textContent = formatReadout("rate");
    });
    document.querySelectorAll('[data-chorus-readout="depth"]').forEach((readout) => {
      readout.textContent = formatReadout("depth");
    });
  }

  function handleChorusInput(event) {
    const control = event.target.closest("[data-chorus-control]");
    if (!control) return;

    const key = control.dataset.chorusControl;
    if (key === "mix") state.mix = clamp(Number(control.value) / 100, 0, 1, state.mix);
    if (key === "rate") state.rate = clamp(control.value, 0.1, 5, state.rate);
    if (key === "depth") state.depth = clamp(Number(control.value) / 100, 0, 1, state.depth);

    syncChorusControls();
    applyChorusParameters();
  }

  function createChorusModule() {
    const effectsGrid = document.querySelector(".effects-section-grid");
    if (!effectsGrid) return false;
    if (document.querySelector(".chorus-module")) return true;

    const chorusModule = document.createElement("article");
    chorusModule.className = "module chorus-module effect-child-module compact-source-module";
    chorusModule.innerHTML = `
      <div class="module-header"><span class="status-light"></span><h2>Chorus</h2></div>
      <div class="control-grid three-up">
        <div class="control is-audio-linked">
          <div class="control-label">Mix</div>
          <div class="knob knob-large"></div>
          <div class="chorus-control-wrap">
            <input type="range" min="0" max="100" step="1" value="0" data-chorus-control="mix">
            <output class="chorus-readout" data-chorus-readout="mix">0%</output>
          </div>
        </div>
        <div class="control is-audio-linked">
          <div class="control-label">Rate</div>
          <div class="knob knob-large"></div>
          <div class="chorus-control-wrap">
            <input type="range" min="0.1" max="5" step="0.01" value="0.8" data-chorus-control="rate">
            <output class="chorus-readout" data-chorus-readout="rate">0.80 Hz</output>
          </div>
        </div>
        <div class="control is-audio-linked">
          <div class="control-label">Depth</div>
          <div class="knob knob-large"></div>
          <div class="chorus-control-wrap">
            <input type="range" min="0" max="100" step="1" value="35" data-chorus-control="depth">
            <output class="chorus-readout" data-chorus-readout="depth">35%</output>
          </div>
        </div>
      </div>
    `;

    effectsGrid.append(chorusModule);
    syncChorusControls();
    return true;
  }

  function addStyles() {
    if (document.querySelector("#chorus-effect-layer-styles")) return;

    const style = document.createElement("style");
    style.id = "chorus-effect-layer-styles";
    style.textContent = `
      .chorus-module .chorus-control-wrap {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
        margin-top: 6px;
      }

      .chorus-module input[type="range"] {
        width: 100%;
        accent-color: #d7b884;
      }

      .chorus-readout {
        color: #d6c8b5;
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }

      body.is-audio-started .chorus-module .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }

      .effects-section-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    `;

    document.head.append(style);
  }

  function loadDriveEffectLayer() {
    if (document.querySelector('script[src="drive-overdrive-layer.js"]')) return;

    const script = document.createElement("script");
    script.src = "drive-overdrive-layer.js";
    script.defer = true;
    document.head.append(script);
  }

  function initChorus() {
    addStyles();

    if (!createChorusModule()) {
      window.setTimeout(initChorus, 100);
      return;
    }

    syncChorusControls();
    loadDriveEffectLayer();
  }

  document.addEventListener("input", handleChorusInput);
  document.addEventListener("change", handleChorusInput);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChorus);
  } else {
    initChorus();
  }
})();
