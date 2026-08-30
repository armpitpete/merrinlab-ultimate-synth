(() => {
  "use strict";

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  const state = {
    coarseFreq: 220,
    fineCents: 0,
    waveform: "sawtooth",
    pulseWidth: 50,
    vco1PitchModSource: "off",
    vco1PitchModDepth: 0,
    vco1LinearFmSource: "off",
    vco1LinearFmDepth: 0,
    vco1PwmSource: "off",
    vco1PwmDepth: 0,
    vcoLevel: 0.35,
    vco1Mute: "off",
    vco2CoarseFreq: 220,
    vco2FineCents: 0,
    vco2Waveform: "sawtooth",
    vco2PulseWidth: 50,
    vco2PitchModSource: "off",
    vco2PitchModDepth: 0,
    vco2LinearFmSource: "off",
    vco2LinearFmDepth: 0,
    vco2PwmSource: "off",
    vco2PwmDepth: 0,
    vco2Level: 0,
    vco2Mute: "off",
    vco3CoarseFreq: 220,
    vco3FineCents: 0,
    vco3Waveform: "sawtooth",
    vco3PulseWidth: 50,
    vco3PitchModSource: "off",
    vco3PitchModDepth: 0,
    vco3LinearFmSource: "off",
    vco3LinearFmDepth: 0,
    vco3PwmSource: "off",
    vco3PwmDepth: 0,
    vco3Level: 0,
    vco3Mute: "off",
    noiseType: "white",
    whiteNoiseLevel: 0,
    noiseMute: "off",
    cutoff: 900,
    resonance: 0,
    filterEnvelopeMod: 0,
    filterExtCv: 0,
    lfo1Rate: 0.8,
    lfo1Shape: "sine",
    lfo1Range: "low",
    lfo1Mod: 0,
    sampleHoldRate: 2,
    sampleHoldMod: 0,
    sampleHoldPitchMod: 0,
    sampleHoldInput: "noise",
    sampleHoldMode: "sample",
    sampleHoldGlide: 0,
    vcaInitialLevel: 0,
    vcaEnvelopeMod: 1,
    vcaExtCv: 0,
    lfo2Rate: 1.2,
    lfo2Shape: "sine",
    lfo2Range: "low",
    lfo2Mod: 0,
    envelopeMode: "ar",
    adsrRange: "short",
    repeatGate: "off",
    repeatGateRate: 2,
    repeatGateTarget: "envelope",
    auxVcaInput: "off",
    auxVcaCv: "off",
    auxVcaInitialAmp: 0,
    auxVcaCvAmount: 0,
    auxVcaDestination: "filter",
    signalMixerSource1: "off",
    signalMixerSource2: "off",
    signalMixerSource3: "off",
    signalMixerSource4: "off",
    signalMixerLevel1: 0,
    signalMixerLevel2: 0,
    signalMixerLevel3: 0,
    signalMixerLevel4: 0,
    signalMixerLineOut: "vca",
    analogMultiplierX: "off",
    analogMultiplierY: "off",
    filterRingLevel: 0,
    attack: 0.03,
    release: 0.45,
    adsrAttack: 0.05,
    adsrDecay: 0.25,
    adsrSustain: 0.65,
    adsrRelease: 0.5,
    delayMix: 0,
    delayTime: 0.25,
    delayFeedback: 0.2,
    output: 0.08,
  };

  let audioContext = null;
  let oscillator = null;
  let vcoGain = null;
  let oscillator2 = null;
  let vco2Gain = null;
  let oscillator3 = null;
  let vco3Gain = null;
  let vcoProcessors = [];
  let noiseSource = null;
  let noiseGain = null;
  let mixerBus = null;
  let mixerAnalyser = null;
  let mixerMeterTimerId = null;
  let mixerMeterData = null;
  let signalMixerBus = null;
  let signalMixerAnalyser = null;
  let signalMixerRouteNodes = [];
  let signalMixerMeterTimerId = null;
  let signalMixerMeterData = null;
  let lineOutVcaGain = null;
  let lineOutMixGain = null;
  let analogMultiplier = null;
  let analogMultiplierYGain = null;
  let analogMultiplierOutputGain = null;
  let analogMultiplierAnalyser = null;
  let analogMultiplierMeterTimerId = null;
  let analogMultiplierMeterData = null;
  let analogMultiplierConnectedX = null;
  let analogMultiplierConnectedY = null;
  let filterRingMultiplier = null;
  let filterRingYGain = null;
  let filterRingOutputGain = null;
  let filterRingAnalyser = null;
  let filterRingMeterTimerId = null;
  let filterRingMeterData = null;
  let lfo1Oscillator = null;
  let lfo1Gain = null;
  let sampleHoldFilterSource = null;
  let sampleHoldCvSource = null;
  let sampleHoldTimerId = null;
  let sampleHoldValue = 0;
  let lfo2Oscillator = null;
  let lfo2Gain = null;
  let lfo2Offset = null;
  let filter = null;
  let mainVca = null;
  let tremoloGain = null;
  let envelopeCvSource = null;
  let gateCvSource = null;
  let auxVca = null;
  let auxVcaCvGain = null;
  let auxVcaConnectedInput = null;
  let auxVcaConnectedCv = null;
  let auxVcaConnectedDestination = null;
  let attenuatorRouteNodes = [];
  let effectsOutputGraph = null;
  let repeatGateTimerId = null;
  let repeatGateReleaseTimerId = null;
  let isRepeatGateHoldingGate = false;

  const midiHeldNotes = [];
  let midiCurrentNote = null;
  let midiPitchBend = 0;
  let midiGateVelocity = 1;
  const MIDI_PITCH_BEND_SEMITONES = 2;
  const MIDI_REFERENCE_FREQUENCY = 220;

  const limits = {
    coarseFreq: [55, 880],
    fineCents: [-100, 100],
    pulseWidth: [10, 90],
    vco1PitchModDepth: [0, 24],
    vco1LinearFmDepth: [0, 500],
    vco1PwmDepth: [0, 40],
    vcoLevel: [0, 0.7],
    vco2CoarseFreq: [55, 880],
    vco2FineCents: [-100, 100],
    vco2PulseWidth: [10, 90],
    vco2PitchModDepth: [0, 24],
    vco2LinearFmDepth: [0, 500],
    vco2PwmDepth: [0, 40],
    vco2Level: [0, 0.45],
    vco3CoarseFreq: [55, 880],
    vco3FineCents: [-100, 100],
    vco3PulseWidth: [10, 90],
    vco3PitchModDepth: [0, 24],
    vco3LinearFmDepth: [0, 500],
    vco3PwmDepth: [0, 40],
    vco3Level: [0, 0.4],
    whiteNoiseLevel: [0, 0.35],
    cutoff: [120, 6500],
    resonance: [0, 12],
    filterEnvelopeMod: [0, 1],
    filterExtCv: [-1, 1],
    lfo1Rate: [0.05, 12],
    lfo1Mod: [0, 1],
    sampleHoldRate: [0.1, 20],
    sampleHoldMod: [0, 1],
    sampleHoldPitchMod: [0, 1],
    sampleHoldGlide: [0, 1],
    vcaInitialLevel: [0, 1],
    vcaEnvelopeMod: [0, 1],
    vcaExtCv: [-1, 1],
    lfo2Rate: [0.05, 12],
    lfo2Mod: [0, 1],
    repeatGateRate: [0.1, 12],
    attack: [0.005, 1.5],
    release: [0.02, 2.5],
    adsrAttack: [0.005, 2],
    adsrDecay: [0.005, 3],
    adsrSustain: [0, 1],
    adsrRelease: [0.02, 4],
    auxVcaInitialAmp: [0, 1],
    auxVcaCvAmount: [0, 1],
    signalMixerLevel1: [0, 1],
    signalMixerLevel2: [0, 1],
    signalMixerLevel3: [0, 1],
    signalMixerLevel4: [0, 1],
    filterRingLevel: [0, 1],
    delayMix: [0, 1],
    delayTime: [0.05, 0.8],
    delayFeedback: [0, 0.45],
    output: [0, 0.16],
  };

  const labels = {
    coarseFreq: "VCO 1 Coarse Freq",
    fineCents: "VCO 1 Fine Freq",
    waveform: "VCO 1 Waveform",
    pulseWidth: "VCO 1 Pulse Width %",
    vco1PitchModSource: "VCO 1 Pitch Mod Source",
    vco1PitchModDepth: "VCO 1 Pitch Depth",
    vco1LinearFmSource: "VCO 1 Linear FM Source",
    vco1LinearFmDepth: "VCO 1 FM Depth",
    vco1PwmSource: "VCO 1 PWM Source",
    vco1PwmDepth: "VCO 1 PWM Depth",
    vcoLevel: "VCO 1 Level",
    vco1Mute: "VCO 1 Mute",
    vco2CoarseFreq: "VCO 2 Coarse Freq",
    vco2FineCents: "VCO 2 Fine Freq",
    vco2Waveform: "VCO 2 Waveform",
    vco2PulseWidth: "VCO 2 Pulse Width %",
    vco2PitchModSource: "VCO 2 Pitch Mod Source",
    vco2PitchModDepth: "VCO 2 Pitch Depth",
    vco2LinearFmSource: "VCO 2 Linear FM Source",
    vco2LinearFmDepth: "VCO 2 FM Depth",
    vco2PwmSource: "VCO 2 PWM Source",
    vco2PwmDepth: "VCO 2 PWM Depth",
    vco2Level: "VCO 2 Level",
    vco2Mute: "VCO 2 Mute",
    vco3CoarseFreq: "VCO 3 Coarse Freq",
    vco3FineCents: "VCO 3 Fine Freq",
    vco3Waveform: "VCO 3 Waveform",
    vco3PulseWidth: "VCO 3 Pulse Width %",
    vco3PitchModSource: "VCO 3 Pitch Mod Source",
    vco3PitchModDepth: "VCO 3 Pitch Depth",
    vco3LinearFmSource: "VCO 3 Linear FM Source",
    vco3LinearFmDepth: "VCO 3 FM Depth",
    vco3PwmSource: "VCO 3 PWM Source",
    vco3PwmDepth: "VCO 3 PWM Depth",
    vco3Level: "VCO 3 Level",
    vco3Mute: "VCO 3 Mute",
    noiseType: "Noise Type",
    whiteNoiseLevel: "Noise Level",
    noiseMute: "Noise Mute",
    cutoff: "Filter Cutoff",
    resonance: "Resonance",
    filterEnvelopeMod: "Filter Envelope Mod",
    filterExtCv: "Filter Ext CV",
    lfo1Rate: "LFO 1 Rate",
    lfo1Shape: "LFO 1 Shape",
    lfo1Range: "LFO 1 Range",
    lfo1Mod: "LFO-1 Mod",
    sampleHoldRate: "S&H Rate",
    sampleHoldMod: "S&H Mod",
    sampleHoldPitchMod: "S&H Pitch Mod",
    sampleHoldInput: "S&H Input",
    sampleHoldMode: "S&H Mode",
    sampleHoldGlide: "S&H Glide",
    vcaInitialLevel: "VCA Initial Level",
    vcaEnvelopeMod: "VCA Envelope Mod",
    vcaExtCv: "VCA Ext CV",
    lfo2Rate: "LFO 2 Rate",
    lfo2Shape: "LFO 2 Shape",
    lfo2Range: "LFO 2 Range",
    lfo2Mod: "LFO-2 Mod",
    envelopeMode: "Envelope Mode",
    adsrRange: "ADSR Range",
    repeatGate: "Repeat Gate",
    repeatGateRate: "Repeat Gate Rate",
    repeatGateTarget: "Repeat Gate Target",
    auxVcaInput: "AUX VCA Input",
    auxVcaCv: "AUX VCA CV",
    auxVcaInitialAmp: "AUX VCA Initial Amp",
    auxVcaCvAmount: "AUX VCA CV Amount",
    auxVcaDestination: "AUX VCA Destination",
    filterRingLevel: "Filter Ring Level",
    attack: "AR Attack",
    release: "AR Release",
    adsrAttack: "ADSR Attack",
    adsrDecay: "ADSR Decay",
    adsrSustain: "ADSR Sustain",
    adsrRelease: "ADSR Release",
    delayMix: "Delay Mix",
    delayTime: "Delay Time",
    delayFeedback: "Delay Feedback",
    output: "Output",
  };

  const units = {
    coarseFreq: "Hz",
    fineCents: "cent",
    pulseWidth: "%",
    vco1PitchModDepth: "st",
    vco1LinearFmDepth: "Hz",
    vco1PwmDepth: "%",
    vcoLevel: "",
    vco2CoarseFreq: "Hz",
    vco2FineCents: "cent",
    vco2PulseWidth: "%",
    vco2PitchModDepth: "st",
    vco2LinearFmDepth: "Hz",
    vco2PwmDepth: "%",
    vco2Level: "",
    vco3CoarseFreq: "Hz",
    vco3FineCents: "cent",
    vco3PulseWidth: "%",
    vco3PitchModDepth: "st",
    vco3LinearFmDepth: "Hz",
    vco3PwmDepth: "%",
    vco3Level: "",
    whiteNoiseLevel: "",
    cutoff: "Hz",
    resonance: "Q",
    filterEnvelopeMod: "%",
    filterExtCv: "%",
    lfo1Rate: "Hz",
    lfo1Mod: "%",
    sampleHoldRate: "Hz",
    sampleHoldMod: "%",
    sampleHoldPitchMod: "%",
    sampleHoldGlide: "%",
    vcaInitialLevel: "%",
    vcaEnvelopeMod: "%",
    vcaExtCv: "%",
    lfo2Rate: "Hz",
    lfo2Mod: "%",
    repeatGateRate: "Hz",
    attack: "s",
    release: "s",
    adsrAttack: "s",
    adsrDecay: "s",
    adsrSustain: "%",
    adsrRelease: "s",
    auxVcaInitialAmp: "%",
    auxVcaCvAmount: "%",
    filterRingLevel: "%",
    delayMix: "%",
    delayTime: "s",
    delayFeedback: "%",
    output: "",
  };

  const waveforms = [
    ["sawtooth", "Saw"],
    ["square", "Square"],
    ["triangle", "Triangle"],
    ["sine", "Sine"],
    ["pulse", "Pulse"],
  ];

  const noiseTypes = [
    ["white", "White"],
    ["pink", "Pink"],
    ["brown", "Brown"],
  ];

  const muteModes = [
    ["off", "Active"],
    ["on", "Muted"],
  ];

  const envelopeModes = [
    ["ar", "AR"],
    ["adsr", "ADSR"],
  ];

  const repeatGateModes = [
    ["off", "Off"],
    ["on", "On"],
  ];

  const lfoShapes = [
    ["sine", "Sine"],
    ["triangle", "Triangle"],
    ["square", "Square"],
    ["rampUp", "Ramp Up"],
    ["rampDown", "Ramp Down"],
  ];

  const lfoRanges = [
    ["low", "Low"],
    ["high", "High"],
  ];

  const adsrRanges = [
    ["short", "Short"],
    ["long", "Long"],
  ];

  const repeatGateTargets = [
    ["envelope", "Envelope"],
    ["sampleHold", "S&H Trigger"],
    ["both", "Envelope + S&H"],
  ];

  const auxVcaInputs = [
    ["off", "Off"],
    ["vco1", "VCO 1"],
    ["vco2", "VCO 2"],
    ["vco3", "VCO 3"],
    ["noise", "Noise"],
  ];

  const modulationSources = [
    ["off", "Off"],
    ["lfo1", "LFO 1"],
    ["lfo2", "LFO 2"],
    ["envelope", "Envelope"],
    ["sampleHold", "Sample & Hold"],
    ["gate", "Gate"],
    ["noise", "Noise"],
  ];

  const modulationDestinations = [
    ["off", "Off"],
    ["filterCutoff", "Filter Cutoff"],
    ["vco1Pitch", "VCO 1 Pitch"],
    ["vco2Pitch", "VCO 2 Pitch"],
    ["vco3Pitch", "VCO 3 Pitch"],
    ["mainVca", "Main VCA"],
  ];

  const auxVcaDestinations = [
    ["filter", "Filter Input"],
    ["mainVca", "Main VCA Input"],
  ];

  const analogMultiplierSources = [
    ["off", "Off"],
    ["vco1", "VCO 1"],
    ["vco2", "VCO 2"],
    ["vco3", "VCO 3"],
    ["noise", "Noise"],
    ["lfo1", "LFO 1"],
    ["lfo2", "LFO 2"],
    ["envelope", "Envelope"],
    ["sampleHold", "Sample & Hold"],
    ["gate", "Gate"],
    ["mainVca", "Main VCA"],
  ];

  const signalMixerSources = [
    ["off", "Off"],
    ["vco1", "VCO 1"],
    ["vco2", "VCO 2"],
    ["vco3", "VCO 3"],
    ["noise", "Noise"],
    ["mainMixer", "Main Mixer"],
    ["mainFilter", "Main VCF"],
    ["mainVca", "Main VCA"],
    ["auxVca", "AUX VCA"],
    ["analogMultiplier", "XY Multiplier"],
  ];

  const attenuatorRoutes = Array.from({ length: 6 }, () => ({
    source: "off",
    amount: 1,
    destination: "off",
  }));

  const sampleHoldInputs = [
    ["noise", "Noise"],
    ["lfo1", "LFO-1"],
    ["vco1", "VCO-1"],
  ];

  const sampleHoldModes = [
    ["sample", "Sample & Hold"],
    ["track", "Track & Hold"],
  ];

  function clamp(value, key) {
    const [min, max] = limits[key];
    return Math.min(max, Math.max(min, Number(value)));
  }

  function safeRamp(param, value, time, rampTime = 0.02) {
    param.cancelScheduledValues(time);
    param.setTargetAtTime(value, time, rampTime);
  }

  function getMixerChannelLevel(levelKey, muteKey) {
    return state[muteKey] === "on" ? 0 : clamp(state[levelKey], levelKey);
  }

  function stopMixerMeter() {
    if (mixerMeterTimerId !== null) {
      window.clearInterval(mixerMeterTimerId);
      mixerMeterTimerId = null;
    }
    mixerMeterData = null;
    document.dispatchEvent(new CustomEvent("merrinlab:mixer-meter", {
      detail: { peak: 0, rms: 0, clipping: false },
    }));
  }

  function updateMixerMeter() {
    if (!mixerAnalyser || !mixerMeterData) return;
    mixerAnalyser.getFloatTimeDomainData(mixerMeterData);

    let peak = 0;
    let sumSquares = 0;
    for (let index = 0; index < mixerMeterData.length; index += 1) {
      const sample = mixerMeterData[index];
      peak = Math.max(peak, Math.abs(sample));
      sumSquares += sample * sample;
    }

    const rms = Math.sqrt(sumSquares / mixerMeterData.length);
    document.dispatchEvent(new CustomEvent("merrinlab:mixer-meter", {
      detail: { peak, rms, clipping: peak >= 0.98 },
    }));
  }

  function startMixerMeter() {
    stopMixerMeter();
    if (!mixerAnalyser) return;
    mixerMeterData = new Float32Array(mixerAnalyser.fftSize);
    updateMixerMeter();
    mixerMeterTimerId = window.setInterval(updateMixerMeter, 50);
  }

  function stopSignalMixerMeter() {
    if (signalMixerMeterTimerId !== null) {
      window.clearInterval(signalMixerMeterTimerId);
      signalMixerMeterTimerId = null;
    }
    signalMixerMeterData = null;
    document.dispatchEvent(new CustomEvent("merrinlab:signal-mixer-meter", {
      detail: { peak: 0, rms: 0, clipping: false },
    }));
  }

  function updateSignalMixerMeter() {
    if (!signalMixerAnalyser || !signalMixerMeterData) return;
    signalMixerAnalyser.getFloatTimeDomainData(signalMixerMeterData);
    let peak = 0;
    let sumSquares = 0;
    for (let index = 0; index < signalMixerMeterData.length; index += 1) {
      const sample = signalMixerMeterData[index];
      peak = Math.max(peak, Math.abs(sample));
      sumSquares += sample * sample;
    }
    const rms = Math.sqrt(sumSquares / signalMixerMeterData.length);
    document.dispatchEvent(new CustomEvent("merrinlab:signal-mixer-meter", {
      detail: { peak, rms, clipping: peak >= 0.98 },
    }));
  }

  function startSignalMixerMeter() {
    stopSignalMixerMeter();
    if (!signalMixerAnalyser) return;
    signalMixerMeterData = new Float32Array(signalMixerAnalyser.fftSize);
    updateSignalMixerMeter();
    signalMixerMeterTimerId = window.setInterval(updateSignalMixerMeter, 50);
  }

  function stopAnalogMultiplierMeter() {
    if (analogMultiplierMeterTimerId !== null) {
      window.clearInterval(analogMultiplierMeterTimerId);
      analogMultiplierMeterTimerId = null;
    }
    analogMultiplierMeterData = null;
    document.dispatchEvent(new CustomEvent("merrinlab:analog-multiplier-meter", {
      detail: { peak: 0, rms: 0, clipping: false },
    }));
  }

  function updateAnalogMultiplierMeter() {
    if (!analogMultiplierAnalyser || !analogMultiplierMeterData) return;
    analogMultiplierAnalyser.getFloatTimeDomainData(analogMultiplierMeterData);
    let peak = 0;
    let sumSquares = 0;
    for (let index = 0; index < analogMultiplierMeterData.length; index += 1) {
      const sample = analogMultiplierMeterData[index];
      peak = Math.max(peak, Math.abs(sample));
      sumSquares += sample * sample;
    }
    const rms = Math.sqrt(sumSquares / analogMultiplierMeterData.length);
    document.dispatchEvent(new CustomEvent("merrinlab:analog-multiplier-meter", {
      detail: { peak, rms, clipping: peak >= 0.98 },
    }));
  }

  function startAnalogMultiplierMeter() {
    stopAnalogMultiplierMeter();
    if (!analogMultiplierAnalyser) return;
    analogMultiplierMeterData = new Float32Array(analogMultiplierAnalyser.fftSize);
    updateAnalogMultiplierMeter();
    analogMultiplierMeterTimerId = window.setInterval(updateAnalogMultiplierMeter, 50);
  }

  function stopFilterRingMeter() {
    if (filterRingMeterTimerId !== null) {
      window.clearInterval(filterRingMeterTimerId);
      filterRingMeterTimerId = null;
    }
    filterRingMeterData = null;
    document.dispatchEvent(new CustomEvent("merrinlab:filter-ring-meter", {
      detail: { peak: 0, rms: 0, clipping: false },
    }));
  }

  function updateFilterRingMeter() {
    if (!filterRingAnalyser || !filterRingMeterData) return;
    filterRingAnalyser.getFloatTimeDomainData(filterRingMeterData);
    let peak = 0;
    let sumSquares = 0;
    for (let index = 0; index < filterRingMeterData.length; index += 1) {
      const sample = filterRingMeterData[index];
      peak = Math.max(peak, Math.abs(sample));
      sumSquares += sample * sample;
    }
    const rms = Math.sqrt(sumSquares / filterRingMeterData.length);
    document.dispatchEvent(new CustomEvent("merrinlab:filter-ring-meter", {
      detail: { peak, rms, clipping: peak >= 0.98 },
    }));
  }

  function startFilterRingMeter() {
    stopFilterRingMeter();
    if (!filterRingAnalyser) return;
    filterRingMeterData = new Float32Array(filterRingAnalyser.fftSize);
    updateFilterRingMeter();
    filterRingMeterTimerId = window.setInterval(updateFilterRingMeter, 50);
  }

  function getEffectiveLfoRate(which) {
    const rateKey = which === "lfo1" ? "lfo1Rate" : "lfo2Rate";
    const rangeKey = which === "lfo1" ? "lfo1Range" : "lfo2Range";
    const multiplier = state[rangeKey] === "high" ? 4 : 1;
    return Math.min(40, clamp(state[rateKey], rateKey) * multiplier);
  }

  function createRampWave(inverted = false) {
    const harmonicCount = 64;
    const real = new Float32Array(harmonicCount + 1);
    const imag = new Float32Array(harmonicCount + 1);

    for (let harmonic = 1; harmonic <= harmonicCount; harmonic += 1) {
      const sign = harmonic % 2 === 0 ? -1 : 1;
      imag[harmonic] = (inverted ? -1 : 1) * sign * (2 / (harmonic * Math.PI));
    }

    return audioContext.createPeriodicWave(real, imag, { disableNormalization: false });
  }

  function applyLfoShape(which) {
    const target = which === "lfo1" ? lfo1Oscillator : lfo2Oscillator;
    const shape = state[which === "lfo1" ? "lfo1Shape" : "lfo2Shape"];
    if (!target || !audioContext) return;

    if (shape === "rampUp") {
      target.setPeriodicWave(createRampWave(false));
    } else if (shape === "rampDown") {
      target.setPeriodicWave(createRampWave(true));
    } else {
      target.type = shape;
    }
  }

  function getEnvelopeTime(key) {
    const multiplier = state.adsrRange === "long" ? 4 : 1;
    return clamp(state[key], key) * multiplier;
  }

  function getModulationSourceNode(source) {
    if (source === "lfo1") return lfo1Oscillator;
    if (source === "lfo2") return lfo2Oscillator;
    if (source === "envelope") return envelopeCvSource;
    if (source === "sampleHold") return sampleHoldCvSource;
    if (source === "gate") return gateCvSource;
    if (source === "noise") return noiseSource;
    return null;
  }

  function getModulationDestination(destination) {
    if (destination === "filterCutoff" && filter) return { param: filter.detune, scale: 2400 };
    if (destination === "vco1Pitch" && oscillator) return { param: oscillator.detune, scale: 1200 };
    if (destination === "vco2Pitch" && oscillator2) return { param: oscillator2.detune, scale: 1200 };
    if (destination === "vco3Pitch" && oscillator3) return { param: oscillator3.detune, scale: 1200 };
    if (destination === "mainVca" && tremoloGain) return { param: tremoloGain.gain, scale: 0.45 };
    return null;
  }

  function disconnectAttenuatorRoute(index) {
    const routeNode = attenuatorRouteNodes[index];
    if (!routeNode) return;
    try { if (routeNode.source) routeNode.source.disconnect(routeNode.gain); } catch (_error) {}
    try { routeNode.gain.disconnect(); } catch (_error) {}
    routeNode.source = null;
    routeNode.destination = null;
  }

  function applyAttenuatorRoute(index) {
    if (!audioContext) return;
    const route = attenuatorRoutes[index];
    const routeNode = attenuatorRouteNodes[index];
    if (!route || !routeNode) return;

    disconnectAttenuatorRoute(index);
    const source = getModulationSourceNode(route.source);
    const destination = getModulationDestination(route.destination);
    if (!source || !destination) {
      routeNode.gain.gain.value = 0;
      return;
    }

    routeNode.gain.gain.value = Math.max(0, Math.min(1, Number(route.amount))) * destination.scale;
    source.connect(routeNode.gain);
    routeNode.gain.connect(destination.param);
    routeNode.source = source;
    routeNode.destination = destination.param;
  }

  function applyAllAttenuatorRoutes() {
    attenuatorRoutes.forEach((_route, index) => applyAttenuatorRoute(index));
  }

  function setAttenuatorRoute(channelNumber, patch = {}) {
    const index = Number(channelNumber) - 1;
    if (!Number.isInteger(index) || index < 0 || index >= attenuatorRoutes.length) return null;

    const route = attenuatorRoutes[index];
    const allowedSources = new Set(modulationSources.map(([value]) => value));
    const allowedDestinations = new Set(modulationDestinations.map(([value]) => value));
    if (patch.source !== undefined && allowedSources.has(patch.source)) route.source = patch.source;
    if (patch.destination !== undefined && allowedDestinations.has(patch.destination)) route.destination = patch.destination;
    if (patch.amount !== undefined) route.amount = Math.max(0, Math.min(1, Number(patch.amount) || 0));
    applyAttenuatorRoute(index);
    return { channel: index + 1, ...route };
  }

  function getVcoOutputNode(index) {
    const processor = vcoProcessors[index];
    if (!processor) return null;
    return state[processor.waveformKey] === "pulse" ? processor.pulseShaper : processor.oscillator;
  }

  function getAnalogMultiplierSourceNode(source) {
    if (source === "vco1") return getVcoOutputNode(0);
    if (source === "vco2") return getVcoOutputNode(1);
    if (source === "vco3") return getVcoOutputNode(2);
    if (source === "noise") return noiseSource;
    if (source === "lfo1") return lfo1Oscillator;
    if (source === "lfo2") return lfo2Oscillator;
    if (source === "envelope") return envelopeCvSource;
    if (source === "sampleHold") return sampleHoldCvSource;
    if (source === "gate") return gateCvSource;
    if (source === "mainVca") return tremoloGain;
    return null;
  }

  function disconnectAnalogMultiplierRouting() {
    try { if (analogMultiplierConnectedX && analogMultiplier) analogMultiplierConnectedX.disconnect(analogMultiplier); } catch (_error) {}
    try { if (analogMultiplierConnectedY && analogMultiplierYGain) analogMultiplierConnectedY.disconnect(analogMultiplierYGain); } catch (_error) {}
    analogMultiplierConnectedX = null;
    analogMultiplierConnectedY = null;
  }

  function applyAnalogMultiplierRouting() {
    if (!audioContext || !analogMultiplier || !analogMultiplierYGain) return;
    disconnectAnalogMultiplierRouting();
    const x = getAnalogMultiplierSourceNode(state.analogMultiplierX);
    const y = getAnalogMultiplierSourceNode(state.analogMultiplierY);
    analogMultiplier.gain.value = 0;
    analogMultiplierYGain.gain.value = 1;
    if (!x || !y) return;
    x.connect(analogMultiplier);
    y.connect(analogMultiplierYGain);
    analogMultiplierConnectedX = x;
    analogMultiplierConnectedY = y;
  }

  function getSignalMixerSourceNode(source) {
    if (source === "vco1") return vcoGain;
    if (source === "vco2") return vco2Gain;
    if (source === "vco3") return vco3Gain;
    if (source === "noise") return noiseGain;
    if (source === "mainMixer") return mixerAnalyser;
    if (source === "mainFilter") return filter;
    if (source === "mainVca") return tremoloGain;
    if (source === "auxVca") return auxVca;
    if (source === "analogMultiplier") return analogMultiplierAnalyser;
    return null;
  }

  function signalMixerSourceKey(index) {
    return `signalMixerSource${index + 1}`;
  }

  function signalMixerLevelKey(index) {
    return `signalMixerLevel${index + 1}`;
  }

  function disconnectSignalMixerRoute(index) {
    const routeNode = signalMixerRouteNodes[index];
    if (!routeNode?.source) return;
    try { routeNode.source.disconnect(routeNode.gain); } catch (_error) {}
    routeNode.source = null;
  }

  function applySignalMixerRoute(index) {
    if (!audioContext) return;
    const routeNode = signalMixerRouteNodes[index];
    if (!routeNode) return;
    disconnectSignalMixerRoute(index);
    const source = getSignalMixerSourceNode(state[signalMixerSourceKey(index)]);
    const level = clamp(state[signalMixerLevelKey(index)], signalMixerLevelKey(index));
    safeRamp(routeNode.gain.gain, level * 0.35, audioContext.currentTime, 0.02);
    if (!source) return;
    source.connect(routeNode.gain);
    routeNode.source = source;
  }

  function applyAllSignalMixerRoutes() {
    signalMixerRouteNodes.forEach((_routeNode, index) => applySignalMixerRoute(index));
  }

  function applySignalMixerLineOut() {
    if (!audioContext || !lineOutVcaGain || !lineOutMixGain) return;
    const useMix = state.signalMixerLineOut === "mix";
    const now = audioContext.currentTime;
    safeRamp(lineOutVcaGain.gain, useMix ? 0 : 1, now, 0.01);
    safeRamp(lineOutMixGain.gain, useMix ? 1 : 0, now, 0.01);
  }

  function getAuxVcaInputNode() {
    if (state.auxVcaInput === "vco1") return vcoGain;
    if (state.auxVcaInput === "vco2") return vco2Gain;
    if (state.auxVcaInput === "vco3") return vco3Gain;
    if (state.auxVcaInput === "noise") return noiseGain;
    return null;
  }

  function getAuxVcaDestinationNode() {
    if (state.auxVcaDestination === "mainVca") return mainVca;
    if (state.auxVcaDestination === "filter") return filter;
    return null;
  }

  function disconnectAuxVcaRouting() {
    try { if (auxVcaConnectedInput && auxVca) auxVcaConnectedInput.disconnect(auxVca); } catch (_error) {}
    try { if (auxVcaConnectedCv && auxVcaCvGain) auxVcaConnectedCv.disconnect(auxVcaCvGain); } catch (_error) {}
    try { if (auxVcaCvGain) auxVcaCvGain.disconnect(); } catch (_error) {}
    try { if (auxVca) auxVca.disconnect(); } catch (_error) {}
    auxVcaConnectedInput = null;
    auxVcaConnectedCv = null;
    auxVcaConnectedDestination = null;
  }

  function applyAuxVcaRouting() {
    if (!audioContext || !auxVca || !auxVcaCvGain) return;
    disconnectAuxVcaRouting();

    const input = getAuxVcaInputNode();
    const cv = getModulationSourceNode(state.auxVcaCv);
    const destination = getAuxVcaDestinationNode();
    const now = audioContext.currentTime;
    const cvAmount = clamp(state.auxVcaCvAmount, "auxVcaCvAmount");
    const usesBipolarCv = state.auxVcaCv === "lfo1" || state.auxVcaCv === "lfo2" || state.auxVcaCv === "sampleHold" || state.auxVcaCv === "noise";
    const cvScale = usesBipolarCv ? cvAmount / 2 : cvAmount;
    const cvOffset = usesBipolarCv ? cvAmount / 2 : 0;
    safeRamp(auxVca.gain, clamp(state.auxVcaInitialAmp, "auxVcaInitialAmp") + cvOffset, now, 0.02);
    safeRamp(auxVcaCvGain.gain, cvScale, now, 0.02);

    if (!input || !destination) return;
    input.connect(auxVca);
    auxVca.connect(destination);
    auxVcaConnectedInput = input;
    auxVcaConnectedDestination = destination;

    if (cv) {
      cv.connect(auxVcaCvGain);
      auxVcaCvGain.connect(auxVca.gain);
      auxVcaConnectedCv = cv;
    }
  }

  function getOscillatorFrequency(coarseKey, fineKey) {
    const coarse = clamp(state[coarseKey], coarseKey);
    const fine = clamp(state[fineKey], fineKey);
    const frequency = coarse * Math.pow(2, fine / 1200);
    return Math.min(1200, Math.max(40, frequency));
  }

  function midiNoteToFrequency(note) {
    const semitoneOffset = (Number(note) - 69) + (midiPitchBend * MIDI_PITCH_BEND_SEMITONES);
    return 440 * Math.pow(2, semitoneOffset / 12);
  }

  function getTrackedOscillatorFrequency(coarseKey, fineKey) {
    if (midiCurrentNote === null) return getOscillatorFrequency(coarseKey, fineKey);
    const coarseRatio = clamp(state[coarseKey], coarseKey) / MIDI_REFERENCE_FREQUENCY;
    const fine = clamp(state[fineKey], fineKey);
    const frequency = midiNoteToFrequency(midiCurrentNote) * coarseRatio * Math.pow(2, fine / 1200);
    return Math.min(16000, Math.max(8, frequency));
  }

  function getSampleHoldPitchCents() {
    const amount = clamp(state.sampleHoldPitchMod, "sampleHoldPitchMod");
    const maxDepthCents = 700;
    return sampleHoldValue * amount * maxDepthCents;
  }

  function getVcoFrequency() {
    const baseFrequency = getTrackedOscillatorFrequency("coarseFreq", "fineCents");
    const shiftedFrequency = baseFrequency * Math.pow(2, getSampleHoldPitchCents() / 1200);
    return Math.min(16000, Math.max(8, shiftedFrequency));
  }

  function getVco2Frequency() {
    return getTrackedOscillatorFrequency("vco2CoarseFreq", "vco2FineCents");
  }

  function getVco3Frequency() {
    return getTrackedOscillatorFrequency("vco3CoarseFreq", "vco3FineCents");
  }

  function getFilterBaseCutoff() {
    const baseCutoff = clamp(state.cutoff, "cutoff");
    const extCv = clamp(state.filterExtCv, "filterExtCv");
    if (extCv >= 0) return baseCutoff + extCv * (limits.cutoff[1] - baseCutoff);
    return baseCutoff + extCv * (baseCutoff - limits.cutoff[0]);
  }

  function getFilterHeadroom() {
    const baseCutoff = getFilterBaseCutoff();
    const lowHeadroom = Math.max(0, baseCutoff - limits.cutoff[0]);
    const highHeadroom = Math.max(0, limits.cutoff[1] - baseCutoff);
    return Math.min(lowHeadroom, highHeadroom);
  }

  function getFilterEnvelopeDepth() {
    const baseCutoff = getFilterBaseCutoff();
    return clamp(state.filterEnvelopeMod, "filterEnvelopeMod") * Math.max(0, limits.cutoff[1] - baseCutoff);
  }

  function getFilterEnvelopeTarget() {
    const baseCutoff = getFilterBaseCutoff();
    if (!document.body.classList.contains("is-audio-gated")) return baseCutoff;
    const envelopeLevel = state.envelopeMode === "adsr" ? clamp(state.adsrSustain, "adsrSustain") : 1;
    return Math.min(limits.cutoff[1], baseCutoff + getFilterEnvelopeDepth() * envelopeLevel);
  }

  function getSafeLfoDepth() {
    const modAmount = clamp(state.lfo1Mod, "lfo1Mod");
    const requestedDepth = modAmount * 1800;
    return Math.min(requestedDepth, getFilterHeadroom());
  }

  function getSafeSampleHoldDepth() {
    const modAmount = clamp(state.sampleHoldMod, "sampleHoldMod");
    const requestedDepth = modAmount * 1800;
    const remainingHeadroom = Math.max(0, getFilterHeadroom() - getSafeLfoDepth());
    return Math.min(requestedDepth, remainingHeadroom);
  }

  function getSafeTremoloDepth() {
    return clamp(state.lfo2Mod, "lfo2Mod");
  }

  function getVcaTarget(envelopeLevel = 1) {
    const initialLevel = clamp(state.vcaInitialLevel, "vcaInitialLevel");
    const envelopeAmount = clamp(state.vcaEnvelopeMod, "vcaEnvelopeMod");
    const velocity = Math.max(0.08, Math.min(1, midiGateVelocity));
    const envelopeContribution = (1 - initialLevel) * envelopeAmount * velocity * Math.max(0, Math.min(1, envelopeLevel));
    const extCvScale = 1 + clamp(state.vcaExtCv, "vcaExtCv");
    return Math.min(0.9, 0.55 * (initialLevel + envelopeContribution) * extCvScale);
  }

  function applyVcaControlParameters() {
    if (!audioContext || !mainVca) return;
    const target = document.body.classList.contains("is-audio-gated")
      ? getVcaTarget(state.envelopeMode === "adsr" ? clamp(state.adsrSustain, "adsrSustain") : 1)
      : 0;
    safeRamp(mainVca.gain, target, audioContext.currentTime, 0.02);
  }

  function getRepeatGateIntervalMs() {
    const rate = clamp(state.repeatGateRate, "repeatGateRate");
    return Math.max(80, 1000 / rate);
  }

  function getRepeatGateHoldMs() {
    const intervalMs = getRepeatGateIntervalMs();
    return Math.max(30, Math.min(intervalMs * 0.45, intervalMs - 20));
  }

  function applyVco1Frequency(rampTime = 0.015) {
    if (!audioContext || !oscillator) return;
    safeRamp(oscillator.frequency, getVcoFrequency(), audioContext.currentTime, rampTime);
  }

  function applyAllVcoFrequencies() {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    if (oscillator) safeRamp(oscillator.frequency, getVcoFrequency(), now, 0.015);
    if (oscillator2) safeRamp(oscillator2.frequency, getVco2Frequency(), now, 0.015);
    if (oscillator3) safeRamp(oscillator3.frequency, getVco3Frequency(), now, 0.015);
  }

  function applyFilterCutoffAndModulators() {
    if (!audioContext || !filter) return;
    const now = audioContext.currentTime;
    safeRamp(filter.frequency, getFilterEnvelopeTarget(), now, 0.025);
    if (lfo1Gain) safeRamp(lfo1Gain.gain, getSafeLfoDepth(), now, 0.04);
    if (sampleHoldFilterSource) safeRamp(sampleHoldFilterSource.offset, sampleHoldValue * getSafeSampleHoldDepth(), now, 0.02);
  }

  function applyDelayParameters() {
    window.MerrinLabEffectsOutputGraph?.setParameters("delay", {
      mix: clamp(state.delayMix, "delayMix"),
      time: clamp(state.delayTime, "delayTime"),
      feedback: clamp(state.delayFeedback, "delayFeedback"),
    });
  }

  function triggerFilterEnvelopeOn(now) {
    if (!filter) return;
    const baseCutoff = getFilterBaseCutoff();
    const depth = getFilterEnvelopeDepth();
    filter.frequency.cancelScheduledValues(now);
    filter.frequency.setValueAtTime(Math.max(limits.cutoff[0], filter.frequency.value), now);
    if (state.envelopeMode === "adsr") {
      const attack = getEnvelopeTime("adsrAttack");
      const decay = getEnvelopeTime("adsrDecay");
      const sustainTarget = baseCutoff + depth * clamp(state.adsrSustain, "adsrSustain");
      filter.frequency.linearRampToValueAtTime(Math.min(limits.cutoff[1], baseCutoff + depth), now + attack);
      filter.frequency.linearRampToValueAtTime(Math.min(limits.cutoff[1], sustainTarget), now + attack + decay);
      return;
    }
    filter.frequency.linearRampToValueAtTime(Math.min(limits.cutoff[1], baseCutoff + depth), now + clamp(state.attack, "attack"));
  }

  function triggerFilterEnvelopeOff(now, release) {
    if (!filter) return;
    filter.frequency.cancelScheduledValues(now);
    filter.frequency.setValueAtTime(Math.max(limits.cutoff[0], filter.frequency.value), now);
    filter.frequency.linearRampToValueAtTime(getFilterBaseCutoff(), now + release);
  }

  function getSampleHoldInputValue() {
    if (!audioContext) return 0;
    const phaseTime = audioContext.currentTime * Math.PI * 2;
    if (state.sampleHoldInput === "lfo1") return Math.sin(phaseTime * clamp(state.lfo1Rate, "lfo1Rate"));
    if (state.sampleHoldInput === "vco1") return Math.sin(phaseTime * getVcoFrequency());
    return Math.random() * 2 - 1;
  }

  function getSampleHoldGlideTime() {
    return clamp(state.sampleHoldGlide, "sampleHoldGlide");
  }

  function notifySampleHoldUi(isTracking = false, captured = false) {
    document.dispatchEvent(new CustomEvent("merrinlab:sample-hold-value", {
      detail: { value: sampleHoldValue, mode: state.sampleHoldMode, tracking: Boolean(isTracking), captured: Boolean(captured) },
    }));
  }

  function updateSampleHoldValue() {
    if (!audioContext) return;
    sampleHoldValue = getSampleHoldInputValue();
    const now = audioContext.currentTime;
    const glideTime = getSampleHoldGlideTime();
    if (sampleHoldCvSource) {
      if (glideTime === 0) {
        sampleHoldCvSource.offset.cancelScheduledValues(now);
        sampleHoldCvSource.offset.setValueAtTime(sampleHoldValue, now);
      } else safeRamp(sampleHoldCvSource.offset, sampleHoldValue, now, glideTime);
    }
    if (sampleHoldFilterSource && clamp(state.sampleHoldMod, "sampleHoldMod") > 0) {
      if (glideTime === 0) {
        sampleHoldFilterSource.offset.cancelScheduledValues(now);
        sampleHoldFilterSource.offset.setValueAtTime(sampleHoldValue * getSafeSampleHoldDepth(), now);
      } else safeRamp(sampleHoldFilterSource.offset, sampleHoldValue * getSafeSampleHoldDepth(), now, glideTime);
    }
    if (clamp(state.sampleHoldPitchMod, "sampleHoldPitchMod") > 0) {
      applyVco1Frequency(glideTime === 0 ? 0.001 : glideTime);
    }
    const isTracking = state.sampleHoldMode === "track" && document.body.classList.contains("is-audio-gated");
    notifySampleHoldUi(isTracking, true);
  }

  function isSampleHoldActive() {
    return clamp(state.sampleHoldMod, "sampleHoldMod") > 0 || clamp(state.sampleHoldPitchMod, "sampleHoldPitchMod") > 0;
  }

  function stopSampleHoldTimer() {
    if (sampleHoldTimerId !== null) {
      window.clearInterval(sampleHoldTimerId);
      sampleHoldTimerId = null;
    }
  }

  function startSampleHoldTimer() {
    stopSampleHoldTimer();
    if (state.sampleHoldMode === "track") {
      if (!document.body.classList.contains("is-audio-gated")) {
        notifySampleHoldUi(false);
        return;
      }
      updateSampleHoldValue();
      sampleHoldTimerId = window.setInterval(updateSampleHoldValue, 25);
      return;
    }
    const rate = clamp(state.sampleHoldRate, "sampleHoldRate");
    const intervalMs = Math.max(40, 1000 / rate);
    updateSampleHoldValue();
    sampleHoldTimerId = window.setInterval(updateSampleHoldValue, intervalMs);
  }

  async function triggerSampleHold() {
    await startAudio();
    updateSampleHoldValue();
    setStatus(`${state.sampleHoldMode === "track" ? "Track" : "Sample"} captured · ${state.sampleHoldInput.toUpperCase()} input`);
  }

  function stopRepeatGateTimer(releaseGate = false) {
    if (repeatGateTimerId !== null) {
      window.clearInterval(repeatGateTimerId);
      repeatGateTimerId = null;
    }
    if (repeatGateReleaseTimerId !== null) {
      window.clearTimeout(repeatGateReleaseTimerId);
      repeatGateReleaseTimerId = null;
    }
    if (releaseGate && isRepeatGateHoldingGate) triggerGateOff("Repeat Gate off · gate released");
    isRepeatGateHoldingGate = false;
  }

  function triggerRepeatGateCycle() {
    if (!audioContext || state.repeatGate !== "on") return;
    if (repeatGateReleaseTimerId !== null) {
      window.clearTimeout(repeatGateReleaseTimerId);
      repeatGateReleaseTimerId = null;
    }
    const triggersEnvelope = state.repeatGateTarget === "envelope" || state.repeatGateTarget === "both";
    const triggersSampleHold = state.repeatGateTarget === "sampleHold" || state.repeatGateTarget === "both";
    if (triggersSampleHold) updateSampleHoldValue();
    if (!triggersEnvelope || !mainVca) {
      setStatus("Repeat Gate trigger · Sample & Hold captured");
      return;
    }
    triggerGateOn(triggersSampleHold ? "Repeat Gate trigger · envelope + S&H" : "Repeat Gate trigger · envelope active");
    isRepeatGateHoldingGate = true;
    repeatGateReleaseTimerId = window.setTimeout(() => {
      if (state.repeatGate !== "on" || !isRepeatGateHoldingGate) return;
      triggerGateOff("Repeat Gate release");
      isRepeatGateHoldingGate = false;
      repeatGateReleaseTimerId = null;
    }, getRepeatGateHoldMs());
  }

  function startRepeatGateTimer() {
    stopRepeatGateTimer(false);
    if (!audioContext || state.repeatGate !== "on") return;
    triggerRepeatGateCycle();
    repeatGateTimerId = window.setInterval(triggerRepeatGateCycle, getRepeatGateIntervalMs());
  }

  function applyLfo2Tremolo() {
    if (!audioContext || !lfo2Gain || !lfo2Offset) return;
    const now = audioContext.currentTime;
    const depth = getSafeTremoloDepth();
    safeRamp(lfo2Gain.gain, depth / 2, now, 0.04);
    safeRamp(lfo2Offset.offset, 1 - depth / 2, now, 0.04);
  }

  function createPulseShaperCurve() {
    const curve = new Float32Array(4096);
    for (let index = 0; index < curve.length; index += 1) {
      const input = (index / (curve.length - 1)) * 2 - 1;
      curve[index] = Math.tanh(input * 80);
    }
    return curve;
  }

  function createVcoProcessor(oscillatorNode, outputGain, config) {
    const pulseShaper = audioContext.createWaveShaper();
    pulseShaper.curve = createPulseShaperCurve();
    pulseShaper.oversample = "4x";
    const pulseOffset = audioContext.createConstantSource();
    const pwmGain = audioContext.createGain();
    const pitchGain = audioContext.createGain();
    const linearFmGain = audioContext.createGain();
    pulseOffset.connect(pulseShaper);
    pwmGain.connect(pulseShaper);
    pitchGain.connect(oscillatorNode.detune);
    linearFmGain.connect(oscillatorNode.frequency);
    return {
      ...config,
      oscillator: oscillatorNode,
      outputGain,
      pulseShaper,
      pulseOffset,
      pwmGain,
      pitchGain,
      linearFmGain,
      connectedPitchSource: null,
      connectedLinearFmSource: null,
      connectedPwmSource: null,
    };
  }

  function disconnectVcoSignalPath(processor) {
    if (!processor) return;
    try { processor.oscillator.disconnect(processor.outputGain); } catch (_error) {}
    try { processor.oscillator.disconnect(processor.pulseShaper); } catch (_error) {}
    try { processor.pulseShaper.disconnect(processor.outputGain); } catch (_error) {}
  }

  function applyVcoSignalPath(processor) {
    if (!audioContext || !processor) return;
    const waveform = state[processor.waveformKey];
    const pulseWidth = clamp(state[processor.pulseWidthKey], processor.pulseWidthKey);
    const now = audioContext.currentTime;
    disconnectVcoSignalPath(processor);
    if (waveform === "pulse") {
      processor.oscillator.type = "sawtooth";
      safeRamp(processor.pulseOffset.offset, (pulseWidth - 50) / 50, now, 0.01);
      processor.oscillator.connect(processor.pulseShaper);
      processor.pulseShaper.connect(processor.outputGain);
      applyAnalogMultiplierRouting();
      return;
    }
    processor.oscillator.type = waveform;
    processor.oscillator.connect(processor.outputGain);
    applyAnalogMultiplierRouting();
  }

  function disconnectVcoModulationSource(processor, route) {
    const sourceKey = `connected${route}`;
    const gainKey = route === "PitchSource" ? "pitchGain" : route === "LinearFmSource" ? "linearFmGain" : "pwmGain";
    const source = processor?.[sourceKey];
    if (!source) return;
    try { source.disconnect(processor[gainKey]); } catch (_error) {}
    processor[sourceKey] = null;
  }

  function applyVcoModulationRoutes(processor) {
    if (!audioContext || !processor) return;
    disconnectVcoModulationSource(processor, "PitchSource");
    disconnectVcoModulationSource(processor, "LinearFmSource");
    disconnectVcoModulationSource(processor, "PwmSource");
    const pitchSource = getModulationSourceNode(state[processor.pitchSourceKey]);
    const linearFmSource = getModulationSourceNode(state[processor.linearFmSourceKey]);
    const pwmSource = getModulationSourceNode(state[processor.pwmSourceKey]);
    const now = audioContext.currentTime;
    safeRamp(processor.pitchGain.gain, clamp(state[processor.pitchDepthKey], processor.pitchDepthKey) * 100, now, 0.02);
    safeRamp(processor.linearFmGain.gain, clamp(state[processor.linearFmDepthKey], processor.linearFmDepthKey), now, 0.02);
    safeRamp(processor.pwmGain.gain, clamp(state[processor.pwmDepthKey], processor.pwmDepthKey) / 50, now, 0.02);
    if (pitchSource) { pitchSource.connect(processor.pitchGain); processor.connectedPitchSource = pitchSource; }
    if (linearFmSource) { linearFmSource.connect(processor.linearFmGain); processor.connectedLinearFmSource = linearFmSource; }
    if (pwmSource) { pwmSource.connect(processor.pwmGain); processor.connectedPwmSource = pwmSource; }
  }

  function applyAllVcoModulationRoutes() {
    vcoProcessors.forEach(applyVcoModulationRoutes);
  }

  function fillWhiteNoise(channel) {
    for (let i = 0; i < channel.length; i += 1) channel[i] = (Math.random() * 2 - 1) * 0.7;
  }

  function fillPinkNoise(channel) {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < channel.length; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      channel[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
  }

  function fillBrownNoise(channel) {
    let lastOut = 0;
    for (let i = 0; i < channel.length; i += 1) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      channel[i] = lastOut * 3.5;
    }
  }

  function createNoiseSource() {
    const seconds = 2;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * seconds, sampleRate);
    const channel = buffer.getChannelData(0);
    if (state.noiseType === "pink") fillPinkNoise(channel);
    else if (state.noiseType === "brown") fillBrownNoise(channel);
    else fillWhiteNoise(channel);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  function replaceNoiseSource() {
    if (!audioContext || !noiseGain) return;
    try { if (noiseSource) noiseSource.stop(); } catch (_error) {}
    try { if (noiseSource) noiseSource.disconnect(); } catch (_error) {}
    noiseSource = createNoiseSource();
    noiseSource.connect(noiseGain);
    noiseSource.start();
    applyAllAttenuatorRoutes();
    applyAllVcoModulationRoutes();
    applyAnalogMultiplierRouting();
  }

  function applyWaveform() { applyVcoSignalPath(vcoProcessors[0]); }
  function applyVco2Waveform() { applyVcoSignalPath(vcoProcessors[1]); }
  function applyVco3Waveform() { applyVcoSignalPath(vcoProcessors[2]); }

  function createAudioGraph() {
    if (!AudioContextClass) {
      setStatus("Web Audio unavailable in this browser");
      return false;
    }
    if (audioContext && audioContext.state !== "closed") return true;

    audioContext = new AudioContextClass();
    oscillator = audioContext.createOscillator();
    oscillator.frequency.value = getVcoFrequency();
    vcoGain = audioContext.createGain();
    vcoGain.gain.value = getMixerChannelLevel("vcoLevel", "vco1Mute");
    oscillator2 = audioContext.createOscillator();
    oscillator2.frequency.value = getVco2Frequency();
    vco2Gain = audioContext.createGain();
    vco2Gain.gain.value = getMixerChannelLevel("vco2Level", "vco2Mute");
    oscillator3 = audioContext.createOscillator();
    oscillator3.frequency.value = getVco3Frequency();
    vco3Gain = audioContext.createGain();
    vco3Gain.gain.value = getMixerChannelLevel("vco3Level", "vco3Mute");

    vcoProcessors = [
      createVcoProcessor(oscillator, vcoGain, { waveformKey: "waveform", pulseWidthKey: "pulseWidth", pitchSourceKey: "vco1PitchModSource", pitchDepthKey: "vco1PitchModDepth", linearFmSourceKey: "vco1LinearFmSource", linearFmDepthKey: "vco1LinearFmDepth", pwmSourceKey: "vco1PwmSource", pwmDepthKey: "vco1PwmDepth" }),
      createVcoProcessor(oscillator2, vco2Gain, { waveformKey: "vco2Waveform", pulseWidthKey: "vco2PulseWidth", pitchSourceKey: "vco2PitchModSource", pitchDepthKey: "vco2PitchModDepth", linearFmSourceKey: "vco2LinearFmSource", linearFmDepthKey: "vco2LinearFmDepth", pwmSourceKey: "vco2PwmSource", pwmDepthKey: "vco2PwmDepth" }),
      createVcoProcessor(oscillator3, vco3Gain, { waveformKey: "vco3Waveform", pulseWidthKey: "vco3PulseWidth", pitchSourceKey: "vco3PitchModSource", pitchDepthKey: "vco3PitchModDepth", linearFmSourceKey: "vco3LinearFmSource", linearFmDepthKey: "vco3LinearFmDepth", pwmSourceKey: "vco3PwmSource", pwmDepthKey: "vco3PwmDepth" }),
    ];
    applyWaveform();
    applyVco2Waveform();
    applyVco3Waveform();

    noiseSource = createNoiseSource();
    noiseGain = audioContext.createGain();
    noiseGain.gain.value = getMixerChannelLevel("whiteNoiseLevel", "noiseMute");
    mixerBus = audioContext.createGain();
    mixerBus.gain.value = 1;
    mixerAnalyser = audioContext.createAnalyser();
    mixerAnalyser.fftSize = 256;
    mixerAnalyser.smoothingTimeConstant = 0.72;
    signalMixerBus = audioContext.createGain();
    signalMixerBus.gain.value = 1;
    signalMixerAnalyser = audioContext.createAnalyser();
    signalMixerAnalyser.fftSize = 256;
    signalMixerAnalyser.smoothingTimeConstant = 0.72;
    lineOutVcaGain = audioContext.createGain();
    lineOutVcaGain.gain.value = state.signalMixerLineOut === "mix" ? 0 : 1;
    lineOutMixGain = audioContext.createGain();
    lineOutMixGain.gain.value = state.signalMixerLineOut === "mix" ? 1 : 0;

    filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = state.cutoff;
    filter.Q.value = state.resonance;
    lfo1Oscillator = audioContext.createOscillator();
    lfo1Oscillator.frequency.value = getEffectiveLfoRate("lfo1");
    applyLfoShape("lfo1");
    lfo1Gain = audioContext.createGain();
    lfo1Gain.gain.value = getSafeLfoDepth();
    sampleHoldFilterSource = audioContext.createConstantSource();
    sampleHoldFilterSource.offset.value = 0;
    sampleHoldCvSource = audioContext.createConstantSource();
    sampleHoldCvSource.offset.value = 0;
    envelopeCvSource = audioContext.createConstantSource();
    envelopeCvSource.offset.value = 0;
    gateCvSource = audioContext.createConstantSource();
    gateCvSource.offset.value = 0;
    mainVca = audioContext.createGain();
    mainVca.gain.value = 0;
    tremoloGain = audioContext.createGain();
    tremoloGain.gain.value = 0;
    lfo2Oscillator = audioContext.createOscillator();
    lfo2Oscillator.frequency.value = getEffectiveLfoRate("lfo2");
    applyLfoShape("lfo2");
    lfo2Gain = audioContext.createGain();
    lfo2Gain.gain.value = getSafeTremoloDepth() / 2;
    lfo2Offset = audioContext.createConstantSource();
    lfo2Offset.offset.value = 1 - getSafeTremoloDepth() / 2;
    auxVca = audioContext.createGain();
    auxVca.gain.value = state.auxVcaInitialAmp;
    auxVcaCvGain = audioContext.createGain();
    auxVcaCvGain.gain.value = state.auxVcaCvAmount;
    analogMultiplier = audioContext.createGain();
    analogMultiplier.gain.value = 0;
    analogMultiplierYGain = audioContext.createGain();
    analogMultiplierYGain.gain.value = 1;
    analogMultiplierOutputGain = audioContext.createGain();
    analogMultiplierOutputGain.gain.value = 0.7;
    analogMultiplierAnalyser = audioContext.createAnalyser();
    analogMultiplierAnalyser.fftSize = 256;
    analogMultiplierAnalyser.smoothingTimeConstant = 0.72;
    filterRingMultiplier = audioContext.createGain();
    filterRingMultiplier.gain.value = 0;
    filterRingYGain = audioContext.createGain();
    filterRingYGain.gain.value = 1;
    filterRingOutputGain = audioContext.createGain();
    filterRingOutputGain.gain.value = clamp(state.filterRingLevel, "filterRingLevel") * 0.7;
    filterRingAnalyser = audioContext.createAnalyser();
    filterRingAnalyser.fftSize = 256;
    filterRingAnalyser.smoothingTimeConstant = 0.72;

    attenuatorRouteNodes = attenuatorRoutes.map(() => ({ gain: audioContext.createGain(), source: null, destination: null }));
    signalMixerRouteNodes = Array.from({ length: 4 }, () => {
      const gain = audioContext.createGain();
      gain.gain.value = 0;
      gain.connect(signalMixerBus);
      return { gain, source: null };
    });

    effectsOutputGraph = window.MerrinLabEffectsOutputGraph?.create(audioContext) || null;
    if (!effectsOutputGraph) {
      setStatus("Effects/output graph unavailable");
      return false;
    }
    const filter2Output = window.MerrinLabEffectsOutputGraph?.getSignalNode("filter2Output");
    const filterRingReturn = window.MerrinLabEffectsOutputGraph?.getSignalNode("filterRingReturn");
    if (!filter2Output || !filterRingReturn) {
      setStatus("Filter Ring graph unavailable");
      return false;
    }

    vcoGain.connect(mixerBus);
    vco2Gain.connect(mixerBus);
    vco3Gain.connect(mixerBus);
    noiseSource.connect(noiseGain);
    noiseGain.connect(mixerBus);
    mixerBus.connect(mixerAnalyser);
    mixerAnalyser.connect(filter);
    lfo1Oscillator.connect(lfo1Gain);
    lfo1Gain.connect(filter.frequency);
    sampleHoldFilterSource.connect(filter.frequency);
    lfo2Oscillator.connect(lfo2Gain);
    lfo2Gain.connect(tremoloGain.gain);
    lfo2Offset.connect(tremoloGain.gain);
    filter.connect(mainVca);
    mainVca.connect(tremoloGain);
    tremoloGain.connect(lineOutVcaGain);
    lineOutVcaGain.connect(effectsOutputGraph.input);
    analogMultiplierYGain.connect(analogMultiplier.gain);
    analogMultiplier.connect(analogMultiplierOutputGain);
    analogMultiplierOutputGain.connect(analogMultiplierAnalyser);
    filter.connect(filterRingMultiplier);
    filter2Output.connect(filterRingYGain);
    filterRingYGain.connect(filterRingMultiplier.gain);
    filterRingMultiplier.connect(filterRingOutputGain);
    filterRingOutputGain.connect(filterRingAnalyser);
    filterRingAnalyser.connect(filterRingReturn);
    signalMixerBus.connect(signalMixerAnalyser);
    signalMixerAnalyser.connect(lineOutMixGain);
    lineOutMixGain.connect(effectsOutputGraph.input);

    applyAuxVcaRouting();
    applyAllAttenuatorRoutes();
    applyAllVcoModulationRoutes();
    applyAnalogMultiplierRouting();
    applyAllSignalMixerRoutes();
    applySignalMixerLineOut();

    oscillator.start();
    oscillator2.start();
    oscillator3.start();
    noiseSource.start();
    lfo1Oscillator.start();
    sampleHoldFilterSource.start();
    sampleHoldCvSource.start();
    envelopeCvSource.start();
    gateCvSource.start();
    startSampleHoldTimer();
    lfo2Oscillator.start();
    lfo2Offset.start();
    vcoProcessors.forEach((processor) => processor.pulseOffset.start());
    startMixerMeter();
    startSignalMixerMeter();
    startAnalogMultiplierMeter();
    startFilterRingMeter();
    return true;
  }

  async function startAudio() {
    if (!createAudioGraph()) return;
    if (audioContext.state === "suspended") await audioContext.resume();
    document.body.classList.add("is-audio-started");
    setStatus(`Audio ready · VCO 1 + VCO 2 + VCO 3 + ${state.noiseType} noise · safe output`);
    applyAllParameters();
  }

  function triggerGateOn(statusMessage) {
    if (!audioContext || !mainVca) return;
    const now = audioContext.currentTime;
    const target = getVcaTarget(1);
    document.body.classList.add("is-audio-gated");
    document.dispatchEvent(new CustomEvent("merrinlab:gate-state", { detail: { gated: true } }));
    if (gateCvSource) {
      gateCvSource.offset.cancelScheduledValues(now);
      gateCvSource.offset.setValueAtTime(1, now);
    }
    mainVca.gain.cancelScheduledValues(now);
    mainVca.gain.setValueAtTime(Math.max(0, mainVca.gain.value), now);
    triggerFilterEnvelopeOn(now);
    if (state.sampleHoldMode === "track") startSampleHoldTimer();
    if (state.envelopeMode === "adsr") {
      const attack = getEnvelopeTime("adsrAttack");
      const decay = getEnvelopeTime("adsrDecay");
      const sustain = getVcaTarget(clamp(state.adsrSustain, "adsrSustain"));
      if (envelopeCvSource) {
        envelopeCvSource.offset.cancelScheduledValues(now);
        envelopeCvSource.offset.setValueAtTime(Math.max(0, envelopeCvSource.offset.value), now);
        envelopeCvSource.offset.linearRampToValueAtTime(1, now + attack);
        envelopeCvSource.offset.linearRampToValueAtTime(clamp(state.adsrSustain, "adsrSustain"), now + attack + decay);
      }
      mainVca.gain.linearRampToValueAtTime(target, now + attack);
      mainVca.gain.linearRampToValueAtTime(sustain, now + attack + decay);
      setStatus(statusMessage || "Gate open · ADSR envelope active");
      return;
    }
    const attack = clamp(state.attack, "attack");
    if (envelopeCvSource) {
      envelopeCvSource.offset.cancelScheduledValues(now);
      envelopeCvSource.offset.setValueAtTime(Math.max(0, envelopeCvSource.offset.value), now);
      envelopeCvSource.offset.linearRampToValueAtTime(1, now + attack);
    }
    mainVca.gain.linearRampToValueAtTime(target, now + attack);
    setStatus(statusMessage || "Gate open · AR envelope active");
  }

  async function gateOn() {
    midiGateVelocity = 1;
    await startAudio();
    triggerGateOn();
  }

  function triggerGateOff(statusMessage) {
    if (!audioContext || !mainVca) return;
    const now = audioContext.currentTime;
    const release = state.envelopeMode === "adsr" ? getEnvelopeTime("adsrRelease") : clamp(state.release, "release");
    document.body.classList.remove("is-audio-gated");
    document.dispatchEvent(new CustomEvent("merrinlab:gate-state", { detail: { gated: false } }));
    if (gateCvSource) {
      gateCvSource.offset.cancelScheduledValues(now);
      gateCvSource.offset.setValueAtTime(0, now);
    }
    if (envelopeCvSource) {
      envelopeCvSource.offset.cancelScheduledValues(now);
      envelopeCvSource.offset.setValueAtTime(Math.max(0, envelopeCvSource.offset.value), now);
      envelopeCvSource.offset.linearRampToValueAtTime(0, now + release);
    }
    mainVca.gain.cancelScheduledValues(now);
    mainVca.gain.setValueAtTime(Math.max(0, mainVca.gain.value), now);
    mainVca.gain.linearRampToValueAtTime(0, now + release);
    triggerFilterEnvelopeOff(now, release);
    if (state.sampleHoldMode === "track") {
      stopSampleHoldTimer();
      notifySampleHoldUi(false);
    }
    setStatus(statusMessage || (state.envelopeMode === "adsr" ? "Gate released · ADSR release" : "Gate released · AR release"));
  }

  function gateOff() {
    triggerGateOff();
    isRepeatGateHoldingGate = false;
  }

  function removeMidiHeldNote(note) {
    for (let index = midiHeldNotes.length - 1; index >= 0; index -= 1) {
      if (midiHeldNotes[index].note === note) midiHeldNotes.splice(index, 1);
    }
  }

  async function midiNoteOn(note, velocity = 127) {
    const normalizedNote = Math.max(0, Math.min(127, Number(note)));
    const normalizedVelocity = Math.max(1, Math.min(127, Number(velocity)));
    removeMidiHeldNote(normalizedNote);
    midiHeldNotes.push({ note: normalizedNote, velocity: normalizedVelocity });
    midiCurrentNote = normalizedNote;
    midiGateVelocity = normalizedVelocity / 127;
    await startAudio();
    applyAllVcoFrequencies();
    triggerGateOn(`MIDI note ${normalizedNote} · velocity ${normalizedVelocity}`);
  }

  function midiNoteOff(note) {
    const normalizedNote = Math.max(0, Math.min(127, Number(note)));
    removeMidiHeldNote(normalizedNote);
    if (midiCurrentNote !== normalizedNote) return;
    if (midiHeldNotes.length) {
      const fallback = midiHeldNotes[midiHeldNotes.length - 1];
      midiCurrentNote = fallback.note;
      midiGateVelocity = fallback.velocity / 127;
      applyAllVcoFrequencies();
      setStatus(`MIDI legato · note ${fallback.note}`);
      return;
    }
    midiCurrentNote = null;
    midiGateVelocity = 1;
    triggerGateOff("MIDI release");
  }

  function setMidiPitchBend(value) {
    const numeric = Number(value);
    const normalized = Math.abs(numeric) > 1 ? numeric / 8192 : numeric;
    midiPitchBend = Math.max(-1, Math.min(1, normalized));
    applyAllVcoFrequencies();
  }

  async function panicStop() {
    document.body.classList.remove("is-audio-started", "is-audio-gated");
    isRepeatGateHoldingGate = false;
    midiHeldNotes.length = 0;
    midiCurrentNote = null;
    midiPitchBend = 0;
    midiGateVelocity = 1;
    stopSampleHoldTimer();
    stopMixerMeter();
    stopSignalMixerMeter();
    stopAnalogMultiplierMeter();
    stopFilterRingMeter();
    stopRepeatGateTimer(false);
    sampleHoldValue = 0;

    if (mainVca && audioContext) { mainVca.gain.cancelScheduledValues(audioContext.currentTime); mainVca.gain.setValueAtTime(0, audioContext.currentTime); }
    if (noiseGain && audioContext) { noiseGain.gain.cancelScheduledValues(audioContext.currentTime); noiseGain.gain.setValueAtTime(0, audioContext.currentTime); }
    if (lfo1Gain && audioContext) { lfo1Gain.gain.cancelScheduledValues(audioContext.currentTime); lfo1Gain.gain.setValueAtTime(0, audioContext.currentTime); }
    if (sampleHoldFilterSource && audioContext) { sampleHoldFilterSource.offset.cancelScheduledValues(audioContext.currentTime); sampleHoldFilterSource.offset.setValueAtTime(0, audioContext.currentTime); }
    if (lfo2Gain && audioContext) { lfo2Gain.gain.cancelScheduledValues(audioContext.currentTime); lfo2Gain.gain.setValueAtTime(0, audioContext.currentTime); }
    if (lfo2Offset && audioContext) { lfo2Offset.offset.cancelScheduledValues(audioContext.currentTime); lfo2Offset.offset.setValueAtTime(0, audioContext.currentTime); }
    if (tremoloGain && audioContext) { tremoloGain.gain.cancelScheduledValues(audioContext.currentTime); tremoloGain.gain.setValueAtTime(0, audioContext.currentTime); }
    if (auxVca && audioContext) { auxVca.gain.cancelScheduledValues(audioContext.currentTime); auxVca.gain.setValueAtTime(0, audioContext.currentTime); }
    if (lineOutVcaGain && audioContext) { lineOutVcaGain.gain.cancelScheduledValues(audioContext.currentTime); lineOutVcaGain.gain.setValueAtTime(0, audioContext.currentTime); }
    if (lineOutMixGain && audioContext) { lineOutMixGain.gain.cancelScheduledValues(audioContext.currentTime); lineOutMixGain.gain.setValueAtTime(0, audioContext.currentTime); }
    if (analogMultiplierOutputGain && audioContext) { analogMultiplierOutputGain.gain.cancelScheduledValues(audioContext.currentTime); analogMultiplierOutputGain.gain.setValueAtTime(0, audioContext.currentTime); }
    if (filterRingOutputGain && audioContext) { filterRingOutputGain.gain.cancelScheduledValues(audioContext.currentTime); filterRingOutputGain.gain.setValueAtTime(0, audioContext.currentTime); }

    [sampleHoldCvSource, envelopeCvSource, gateCvSource].forEach((source) => {
      if (!source || !audioContext) return;
      source.offset.cancelScheduledValues(audioContext.currentTime);
      source.offset.setValueAtTime(0, audioContext.currentTime);
    });

    attenuatorRouteNodes.forEach((_routeNode, index) => disconnectAttenuatorRoute(index));
    signalMixerRouteNodes.forEach((routeNode, index) => {
      disconnectSignalMixerRoute(index);
      if (routeNode?.gain && audioContext) {
        routeNode.gain.gain.cancelScheduledValues(audioContext.currentTime);
        routeNode.gain.gain.setValueAtTime(0, audioContext.currentTime);
      }
    });
    disconnectAnalogMultiplierRouting();
    vcoProcessors.forEach((processor) => {
      disconnectVcoModulationSource(processor, "PitchSource");
      disconnectVcoModulationSource(processor, "LinearFmSource");
      disconnectVcoModulationSource(processor, "PwmSource");
      [processor.pitchGain, processor.linearFmGain, processor.pwmGain].forEach((gainNode) => {
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      });
      try { processor.pulseOffset.stop(); } catch (_error) {}
    });
    disconnectAuxVcaRouting();
    window.MerrinLabEffectsOutputGraph?.mute();

    [oscillator, oscillator2, oscillator3, noiseSource, lfo1Oscillator, sampleHoldFilterSource, sampleHoldCvSource, envelopeCvSource, gateCvSource, lfo2Oscillator, lfo2Offset].forEach((source) => {
      try { if (source) source.stop(); } catch (_error) {}
    });

    try { if (audioContext && audioContext.state !== "closed") await audioContext.close(); } catch (_error) {}
    window.MerrinLabEffectsOutputGraph?.dispose();
    audioContext = null;
    oscillator = null;
    vcoGain = null;
    oscillator2 = null;
    vco2Gain = null;
    oscillator3 = null;
    vco3Gain = null;
    vcoProcessors = [];
    noiseSource = null;
    noiseGain = null;
    mixerBus = null;
    mixerAnalyser = null;
    signalMixerBus = null;
    signalMixerAnalyser = null;
    signalMixerRouteNodes = [];
    lineOutVcaGain = null;
    lineOutMixGain = null;
    analogMultiplier = null;
    analogMultiplierYGain = null;
    analogMultiplierOutputGain = null;
    analogMultiplierAnalyser = null;
    analogMultiplierConnectedX = null;
    analogMultiplierConnectedY = null;
    filterRingMultiplier = null;
    filterRingYGain = null;
    filterRingOutputGain = null;
    filterRingAnalyser = null;
    lfo1Oscillator = null;
    lfo1Gain = null;
    sampleHoldFilterSource = null;
    sampleHoldCvSource = null;
    lfo2Oscillator = null;
    lfo2Gain = null;
    lfo2Offset = null;
    filter = null;
    mainVca = null;
    tremoloGain = null;
    envelopeCvSource = null;
    gateCvSource = null;
    auxVca = null;
    auxVcaCvGain = null;
    auxVcaConnectedInput = null;
    auxVcaConnectedCv = null;
    auxVcaConnectedDestination = null;
    attenuatorRouteNodes = [];
    effectsOutputGraph = null;
    setStatus("Panic stopped · silent");
    document.dispatchEvent(new CustomEvent("merrinlab:gate-state", { detail: { gated: false } }));
  }

  function applyAllParameters() {
    if (!audioContext) return;
    [
      "coarseFreq", "fineCents", "waveform", "pulseWidth", "vco1PitchModSource", "vco1PitchModDepth", "vco1LinearFmSource", "vco1LinearFmDepth", "vco1PwmSource", "vco1PwmDepth", "vcoLevel", "vco1Mute",
      "vco2CoarseFreq", "vco2FineCents", "vco2Waveform", "vco2PulseWidth", "vco2PitchModSource", "vco2PitchModDepth", "vco2LinearFmSource", "vco2LinearFmDepth", "vco2PwmSource", "vco2PwmDepth", "vco2Level", "vco2Mute",
      "vco3CoarseFreq", "vco3FineCents", "vco3Waveform", "vco3PulseWidth", "vco3PitchModSource", "vco3PitchModDepth", "vco3LinearFmSource", "vco3LinearFmDepth", "vco3PwmSource", "vco3PwmDepth", "vco3Level", "vco3Mute",
      "noiseType", "whiteNoiseLevel", "noiseMute", "cutoff", "resonance", "filterEnvelopeMod", "filterExtCv", "lfo1Rate", "lfo1Shape", "lfo1Range", "lfo1Mod",
      "sampleHoldRate", "sampleHoldMod", "sampleHoldPitchMod", "sampleHoldInput", "sampleHoldMode", "sampleHoldGlide", "vcaInitialLevel", "vcaEnvelopeMod", "vcaExtCv",
      "lfo2Rate", "lfo2Shape", "lfo2Range", "lfo2Mod", "envelopeMode", "adsrRange", "repeatGate", "repeatGateRate", "repeatGateTarget",
      "auxVcaInput", "auxVcaCv", "auxVcaInitialAmp", "auxVcaCvAmount", "auxVcaDestination",
      "analogMultiplierX", "analogMultiplierY",
      "filterRingLevel",
      "signalMixerSource1", "signalMixerSource2", "signalMixerSource3", "signalMixerSource4", "signalMixerLevel1", "signalMixerLevel2", "signalMixerLevel3", "signalMixerLevel4", "signalMixerLineOut",
      "delayMix", "delayTime", "delayFeedback", "output",
    ].forEach(applyParameter);
  }

  function applyParameter(key) {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    if (key === "coarseFreq" || key === "fineCents" || key === "sampleHoldPitchMod") applyVco1Frequency();
    if ((key === "vco2CoarseFreq" || key === "vco2FineCents") && oscillator2) safeRamp(oscillator2.frequency, getVco2Frequency(), now, 0.015);
    if ((key === "vco3CoarseFreq" || key === "vco3FineCents") && oscillator3) safeRamp(oscillator3.frequency, getVco3Frequency(), now, 0.015);
    if (key === "waveform" || key === "pulseWidth") applyWaveform();
    if (key === "vco2Waveform" || key === "vco2PulseWidth") applyVco2Waveform();
    if (key === "vco3Waveform" || key === "vco3PulseWidth") applyVco3Waveform();

    const vcoModulationIndex = [
      ["vco1PitchModSource", "vco1PitchModDepth", "vco1LinearFmSource", "vco1LinearFmDepth", "vco1PwmSource", "vco1PwmDepth"],
      ["vco2PitchModSource", "vco2PitchModDepth", "vco2LinearFmSource", "vco2LinearFmDepth", "vco2PwmSource", "vco2PwmDepth"],
      ["vco3PitchModSource", "vco3PitchModDepth", "vco3LinearFmSource", "vco3LinearFmDepth", "vco3PwmSource", "vco3PwmDepth"],
    ].findIndex((keys) => keys.includes(key));
    if (vcoModulationIndex >= 0) applyVcoModulationRoutes(vcoProcessors[vcoModulationIndex]);

    if (key === "noiseType") { replaceNoiseSource(); setStatus(`Noise type changed · ${state.noiseType} noise`); }
    if ((key === "vcoLevel" || key === "vco1Mute") && vcoGain) safeRamp(vcoGain.gain, getMixerChannelLevel("vcoLevel", "vco1Mute"), now, 0.02);
    if ((key === "vco2Level" || key === "vco2Mute") && vco2Gain) safeRamp(vco2Gain.gain, getMixerChannelLevel("vco2Level", "vco2Mute"), now, 0.02);
    if ((key === "vco3Level" || key === "vco3Mute") && vco3Gain) safeRamp(vco3Gain.gain, getMixerChannelLevel("vco3Level", "vco3Mute"), now, 0.02);
    if ((key === "whiteNoiseLevel" || key === "noiseMute") && noiseGain) safeRamp(noiseGain.gain, getMixerChannelLevel("whiteNoiseLevel", "noiseMute"), now, 0.02);
    if (key === "cutoff" || key === "filterEnvelopeMod" || key === "filterExtCv" || key === "lfo1Mod" || key === "sampleHoldMod") applyFilterCutoffAndModulators();
    if (key === "resonance" && filter) safeRamp(filter.Q, clamp(state.resonance, "resonance"), now, 0.025);
    if ((key === "lfo1Rate" || key === "lfo1Range") && lfo1Oscillator) safeRamp(lfo1Oscillator.frequency, getEffectiveLfoRate("lfo1"), now, 0.04);
    if (key === "lfo1Shape") applyLfoShape("lfo1");
    if (key === "sampleHoldRate" || key === "sampleHoldMod" || key === "sampleHoldPitchMod" || key === "sampleHoldInput" || key === "sampleHoldMode") startSampleHoldTimer();
    if (key === "sampleHoldGlide" && isSampleHoldActive()) {
      applyFilterCutoffAndModulators();
      if (clamp(state.sampleHoldPitchMod, "sampleHoldPitchMod") > 0) applyVco1Frequency(getSampleHoldGlideTime() || 0.001);
    }
    if ((key === "lfo2Rate" || key === "lfo2Range") && lfo2Oscillator) safeRamp(lfo2Oscillator.frequency, getEffectiveLfoRate("lfo2"), now, 0.04);
    if (key === "lfo2Shape") applyLfoShape("lfo2");
    if (key === "lfo2Mod") applyLfo2Tremolo();
    if (key === "vcaInitialLevel" || key === "vcaEnvelopeMod" || key === "vcaExtCv" || key === "adsrSustain") applyVcaControlParameters();
    if (key === "envelopeMode" || key === "adsrRange") { applyVcaControlParameters(); setStatus(`Envelope changed · ${state.envelopeMode.toUpperCase()} · ${state.adsrRange}`); }
    if (key === "repeatGate") {
      if (state.repeatGate === "on") { startRepeatGateTimer(); setStatus("Repeat Gate on · triggering current envelope"); }
      else { stopRepeatGateTimer(true); setStatus("Repeat Gate off"); }
    }
    if (key === "repeatGateRate" && state.repeatGate === "on") { startRepeatGateTimer(); setStatus(`Repeat Gate rate changed · ${formatValue("repeatGateRate", state.repeatGateRate)}`); }
    if (key === "repeatGateTarget" && state.repeatGate === "on") { startRepeatGateTimer(); setStatus(`Repeat Gate target · ${state.repeatGateTarget}`); }
    if (key === "auxVcaInput" || key === "auxVcaCv" || key === "auxVcaInitialAmp" || key === "auxVcaCvAmount" || key === "auxVcaDestination") applyAuxVcaRouting();
    if (key === "analogMultiplierX" || key === "analogMultiplierY") applyAnalogMultiplierRouting();
    if (key === "filterRingLevel" && filterRingOutputGain) safeRamp(filterRingOutputGain.gain, clamp(state.filterRingLevel, "filterRingLevel") * 0.7, now, 0.02);

    const sourceMatch = key.match(/^signalMixerSource([1-4])$/);
    const levelMatch = key.match(/^signalMixerLevel([1-4])$/);
    if (sourceMatch) applySignalMixerRoute(Number(sourceMatch[1]) - 1);
    if (levelMatch) applySignalMixerRoute(Number(levelMatch[1]) - 1);
    if (key === "signalMixerLineOut") applySignalMixerLineOut();

    if (key === "delayMix" || key === "delayTime" || key === "delayFeedback") applyDelayParameters();
    if (key === "output") window.MerrinLabEffectsOutputGraph?.setParameter("output", "level", clamp(state.output, "output"));
  }

  function setStatus(message) {
    const status = document.querySelector("[data-audio-status]");
    if (status) status.textContent = message;
  }

  function formatValue(key, value) {
    if (key === "coarseFreq" || key === "vco2CoarseFreq" || key === "vco3CoarseFreq" || key === "cutoff") return `${Math.round(value)} ${units[key]}`;
    if (key === "fineCents" || key === "vco2FineCents" || key === "vco3FineCents") return `${Number(value).toFixed(0)} ${units[key]}`;
    if (key === "pulseWidth" || key === "vco2PulseWidth" || key === "vco3PulseWidth") return `${Number(value).toFixed(0)} ${units[key]}`;
    if (key === "vco1PitchModDepth" || key === "vco2PitchModDepth" || key === "vco3PitchModDepth") return `${Number(value).toFixed(1)} ${units[key]}`;
    if (key === "vco1LinearFmDepth" || key === "vco2LinearFmDepth" || key === "vco3LinearFmDepth") return `${Number(value).toFixed(0)} ${units[key]}`;
    if (key === "vco1PwmDepth" || key === "vco2PwmDepth" || key === "vco3PwmDepth") return `${Number(value).toFixed(0)} ${units[key]}`;
    if (key === "lfo1Rate" || key === "lfo2Rate" || key === "sampleHoldRate" || key === "repeatGateRate") return `${Number(value).toFixed(2)} ${units[key]}`;
    if (key === "delayTime") return `${Number(value).toFixed(2)} ${units[key]}`;
    if (key === "lfo1Mod" || key === "lfo2Mod" || key === "sampleHoldMod" || key === "sampleHoldPitchMod" || key === "sampleHoldGlide" || key === "vcaInitialLevel" || key === "vcaEnvelopeMod" || key === "filterEnvelopeMod" || key === "adsrSustain" || key === "auxVcaInitialAmp" || key === "auxVcaCvAmount" || key === "filterRingLevel" || key === "delayMix" || key === "delayFeedback") return `${Math.round(Number(value) * 100)} ${units[key]}`;
    if (key === "filterExtCv" || key === "vcaExtCv") return `${Number(value) >= 0 ? "+" : ""}${Math.round(Number(value) * 100)} ${units[key]}`;
    if (key === "attack" || key === "release" || key === "adsrAttack" || key === "adsrDecay" || key === "adsrRelease") return `${Number(value).toFixed(2)} ${units[key]}`;
    if (key === "resonance") return `${Number(value).toFixed(1)} ${units[key]}`;
    return Number(value).toFixed(2);
  }

  function syncParameterUi(key) {
    const control = document.querySelector(`[data-audio-control="${key}"]`);
    if (control) control.value = String(state[key]);
    const readout = document.querySelector(`[data-audio-readout="${key}"]`);
    if (readout) readout.textContent = control?.tagName === "SELECT" ? state[key] : formatValue(key, state[key]);
  }

  function setEngineParameter(key, value) {
    if (!(key in state)) return false;
    if (/^signalMixerSource[1-4]$/.test(key)) {
      const allowed = new Set(signalMixerSources.map(([source]) => source));
      state[key] = allowed.has(value) ? value : "off";
    } else if (key === "signalMixerLineOut") {
      state[key] = value === "mix" ? "mix" : "vca";
    } else if (key === "analogMultiplierX" || key === "analogMultiplierY") {
      const allowed = new Set(analogMultiplierSources.map(([source]) => source));
      state[key] = allowed.has(value) ? value : "off";
    } else if (limits[key]) state[key] = clamp(value, key);
    else state[key] = value;
    syncParameterUi(key);
    applyParameter(key);
    return true;
  }

  function createSlider(key, min, max, step) {
    const row = document.createElement("label");
    row.className = "audio-slider-row";
    row.innerHTML = `<span>${labels[key]}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}" data-audio-control="${key}"><output data-audio-readout="${key}">${formatValue(key, state[key])}</output>`;
    return row;
  }

  function createSelect(key, optionsList) {
    const row = document.createElement("label");
    row.className = "audio-select-row";
    const options = optionsList.map(([value, label]) => `<option value="${value}"${value === state[key] ? " selected" : ""}>${label}</option>`).join("");
    row.innerHTML = `<span>${labels[key]}</span><select data-audio-control="${key}">${options}</select><output data-audio-readout="${key}">${state[key]}</output>`;
    return row;
  }

  function createButtonRow() {
    const row = document.createElement("div");
    row.className = "audio-button-row";
    row.innerHTML = `<button type="button" data-audio-action="start">Start Audio</button><button type="button" data-audio-action="gate-on">Gate Note</button><button type="button" data-audio-action="gate-off">Release</button><button type="button" data-audio-action="panic">Panic Stop</button>`;
    return row;
  }

  function createGroup(title, ...children) {
    const group = document.createElement("section");
    group.className = "audio-control-group";
    const heading = document.createElement("h3");
    heading.className = "audio-group-title";
    heading.textContent = title;
    group.append(heading, ...children);
    return group;
  }

  function createPanel() {
    const style = document.createElement("style");
    style.textContent = `
      .audio-voice-panel { position: fixed; right: 18px; bottom: 18px; z-index: 50; width: min(380px, calc(100vw - 36px)); max-height: calc(100vh - 36px); overflow: auto; padding: 14px; border: 1px solid rgba(215,184,132,.42); border-radius: 18px; background: rgba(18,14,11,.94); box-shadow: 0 18px 50px rgba(0,0,0,.5); color: #f1e7d9; font-family: inherit; }
      .audio-voice-panel h2 { margin: 0 0 4px; font-size: .82rem; letter-spacing: .12em; text-transform: uppercase; }
      .audio-voice-panel p { margin: 0 0 12px; color: #cdbda7; font-size: .72rem; }
      .audio-control-group { margin: 10px 0 0; padding: 10px 10px 8px; border: 1px solid rgba(215,184,132,.18); border-radius: 12px; background: rgba(255,255,255,.025); }
      .audio-group-title { margin: 0 0 8px; color: #e7d1ad; font-size: .66rem; letter-spacing: .14em; text-transform: uppercase; }
      .audio-note { display:block; margin:10px 0 0; color:#bda98d; font-size:.66rem; line-height:1.45; }
      .audio-button-row { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
      .audio-button-row button { border:1px solid rgba(215,184,132,.48); border-radius:999px; padding:8px 10px; background:#2a211a; color:#f3e8da; font:inherit; font-size:.72rem; font-weight:800; cursor:pointer; }
      .audio-button-row button[data-audio-action="panic"] { border-color:rgba(255,134,99,.72); }
      .audio-slider-row,.audio-select-row { display:grid; grid-template-columns:112px 1fr 62px; align-items:center; gap:8px; margin:8px 0; font-size:.7rem; }
      .audio-slider-row input { accent-color:#d7b884; }
      .audio-select-row select { min-width:0; border:1px solid rgba(215,184,132,.36); border-radius:999px; padding:5px 8px; background:#211913; color:#f3e8da; font:inherit; font-size:.7rem; }
      .audio-slider-row output,.audio-select-row output { text-align:right; color:#d6c8b5; font-variant-numeric:tabular-nums; }
      body.is-audio-started .vco-bank .vco-module:first-child .status-light, body.is-audio-started .vco-bank .vco-module:nth-child(2) .status-light, body.is-audio-started .vco-bank .vco-module:nth-child(3) .status-light, body.is-audio-started .mixer-module .status-light, body.is-audio-started .lfo1-module .status-light, body.is-audio-started .lfo2-module .status-light, body.is-audio-started .sample-hold-module .status-light, body.is-audio-started .repeat-gate-module .status-light, body.is-audio-started .filter-lp-module .status-light, body.is-audio-started .main-vca-module .status-light, body.is-audio-started .output-module .status-light { background:#93d36c; box-shadow:0 0 10px rgba(147,211,108,.65); }
      body.is-audio-gated .main-vca-module .status-light { background:#ffd36c; box-shadow:0 0 12px rgba(255,211,108,.7); }
    `;

    const panel = document.createElement("section");
    panel.className = "audio-voice-panel";
    panel.setAttribute("aria-label", "First safe audible voice controls");
    panel.innerHTML = `<h2>First Voice v1.2</h2><p data-audio-status>Stopped · VCO 1 + VCO 2 + VCO 3 + noise + LFO/S&H + AR/ADSR + Repeat Gate · Delay default-off · safe output</p>`;
    panel.append(
      createGroup("Transport / Safety", createButtonRow()),
      createGroup("VCO 1", createSlider("coarseFreq",55,880,1), createSlider("fineCents",-100,100,1), createSelect("waveform",waveforms), createSlider("pulseWidth",10,90,1), createSelect("vco1PitchModSource",modulationSources), createSlider("vco1PitchModDepth",0,24,.1), createSelect("vco1LinearFmSource",modulationSources), createSlider("vco1LinearFmDepth",0,500,1), createSelect("vco1PwmSource",modulationSources), createSlider("vco1PwmDepth",0,40,1), createSlider("vcoLevel",0,.7,.01), createSelect("vco1Mute",muteModes)),
      createGroup("VCO 2", createSlider("vco2CoarseFreq",55,880,1), createSlider("vco2FineCents",-100,100,1), createSelect("vco2Waveform",waveforms), createSlider("vco2PulseWidth",10,90,1), createSelect("vco2PitchModSource",modulationSources), createSlider("vco2PitchModDepth",0,24,.1), createSelect("vco2LinearFmSource",modulationSources), createSlider("vco2LinearFmDepth",0,500,1), createSelect("vco2PwmSource",modulationSources), createSlider("vco2PwmDepth",0,40,1), createSlider("vco2Level",0,.45,.01), createSelect("vco2Mute",muteModes)),
      createGroup("VCO 3", createSlider("vco3CoarseFreq",55,880,1), createSlider("vco3FineCents",-100,100,1), createSelect("vco3Waveform",waveforms), createSlider("vco3PulseWidth",10,90,1), createSelect("vco3PitchModSource",modulationSources), createSlider("vco3PitchModDepth",0,24,.1), createSelect("vco3LinearFmSource",modulationSources), createSlider("vco3LinearFmDepth",0,500,1), createSelect("vco3PwmSource",modulationSources), createSlider("vco3PwmDepth",0,40,1), createSlider("vco3Level",0,.4,.01), createSelect("vco3Mute",muteModes)),
      createGroup("Noise", createSelect("noiseType",noiseTypes), createSlider("whiteNoiseLevel",0,.35,.005), createSelect("noiseMute",muteModes)),
      createGroup("Filter", createSlider("cutoff",120,6500,1), createSlider("resonance",0,12,.1), createSlider("filterEnvelopeMod",0,1,.01), createSlider("filterExtCv",-1,1,.01)),
      createGroup("Filter Modulation", createSlider("lfo1Rate",.05,12,.01), createSelect("lfo1Shape",lfoShapes), createSelect("lfo1Range",lfoRanges), createSlider("lfo1Mod",0,1,.01), createSelect("sampleHoldInput",sampleHoldInputs), createSelect("sampleHoldMode",sampleHoldModes), createSlider("sampleHoldRate",.1,20,.1), createSlider("sampleHoldMod",0,1,.01), createSlider("sampleHoldGlide",0,1,.01)),
      createGroup("VCO 1 Pitch Modulation", createSlider("sampleHoldPitchMod",0,1,.01)),
      createGroup("Amplitude / Envelope", createSlider("lfo2Rate",.05,12,.01), createSelect("lfo2Shape",lfoShapes), createSelect("lfo2Range",lfoRanges), createSlider("lfo2Mod",0,1,.01), createSlider("vcaInitialLevel",0,1,.01), createSlider("vcaEnvelopeMod",0,1,.01), createSlider("vcaExtCv",-1,1,.01), createSelect("envelopeMode",envelopeModes), createSlider("attack",.005,1.5,.005), createSlider("release",.02,2.5,.01), createSlider("adsrAttack",.005,2,.005), createSlider("adsrDecay",.005,3,.005), createSlider("adsrSustain",0,1,.01), createSlider("adsrRelease",.02,4,.01), createSelect("adsrRange",adsrRanges)),
      createGroup("AUX VCA", createSelect("auxVcaInput",auxVcaInputs), createSlider("auxVcaInitialAmp",0,1,.01), createSelect("auxVcaCv",modulationSources), createSlider("auxVcaCvAmount",0,1,.01), createSelect("auxVcaDestination",auxVcaDestinations)),
      createGroup("Repeat Gate", createSelect("repeatGate",repeatGateModes), createSlider("repeatGateRate",.1,12,.1), createSelect("repeatGateTarget",repeatGateTargets)),
      createGroup("Delay", createSlider("delayMix",0,1,.01), createSlider("delayTime",.05,.8,.01), createSlider("delayFeedback",0,.45,.01)),
      createGroup("Output", createSlider("output",0,.16,.005)),
    );
    const note = document.createElement("small");
    note.className = "audio-note";
    note.textContent = "S&H Pitch Mod is optional and default-off. Delay is also default-off: raise Delay Mix to hear echo.";
    panel.append(note);
    document.head.append(style);
    document.body.append(panel);

    panel.addEventListener("input", (event) => {
      const input = event.target.closest("[data-audio-control]");
      if (!input) return;
      const key = input.dataset.audioControl;
      if (input.tagName === "SELECT") state[key] = input.value;
      else state[key] = clamp(input.value, key);
      const readout = panel.querySelector(`[data-audio-readout="${key}"]`);
      if (readout) readout.textContent = input.tagName === "SELECT" ? state[key] : formatValue(key, state[key]);
      applyParameter(key);
    });
    panel.addEventListener("change", (event) => {
      const input = event.target.closest("[data-audio-control]");
      if (input) input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    panel.addEventListener("click", (event) => {
      const button = event.target.closest("[data-audio-action]");
      if (!button) return;
      const action = button.dataset.audioAction;
      if (action === "start") startAudio();
      if (action === "gate-on") gateOn();
      if (action === "gate-off") gateOff();
      if (action === "panic") panicStop();
    });
  }

  async function triggerOnce() {
    await gateOn();
    window.setTimeout(() => triggerGateOff("Manual trigger release"), 80);
  }

  window.MerrinLabAudio = {
    start: startAudio,
    gateOn,
    gateOff,
    trigger: triggerOnce,
    noteOn: midiNoteOn,
    noteOff: midiNoteOff,
    pitchBend: setMidiPitchBend,
    setParameter: setEngineParameter,
    setAttenuatorRoute,
    getRoutingOptions() {
      return {
        sources: modulationSources.map(([value, label]) => ({ value, label })),
        destinations: modulationDestinations.map(([value, label]) => ({ value, label })),
      };
    },
    getSignalMixerOptions() {
      return signalMixerSources.map(([value, label]) => ({ value, label }));
    },
    getAnalogMultiplierOptions() {
      return analogMultiplierSources.map(([value, label]) => ({ value, label }));
    },
    panic: panicStop,
    triggerSampleHold,
    getState() {
      return {
        midiNote: midiCurrentNote,
        pitchBend: midiPitchBend,
        heldNotes: midiHeldNotes.map(entry => entry.note),
        audioState: audioContext?.state || "stopped",
        parameters: { ...state },
        attenuators: attenuatorRoutes.map((route, index) => ({ channel: index + 1, ...route })),
        analogMultiplier: {
          x: state.analogMultiplierX,
          y: state.analogMultiplierY,
          active: state.analogMultiplierX !== "off" && state.analogMultiplierY !== "off",
        },
        filterRing: {
          level: state.filterRingLevel,
          active: state.filterRingLevel > 0,
          equation: "Filter 1 Output × Filter 2 Output",
        },
        signalMixer: {
          lineOut: state.signalMixerLineOut,
          channels: Array.from({ length: 4 }, (_entry, index) => ({
            channel: index + 1,
            source: state[signalMixerSourceKey(index)],
            level: state[signalMixerLevelKey(index)],
          })),
        },
        effectsGraph: window.MerrinLabEffectsOutputGraph?.getDebugState() || null,
      };
    }
  };

  document.addEventListener("DOMContentLoaded", createPanel);
})();
