(() => {
  "use strict";

  function audioApi() {
    return window.MerrinLabAudio || null;
  }

  function moduleRoot() {
    return document.querySelector("[data-filter-ring-module]");
  }

  function engineState() {
    return audioApi()?.getState?.()?.filterRing || { level: 0, active: false };
  }

  function updateInterface() {
    const root = moduleRoot();
    if (!root) return;
    const state = engineState();
    const level = root.querySelector("[data-filter-ring-level]");
    const levelReadout = root.querySelector("[data-filter-ring-level-readout]");
    const status = root.querySelector("[data-filter-ring-status]");
    const percent = Math.round((Number(state.level) || 0) * 100);
    if (level) level.value = String(percent);
    if (levelReadout) levelReadout.textContent = `${percent}%`;
    if (status) status.textContent = state.active ? `Active · ${percent}%` : "Off";
    root.classList.toggle("is-filter-ring-active", Boolean(state.active));
  }

  function handleControl(event) {
    const level = event.target.closest("[data-filter-ring-level]");
    if (!level) return;
    audioApi()?.setParameter?.("filterRingLevel", Math.min(1, Math.max(0, Number(level.value) / 100)));
    updateInterface();
  }

  function updateMeter(event) {
    const root = moduleRoot();
    if (!root) return;
    const detail = event.detail || {};
    const level = Math.min(1, Math.max(0, Number(detail.peak) || 0));
    const meter = root.querySelector("[data-filter-ring-meter]");
    const readout = root.querySelector("[data-filter-ring-meter-readout]");
    if (meter) meter.value = level;
    if (readout) {
      if (detail.clipping) readout.textContent = "CLIP";
      else if (!engineState().active || level < 0.01) readout.textContent = "silent";
      else readout.textContent = `${Math.round(level * 100)}%`;
    }
    root.classList.toggle("is-filter-ring-clipping", Boolean(detail.clipping));
  }

  function addStyles() {
    if (document.querySelector("#filter-ring-layer-styles")) return;
    const style = document.createElement("style");
    style.id = "filter-ring-layer-styles";
    style.textContent = `
      .filter-ring-module { border-color: rgba(196, 112, 169, 0.7) !important; display: grid; gap: 14px; }
      .filter-ring-module .module-header { grid-template-columns: auto minmax(0, 1fr) auto; }
      .filter-ring-module .module-header h2 { color: #f4d8eb !important; font-size: 0.78rem; }
      .filter-ring-status { color: #d8bfd0; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
      .filter-ring-module.is-filter-ring-active .status-light { background: #ef92ce; box-shadow: 0 0 12px rgba(239, 146, 206, 0.72); }
      .filter-ring-equation { align-items: stretch; display: grid; gap: 8px; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); }
      .filter-ring-source { background: rgba(44, 25, 38, 0.65); border: 1px solid rgba(196, 112, 169, 0.42); border-radius: 10px; display: grid; gap: 4px; min-width: 0; padding: 10px; }
      .filter-ring-source strong { color: #f4d8eb; font-size: 0.68rem; letter-spacing: 0.06em; text-transform: uppercase; }
      .filter-ring-source span { color: #cbb7c5; font-size: 0.58rem; line-height: 1.3; }
      .filter-ring-multiply { align-self: center; color: #ef92ce; font-size: 1.45rem; font-weight: 900; }
      .filter-ring-result { background: rgba(11, 14, 18, 0.68); border: 1px solid rgba(239, 146, 206, 0.36); border-radius: 10px; color: #efd9e8; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.05em; padding: 9px; text-align: center; text-transform: uppercase; }
      .filter-ring-level { display: grid; gap: 7px; }
      .filter-ring-level-heading { align-items: center; display: flex; justify-content: space-between; }
      .filter-ring-level-heading span { color: #f4d8eb; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
      .filter-ring-level-heading output { color: #ef92ce; font-size: 0.7rem; font-variant-numeric: tabular-nums; font-weight: 800; }
      .filter-ring-level input { accent-color: #ef92ce; min-width: 0; width: 100%; }
      .filter-ring-output { align-items: center; display: grid; gap: 7px; grid-template-columns: auto minmax(0, 1fr) 42px; }
      .filter-ring-output > span, .filter-ring-output > output { color: #cbb7c5; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
      .filter-ring-output meter { accent-color: #ef92ce; height: 10px; width: 100%; }
      .filter-ring-output output { font-variant-numeric: tabular-nums; text-align: right; }
      .filter-ring-module.is-filter-ring-clipping .filter-ring-output output { color: #ff896f; font-weight: 900; }
      .filter-ring-note { color: #aa9ca6; font-size: 0.58rem; line-height: 1.4; margin: 0; text-align: center; }
    `;
    document.head.append(style);
  }

  function init() {
    if (!moduleRoot()) return;
    addStyles();
    updateInterface();
  }

  document.addEventListener("input", handleControl);
  document.addEventListener("change", handleControl);
  document.addEventListener("merrinlab:filter-ring-meter", updateMeter);
  document.addEventListener("merrinlab:gate-state", () => window.setTimeout(updateInterface, 0));

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
