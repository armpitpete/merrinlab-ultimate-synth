(() => {
  "use strict";

  const state = {
    drive: { mix: 0, drive: 0.35, tone: 0.55 },
    chorus: { mix: 0, rate: 0.8, depth: 0.35 },
    delay: { mix: 0, time: 0.25, feedback: 0.2 },
    reverb: { mix: 0, size: 0.45 },
    svf: { mode: "bandpass", cutoff: 900, resonance: 0.7, bpWidth: 0.55, level: 0 },
    output: { level: 0.08 },
  };

  let activeGraph = null;

  function clamp(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function safeParam(param, value, context, speed = 0.04) {
    if (!param || !context) return;
    const now = context.currentTime;
    param.cancelScheduledValues(now);
    param.setTargetAtTime(value, now, speed);
  }

  function makeSoftDriveCurve(amount) {
    const samples = 2048;
    const curve = new Float32Array(samples);
    const drive = 1 + clamp(amount, 0, 1, 0.35) * 16;

    for (let index = 0; index < samples; index += 1) {
      const input = (index / (samples - 1)) * 2 - 1;
      curve[index] = Math.tanh(input * drive) / Math.tanh(drive);
    }

    return curve;
  }

  function createDrive(context) {
    const input = context.createGain();
    const dryGain = context.createGain();
    const inputGain = context.createGain();
    const shaper = context.createWaveShaper();
    const toneFilter = context.createBiquadFilter();
    const wetGain = context.createGain();
    const output = context.createGain();

    toneFilter.type = "lowpass";
    shaper.oversample = "2x";
    input.connect(dryGain);
    dryGain.connect(output);
    input.connect(inputGain);
    inputGain.connect(shaper);
    shaper.connect(toneFilter);
    toneFilter.connect(wetGain);
    wetGain.connect(output);

    return { input, dryGain, inputGain, shaper, toneFilter, wetGain, output };
  }

  function createChorus(context) {
    const input = context.createGain();
    const dryGain = context.createGain();
    const leftDelay = context.createDelay(0.06);
    const rightDelay = context.createDelay(0.06);
    const lfo = context.createOscillator();
    const leftDepth = context.createGain();
    const rightDepth = context.createGain();
    const merger = context.createChannelMerger(2);
    const wetGain = context.createGain();
    const output = context.createGain();

    lfo.type = "sine";
    input.connect(dryGain);
    dryGain.connect(output);
    input.connect(leftDelay);
    input.connect(rightDelay);
    lfo.connect(leftDepth);
    lfo.connect(rightDepth);
    leftDepth.connect(leftDelay.delayTime);
    rightDepth.connect(rightDelay.delayTime);
    leftDelay.connect(merger, 0, 0);
    rightDelay.connect(merger, 0, 1);
    merger.connect(wetGain);
    wetGain.connect(output);
    lfo.start();

    return { input, dryGain, leftDelay, rightDelay, lfo, leftDepth, rightDepth, wetGain, output };
  }

  function createDelay(context) {
    const input = context.createGain();
    const dryGain = context.createGain();
    const delayNode = context.createDelay(3.2);
    const feedbackTone = context.createBiquadFilter();
    const feedbackGain = context.createGain();
    const wetGain = context.createGain();
    const output = context.createGain();

    feedbackTone.type = "lowpass";
    input.connect(dryGain);
    dryGain.connect(output);
    input.connect(delayNode);
    delayNode.connect(feedbackTone);
    feedbackTone.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(wetGain);
    wetGain.connect(output);

    return { input, dryGain, delayNode, feedbackTone, feedbackGain, wetGain, output };
  }

  function createImpulse(context, size) {
    const seconds = 0.8 + clamp(size, 0.1, 1, 0.45) * 3.8;
    const length = Math.max(1, Math.floor(context.sampleRate * seconds));
    const impulse = context.createBuffer(2, length, context.sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const data = impulse.getChannelData(channel);
      for (let index = 0; index < length; index += 1) {
        const position = index / length;
        const envelope = Math.pow(1 - position, 1.25);
        data[index] = (Math.random() * 2 - 1) * envelope * (channel === 0 ? 0.52 : 0.56);
      }
    }

    return impulse;
  }

  function createReverb(context) {
    const input = context.createGain();
    const dryGain = context.createGain();
    const preDelay = context.createDelay(0.12);
    const convolver = context.createConvolver();
    const tone = context.createBiquadFilter();
    const wetGain = context.createGain();
    const output = context.createGain();

    tone.type = "lowpass";
    input.connect(dryGain);
    dryGain.connect(output);
    input.connect(preDelay);
    preDelay.connect(convolver);
    convolver.connect(tone);
    tone.connect(wetGain);
    wetGain.connect(output);

    return { input, dryGain, preDelay, convolver, tone, wetGain, output, impulseSize: null };
  }

  function createSvf(context) {
    const input = context.createGain();
    const dryGain = context.createGain();
    const modeFilter = context.createBiquadFilter();
    const modeFilterGain = context.createGain();
    const bpHighpass = context.createBiquadFilter();
    const bpLowpass = context.createBiquadFilter();
    const bpPeak = context.createBiquadFilter();
    const bpGain = context.createGain();
    const wetGain = context.createGain();
    const analyser = context.createAnalyser();
    const output = context.createGain();

    bpHighpass.type = "highpass";
    bpLowpass.type = "lowpass";
    bpPeak.type = "peaking";
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.78;
    analyser.minDecibels = -95;
    analyser.maxDecibels = -12;

    input.connect(dryGain);
    dryGain.connect(output);
    input.connect(modeFilter);
    modeFilter.connect(modeFilterGain);
    modeFilterGain.connect(wetGain);
    input.connect(bpHighpass);
    bpHighpass.connect(bpLowpass);
    bpLowpass.connect(bpPeak);
    bpPeak.connect(bpGain);
    bpGain.connect(wetGain);
    wetGain.connect(analyser);
    analyser.connect(output);

    return { input, dryGain, modeFilter, modeFilterGain, bpHighpass, bpLowpass, bpPeak, bpGain, wetGain, analyser, output };
  }

  function applyDrive(graph) {
    const values = state.drive;
    const mix = clamp(values.mix, 0, 1, 0);
    const drive = clamp(values.drive, 0, 1, 0.35);
    const tone = clamp(values.tone, 0, 1, 0.55);
    graph.drive.shaper.curve = makeSoftDriveCurve(drive);
    safeParam(graph.drive.dryGain.gain, 1 - mix, graph.context);
    safeParam(graph.drive.inputGain.gain, 0.55 + drive * 0.95, graph.context);
    safeParam(graph.drive.toneFilter.frequency, 900 + tone * 5200, graph.context, 0.08);
    safeParam(graph.drive.wetGain.gain, mix * 0.48, graph.context);
  }

  function applyChorus(graph) {
    const values = state.chorus;
    const mix = clamp(values.mix, 0, 1, 0);
    const depth = clamp(values.depth, 0, 1, 0.35) * 0.014;
    safeParam(graph.chorus.dryGain.gain, 1 - mix, graph.context);
    safeParam(graph.chorus.lfo.frequency, clamp(values.rate, 0.1, 5, 0.8), graph.context, 0.08);
    safeParam(graph.chorus.leftDepth.gain, depth, graph.context, 0.08);
    safeParam(graph.chorus.rightDepth.gain, -depth, graph.context, 0.08);
    safeParam(graph.chorus.leftDelay.delayTime, 0.018, graph.context, 0.1);
    safeParam(graph.chorus.rightDelay.delayTime, 0.022, graph.context, 0.1);
    safeParam(graph.chorus.wetGain.gain, mix * 0.45, graph.context);
  }

  function applyDelay(graph) {
    const values = state.delay;
    const mix = clamp(values.mix, 0, 1, 0);
    const feedback = clamp(values.feedback, 0, 0.85, 0.2);
    safeParam(graph.delay.dryGain.gain, 1, graph.context);
    safeParam(graph.delay.delayNode.delayTime, clamp(values.time, 0.05, 3, 0.25), graph.context, 0.05);
    safeParam(graph.delay.feedbackGain.gain, feedback, graph.context, 0.05);
    safeParam(graph.delay.feedbackTone.frequency, 5200 - feedback * 2200, graph.context, 0.12);
    safeParam(graph.delay.wetGain.gain, mix * 0.7, graph.context);
  }

  function applyReverb(graph) {
    const values = state.reverb;
    const mix = clamp(values.mix, 0, 1, 0);
    const size = clamp(values.size, 0.1, 1, 0.45);
    safeParam(graph.reverb.dryGain.gain, 1, graph.context);
    safeParam(graph.reverb.preDelay.delayTime, 0.018 + size * 0.04, graph.context, 0.06);
    safeParam(graph.reverb.tone.frequency, 5200 - size * 2200, graph.context, 0.12);
    safeParam(graph.reverb.wetGain.gain, mix * 0.38, graph.context);

    if (graph.reverb.impulseSize === null || Math.abs(graph.reverb.impulseSize - size) >= 0.05) {
      graph.reverb.convolver.buffer = createImpulse(graph.context, size);
      graph.reverb.impulseSize = size;
    }
  }

  function svfCutoffMax(mode) {
    return mode === "bandpass" ? 16000 : 8500;
  }

  function applySvf(graph) {
    const values = state.svf;
    const mode = ["highpass", "bandpass", "lowpass"].includes(values.mode) ? values.mode : "bandpass";
    const cutoff = clamp(values.cutoff, 90, svfCutoffMax(mode), 900);
    const resonance = clamp(values.resonance, 0.1, 24, 0.7);
    const amount = clamp((resonance - 0.1) / 23.9, 0, 1, 0);
    const width = clamp(values.bpWidth, 0, 1, 0.55);
    const level = clamp(values.level, 0, 1, 0);
    const position = clamp((Math.log(cutoff) - Math.log(90)) / (Math.log(svfCutoffMax(mode)) - Math.log(90)), 0, 1, 0);
    const octaveWidth = 0.05 + Math.pow(width, 1.15) * 3.1;
    const ratio = Math.pow(2, octaveWidth / 2);
    const isBandpass = mode === "bandpass";

    graph.svf.modeFilter.type = mode;
    safeParam(graph.svf.modeFilter.frequency, cutoff, graph.context);
    safeParam(graph.svf.modeFilter.Q, isBandpass ? 0.707 : 0.7 + Math.pow(amount, 1.2) * 12, graph.context);
    safeParam(graph.svf.modeFilterGain.gain, isBandpass ? 0 : 1, graph.context);
    safeParam(graph.svf.bpHighpass.frequency, clamp(cutoff / ratio, 90, 16000, 90), graph.context);
    safeParam(graph.svf.bpHighpass.Q, 0.72, graph.context);
    safeParam(graph.svf.bpLowpass.frequency, clamp(cutoff * ratio, 90, 16000, 16000), graph.context);
    safeParam(graph.svf.bpLowpass.Q, 0.72, graph.context);
    safeParam(graph.svf.bpPeak.frequency, cutoff, graph.context);
    safeParam(graph.svf.bpPeak.Q, 0.8 + Math.pow(amount, 1.1) * 15, graph.context);
    safeParam(graph.svf.bpPeak.gain, Math.pow(amount, 0.9) * 16, graph.context);
    safeParam(graph.svf.bpGain.gain, isBandpass ? (0.08 + Math.pow(width, 0.7) * 0.55 + amount * 0.12) * (0.65 + position * 1.6) : 0, graph.context);
    safeParam(graph.svf.dryGain.gain, 1 - level, graph.context);
    safeParam(graph.svf.wetGain.gain, level, graph.context);
  }

  function applyOutput(graph) {
    safeParam(graph.masterGain.gain, clamp(state.output.level, 0, 0.16, 0.08), graph.context, 0.02);
  }

  const appliers = { drive: applyDrive, chorus: applyChorus, delay: applyDelay, reverb: applyReverb, svf: applySvf, output: applyOutput };

  function applyAll(graph) {
    Object.values(appliers).forEach((apply) => apply(graph));
  }

  function create(context) {
    if (activeGraph && activeGraph.context === context) return activeGraph;
    if (activeGraph) dispose();

    const input = context.createGain();
    const drive = createDrive(context);
    const chorus = createChorus(context);
    const delay = createDelay(context);
    const reverb = createReverb(context);
    const svf = createSvf(context);
    const envelopeFollowerAnalyser = context.createAnalyser();
    const masterGain = context.createGain();
    const limiter = context.createDynamicsCompressor();

    envelopeFollowerAnalyser.fftSize = 512;
    envelopeFollowerAnalyser.smoothingTimeConstant = 0.03;
    limiter.threshold.value = -24;
    limiter.knee.value = 12;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.12;

    input.connect(drive.input);
    drive.output.connect(chorus.input);
    chorus.output.connect(delay.input);
    delay.output.connect(reverb.input);
    reverb.output.connect(svf.input);
    svf.output.connect(envelopeFollowerAnalyser);
    svf.output.connect(masterGain);
    masterGain.connect(limiter);
    limiter.connect(context.destination);

    activeGraph = { context, input, drive, chorus, delay, reverb, svf, envelopeFollowerAnalyser, masterGain, limiter, destinationConnections: 1 };
    applyAll(activeGraph);
    window.dispatchEvent(new CustomEvent("merrinlab-effects-graph-ready"));
    return activeGraph;
  }

  function setParameters(effect, values) {
    if (!state[effect] || !values || typeof values !== "object") return false;
    Object.assign(state[effect], values);
    if (activeGraph && appliers[effect]) appliers[effect](activeGraph);
    return true;
  }

  function setParameter(effect, key, value) {
    return setParameters(effect, { [key]: value });
  }

  function getAnalyser(name) {
    if (!activeGraph) return null;
    if (name === "svf") return activeGraph.svf.analyser;
    if (name === "envelopeFollower") return activeGraph.envelopeFollowerAnalyser;
    return null;
  }

  function mute() {
    if (!activeGraph) return;
    safeParam(activeGraph.masterGain.gain, 0, activeGraph.context, 0.005);
    safeParam(activeGraph.delay.feedbackGain.gain, 0, activeGraph.context, 0.005);
  }

  function dispose() {
    if (!activeGraph) return;
    try { activeGraph.chorus.lfo.stop(); } catch (_error) {}
    try { activeGraph.input.disconnect(); } catch (_error) {}
    activeGraph = null;
  }

  function getDebugState() {
    return {
      active: Boolean(activeGraph),
      destinationConnections: activeGraph?.destinationConnections || 0,
      order: ["drive", "chorus", "delay", "reverb", "svf", "master", "limiter", "destination"],
    };
  }

  window.MerrinLabEffectsOutputGraph = { create, setParameter, setParameters, getAnalyser, mute, dispose, getDebugState };
})();
