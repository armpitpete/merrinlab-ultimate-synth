(() => {
  "use strict";

  const CUTOFF_MIN = 90;
  const BANDPASS_CUTOFF_MAX = 16000;
  const DEFAULT_CUTOFF_MAX = 8500;
  const CUTOFF_SLIDER_MAX = 1000;

  let originalConnect = null;
  let originalCreateGain = null;
  let originalCreateBiquadFilter = null;
  let capturingSvfGraph = false;
  let capturedGains = [];
  let capturedFilters = [];
  let bpNodes = null;

  function clamp(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function isDestinationNode(node) {
    return Boolean(node && (
      (typeof AudioDestinationNode !== "undefined" && node instanceof AudioDestinationNode) ||
      node.constructor?.name === "AudioDestinationNode"
    ));
  }

  function isMainSynthOutputNode(node) {
    return Boolean(node && (
      (typeof DynamicsCompressorNode !== "undefined" && node instanceof DynamicsCompressorNode) ||
      node.constructor?.name === "DynamicsCompressorNode"
    ));
  }

  function safeParam(param, value, speed = 0.035) {
    if (!param || !bpNodes?.context) return;
    const now = bpNodes.context.currentTime;
    param.cancelScheduledValues(now);
    param.setTargetAtTime(value, now, speed);
  }

  function mode() {
    return document.querySelector('[data-svf-control="mode"]')?.value || "bandpass";
  }

  function cutoffMaxForMode() {
    return mode() === "bandpass" ? BANDPASS_CUTOFF_MAX : DEFAULT_CUTOFF_MAX;
  }

  function cutoffFromSlider() {
    const control = document.querySelector('[data-svf-control="cutoff"]');
    const slider = clamp(control?.value, 0, CUTOFF_SLIDER_MAX, 0) / CUTOFF_SLIDER_MAX;
    const maxCutoff = cutoffMaxForMode();
    return Math.exp(Math.log(CUTOFF_MIN) + slider * (Math.log(maxCutoff) - Math.log(CUTOFF_MIN)));
  }

  function bpPosition() {
    const position = (Math.log(cutoffFromSlider()) - Math.log(CUTOFF_MIN)) / (Math.log(BANDPASS_CUTOFF_MAX) - Math.log(CUTOFF_MIN));
    return clamp(position, 0, 1, 0);
  }

  function widthAmount() {
    const control = document.querySelector('[data-svf-control="bpWidth"]');
    return clamp(Number(control?.value) / 100, 0, 1, 0.55);
  }

  function resonanceAmount() {
    const control = document.querySelector('[data-svf-control="resonance"]');
    const value = clamp(control?.value, 0.1, 24, 0.7);
    return clamp((value - 0.1) / (24 - 0.1), 0, 1, 0);
  }

  function bpEdges() {
    const centre = cutoffFromSlider();
    const position = bpPosition();
    const width = widthAmount();
    const lowCentreWidthScale = 0.24 + Math.pow(position, 0.55) * 0.76;
    const octaveWidth = (0.05 + Math.pow(width, 1.15) * 3.1) * lowCentreWidthScale;
    const ratio = Math.pow(2, octaveWidth / 2);

    return {
      centre,
      lowEdge: clamp(centre / ratio, CUTOFF_MIN, BANDPASS_CUTOFF_MAX, CUTOFF_MIN),
      highEdge: clamp(centre * ratio, CUTOFF_MIN, BANDPASS_CUTOFF_MAX, BANDPASS_CUTOFF_MAX),
    };
  }

  function bpFrequencyMakeup() {
    const position = bpPosition();
    const lowScale = 0.25 + Math.pow(position, 0.75) * 0.75;
    const highScale = 1 + Math.pow(position, 2.15) * 2.45;
    return lowScale * highScale;
  }

  function bpWindowGain() {
    const baseGain = 0.08 + Math.pow(widthAmount(), 0.7) * 0.55 + resonanceAmount() * 0.12;
    return baseGain * bpFrequencyMakeup();
  }

  function bpPeakQ() {
    return 0.8 + Math.pow(resonanceAmount(), 1.1) * 15;
  }

  function bpPeakGain() {
    const position = bpPosition();
    const frequencyScale = 0.22 + Math.pow(position, 0.72) * 0.98;
    return Math.pow(resonanceAmount(), 0.9) * 16 * frequencyScale;
  }

  function applyCalibration() {
    if (!bpNodes || mode() !== "bandpass") return;

    const edges = bpEdges();
    safeParam(bpNodes.highpass.frequency, edges.lowEdge);
    safeParam(bpNodes.highpass.Q, 0.72);
    safeParam(bpNodes.lowpass.frequency, edges.highEdge);
    safeParam(bpNodes.lowpass.Q, 0.72);
    safeParam(bpNodes.peak.frequency, edges.centre);
    safeParam(bpNodes.peak.Q, bpPeakQ());
    safeParam(bpNodes.peak.gain, bpPeakGain());
    safeParam(bpNodes.gain.gain, bpWindowGain(), 0.025);
  }

  function captureNodes(context) {
    if (capturedFilters.length < 4 || capturedGains.length < 4) return;

    bpNodes = {
      context,
      highpass: capturedFilters[1],
      lowpass: capturedFilters[2],
      peak: capturedFilters[3],
      gain: capturedGains[3],
    };

    window.setTimeout(applyCalibration, 0);
  }

  function patchAudioCreation() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass || AudioContextClass.prototype.__merrinlabBpBalanceRuntimePatched) return;

    originalCreateGain = AudioContextClass.prototype.createGain;
    originalCreateBiquadFilter = AudioContextClass.prototype.createBiquadFilter;

    AudioContextClass.prototype.createGain = function createCalibratedGain(...args) {
      const node = originalCreateGain.apply(this, args);
      if (capturingSvfGraph) capturedGains.push(node);
      return node;
    };

    AudioContextClass.prototype.createBiquadFilter = function createCalibratedBiquadFilter(...args) {
      const node = originalCreateBiquadFilter.apply(this, args);
      if (capturingSvfGraph) capturedFilters.push(node);
      return node;
    };

    AudioContextClass.prototype.__merrinlabBpBalanceRuntimePatched = true;
  }

  function patchOutputConnect() {
    if (!window.AudioNode || window.AudioNode.prototype.__merrinlabBpBalanceRuntimeConnectPatched) return;

    originalConnect = window.AudioNode.prototype.connect;

    window.AudioNode.prototype.connect = function connectWithBpBalanceRuntime(destination, ...rest) {
      const shouldCapture = isDestinationNode(destination) && isMainSynthOutputNode(this);

      if (shouldCapture) {
        capturedGains = [];
        capturedFilters = [];
        capturingSvfGraph = true;
      }

      const result = originalConnect.call(this, destination, ...rest);

      if (shouldCapture) {
        capturingSvfGraph = false;
        captureNodes(this.context);
      }

      return result;
    };

    window.AudioNode.prototype.__merrinlabBpBalanceRuntimeConnectPatched = true;
  }

  function handleInput(event) {
    if (!event.target.closest('[data-svf-control="mode"], [data-svf-control="cutoff"], [data-svf-control="bpWidth"], [data-svf-control="resonance"]')) return;
    window.setTimeout(applyCalibration, 0);
  }

  function init() {
    patchAudioCreation();
    patchOutputConnect();
    document.addEventListener("input", handleInput, true);
    document.addEventListener("change", handleInput, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
