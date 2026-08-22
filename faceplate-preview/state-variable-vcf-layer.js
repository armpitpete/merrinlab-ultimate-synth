(() => {
  "use strict";

  const CUTOFF_MIN = 90;
  const CUTOFF_MAX = 16000;
  const CUTOFF_SLIDER_MAX = 1000;
  const state = { mode: "bandpass", cutoff: 900, resonance: 0.7, bpWidth: 0.55, level: 0 };
  let meterRaf = null;

  function clamp(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function frequencyToSlider(frequency) {
    const safeFrequency = clamp(frequency, CUTOFF_MIN, CUTOFF_MAX, state.cutoff);
    const position = (Math.log(safeFrequency) - Math.log(CUTOFF_MIN)) / (Math.log(CUTOFF_MAX) - Math.log(CUTOFF_MIN));
    return Math.round(position * CUTOFF_SLIDER_MAX);
  }

  function sliderToFrequency(sliderValue) {
    const position = clamp(sliderValue, 0, CUTOFF_SLIDER_MAX, 0) / CUTOFF_SLIDER_MAX;
    return Math.exp(Math.log(CUTOFF_MIN) + position * (Math.log(CUTOFF_MAX) - Math.log(CUTOFF_MIN)));
  }

  function modeLabel(mode = state.mode) {
    if (mode === "lowpass") return "LP";
    if (mode === "highpass") return "HP";
    return "BP";
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  }

  function applyParameters() {
    window.MerrinLabEffectsOutputGraph?.setParameters("svf", { ...state });
  }

  function updateInterface() {
    const module = document.querySelector("[data-svf-module]");
    if (!module) return;

    module.querySelectorAll('[data-svf-control="mode"]').forEach((control) => { control.value = state.mode; });
    module.querySelectorAll('[data-svf-control="cutoff"]').forEach((control) => { control.value = String(frequencyToSlider(state.cutoff)); });
    module.querySelectorAll('[data-svf-control="resonance"]').forEach((control) => { control.value = String(state.resonance); });
    module.querySelectorAll('[data-svf-control="bpWidth"]').forEach((control) => { control.value = String(Math.round(state.bpWidth * 100)); });
    module.querySelectorAll('[data-svf-control="level"]').forEach((control) => { control.value = String(Math.round(state.level * 100)); });

    setText('[data-svf-readout="cutoff"]', `${Math.round(state.cutoff)} Hz`);
    setText('[data-svf-readout="resonance"]', `${state.resonance.toFixed(1)} Q`);
    setText('[data-svf-readout="bpWidth"]', state.mode === "bandpass" ? `${Math.round(state.bpWidth * 100)}% wide` : "BP only");
    setText('[data-svf-readout="level"]', state.level === 0 ? "0% · dry" : state.level === 1 ? "100% · wet" : `${Math.round(state.level * 100)}% wet`);
    setText("[data-svf-path-mode]", `${modeLabel()} filter`);
    setText("[data-svf-status]", state.level === 0 ? "Bypassed" : `${modeLabel()} · ${Math.round(state.level * 100)}%`);

    const widthControl = module.querySelector("[data-svf-bp-width-control]");
    const widthInput = widthControl?.querySelector('[data-svf-control="bpWidth"]');
    const isBandpass = state.mode === "bandpass";
    if (widthInput) widthInput.disabled = !isBandpass;
    if (widthControl) widthControl.setAttribute("aria-disabled", String(!isBandpass));
    module.classList.toggle("is-svf-bypassed", state.level === 0);
    module.classList.toggle("is-svf-active", state.level > 0);
  }

  function handleControl(event) {
    const control = event.target.closest("[data-svf-control]");
    if (!control) return;

    const key = control.dataset.svfControl;
    if (key === "mode" && ["lowpass", "bandpass", "highpass"].includes(control.value)) state.mode = control.value;
    if (key === "cutoff") state.cutoff = sliderToFrequency(control.value);
    if (key === "resonance") state.resonance = clamp(control.value, 0, 12, state.resonance);
    if (key === "bpWidth") state.bpWidth = clamp(Number(control.value) / 100, 0, 1, state.bpWidth);
    if (key === "level") state.level = clamp(Number(control.value) / 100, 0, 1, state.level);

    updateInterface();
    applyParameters();
  }

  function meterLevel(analyser) {
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (const sample of data) {
      const normalized = (sample - 128) / 128;
      sum += normalized * normalized;
    }
    return clamp(Math.sqrt(sum / data.length) * 3.2, 0, 1, 0);
  }

  function drawMeter() {
    const meter = document.querySelector("[data-svf-meter]");
    const readout = document.querySelector("[data-svf-meter-readout]");
    const analyser = window.MerrinLabEffectsOutputGraph?.getAnalyser("svf");
    const level = analyser && state.level > 0 ? meterLevel(analyser) : 0;
    if (meter) meter.value = level;
    if (readout) readout.textContent = level < 0.01 ? "silent" : level > 0.9 ? "peak" : `${Math.round(level * 100)}%`;
    meterRaf = window.requestAnimationFrame(drawMeter);
  }

  function addStyles() {
    if (document.querySelector("#state-variable-vcf-layer-styles")) return;
    const style = document.createElement("style");
    style.id = "state-variable-vcf-layer-styles";
    style.textContent = `
      .state-variable-vcf-module { display: grid; gap: 10px; }
      .state-variable-vcf-module .module-header { grid-template-columns: auto minmax(0, 1fr) auto; }
      .state-variable-vcf-module .status-light { background: #d19a45; box-shadow: 0 0 8px rgba(209, 154, 69, 0.45); }
      .state-variable-vcf-module.is-svf-active .status-light { background: #93d36c; box-shadow: 0 0 10px rgba(147, 211, 108, 0.65); }
      .svf-status { color: #d6c8b5; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
      .svf-signal-path { align-items: center; background: rgba(11, 14, 18, 0.56); border: 1px solid rgba(215, 184, 132, 0.2); border-radius: 8px; color: #bdb1a1; display: flex; font-size: 0.55rem; gap: 5px; justify-content: center; letter-spacing: 0.04em; padding: 6px; text-transform: uppercase; }
      .svf-signal-path strong { color: #93d36c; font-weight: 800; }
      .svf-mode-control { align-items: center; display: grid; gap: 6px; grid-template-columns: auto minmax(0, 1fr); }
      .svf-mode-control > span { color: #eee4d6; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; }
      .svf-mode-control select { background: #211913; border: 1px solid rgba(215, 184, 132, 0.38); border-radius: 999px; color: #f3e8da; font: inherit; font-size: 0.7rem; padding: 6px 9px; width: 100%; }
      .svf-mode-control select:focus-visible { border-color: rgba(147, 211, 108, 0.86); box-shadow: 0 0 0 2px rgba(147, 211, 108, 0.18); outline: none; }
      .state-variable-vcf-module .svf-control-grid { align-items: stretch; gap: 7px; }
      .state-variable-vcf-module .svf-control-grid .control { border: 1px solid rgba(111, 155, 73, 0.58); border-radius: 12px; display: grid; gap: 4px; min-width: 0; padding: 7px 6px 6px; }
      .state-variable-vcf-module .svf-control-grid input[type="range"] { accent-color: #d7b884; min-width: 0; width: 100%; }
      .state-variable-vcf-module .svf-readout { color: #d6c8b5; font-size: 0.62rem; font-variant-numeric: tabular-nums; text-align: center; white-space: nowrap; }
      .state-variable-vcf-module [data-svf-bp-width-control][aria-disabled="true"] { border-color: rgba(215, 184, 132, 0.16); opacity: 0.52; }
      .svf-output-meter { align-items: center; display: grid; gap: 5px; grid-template-columns: auto minmax(0, 1fr) 34px; }
      .svf-output-meter > span, .svf-output-meter > output { color: #bdb1a1; font-size: 0.55rem; letter-spacing: 0.04em; text-transform: uppercase; }
      .svf-output-meter > output { font-variant-numeric: tabular-nums; text-align: right; }
      .svf-output-meter meter { accent-color: #93d36c; height: 8px; width: 100%; }
    `;
    document.head.append(style);
  }

  function initStateVariableVcf() {
    if (!document.querySelector("[data-svf-module]")) return;
    addStyles();
    updateInterface();
    applyParameters();
    if (meterRaf === null) meterRaf = window.requestAnimationFrame(drawMeter);
  }

  document.addEventListener("input", handleControl);
  document.addEventListener("change", handleControl);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initStateVariableVcf);
  else initStateVariableVcf();
})();
