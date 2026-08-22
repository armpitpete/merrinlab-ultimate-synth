(() => {
  "use strict";

  const shapes = [
    ["sine", "Sine"],
    ["triangle", "Triangle"],
    ["square", "Square"],
    ["rampUp", "Ramp Up"],
    ["rampDown", "Ramp Down"],
  ];
  const ranges = [["low", "Low"], ["high", "High"]];

  function findSourceControl(key) {
    return document.querySelector(`.audio-voice-panel [data-audio-control="${key}"]`);
  }

  function createSelect(key, options) {
    const select = document.createElement("select");
    select.className = "lfo-faceplate-select";
    select.dataset.lfoControl = key;
    options.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.append(option);
    });
    select.value = findSourceControl(key)?.value || options[0][0];
    return select;
  }

  function sendToEngine(key, value) {
    const source = findSourceControl(key);
    if (!source) return;
    source.value = value;
    source.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function syncControl(key, value) {
    document.querySelectorAll(`[data-lfo-control="${key}"]`).forEach((control) => {
      control.value = value;
    });
  }

  function installFaceplateControls(which) {
    const module = document.querySelector(which === "lfo1" ? ".lfo1-module" : ".lfo2-module");
    if (!module) return false;
    const shapeKey = `${which}Shape`;
    const rangeKey = `${which}Range`;
    const shapeBank = module.querySelector(".lfo-shape-bank");
    const rangeControl = module.querySelector(".lfo-range");

    if (shapeBank && !shapeBank.querySelector(`[data-lfo-control="${shapeKey}"]`)) {
      shapeBank.append(createSelect(shapeKey, shapes));
    }
    if (rangeControl && !rangeControl.querySelector(`[data-lfo-control="${rangeKey}"]`)) {
      rangeControl.append(createSelect(rangeKey, ranges));
    }
    module.classList.add("is-lfo-control-linked");
    return true;
  }

  function addStyles() {
    if (document.querySelector("#lfo-shape-control-styles")) return;
    const style = document.createElement("style");
    style.id = "lfo-shape-control-styles";
    style.textContent = `
      .lfo-faceplate-select {
        width: 100%;
        min-width: 0;
        border: 1px solid rgba(215, 184, 132, 0.38);
        border-radius: 999px;
        padding: 4px 6px;
        background: #211913;
        color: #f3e8da;
        font: inherit;
        font-size: 0.68rem;
      }
      .lfo-module.is-lfo-control-linked .lfo-shape-bank > .wave-box,
      .lfo-module.is-lfo-control-linked .lfo-shape-bank > .switch-control,
      .lfo-module.is-lfo-control-linked .lfo-range > .switch-control,
      .lfo-module.is-lfo-control-linked .lfo-outputs .dual-jacks { display: none; }
      .lfo-route-note {
        color: #d6c8b5;
        font-size: 0.58rem;
        line-height: 1.25;
        text-align: center;
      }
    `;
    document.head.append(style);
  }

  function installRouteNotes() {
    document.querySelectorAll(".lfo-module .lfo-outputs").forEach((control) => {
      if (control.querySelector(".lfo-route-note")) return;
      const note = document.createElement("div");
      note.className = "lfo-route-note";
      note.textContent = "Route through Attenuators";
      control.append(note);
    });
  }

  function loadAdsrVisibleBridge() {
    if (document.querySelector('script[src="adsr-visible-controls.js"]')) return;
    const script = document.createElement("script");
    script.src = "adsr-visible-controls.js";
    script.defer = true;
    document.head.append(script);
  }

  function handleInput(event) {
    const control = event.target.closest("[data-lfo-control]");
    if (!control) return;
    sendToEngine(control.dataset.lfoControl, control.value);
    syncControl(control.dataset.lfoControl, control.value);
  }

  function syncFromEngine(event) {
    const source = event.target.closest('[data-audio-control^="lfo1"], [data-audio-control^="lfo2"]');
    const key = source?.dataset.audioControl || "";
    if (!key.endsWith("Shape") && !key.endsWith("Range")) return;
    syncControl(key, source.value);
  }

  function init() {
    if (!document.querySelector(".audio-voice-panel")) {
      window.setTimeout(init, 50);
      return;
    }
    addStyles();
    installFaceplateControls("lfo1");
    installFaceplateControls("lfo2");
    installRouteNotes();
    loadAdsrVisibleBridge();
    ["lfo1Shape", "lfo1Range", "lfo2Shape", "lfo2Range"].forEach((key) => {
      const source = findSourceControl(key);
      if (source) syncControl(key, source.value);
    });
  }

  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleInput);
  document.addEventListener("input", syncFromEngine, true);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
