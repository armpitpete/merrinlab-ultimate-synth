(() => {
  "use strict";

  const shapes = [
    ["sine", "Sine"],
    ["triangle", "Triangle"],
    ["square", "Square"],
    ["rampUp", "Ramp Up"],
    ["rampDown", "Ramp Down"],
  ];

  const state = {
    lfo1Shape: "sine",
    lfo2Shape: "sine",
  };

  const lfoNodes = {
    lfo1: null,
    lfo2: null,
  };

  const contextOscillatorCounts = new WeakMap();

  function patchOscillatorCreation() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass || AudioContextClass.prototype.__merrinlabLfoShapePatched) return;

    const originalCreateOscillator = AudioContextClass.prototype.createOscillator;

    AudioContextClass.prototype.createOscillator = function createOscillatorWithLfoShapeCapture(...args) {
      const oscillator = originalCreateOscillator.apply(this, args);
      const nextCount = (contextOscillatorCounts.get(this) || 0) + 1;
      contextOscillatorCounts.set(this, nextCount);

      if (nextCount === 4) {
        lfoNodes.lfo1 = oscillator;
        window.setTimeout(() => applyLfoShape("lfo1"), 0);
      }

      if (nextCount === 5) {
        lfoNodes.lfo2 = oscillator;
        window.setTimeout(() => applyLfoShape("lfo2"), 0);
      }

      return oscillator;
    };

    AudioContextClass.prototype.__merrinlabLfoShapePatched = true;
  }

  function createRampWave(context, inverted = false) {
    const harmonicCount = 64;
    const real = new Float32Array(harmonicCount + 1);
    const imag = new Float32Array(harmonicCount + 1);

    for (let n = 1; n <= harmonicCount; n += 1) {
      const sign = n % 2 === 0 ? -1 : 1;
      imag[n] = (inverted ? -1 : 1) * sign * (2 / (n * Math.PI));
    }

    return context.createPeriodicWave(real, imag, {
      disableNormalization: false,
    });
  }

  function applyLfoShape(which) {
    const oscillator = lfoNodes[which];
    if (!oscillator) return;

    const key = which === "lfo1" ? "lfo1Shape" : "lfo2Shape";
    const shape = state[key];

    try {
      if (shape === "rampUp") {
        oscillator.setPeriodicWave(createRampWave(oscillator.context, false));
        return;
      }

      if (shape === "rampDown") {
        oscillator.setPeriodicWave(createRampWave(oscillator.context, true));
        return;
      }

      oscillator.type = shape;
    } catch (_error) {
      // Shape changes are optional. The running audio graph should not break.
    }
  }

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function createShapeSelect(key, className) {
    const select = document.createElement("select");
    select.className = className;
    select.dataset.lfoShapeControl = key;

    shapes.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.append(option);
    });

    select.value = state[key];
    return select;
  }

  function updateShapeControls(key) {
    document.querySelectorAll(`[data-lfo-shape-control="${key}"]`).forEach((control) => {
      control.value = state[key];
    });
  }

  function addFirstVoiceControls() {
    const panel = document.querySelector(".audio-voice-panel");
    if (!panel || panel.querySelector(".merrinlab-lfo-shape-panel")) return false;

    const group = document.createElement("section");
    group.className = "audio-control-group merrinlab-lfo-shape-panel";
    group.innerHTML = `
      <h3 class="audio-group-title">LFO Shape</h3>
      <label class="audio-select-row">
        <span>LFO 1 Shape</span>
      </label>
      <label class="audio-select-row">
        <span>LFO 2 Shape</span>
      </label>
    `;

    const rows = group.querySelectorAll(".audio-select-row");
    const lfo1Select = createShapeSelect("lfo1Shape", "lfo-shape-select");
    const lfo2Select = createShapeSelect("lfo2Shape", "lfo-shape-select");
    rows[0].append(lfo1Select, document.createElement("output"));
    rows[1].append(lfo2Select, document.createElement("output"));

    const modulationGroup = Array.from(panel.querySelectorAll(".audio-control-group")).find((section) => {
      return normalizeText(section.querySelector(".audio-group-title")?.textContent) === "Filter Modulation";
    });

    if (modulationGroup) {
      modulationGroup.insertAdjacentElement("afterend", group);
    } else {
      panel.append(group);
    }

    return true;
  }

  function addFaceplateShapeControl(which) {
    const moduleSelector = which === "lfo1" ? ".lfo1-module" : ".lfo2-module";
    const key = which === "lfo1" ? "lfo1Shape" : "lfo2Shape";
    const module = document.querySelector(moduleSelector);
    if (!module || module.querySelector(`[data-lfo-shape-control="${key}"]`)) return false;

    const shapeBank = module.querySelector(".lfo-shape-bank");
    if (!shapeBank) return false;

    const select = createShapeSelect(key, "lfo-shape-faceplate-select");
    shapeBank.append(select);
    module.classList.add("is-lfo-shape-linked");
    return true;
  }

  function addStyles() {
    if (document.querySelector("#lfo-shape-control-styles")) return;

    const style = document.createElement("style");
    style.id = "lfo-shape-control-styles";
    style.textContent = `
      .lfo-shape-select,
      .lfo-shape-faceplate-select {
        border: 1px solid rgba(215, 184, 132, 0.38);
        border-radius: 999px;
        padding: 4px 6px;
        background: #211913;
        color: #f3e8da;
        font: inherit;
        font-size: 0.68rem;
        min-width: 0;
      }

      .lfo-shape-faceplate-select {
        width: 100%;
        margin-top: 6px;
      }

      .lfo-module.is-lfo-shape-linked .lfo-shape-bank {
        outline: 1px solid rgba(147, 211, 108, 0.45);
        outline-offset: 3px;
        border-radius: 12px;
      }
    `;

    document.head.append(style);
  }

  function loadAdsrVisibleBridge() {
    if (document.querySelector('script[src="adsr-visible-controls.js"]')) return;

    const script = document.createElement("script");
    script.src = "adsr-visible-controls.js";
    script.defer = true;
    document.head.append(script);
  }

  function handleShapeInput(event) {
    const control = event.target.closest("[data-lfo-shape-control]");
    if (!control) return;

    const key = control.dataset.lfoShapeControl;
    state[key] = control.value;
    updateShapeControls(key);
    applyLfoShape(key === "lfo1Shape" ? "lfo1" : "lfo2");
  }

  function initLfoShapeControls() {
    addStyles();

    const sourcePanel = document.querySelector(".audio-voice-panel");
    if (!sourcePanel) {
      window.setTimeout(initLfoShapeControls, 50);
      return;
    }

    addFirstVoiceControls();
    addFaceplateShapeControl("lfo1");
    addFaceplateShapeControl("lfo2");
    updateShapeControls("lfo1Shape");
    updateShapeControls("lfo2Shape");
    loadAdsrVisibleBridge();
  }

  patchOscillatorCreation();
  document.addEventListener("input", handleShapeInput);
  document.addEventListener("change", handleShapeInput);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLfoShapeControls);
  } else {
    initLfoShapeControls();
  }
})();
