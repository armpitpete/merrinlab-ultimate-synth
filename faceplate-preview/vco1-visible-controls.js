(() => {
  "use strict";

  const waveOptions = [
    ["sawtooth", "Saw"],
    ["square", "Square"],
    ["triangle", "Triangle"],
    ["sine", "Sine"],
    ["pulse", "Pulse"],
  ];

  const noiseTypeOptions = [
    ["white", "White"],
    ["pink", "Pink"],
    ["brown", "Brown"],
  ];

  const repeatGateOptions = [
    ["off", "Off"],
    ["on", "On"],
  ];

  const repeatGateTargetOptions = [
    ["envelope", "Envelope"],
    ["sampleHold", "Sample & Hold"],
    ["both", "Both"],
  ];

  const auxVcaInputOptions = [
    ["off", "Off"],
    ["vco1", "VCO-1"],
    ["vco2", "VCO-2"],
    ["vco3", "VCO-3"],
    ["noise", "Noise"],
  ];

  const modulationSourceOptions = [
    ["off", "Off"],
    ["lfo1", "LFO-1"],
    ["lfo2", "LFO-2"],
    ["envelope", "Envelope"],
    ["sampleHold", "Sample & Hold"],
    ["gate", "Gate"],
    ["noise", "Noise"],
  ];

  const auxVcaDestinationOptions = [
    ["filter", "Filter"],
    ["mainVca", "Main VCA"],
  ];

  const adsrRangeOptions = [["short", "Short"], ["long", "Long"]];

  const sampleHoldInputOptions = [
    ["noise", "Noise"],
    ["lfo1", "LFO-1"],
    ["vco1", "VCO-1"],
  ];

  const sampleHoldModeOptions = [
    ["sample", "Sample & Hold"],
    ["track", "Track & Hold"],
  ];

  let sampleHoldLedTimerId = null;

  const noteOptions = buildNoteOptions(33, 81);

  const visibleControlConfigs = [
    {
      key: "coarseFreq",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Coarse Freq",
      type: "select",
      options: noteOptions,
      matchNearestOption: true,
      hideReadout: true,
    },
    {
      key: "fineCents",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Fine Freq",
      type: "range",
      min: -100,
      max: 100,
      step: 1,
      unit: "cent",
    },
    {
      key: "waveform",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Waveform",
      type: "select",
      options: waveOptions,
      hideReadout: true,
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
      key: "vco1PitchModSource",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Pitch Mod Source",
      type: "select",
      options: modulationSourceOptions,
      hideReadout: true,
    },
    {
      key: "vco1PitchModDepth",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Pitch Depth",
      type: "range",
      min: 0,
      max: 24,
      step: 0.1,
      unit: "st",
    },
    {
      key: "vco1LinearFmSource",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Linear FM Source",
      type: "select",
      options: modulationSourceOptions,
      hideReadout: true,
    },
    {
      key: "vco1LinearFmDepth",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "FM Depth",
      type: "range",
      min: 0,
      max: 500,
      step: 1,
      unit: "Hz",
    },
    {
      key: "vco1PwmSource",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "PWM Source",
      type: "select",
      options: modulationSourceOptions,
      hideReadout: true,
    },
    {
      key: "vco1PwmDepth",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "PWM Depth",
      type: "range",
      min: 0,
      max: 40,
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
      hideReadout: true,
    },
    {
      key: "vco2FineCents",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Fine Freq",
      type: "range",
      min: -100,
      max: 100,
      step: 1,
      unit: "cent",
    },
    {
      key: "vco2Waveform",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Waveform",
      type: "select",
      options: waveOptions,
      hideReadout: true,
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
      key: "vco2PitchModSource",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Pitch Mod Source",
      type: "select",
      options: modulationSourceOptions,
      hideReadout: true,
    },
    {
      key: "vco2PitchModDepth",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Pitch Depth",
      type: "range",
      min: 0,
      max: 24,
      step: 0.1,
      unit: "st",
    },
    {
      key: "vco2LinearFmSource",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Linear FM Source",
      type: "select",
      options: modulationSourceOptions,
      hideReadout: true,
    },
    {
      key: "vco2LinearFmDepth",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "FM Depth",
      type: "range",
      min: 0,
      max: 500,
      step: 1,
      unit: "Hz",
    },
    {
      key: "vco2PwmSource",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "PWM Source",
      type: "select",
      options: modulationSourceOptions,
      hideReadout: true,
    },
    {
      key: "vco2PwmDepth",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "PWM Depth",
      type: "range",
      min: 0,
      max: 40,
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
      hideReadout: true,
    },
    {
      key: "vco3FineCents",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Fine Freq",
      type: "range",
      min: -100,
      max: 100,
      step: 1,
      unit: "cent",
    },
    {
      key: "vco3Waveform",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Waveform",
      type: "select",
      options: waveOptions,
      hideReadout: true,
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
      key: "vco3PitchModSource",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Pitch Mod Source",
      type: "select",
      options: modulationSourceOptions,
      hideReadout: true,
    },
    {
      key: "vco3PitchModDepth",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Pitch Depth",
      type: "range",
      min: 0,
      max: 24,
      step: 0.1,
      unit: "st",
    },
    {
      key: "vco3LinearFmSource",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Linear FM Source",
      type: "select",
      options: modulationSourceOptions,
      hideReadout: true,
    },
    {
      key: "vco3LinearFmDepth",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "FM Depth",
      type: "range",
      min: 0,
      max: 500,
      step: 1,
      unit: "Hz",
    },
    {
      key: "vco3PwmSource",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "PWM Source",
      type: "select",
      options: modulationSourceOptions,
      hideReadout: true,
    },
    {
      key: "vco3PwmDepth",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "PWM Depth",
      type: "range",
      min: 0,
      max: 40,
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
      label: "Noise Level",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => (Number(value) / 0.35) * 100,
      toSourceValue: (value) => (Number(value) / 100) * 0.35,
    },
    {
      key: "noiseType",
      moduleSelector: ".mixer-module",
      label: "Noise Type",
      type: "select",
      options: noiseTypeOptions,
      hideReadout: true,
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
      key: "filterEnvelopeMod",
      moduleSelector: ".filter-lp-module",
      label: "AR Mod",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
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
      min: 0,
      max: 12,
      step: 0.1,
      unit: "Q",
    },
    {
      key: "filterExtCv",
      moduleSelector: ".filter-lp-module",
      label: "Ext CV",
      type: "range",
      min: -100,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
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
      key: "sampleHoldInput",
      moduleSelector: ".sample-hold-module",
      label: "Input",
      type: "select",
      options: sampleHoldInputOptions,
    },
    {
      key: "sampleHoldMode",
      moduleSelector: ".sample-hold-module",
      label: "Mode",
      type: "select",
      options: sampleHoldModeOptions,
    },
    {
      key: "sampleHoldRate",
      moduleSelector: ".sample-hold-module",
      label: "Sample Rate",
      type: "range",
      min: 0.1,
      max: 20,
      step: 0.1,
      unit: "Hz",
    },
    {
      key: "sampleHoldMod",
      moduleSelector: ".sample-hold-module",
      label: "Filter Amount",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "sampleHoldGlide",
      moduleSelector: ".sample-hold-module",
      label: "Glide",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "vcaInitialLevel",
      moduleSelector: ".main-vca-module",
      label: "Initial Level",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "vcaEnvelopeMod",
      moduleSelector: ".main-vca-module",
      label: "AR Mod",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "lfo2Mod",
      moduleSelector: ".main-vca-module",
      label: "LFO-2 Mod",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "vcaExtCv",
      moduleSelector: ".main-vca-module",
      label: "Ext CV",
      type: "range",
      min: -100,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "lfo2Rate",
      moduleSelector: ".lfo2-module",
      label: "Rate",
      type: "range",
      min: 0.05,
      max: 12,
      step: 0.01,
      unit: "Hz",
    },
    {
      key: "adsrRange",
      moduleSelector: ".adsr-module",
      label: "ADSR Range",
      type: "select",
      options: adsrRangeOptions,
    },
    {
      key: "auxVcaInput",
      moduleSelector: ".aux-vca-module",
      label: "Input",
      type: "select",
      options: auxVcaInputOptions,
    },
    {
      key: "auxVcaInitialAmp",
      moduleSelector: ".aux-vca-module",
      label: "Initial Amp",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "auxVcaCv",
      moduleSelector: ".aux-vca-module",
      label: "CV Source",
      type: "select",
      options: modulationSourceOptions,
    },
    {
      key: "auxVcaCvAmount",
      moduleSelector: ".aux-vca-module",
      label: "CV Amount",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "auxVcaDestination",
      moduleSelector: ".aux-vca-module",
      label: "Destination",
      type: "select",
      options: auxVcaDestinationOptions,
    },
    {
      key: "repeatGate",
      moduleSelector: ".repeat-module",
      label: "Gate",
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
    {
      key: "repeatGateTarget",
      moduleSelector: ".repeat-module",
      label: "Target",
      type: "select",
      options: repeatGateTargetOptions,
    },
    {
      key: "delayMix",
      moduleSelector: ".delay-module",
      label: "Mix",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "delayTime",
      moduleSelector: ".delay-module",
      label: "Time",
      type: "range",
      min: 0.05,
      max: 0.8,
      step: 0.01,
      unit: "s",
    },
    {
      key: "delayFeedback",
      moduleSelector: ".delay-module",
      label: "Feedback",
      type: "range",
      min: 0,
      max: 45,
      step: 1,
      unit: "%",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
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
    const percentKeys = ["vcoLevel", "vco2Level", "vco3Level", "whiteNoiseLevel", "filterEnvelopeMod", "lfo1Mod", "sampleHoldMod", "sampleHoldGlide", "vcaInitialLevel", "vcaEnvelopeMod", "lfo2Mod", "auxVcaInitialAmp", "auxVcaCvAmount", "delayMix", "delayFeedback"];
    const fineTuneKeys = ["fineCents", "vco2FineCents", "vco3FineCents"];
    const pitchDepthKeys = ["vco1PitchModDepth", "vco2PitchModDepth", "vco3PitchModDepth"];
    const pwmDepthKeys = ["vco1PwmDepth", "vco2PwmDepth", "vco3PwmDepth"];

    if (config.key === "repeatGateRate") return `${number.toFixed(0)} ${config.unit}`;
    if (config.key === "lfo1Rate") return `${number.toFixed(2)} ${config.unit}`;
    if (config.key === "lfo2Rate") return `${number.toFixed(2)} ${config.unit}`;
    if (config.key === "delayTime") return `${number.toFixed(2)} ${config.unit}`;
    if (config.key === "sampleHoldRate") return `${number.toFixed(1)} ${config.unit}`;
    if (config.key === "resonance") return `${number.toFixed(1)} ${config.unit}`;
    if (config.key === "filterExtCv" || config.key === "vcaExtCv") return `${number >= 0 ? "+" : ""}${number.toFixed(0)}%`;
    if (percentKeys.includes(config.key)) return `${number.toFixed(0)}%`;
    if (fineTuneKeys.includes(config.key)) return `${number.toFixed(0)} ${config.unit}`;
    if (pitchDepthKeys.includes(config.key)) return `${number.toFixed(1)} ${config.unit}`;
    if (pwmDepthKeys.includes(config.key)) return `${number.toFixed(0)}%`;
    return `${number.toFixed(0)} ${config.unit}`.trim();
  }

  function ensureDelayFaceplateModule() {
    if (document.querySelector(".delay-module")) return true;

    const repeatModule = document.querySelector(".repeat-module");
    const ultimateGrid = document.querySelector(".ultimate-grid");
    if (!ultimateGrid) return false;

    const delayModule = document.createElement("article");
    delayModule.className = "module delay-module compact-source-module";
    delayModule.innerHTML = `
      <div class="module-header"><span class="status-light"></span><h2>Delay</h2></div>
      <div class="control-grid three-up">
        <div class="control"><div class="control-label">Mix</div><div class="knob knob-large"></div></div>
        <div class="control"><div class="control-label">Time</div><div class="knob knob-large"></div></div>
        <div class="control"><div class="control-label">Feedback</div><div class="knob knob-large"></div></div>
      </div>
    `;

    if (repeatModule) {
      repeatModule.insertAdjacentElement("afterend", delayModule);
    } else {
      ultimateGrid.append(delayModule);
    }

    return true;
  }

  function updateSampleHoldRuntimeUi(detail = {}) {
    const value = Number(detail.value) || 0;
    const output = document.querySelector("[data-sample-hold-cv-output]");
    if (output) output.textContent = `${value >= 0 ? "+" : ""}${value.toFixed(2)} CV`;

    const led = document.querySelector(".sample-hold-module .led-light");
    if (!led) return;

    if (sampleHoldLedTimerId !== null) {
      window.clearTimeout(sampleHoldLedTimerId);
      sampleHoldLedTimerId = null;
    }

    led.classList.toggle("is-tracking", Boolean(detail.tracking));
    led.classList.toggle("is-active", Boolean(detail.tracking || detail.captured));

    if (detail.captured && !detail.tracking) {
      sampleHoldLedTimerId = window.setTimeout(() => {
        led.classList.remove("is-active");
        sampleHoldLedTimerId = null;
      }, 140);
    }
  }

  function installSampleHoldRuntimeUi() {
    const module = document.querySelector(".sample-hold-module");
    if (!module) return false;

    const outputControl = findControlByLabel(module, "CV-Out");
    if (outputControl && !outputControl.querySelector("[data-sample-hold-cv-output]")) {
      outputControl.classList.add("is-audio-linked", "sample-hold-cv-output-control");
      const output = document.createElement("output");
      output.className = "sample-hold-cv-output";
      output.dataset.sampleHoldCvOutput = "";
      output.textContent = "+0.00 CV";
      outputControl.append(output);
    }

    const triggerControl = findControlByLabel(module, "Trig");
    if (triggerControl && !triggerControl.querySelector("[data-sample-hold-trigger]")) {
      triggerControl.classList.add("is-audio-linked", "sample-hold-trigger-control");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sample-hold-trigger";
      button.dataset.sampleHoldTrigger = "";
      button.textContent = "Capture";
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          await window.MerrinLabAudio?.triggerSampleHold?.();
        } finally {
          button.disabled = false;
        }
      });
      triggerControl.append(button);
    }

    const ledControl = findControlByLabel(module, "LED");
    if (ledControl) ledControl.classList.add("sample-hold-led-control");
    return true;
  }

  function syncMixerMuteButtons() {
    document.querySelectorAll("[data-mixer-mute]").forEach((button) => {
      const key = button.dataset.mixerMute;
      const sourceControl = findSourceControl(key);
      const muted = sourceControl?.value === "on";
      button.classList.toggle("is-muted", muted);
      button.setAttribute("aria-pressed", String(muted));
      button.textContent = muted ? "Muted" : "Mute";

      const status = button.closest(".mixer-channel")?.querySelector("[data-mixer-channel-status]");
      if (status) status.textContent = muted ? "Muted" : "Active";
    });
  }

  function installMixerRuntimeUi() {
    const buttons = document.querySelectorAll("[data-mixer-mute]");
    if (!buttons.length) return false;

    buttons.forEach((button) => {
      if (button.dataset.mixerMuteBound === "true") return;
      button.dataset.mixerMuteBound = "true";
      button.addEventListener("click", () => {
        const sourceControl = findSourceControl(button.dataset.mixerMute);
        if (!sourceControl) return;
        sourceControl.value = sourceControl.value === "on" ? "off" : "on";
        sourceControl.dispatchEvent(new Event("input", { bubbles: true }));
        syncMixerMuteButtons();
      });
    });

    syncMixerMuteButtons();
    return true;
  }

  function updateMixerMeter(detail = {}) {
    const peak = Math.max(0, Math.min(1, Number(detail.peak) || 0));
    const fill = document.querySelector("[data-mixer-meter-fill]");
    const readout = document.querySelector("[data-mixer-meter-readout]");
    const meter = document.querySelector(".mixer-meter");
    if (fill) fill.style.width = `${Math.round(peak * 100)}%`;
    if (readout) readout.textContent = peak > 0.0001 ? `${(20 * Math.log10(peak)).toFixed(1)} dBFS` : "Silent";
    meter?.classList.toggle("is-clipping", Boolean(detail.clipping));
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

    if (["waveform", "vco2Waveform", "vco3Waveform"].includes(config.key)) {
      updatePulseControlAvailability();
    }
  }

  function updatePulseControlAvailability() {
    [
      { waveform: "waveform", controls: ["pulseWidth", "vco1PwmSource", "vco1PwmDepth"] },
      { waveform: "vco2Waveform", controls: ["vco2PulseWidth", "vco2PwmSource", "vco2PwmDepth"] },
      { waveform: "vco3Waveform", controls: ["vco3PulseWidth", "vco3PwmSource", "vco3PwmDepth"] },
    ].forEach((group) => {
      const waveformControl = document.querySelector(`[data-visible-audio-control="${group.waveform}"]`);
      const enabled = waveformControl?.value === "pulse";
      group.controls.forEach((key) => {
        const control = document.querySelector(`[data-visible-audio-control="${key}"]`);
        if (!control) return;
        control.disabled = !enabled;
        control.closest(".control")?.classList.toggle("is-audio-conditional-disabled", !enabled);
      });
    });
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

    wrapper.append(input);
    if (!config.hideReadout) wrapper.append(readout);
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

      .vco-module .control.is-audio-conditional-disabled {
        opacity: 0.42;
      }

      .vco-module .control.is-audio-conditional-disabled .control-label::after {
        content: " PULSE ONLY";
        color: #bda98d;
      }

      .control.is-audio-linked > .knob,
      .control.is-audio-linked > .knob-small,
      .control.is-audio-linked > .knob-large {
        display: none;
      }

      .filter-lp-module .lowpass-ext-cv.is-audio-linked .jack-stack {
        display: none;
      }

      .sample-hold-module .control.is-audio-linked > .jack-socket,
      .sample-hold-module .control.is-audio-linked > .switch-control {
        display: none;
      }

      .sample-hold-cv-output,
      .sample-hold-trigger {
        box-sizing: border-box;
        display: block;
        margin-top: 8px;
        width: 100%;
      }

      .sample-hold-cv-output {
        color: #d6c8b5;
        font-size: 0.68rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }

      .sample-hold-trigger {
        background: #211913;
        border: 1px solid rgba(215, 184, 132, 0.45);
        border-radius: 999px;
        color: #f3e8da;
        cursor: pointer;
        font: inherit;
        font-size: 0.62rem;
        padding: 5px 8px;
        text-transform: uppercase;
      }

      .sample-hold-module .led-light.is-active {
        background: #e8bd56;
        box-shadow: 0 0 12px rgba(232, 189, 86, 0.85);
      }

      .sample-hold-module .led-light.is-tracking {
        background: #93d36c;
        box-shadow: 0 0 12px rgba(147, 211, 108, 0.85);
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

      body.is-audio-started .delay-module .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
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

    ensureDelayFaceplateModule();
    visibleControlConfigs.forEach(addVisibleControl);
    installSampleHoldRuntimeUi();
    installMixerRuntimeUi();
    updatePulseControlAvailability();

    sourcePanel.addEventListener("input", (event) => {
      const sourceControl = event.target.closest("[data-audio-control]");
      if (!sourceControl) return;

      if (["vco1Mute", "vco2Mute", "vco3Mute", "noiseMute"].includes(sourceControl.dataset.audioControl)) {
        syncMixerMuteButtons();
        return;
      }

      const config = visibleControlConfigs.find((item) => item.key === sourceControl.dataset.audioControl);
      if (!config) return;
      updateVisibleControl(config, sourceControl.value);
    });

    syncFromExistingControls();
  }

  document.addEventListener("merrinlab:sample-hold-value", (event) => {
    updateSampleHoldRuntimeUi(event.detail);
  });

  document.addEventListener("merrinlab:mixer-meter", (event) => {
    updateMixerMeter(event.detail);
  });

  document.addEventListener("DOMContentLoaded", initVisibleOscillatorControls);
})();
