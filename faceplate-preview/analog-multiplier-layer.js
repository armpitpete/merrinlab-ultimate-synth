(() => {
  "use strict";

  let meterLevel = 0;

  function audioApi() {
    return window.MerrinLabAudio || null;
  }

  function moduleRoot() {
    return document.querySelector(".analog-multiplier-module");
  }

  function sourceOptions() {
    return audioApi()?.getAnalogMultiplierOptions?.() || [
      { value: "off", label: "Off" },
      { value: "vco1", label: "VCO 1" },
      { value: "vco2", label: "VCO 2" },
      { value: "vco3", label: "VCO 3" },
      { value: "noise", label: "Noise" },
      { value: "lfo1", label: "LFO 1" },
      { value: "lfo2", label: "LFO 2" },
      { value: "envelope", label: "Envelope" },
      { value: "sampleHold", label: "Sample & Hold" },
      { value: "gate", label: "Gate" },
      { value: "mainVca", label: "Main VCA" },
    ];
  }

  function engineState() {
    return audioApi()?.getState?.()?.analogMultiplier || { x: "off", y: "off", active: false };
  }

  function sourceLabel(value) {
    return sourceOptions().find((option) => option.value === value)?.label || value;
  }

  function populateSelect(select) {
    if (!select || select.options.length) return;
    for (const option of sourceOptions()) {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      select.append(element);
    }
  }

  function updateInterface() {
    const root = moduleRoot();
    if (!root) return;
    const state = engineState();
    const x = root.querySelector('[data-analog-multiplier-control="x"]');
    const y = root.querySelector('[data-analog-multiplier-control="y"]');
    populateSelect(x);
    populateSelect(y);
    if (x) x.value = state.x || "off";
    if (y) y.value = state.y || "off";

    const status = root.querySelector("[data-analog-multiplier-status]");
    const equation = root.querySelector("[data-analog-multiplier-equation]");
    if (status) status.textContent = state.active ? "XY active" : "Off";
    if (equation) {
      equation.textContent = state.active
        ? `${sourceLabel(state.x)} × ${sourceLabel(state.y)} → XY-OUT`
        : "Select X and Y · XY-OUT is silent";
    }
    root.classList.toggle("is-analog-multiplier-active", Boolean(state.active));
  }

  function handleControl(event) {
    const control = event.target.closest("[data-analog-multiplier-control]");
    if (!control) return;
    const key = control.dataset.analogMultiplierControl === "x" ? "analogMultiplierX" : "analogMultiplierY";
    audioApi()?.setParameter?.(key, control.value);
    updateInterface();
  }

  function updateMeter(event) {
    const root = moduleRoot();
    if (!root) return;
    const detail = event.detail || {};
    meterLevel = Math.min(1, Math.max(0, Number(detail.peak) || 0));
    const meter = root.querySelector("[data-analog-multiplier-meter]");
    const readout = root.querySelector("[data-analog-multiplier-meter-readout]");
    if (meter) meter.value = meterLevel;
    if (readout) {
      if (detail.clipping) readout.textContent = "CLIP";
      else if (meterLevel < 0.01) readout.textContent = "silent";
      else readout.textContent = `${Math.round(meterLevel * 100)}%`;
    }
    root.classList.toggle("is-analog-multiplier-clipping", Boolean(detail.clipping));
  }

  function installMarkup() {
    const root = moduleRoot();
    if (!root || root.dataset.analogMultiplierLive === "true") return;
    root.dataset.analogMultiplierLive = "true";
    root.innerHTML = `
      <div class="module-header">
        <span class="status-light"></span>
        <h2>Analog Multiplier</h2>
        <output class="analog-multiplier-status" data-analog-multiplier-status>Off</output>
      </div>
      <div class="analog-multiplier-path" data-analog-multiplier-equation>Select X and Y · XY-OUT is silent</div>
      <div class="analog-multiplier-controls">
        <label class="analog-multiplier-control">
          <span>X-IN</span>
          <select data-analog-multiplier-control="x" aria-label="Analog Multiplier X input source"></select>
        </label>
        <div class="analog-multiplier-symbol" aria-hidden="true">×</div>
        <label class="analog-multiplier-control">
          <span>Y-IN</span>
          <select data-analog-multiplier-control="y" aria-label="Analog Multiplier Y input source"></select>
        </label>
      </div>
      <div class="analog-multiplier-output" aria-label="Analog Multiplier XY output level">
        <span>XY-OUT</span>
        <meter min="0" max="1" value="0" data-analog-multiplier-meter></meter>
        <output data-analog-multiplier-meter-readout>silent</output>
      </div>
      <div class="analog-multiplier-route-note">Route XY-OUT by selecting <strong>XY Multiplier</strong> in the Signal Mixer.</div>
    `;
  }

  function addStyles() {
    if (document.querySelector("#analog-multiplier-layer-styles")) return;
    const style = document.createElement("style");
    style.id = "analog-multiplier-layer-styles";
    style.textContent = `
      .analog-multiplier-module { display: grid; gap: 10px; }
      .analog-multiplier-module .module-header { grid-template-columns: auto minmax(0, 1fr) auto; }
      .analog-multiplier-status { color: #d6c8b5; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
      .analog-multiplier-module.is-analog-multiplier-active .status-light { background: #93d36c; box-shadow: 0 0 10px rgba(147, 211, 108, 0.65); }
      .analog-multiplier-path { background: rgba(11, 14, 18, 0.56); border: 1px solid rgba(215, 184, 132, 0.2); border-radius: 8px; color: #d6c8b5; font-size: 0.58rem; line-height: 1.35; padding: 7px; text-align: center; }
      .analog-multiplier-controls { align-items: end; display: grid; gap: 7px; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); }
      .analog-multiplier-control { display: grid; gap: 4px; min-width: 0; }
      .analog-multiplier-control > span, .analog-multiplier-output > span { color: #eee4d6; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
      .analog-multiplier-control select { background: #211913; border: 1px solid rgba(215, 184, 132, 0.38); border-radius: 999px; color: #f3e8da; font: inherit; font-size: 0.66rem; min-width: 0; padding: 5px 8px; width: 100%; }
      .analog-multiplier-symbol { color: #93d36c; font-size: 1rem; font-weight: 900; padding-bottom: 4px; }
      .analog-multiplier-output { align-items: center; display: grid; gap: 5px; grid-template-columns: auto minmax(0, 1fr) 38px; }
      .analog-multiplier-output meter { accent-color: #93d36c; height: 8px; width: 100%; }
      .analog-multiplier-output output { color: #bdb1a1; font-size: 0.55rem; font-variant-numeric: tabular-nums; text-align: right; text-transform: uppercase; }
      .analog-multiplier-module.is-analog-multiplier-clipping .analog-multiplier-output output { color: #ff896f; font-weight: 800; }
      .analog-multiplier-route-note { color: #bdb1a1; font-size: 0.56rem; line-height: 1.35; text-align: center; }
      .analog-multiplier-route-note strong { color: #93d36c; }
    `;
    document.head.append(style);
  }

  function init() {
    if (!moduleRoot()) return;
    installMarkup();
    addStyles();
    updateInterface();
  }

  document.addEventListener("input", handleControl);
  document.addEventListener("change", handleControl);
  document.addEventListener("merrinlab:analog-multiplier-meter", updateMeter);
  document.addEventListener("merrinlab:gate-state", () => window.setTimeout(updateInterface, 0));

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
