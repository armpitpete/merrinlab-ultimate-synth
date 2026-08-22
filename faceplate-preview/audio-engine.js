(() => {
  "use strict";

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  const state = {
    coarseFreq: 220,
    fineCents: 0,
    waveform: "sawtooth",
    pulseWidth: 50,
    vcoLevel: 0.35,
    vco2CoarseFreq: 220,
    vco2FineCents: 0,
    vco2Waveform: "sawtooth",
    vco2PulseWidth: 50,
    vco2Level: 0,
    vco3CoarseFreq: 220,
    vco3FineCents: 0,
    vco3Waveform: "sawtooth",
    vco3PulseWidth: 50,
    vco3Level: 0,
    noiseType: "white",
    whiteNoiseLevel: 0,
    cutoff: 900,
    resonance: 0,
    lfo1Rate: 0.8,
    lfo1Mod: 0,
    sampleHoldRate: 2,
    sampleHoldMod: 0,
    sampleHoldPitchMod: 0,
    lfo2Rate: 1.2,
    lfo2Mod: 0,
    envelopeMode: "ar",
    repeatGate: "off",
    repeatGateRate: 2,
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
  let noiseSource = null;
  let noiseGain = null;
  let lfo1Oscillator = null;
  let lfo1Gain = null;
  let sampleHoldFilterSource = null;
  let sampleHoldTimerId = null;
  let sampleHoldValue = 0;
  let lfo2Oscillator = null;
  let lfo2Gain = null;
  let lfo2Offset = null;
  let filter = null;
  let mainVca = null;
  let tremoloGain = null;
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
    vcoLevel: [0, 0.7],
    vco2CoarseFreq: [55, 880],
    vco2FineCents: [-100, 100],
    vco2PulseWidth: [10, 90],
    vco2Level: [0, 0.45],
    vco3CoarseFreq: [55, 880],
    vco3FineCents: [-100, 100],
    vco3PulseWidth: [10, 90],
    vco3Level: [0, 0.4],
    whiteNoiseLevel: [0, 0.35],
    cutoff: [120, 6500],
    resonance: [0, 12],
    lfo1Rate: [0.05, 12],
    lfo1Mod: [0, 1],
    sampleHoldRate: [0.1, 20],
    sampleHoldMod: [0, 1],
    sampleHoldPitchMod: [0, 1],
    lfo2Rate: [0.05, 12],
    lfo2Mod: [0, 1],
    repeatGateRate: [0.1, 12],
    attack: [0.005, 1.5],
    release: [0.02, 2.5],
    adsrAttack: [0.005, 2],
    adsrDecay: [0.005, 3],
    adsrSustain: [0, 1],
    adsrRelease: [0.02, 4],
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
    vcoLevel: "VCO 1 Level",
    vco2CoarseFreq: "VCO 2 Coarse Freq",
    vco2FineCents: "VCO 2 Fine Freq",
    vco2Waveform: "VCO 2 Waveform",
    vco2PulseWidth: "VCO 2 Pulse Width %",
    vco2Level: "VCO 2 Level",
    vco3CoarseFreq: "VCO 3 Coarse Freq",
    vco3FineCents: "VCO 3 Fine Freq",
    vco3Waveform: "VCO 3 Waveform",
    vco3PulseWidth: "VCO 3 Pulse Width %",
    vco3Level: "VCO 3 Level",
    noiseType: "Noise Type",
    whiteNoiseLevel: "White NS Level",
    cutoff: "Filter Cutoff",
    resonance: "Resonance",
    lfo1Rate: "LFO 1 Rate",
    lfo1Mod: "LFO-1 Mod",
    sampleHoldRate: "S&H Rate",
    sampleHoldMod: "S&H Mod",
    sampleHoldPitchMod: "S&H Pitch Mod",
    lfo2Rate: "LFO 2 Rate",
    lfo2Mod: "LFO-2 Mod",
    envelopeMode: "Envelope Mode",
    repeatGate: "Repeat Gate",
    repeatGateRate: "Repeat Gate Rate",
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
    vcoLevel: "",
    vco2CoarseFreq: "Hz",
    vco2FineCents: "cent",
    vco2PulseWidth: "%",
    vco2Level: "",
    vco3CoarseFreq: "Hz",
    vco3FineCents: "cent",
    vco3PulseWidth: "%",
    vco3Level: "",
    whiteNoiseLevel: "",
    cutoff: "Hz",
    resonance: "Q",
    lfo1Rate: "Hz",
    lfo1Mod: "%",
    sampleHoldRate: "Hz",
    sampleHoldMod: "%",
    sampleHoldPitchMod: "%",
    lfo2Rate: "Hz",
    lfo2Mod: "%",
    repeatGateRate: "Hz",
    attack: "s",
    release: "s",
    adsrAttack: "s",
    adsrDecay: "s",
    adsrSustain: "%",
    adsrRelease: "s",
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

  const envelopeModes = [
    ["ar", "AR"],
    ["adsr", "ADSR"],
  ];

  const repeatGateModes = [
    ["off", "Off"],
    ["on", "On"],
  ];

  function clamp(value, key) {
    const [min, max] = limits[key];
    return Math.min(max, Math.max(min, Number(value)));
  }

  function safeRamp(param, value, time, rampTime = 0.02) {
    param.cancelScheduledValues(time);
    param.setTargetAtTime(value, time, rampTime);
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

  function getFilterHeadroom() {
    const baseCutoff = clamp(state.cutoff, "cutoff");
    const lowHeadroom = Math.max(0, baseCutoff - limits.cutoff[0]);
    const highHeadroom = Math.max(0, limits.cutoff[1] - baseCutoff);
    return Math.min(lowHeadroom, highHeadroom);
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

  function getRepeatGateIntervalMs() {
    const rate = clamp(state.repeatGateRate, "repeatGateRate");
    return Math.max(80, 1000 / rate);
  }

  function getRepeatGateHoldMs() {
    const intervalMs = getRepeatGateIntervalMs();
    return Math.max(30, Math.min(intervalMs * 0.45, intervalMs - 20));
  }

  function applyVco1Frequency() {
    if (!audioContext || !oscillator) return;
    safeRamp(oscillator.frequency, getVcoFrequency(), audioContext.currentTime, 0.015);
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
    safeRamp(filter.frequency, clamp(state.cutoff, "cutoff"), now, 0.025);

    if (lfo1Gain) {
      safeRamp(lfo1Gain.gain, getSafeLfoDepth(), now, 0.04);
    }

    if (sampleHoldFilterSource) {
      safeRamp(sampleHoldFilterSource.offset, sampleHoldValue * getSafeSampleHoldDepth(), now, 0.02);
    }
  }

  function applyDelayParameters() {
    window.MerrinLabEffectsOutputGraph?.setParameters("delay", {
      mix: clamp(state.delayMix, "delayMix"),
      time: clamp(state.delayTime, "delayTime"),
      feedback: clamp(state.delayFeedback, "delayFeedback"),
    });
  }

  function updateSampleHoldValue() {
    if (!audioContext) return;

    sampleHoldValue = Math.random() * 2 - 1;
    const now = audioContext.currentTime;

    if (sampleHoldFilterSource) {
      safeRamp(sampleHoldFilterSource.offset, sampleHoldValue * getSafeSampleHoldDepth(), now, 0.01);
    }

    applyVco1Frequency();
  }

  function stopSampleHoldTimer() {
    if (sampleHoldTimerId !== null) {
      window.clearInterval(sampleHoldTimerId);
      sampleHoldTimerId = null;
    }
  }

  function startSampleHoldTimer() {
    stopSampleHoldTimer();

    const rate = clamp(state.sampleHoldRate, "sampleHoldRate");
    const intervalMs = Math.max(40, 1000 / rate);
    updateSampleHoldValue();
    sampleHoldTimerId = window.setInterval(updateSampleHoldValue, intervalMs);
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

    if (releaseGate && isRepeatGateHoldingGate) {
      triggerGateOff("Repeat Gate off · gate released");
    }

    isRepeatGateHoldingGate = false;
  }

  function triggerRepeatGateCycle() {
    if (!audioContext || !mainVca || state.repeatGate !== "on") return;

    if (repeatGateReleaseTimerId !== null) {
      window.clearTimeout(repeatGateReleaseTimerId);
      repeatGateReleaseTimerId = null;
    }

    triggerGateOn("Repeat Gate trigger · envelope active");
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

  function createPulseWave(dutyPercent, pulseWidthKey = "pulseWidth") {
    const duty = clamp(dutyPercent, pulseWidthKey) / 100;
    const harmonics = 64;
    const real = new Float32Array(harmonics + 1);
    const imag = new Float32Array(harmonics + 1);

    real[0] = 0;
    imag[0] = 0;

    for (let n = 1; n <= harmonics; n += 1) {
      real[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty);
      imag[n] = 0;
    }

    return audioContext.createPeriodicWave(real, imag, {
      disableNormalization: false,
    });
  }

  function fillWhiteNoise(channel) {
    for (let i = 0; i < channel.length; i += 1) {
      channel[i] = (Math.random() * 2 - 1) * 0.7;
    }
  }

  function fillPinkNoise(channel) {
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;

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

    if (state.noiseType === "pink") {
      fillPinkNoise(channel);
    } else if (state.noiseType === "brown") {
      fillBrownNoise(channel);
    } else {
      fillWhiteNoise(channel);
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  function replaceNoiseSource() {
    if (!audioContext || !noiseGain) return;

    try {
      if (noiseSource) noiseSource.stop();
    } catch (_error) {
      // The previous source may already be stopped.
    }

    try {
      if (noiseSource) noiseSource.disconnect();
    } catch (_error) {
      // Disconnect is best-effort.
    }

    noiseSource = createNoiseSource();
    noiseSource.connect(noiseGain);
    noiseSource.start();
  }

  function applyOscillatorWaveform(targetOscillator, waveform, pulseWidth, pulseWidthKey) {
    if (!audioContext || !targetOscillator) return;

    if (waveform === "pulse") {
      targetOscillator.setPeriodicWave(createPulseWave(pulseWidth, pulseWidthKey));
      return;
    }

    targetOscillator.type = waveform;
  }

  function applyWaveform() {
    applyOscillatorWaveform(oscillator, state.waveform, state.pulseWidth, "pulseWidth");
  }

  function applyVco2Waveform() {
    applyOscillatorWaveform(oscillator2, state.vco2Waveform, state.vco2PulseWidth, "vco2PulseWidth");
  }

  function applyVco3Waveform() {
    applyOscillatorWaveform(oscillator3, state.vco3Waveform, state.vco3PulseWidth, "vco3PulseWidth");
  }

  function createAudioGraph() {
    if (!AudioContextClass) {
      setStatus("Web Audio unavailable in this browser");
      return false;
    }

    if (audioContext && audioContext.state !== "closed") {
      return true;
    }

    audioContext = new AudioContextClass();

    oscillator = audioContext.createOscillator();
    oscillator.frequency.value = getVcoFrequency();
    applyWaveform();

    vcoGain = audioContext.createGain();
    vcoGain.gain.value = state.vcoLevel;

    oscillator2 = audioContext.createOscillator();
    oscillator2.frequency.value = getVco2Frequency();
    applyVco2Waveform();

    vco2Gain = audioContext.createGain();
    vco2Gain.gain.value = state.vco2Level;

    oscillator3 = audioContext.createOscillator();
    oscillator3.frequency.value = getVco3Frequency();
    applyVco3Waveform();

    vco3Gain = audioContext.createGain();
    vco3Gain.gain.value = state.vco3Level;

    noiseSource = createNoiseSource();
    noiseGain = audioContext.createGain();
    noiseGain.gain.value = state.whiteNoiseLevel;

    filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = state.cutoff;
    filter.Q.value = state.resonance;

    lfo1Oscillator = audioContext.createOscillator();
    lfo1Oscillator.type = "sine";
    lfo1Oscillator.frequency.value = state.lfo1Rate;

    lfo1Gain = audioContext.createGain();
    lfo1Gain.gain.value = getSafeLfoDepth();

    sampleHoldFilterSource = audioContext.createConstantSource();
    sampleHoldFilterSource.offset.value = 0;

    mainVca = audioContext.createGain();
    mainVca.gain.value = 0;

    tremoloGain = audioContext.createGain();
    tremoloGain.gain.value = 0;

    lfo2Oscillator = audioContext.createOscillator();
    lfo2Oscillator.type = "sine";
    lfo2Oscillator.frequency.value = state.lfo2Rate;

    lfo2Gain = audioContext.createGain();
    lfo2Gain.gain.value = getSafeTremoloDepth() / 2;

    lfo2Offset = audioContext.createConstantSource();
    lfo2Offset.offset.value = 1 - getSafeTremoloDepth() / 2;

    effectsOutputGraph = window.MerrinLabEffectsOutputGraph?.create(audioContext) || null;
    if (!effectsOutputGraph) {
      setStatus("Effects/output graph unavailable");
      return false;
    }

    oscillator.connect(vcoGain);
    vcoGain.connect(filter);

    oscillator2.connect(vco2Gain);
    vco2Gain.connect(filter);

    oscillator3.connect(vco3Gain);
    vco3Gain.connect(filter);

    noiseSource.connect(noiseGain);
    noiseGain.connect(filter);

    lfo1Oscillator.connect(lfo1Gain);
    lfo1Gain.connect(filter.frequency);
    sampleHoldFilterSource.connect(filter.frequency);

    lfo2Oscillator.connect(lfo2Gain);
    lfo2Gain.connect(tremoloGain.gain);
    lfo2Offset.connect(tremoloGain.gain);

    filter.connect(mainVca);
    mainVca.connect(tremoloGain);
    tremoloGain.connect(effectsOutputGraph.input);

    oscillator.start();
    oscillator2.start();
    oscillator3.start();
    noiseSource.start();
    lfo1Oscillator.start();
    sampleHoldFilterSource.start();
    startSampleHoldTimer();
    lfo2Oscillator.start();
    lfo2Offset.start();
    return true;
  }

  async function startAudio() {
    if (!createAudioGraph()) return;

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    document.body.classList.add("is-audio-started");
    setStatus(`Audio ready · VCO 1 + VCO 2 + VCO 3 + ${state.noiseType} noise · safe output`);
    applyAllParameters();
  }

  function triggerGateOn(statusMessage) {
    if (!audioContext || !mainVca) return;

    const now = audioContext.currentTime;
    const target = 0.55 * Math.max(0.08, Math.min(1, midiGateVelocity));

    document.body.classList.add("is-audio-gated");
    mainVca.gain.cancelScheduledValues(now);
    mainVca.gain.setValueAtTime(Math.max(0.0001, mainVca.gain.value), now);

    if (state.envelopeMode === "adsr") {
      const attack = clamp(state.adsrAttack, "adsrAttack");
      const decay = clamp(state.adsrDecay, "adsrDecay");
      const sustain = clamp(state.adsrSustain, "adsrSustain") * target;
      mainVca.gain.linearRampToValueAtTime(target, now + attack);
      mainVca.gain.linearRampToValueAtTime(sustain, now + attack + decay);
      setStatus(statusMessage || "Gate open · ADSR envelope active");
      return;
    }

    const attack = clamp(state.attack, "attack");
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
    const release = state.envelopeMode === "adsr"
      ? clamp(state.adsrRelease, "adsrRelease")
      : clamp(state.release, "release");

    document.body.classList.remove("is-audio-gated");
    mainVca.gain.cancelScheduledValues(now);
    mainVca.gain.setValueAtTime(Math.max(0.0001, mainVca.gain.value), now);
    mainVca.gain.linearRampToValueAtTime(0.0001, now + release);
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
    stopRepeatGateTimer(false);
    sampleHoldValue = 0;

    if (mainVca && audioContext) {
      mainVca.gain.cancelScheduledValues(audioContext.currentTime);
      mainVca.gain.setValueAtTime(0, audioContext.currentTime);
    }

    if (noiseGain && audioContext) {
      noiseGain.gain.cancelScheduledValues(audioContext.currentTime);
      noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
    }

    if (lfo1Gain && audioContext) {
      lfo1Gain.gain.cancelScheduledValues(audioContext.currentTime);
      lfo1Gain.gain.setValueAtTime(0, audioContext.currentTime);
    }

    if (sampleHoldFilterSource && audioContext) {
      sampleHoldFilterSource.offset.cancelScheduledValues(audioContext.currentTime);
      sampleHoldFilterSource.offset.setValueAtTime(0, audioContext.currentTime);
    }

    if (lfo2Gain && audioContext) {
      lfo2Gain.gain.cancelScheduledValues(audioContext.currentTime);
      lfo2Gain.gain.setValueAtTime(0, audioContext.currentTime);
    }

    if (lfo2Offset && audioContext) {
      lfo2Offset.offset.cancelScheduledValues(audioContext.currentTime);
      lfo2Offset.offset.setValueAtTime(0, audioContext.currentTime);
    }

    if (tremoloGain && audioContext) {
      tremoloGain.gain.cancelScheduledValues(audioContext.currentTime);
      tremoloGain.gain.setValueAtTime(0, audioContext.currentTime);
    }

    window.MerrinLabEffectsOutputGraph?.mute();

    [oscillator, oscillator2, oscillator3, noiseSource, lfo1Oscillator, sampleHoldFilterSource, lfo2Oscillator, lfo2Offset].forEach((source) => {
      try {
        if (source) source.stop();
      } catch (_error) {
        // Source may already be stopped. Panic still succeeds.
      }
    });

    try {
      if (audioContext && audioContext.state !== "closed") {
        await audioContext.close();
      }
    } catch (_error) {
      // Closing is best-effort; graph references are still cleared below.
    }

    window.MerrinLabEffectsOutputGraph?.dispose();
    audioContext = null;
    oscillator = null;
    vcoGain = null;
    oscillator2 = null;
    vco2Gain = null;
    oscillator3 = null;
    vco3Gain = null;
    noiseSource = null;
    noiseGain = null;
    lfo1Oscillator = null;
    lfo1Gain = null;
    sampleHoldFilterSource = null;
    lfo2Oscillator = null;
    lfo2Gain = null;
    lfo2Offset = null;
    filter = null;
    mainVca = null;
    tremoloGain = null;
    effectsOutputGraph = null;

    setStatus("Panic stopped · silent");
  }

  function applyAllParameters() {
    if (!audioContext) return;
    [
      "coarseFreq",
      "fineCents",
      "waveform",
      "pulseWidth",
      "vcoLevel",
      "vco2CoarseFreq",
      "vco2FineCents",
      "vco2Waveform",
      "vco2PulseWidth",
      "vco2Level",
      "vco3CoarseFreq",
      "vco3FineCents",
      "vco3Waveform",
      "vco3PulseWidth",
      "vco3Level",
      "noiseType",
      "whiteNoiseLevel",
      "cutoff",
      "resonance",
      "lfo1Rate",
      "lfo1Mod",
      "sampleHoldRate",
      "sampleHoldMod",
      "sampleHoldPitchMod",
      "lfo2Rate",
      "lfo2Mod",
      "envelopeMode",
      "repeatGate",
      "repeatGateRate",
      "delayMix",
      "delayTime",
      "delayFeedback",
      "output",
    ].forEach(applyParameter);
  }

  function applyParameter(key) {
    if (!audioContext) return;
    const now = audioContext.currentTime;

    if (key === "coarseFreq" || key === "fineCents" || key === "sampleHoldPitchMod") {
      applyVco1Frequency();
    }

    if ((key === "vco2CoarseFreq" || key === "vco2FineCents") && oscillator2) {
      safeRamp(oscillator2.frequency, getVco2Frequency(), now, 0.015);
    }

    if ((key === "vco3CoarseFreq" || key === "vco3FineCents") && oscillator3) {
      safeRamp(oscillator3.frequency, getVco3Frequency(), now, 0.015);
    }

    if (key === "waveform" || key === "pulseWidth") applyWaveform();
    if (key === "vco2Waveform" || key === "vco2PulseWidth") applyVco2Waveform();
    if (key === "vco3Waveform" || key === "vco3PulseWidth") applyVco3Waveform();

    if (key === "noiseType") {
      replaceNoiseSource();
      setStatus(`Noise type changed · ${state.noiseType} noise`);
    }

    if (key === "vcoLevel" && vcoGain) {
      safeRamp(vcoGain.gain, clamp(state.vcoLevel, "vcoLevel"), now, 0.02);
    }

    if (key === "vco2Level" && vco2Gain) {
      safeRamp(vco2Gain.gain, clamp(state.vco2Level, "vco2Level"), now, 0.02);
    }

    if (key === "vco3Level" && vco3Gain) {
      safeRamp(vco3Gain.gain, clamp(state.vco3Level, "vco3Level"), now, 0.02);
    }

    if (key === "whiteNoiseLevel" && noiseGain) {
      safeRamp(noiseGain.gain, clamp(state.whiteNoiseLevel, "whiteNoiseLevel"), now, 0.02);
    }

    if (key === "cutoff" || key === "lfo1Mod" || key === "sampleHoldMod") {
      applyFilterCutoffAndModulators();
    }

    if (key === "resonance" && filter) {
      safeRamp(filter.Q, clamp(state.resonance, "resonance"), now, 0.025);
    }

    if (key === "lfo1Rate" && lfo1Oscillator) {
      safeRamp(lfo1Oscillator.frequency, clamp(state.lfo1Rate, "lfo1Rate"), now, 0.04);
    }

    if (key === "sampleHoldRate") {
      startSampleHoldTimer();
    }

    if (key === "lfo2Rate" && lfo2Oscillator) {
      safeRamp(lfo2Oscillator.frequency, clamp(state.lfo2Rate, "lfo2Rate"), now, 0.04);
    }

    if (key === "lfo2Mod") {
      applyLfo2Tremolo();
    }

    if (key === "envelopeMode") {
      setStatus(`Envelope mode changed · ${state.envelopeMode.toUpperCase()}`);
    }

    if (key === "repeatGate") {
      if (state.repeatGate === "on") {
        startRepeatGateTimer();
        setStatus("Repeat Gate on · triggering current envelope");
      } else {
        stopRepeatGateTimer(true);
        setStatus("Repeat Gate off");
      }
    }

    if (key === "repeatGateRate" && state.repeatGate === "on") {
      startRepeatGateTimer();
      setStatus(`Repeat Gate rate changed · ${formatValue("repeatGateRate", state.repeatGateRate)}`);
    }

    if (key === "delayMix" || key === "delayTime" || key === "delayFeedback") {
      applyDelayParameters();
    }

    if (key === "output") {
      window.MerrinLabEffectsOutputGraph?.setParameter("output", "level", clamp(state.output, "output"));
    }
  }

  function setStatus(message) {
    const status = document.querySelector("[data-audio-status]");
    if (status) status.textContent = message;
  }

  function formatValue(key, value) {
    if (key === "coarseFreq" || key === "vco2CoarseFreq" || key === "vco3CoarseFreq" || key === "cutoff") return `${Math.round(value)} ${units[key]}`;
    if (key === "fineCents" || key === "vco2FineCents" || key === "vco3FineCents") return `${Number(value).toFixed(0)} ${units[key]}`;
    if (key === "pulseWidth" || key === "vco2PulseWidth" || key === "vco3PulseWidth") return `${Number(value).toFixed(0)} ${units[key]}`;
    if (key === "lfo1Rate" || key === "lfo2Rate" || key === "sampleHoldRate" || key === "repeatGateRate") return `${Number(value).toFixed(2)} ${units[key]}`;
    if (key === "delayTime") return `${Number(value).toFixed(2)} ${units[key]}`;
    if (key === "lfo1Mod" || key === "lfo2Mod" || key === "sampleHoldMod" || key === "sampleHoldPitchMod" || key === "adsrSustain" || key === "delayMix" || key === "delayFeedback") return `${Math.round(Number(value) * 100)} ${units[key]}`;
    if (key === "attack" || key === "release" || key === "adsrAttack" || key === "adsrDecay" || key === "adsrRelease") return `${Number(value).toFixed(2)} ${units[key]}`;
    if (key === "resonance") return `${Number(value).toFixed(1)} ${units[key]}`;
    return Number(value).toFixed(2);
  }

  function syncParameterUi(key) {
    const control = document.querySelector(`[data-audio-control="${key}"]`);
    if (control) control.value = String(state[key]);

    const readout = document.querySelector(`[data-audio-readout="${key}"]`);
    if (readout) {
      readout.textContent = control?.tagName === "SELECT" ? state[key] : formatValue(key, state[key]);
    }
  }

  function setEngineParameter(key, value) {
    if (!(key in state)) return false;

    if (limits[key]) {
      state[key] = clamp(value, key);
    } else {
      state[key] = value;
    }

    syncParameterUi(key);
    applyParameter(key);
    return true;
  }

  function createSlider(key, min, max, step) {
    const row = document.createElement("label");
    row.className = "audio-slider-row";
    row.innerHTML = `
      <span>${labels[key]}</span>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}" data-audio-control="${key}">
      <output data-audio-readout="${key}">${formatValue(key, state[key])}</output>
    `;
    return row;
  }

  function createSelect(key, optionsList) {
    const row = document.createElement("label");
    row.className = "audio-select-row";
    const options = optionsList.map(([value, label]) => {
      const selected = value === state[key] ? " selected" : "";
      return `<option value="${value}"${selected}>${label}</option>`;
    }).join("");

    row.innerHTML = `
      <span>${labels[key]}</span>
      <select data-audio-control="${key}">${options}</select>
      <output data-audio-readout="${key}">${state[key]}</output>
    `;
    return row;
  }

  function createButtonRow() {
    const row = document.createElement("div");
    row.className = "audio-button-row";
    row.innerHTML = `
      <button type="button" data-audio-action="start">Start Audio</button>
      <button type="button" data-audio-action="gate-on">Gate Note</button>
      <button type="button" data-audio-action="gate-off">Release</button>
      <button type="button" data-audio-action="panic">Panic Stop</button>
    `;
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
      .audio-voice-panel {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 50;
        width: min(380px, calc(100vw - 36px));
        max-height: calc(100vh - 36px);
        overflow: auto;
        padding: 14px;
        border: 1px solid rgba(215, 184, 132, 0.42);
        border-radius: 18px;
        background: rgba(18, 14, 11, 0.94);
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
        color: #f1e7d9;
        font-family: inherit;
      }

      .audio-voice-panel h2 {
        margin: 0 0 4px;
        font-size: 0.82rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .audio-voice-panel p {
        margin: 0 0 12px;
        color: #cdbda7;
        font-size: 0.72rem;
      }

      .audio-control-group {
        margin: 10px 0 0;
        padding: 10px 10px 8px;
        border: 1px solid rgba(215, 184, 132, 0.18);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.025);
      }

      .audio-group-title {
        margin: 0 0 8px;
        color: #e7d1ad;
        font-size: 0.66rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .audio-note {
        display: block;
        margin: 10px 0 0;
        color: #bda98d;
        font-size: 0.66rem;
        line-height: 1.45;
      }

      .audio-button-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .audio-button-row button {
        border: 1px solid rgba(215, 184, 132, 0.48);
        border-radius: 999px;
        padding: 8px 10px;
        background: #2a211a;
        color: #f3e8da;
        font: inherit;
        font-size: 0.72rem;
        font-weight: 800;
        cursor: pointer;
      }

      .audio-button-row button[data-audio-action="panic"] {
        border-color: rgba(255, 134, 99, 0.72);
      }

      .audio-slider-row,
      .audio-select-row {
        display: grid;
        grid-template-columns: 112px 1fr 62px;
        align-items: center;
        gap: 8px;
        margin: 8px 0;
        font-size: 0.7rem;
      }

      .audio-slider-row input {
        accent-color: #d7b884;
      }

      .audio-select-row select {
        min-width: 0;
        border: 1px solid rgba(215, 184, 132, 0.36);
        border-radius: 999px;
        padding: 5px 8px;
        background: #211913;
        color: #f3e8da;
        font: inherit;
        font-size: 0.7rem;
      }

      .audio-slider-row output,
      .audio-select-row output {
        text-align: right;
        color: #d6c8b5;
        font-variant-numeric: tabular-nums;
      }

      body.is-audio-started .vco-bank .vco-module:first-child .status-light,
      body.is-audio-started .vco-bank .vco-module:nth-child(2) .status-light,
      body.is-audio-started .vco-bank .vco-module:nth-child(3) .status-light,
      body.is-audio-started .mixer-module .status-light,
      body.is-audio-started .lfo1-module .status-light,
      body.is-audio-started .lfo2-module .status-light,
      body.is-audio-started .sample-hold-module .status-light,
      body.is-audio-started .repeat-gate-module .status-light,
      body.is-audio-started .filter-lp-module .status-light,
      body.is-audio-started .main-vca-module .status-light,
      body.is-audio-started .output-module .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }

      body.is-audio-gated .main-vca-module .status-light {
        background: #ffd36c;
        box-shadow: 0 0 12px rgba(255, 211, 108, 0.7);
      }
    `;

    const panel = document.createElement("section");
    panel.className = "audio-voice-panel";
    panel.setAttribute("aria-label", "First safe audible voice controls");
    panel.innerHTML = `
      <h2>First Voice v1.2</h2>
      <p data-audio-status>Stopped · VCO 1 + VCO 2 + VCO 3 + noise + LFO/S&H + AR/ADSR + Repeat Gate · Delay default-off · safe output</p>
    `;

    panel.append(
      createGroup(
        "Transport / Safety",
        createButtonRow(),
      ),
      createGroup(
        "VCO 1",
        createSlider("coarseFreq", 55, 880, 1),
        createSlider("fineCents", -100, 100, 1),
        createSelect("waveform", waveforms),
        createSlider("pulseWidth", 10, 90, 1),
        createSlider("vcoLevel", 0, 0.7, 0.01),
      ),
      createGroup(
        "VCO 2",
        createSlider("vco2CoarseFreq", 55, 880, 1),
        createSlider("vco2FineCents", -100, 100, 1),
        createSelect("vco2Waveform", waveforms),
        createSlider("vco2PulseWidth", 10, 90, 1),
        createSlider("vco2Level", 0, 0.45, 0.01),
      ),
      createGroup(
        "VCO 3",
        createSlider("vco3CoarseFreq", 55, 880, 1),
        createSlider("vco3FineCents", -100, 100, 1),
        createSelect("vco3Waveform", waveforms),
        createSlider("vco3PulseWidth", 10, 90, 1),
        createSlider("vco3Level", 0, 0.4, 0.01),
      ),
      createGroup(
        "Noise",
        createSelect("noiseType", noiseTypes),
        createSlider("whiteNoiseLevel", 0, 0.35, 0.005),
      ),
      createGroup(
        "Filter",
        createSlider("cutoff", 120, 6500, 1),
        createSlider("resonance", 0, 12, 0.1),
      ),
      createGroup(
        "Filter Modulation",
        createSlider("lfo1Rate", 0.05, 12, 0.01),
        createSlider("lfo1Mod", 0, 1, 0.01),
        createSlider("sampleHoldRate", 0.1, 20, 0.1),
        createSlider("sampleHoldMod", 0, 1, 0.01),
      ),
      createGroup(
        "VCO 1 Pitch Modulation",
        createSlider("sampleHoldPitchMod", 0, 1, 0.01),
      ),
      createGroup(
        "Amplitude / Envelope",
        createSlider("lfo2Rate", 0.05, 12, 0.01),
        createSlider("lfo2Mod", 0, 1, 0.01),
        createSelect("envelopeMode", envelopeModes),
        createSlider("attack", 0.005, 1.5, 0.005),
        createSlider("release", 0.02, 2.5, 0.01),
        createSlider("adsrAttack", 0.005, 2, 0.005),
        createSlider("adsrDecay", 0.005, 3, 0.005),
        createSlider("adsrSustain", 0, 1, 0.01),
        createSlider("adsrRelease", 0.02, 4, 0.01),
      ),
      createGroup(
        "Repeat Gate",
        createSelect("repeatGate", repeatGateModes),
        createSlider("repeatGateRate", 0.1, 12, 0.1),
      ),
      createGroup(
        "Delay",
        createSlider("delayMix", 0, 1, 0.01),
        createSlider("delayTime", 0.05, 0.8, 0.01),
        createSlider("delayFeedback", 0, 0.45, 0.01),
      ),
      createGroup(
        "Output",
        createSlider("output", 0, 0.16, 0.005),
      ),
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

      if (input.tagName === "SELECT") {
        state[key] = input.value;
      } else {
        state[key] = clamp(input.value, key);
      }

      const readout = panel.querySelector(`[data-audio-readout="${key}"]`);
      if (readout) readout.textContent = input.tagName === "SELECT" ? state[key] : formatValue(key, state[key]);

      applyParameter(key);
    });

    panel.addEventListener("change", (event) => {
      const input = event.target.closest("[data-audio-control]");
      if (!input) return;
      input.dispatchEvent(new Event("input", { bubbles: true }));
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

  window.MerrinLabAudio = {
    start: startAudio,
    noteOn: midiNoteOn,
    noteOff: midiNoteOff,
    pitchBend: setMidiPitchBend,
    setParameter: setEngineParameter,
    panic: panicStop,
    getState() {
      return {
        midiNote: midiCurrentNote,
        pitchBend: midiPitchBend,
        heldNotes: midiHeldNotes.map(entry => entry.note),
        audioState: audioContext?.state || "stopped",
        effectsGraph: window.MerrinLabEffectsOutputGraph?.getDebugState() || null,
      };
    }
  };

  document.addEventListener("DOMContentLoaded", createPanel);
})();
