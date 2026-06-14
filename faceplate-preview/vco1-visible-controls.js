(() => {
  "use strict";

  const waveOptions = [
    ["sawtooth", "Saw"],
    ["square", "Square"],
    ["triangle", "Triangle"],
    ["sine", "Sine"],
    ["pulse", "Pulse"],
  ];

  const repeatGateOptions = [
    ["off", "Off"],
    ["on", "On"],
  ];

  const noteOptions = buildNoteOptions(33, 81);
  const centsOptions = buildCentsOptions();

  const visibleControlConfigs = [
    {
      key: "coarseFreq",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Coarse Freq",
      type: "select",
      options: noteOptions,
      matchNearestOption: true,
    },
    {
      key: "fineCents",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Fine Freq",
      type: "select",
      options: centsOptions,
      matchNearestOption: true,
    },
    {
      key: "waveform",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Waveform",
      type: "select",
      options: waveOptions,
    },
    {
      key: "pulseWidth",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Pulse Width %",
      type: "range",
      min: 10,
      max: 90,
      step: 1,
      unit: "%",
    },
    {
      key: "vcoLevel",
      moduleSelector: ".mixer-module",
      label: "VCO 1 Level",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => (Number(value) / 0.7) * 100,
      toSourceValue: (value) => (Number(value) / 100) * 0.7,
    },
    {
      key: "vco2CoarseFreq",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Coarse Freq",
      type: "select",
      options: noteOptions,
      matchNearestOption: true,
    },
    {
      key: "vco2FineCents",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Fine Freq",
      type: "select",
      options: centsOptions,
      matchNearestOption: true,
    },
    {
      key: "vco2Waveform",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Waveform",
      type: "select",
      options: waveOptions,
    },
    {
      key: "vco2PulseWidth",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Pulse Width %",
      type: "range",
      min: 10,
      max: 90,
      step: 1,
      unit: "%",
    },
    {
      key: "vco2Level",
      moduleSelector: ".mixer-module",
      label: "VCO 2 Level",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => (Number(value) / 0.45) * 100,
      toSourceValue: (value) => (Number(value) / 100) * 0.45,
    },
    {
      key: "vco3CoarseFreq",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Coarse Freq",
      type: "select",
      options: noteOptions,
      matchNearestOption: true,
    },
    {
      key: "vco3FineCents",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Fine Freq",
      type: "select",
      options: centsOptions,
      matchNearestOption: true,
    },
    {
      key: "vco3Waveform",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Waveform",
      type: "select",
      options: waveOptions,
    },
    {
      key: "vco3PulseWidth",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Pulse Width %",
      type: "range",
      min: 10,
      max: 90,
      step: 1,
      unit: "%",
    },
    {
      key: "vco3Level",
      moduleSelector: ".mixer-module",
      label: "VCO 3 Level",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => (Number(value) / 0.4) * 100,
      toSourceValue: (value) => (Number(value) / 100) * 0.4,
    },
    {
      key: "whiteNoiseLevel",
      moduleSelector: ".mixer-module",
      label: "White NS Level",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => (Number(value) / 0.35) * 100,
      toSourceValue: (value) => (Number(value) / 100) * 0.35,
    },
    {
      key: "cutoff",
      moduleSelector: ".filter-lp-module",
      label: "Initial Cutoff",
      type: "range",
      min: 120,
      max: 6500,
      step: 1,
      unit: "Hz",
    },
    {
      key: "lfo1Mod",
      moduleSelector: ".filter-lp-module",
      label: "LFO-1 Mod",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "resonance",
      moduleSelector: ".filter-lp-module",
      label: "Resonance",
      type: "range",
      min: 0.1,
      max: 12,
      step: 0.1,
      unit: "Q",
    },
    {
      key: "lfo1Rate",
      moduleSelector: ".lfo1-module",
      label: "Rate",
      type: "range",
      min: 0.05,
      max: 12,
      step: 0.01,
      unit: "Hz",
    },
    {
      key: "repeatGate",
      moduleSelector: ".repeat-module",
      label: "Gate LED",
      type: "select",
      options: repeatGateOptions,
    },
    {
      key: "repeatGateRate",
      moduleSelector: ".repeat-module",
      label: "Gate Rate",
      type: "range",
      min: 6,
      max: 720,
      step: 1,
      unit: "BPM",
      fromSourceValue: (value) => Number(value) * 60,
      toSourceValue: (value) => Number(value) / 60,
    },
  ];

  function buildNoteOptions(minMidi, maxMidi) {
    const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const options = [];

    for (let midi = minMidi; midi <= maxMidi; midi += 1) {
      const name = names[midi % 12];
      const octave = Math.floor(midi / 12) - 1;
      const frequency = 440 * Math.pow(2, (midi - 69) / 12);
      const value = frequency.toFixed(3);
      const labelFrequency = frequency < 100 ? frequency.toFixed(1) : frequency.toFixed(0);
      options.push([value, `${name}${octave} · ${labelFrequency} Hz`]);
    }

    return options;
  }

  function buildCentsOptions() {
    return [-50, -25, -12, -7, -5, -3, 0, 3, 5, 7, 12, 25, 50].map((value) => {
      const sign = value > 0 ? "+" : "";
      return [String(value), `${sign}${value} cent`];
    });
  }

  function findNearestOptionValue(options, value) {
    const target = Number(value);
    let nearest = options[0]?.[0] || value;
    let nearestDistance = Number.POSITIVE_INFINITY;

    options.forEach(([optionValue]) => {
      const distance = Math.abs(Number(optionValue) - target);
      if (distance < nearestDistance) {
        nearest = optionValue;
        nearestDistance = distance;
      }
    });

    return nearest;
  }

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function findControlByLabel(scope, label) {
    if (!scope) return null;

    return Array.from(scope.querySelectorAll(".control")).find((control) => {
      const controlLabel = control.querySelector(".control-label");
      return normalizeText(controlLabel?.textContent) === label;
    }) || null;
  }

  function findSourceControl(key) {
    return document.querySelector(`.audio-voice-panel [data-audio-control="${key}"]`);
  }

  function getVisibleValue(config, value) {
    if (config.matchNearestOption && config.options) {
      return findNearestOptionValue(config.options, value);
    }

    return config.fromSourceValue ? config.fromSourceValue(value) : value;
  }

  function getSourceValue(config, value) {
    return config.toSourceValue ? config.toSourceValue(value) : value;
  }

  function formatReadout(config, value) {
    if (config.type === "select") {
      const option = config.options.find(([optionValue]) => String(optionValue) === String(value));
      return option ? option[1] : value;
    }

    const number = Number(value);
    const percentKeys = ["vcoLevel", "vco2Level", "vco3Level", "whiteNoiseLevel", "lfo1Mod"];
    const fineTuneKeys = ["fineCents", "vco2FineCents", "vco3FineCents"];

    if (config.key === "repeatGateRate") return `${number.toFixed(0)} ${config.unit}`;
    if (config.key === "lfo1Rate") return `${number.toFixed(2)} ${config.unit}`;
    if (config.key === "resonance") return `${number.toFixed(1)} ${config.unit}`;
    if (percentKeys.includes(config.key)) return `${number.toFixed(0)}%`;
    if (fineTuneKeys.includes(config.key)) return `${number.toFixed(0)} ${config.unit}`;
    return `${number.toFixed(0)} ${config.unit}`.trim();
  }

  function updateVisibleControl(config, sourceValue) {
    const visibleControl = document.querySelector(`[data-visible-audio-control="${config.key}"]`);
    if (!visibleControl) return;

    const visibleValue = getVisibleValue(config, sourceValue);
    visibleControl.value = visibleValue;

    const wrapper = visibleControl.closest(".visible-audio-control-wrap");
    const readout = wrapper?.querySelector(".visible-audio-readout");
    if (readout) readout.textContent = formatReadout(config, visibleValue);

    if (config.type === "select") {
      const faceSwitch = wrapper?.parentElement?.querySelector(".switch-control");
      if (faceSwitch) faceSwitch.textContent = formatReadout(config, visibleValue);
    }
  }

  function sendToExistingAudioControl(config, visibleValue) {
    const sourceControl = findSourceControl(config.key);
    if (!sourceControl) return;

    sourceControl.value = getSourceValue(config, visibleValue);
    sourceControl.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function createVisibleInput(config, sourceControl) {
    const input = document.createElement(config.type === "select" ? "select" : "input");
    input.dataset.visibleAudioControl = config.key;
    input.className = "visible-audio-control";

    if (config.type === "select") {
      config.options.forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        input.append(option);
      });
    } else {
      input.type = "range";
      input.min = config.min;
      input.max = config.max;
      input.step = config.step;
    }

    input.value = getVisibleValue(config, sourceControl.value);

    input.addEventListener("input", () => {
      sendToExistingAudioControl(config, input.value);
      updateVisibleControl(config, getSourceValue(config, input.value));
    });

    input.addEventListener("change", () => {
      sendToExistingAudioControl(config, input.value);
      updateVisibleControl(config, getSourceValue(config, input.value));
    });

    return input;
  }

  function addVisibleControl(config) {
    const module = document.querySelector(config.moduleSelector);
    const control = findControlByLabel(module, config.label);
    const sourceControl = findSourceControl(config.key);

    if (!control || !sourceControl || control.querySelector(`[data-visible-audio-control="${config.key}"]`)) {
      return false;
    }

    control.classList.add("is-audio-linked");

    const wrapper = document.createElement("div");
    wrapper.className = "visible-audio-control-wrap";

    const input = createVisibleInput(config, sourceControl);
    const readout = document.createElement("output");
    readout.className = "visible-audio-readout";
    readout.textContent = formatReadout(config, getVisibleValue(config, sourceControl.value));

    wrapper.append(input, readout);
    control.append(wrapper);

    updateVisibleControl(config, sourceControl.value);
    return true;
  }

  function addStyles() {
    if (document.querySelector("#visible-audio-control-styles")) return;

    const style = document.createElement("style");
    style.id = "visible-audio-control-styles";
    style.textContent = `
      .control.is-audio-linked {
        outline: 1px solid rgba(147, 211, 108, 0.45);
        outline-offset: 3px;
        border-radius: 12px;
      }

      .control.is-audio-linked .control-label::after {
        content: " ACTIVE";
        color: #93d36c;
        font-size: 0.58em;
        letter-spacing: 0.08em;
      }

      .visible-audio-control-wrap {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
        margin-top: 6px;
      }

      .visible-audio-control {
        width: 100%;
        min-width: 0;
        accent-color: #d7b884;
      }

      select.visible-audio-control {
        border: 1px solid rgba(215, 184, 132, 0.38);
        border-radius: 999px;
        padding: 4px 6px;
        background: #211913;
        color: #f3e8da;
        font: inherit;
        font-size: 0.68rem;
      }

      .visible-audio-readout {
        color: #d6c8b5;
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }
    `;

    document.head.append(style);
  }

  function syncFromExistingControls() {
    visibleControlConfigs.forEach((config) => {
      const sourceControl = findSourceControl(config.key);
      if (!sourceControl) return;
      updateVisibleControl(config, sourceControl.value);
    });
  }

  function initVisibleOscillatorControls() {
    addStyles();

    const sourcePanel = document.querySelector(".audio-voice-panel");
    if (!sourcePanel) {
      window.setTimeout(initVisibleOscillatorControls, 50);
      return;
    }

    visibleControlConfigs.forEach(addVisibleControl);

    sourcePanel.addEventListener("input", (event) => {
      const sourceControl = event.target.closest("[data-audio-control]");
      if (!sourceControl) return;

      const config = visibleControlConfigs.find((item) => item.key === sourceControl.dataset.audioControl);
      if (!config) return;
      updateVisibleControl(config, sourceControl.value);
    });

    syncFromExistingControls();
  }

  document.addEventListener("DOMContentLoaded", initVisibleOscillatorControls);
})();
