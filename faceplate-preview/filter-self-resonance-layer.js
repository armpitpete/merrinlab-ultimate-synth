(() => {
  "use strict";

  const RESONANCE_START = 8;
  const RESONANCE_FULL = 20;
  const MAX_RESONANCE = 24;
  const MAX_SELF_GAIN = 0.08;

  const state = {
    cutoff: 1200,
    resonance: 0.1,
  };

  let previousConnect = null;
  let activeSelfResonance = null;

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

  function safeParam(param, value, time, speed = 0.05) {
    param.cancelScheduledValues(time);
    param.setTargetAtTime(value, time, speed);
  }

  function selfAmount() {
    const resonance = clamp(state.resonance, 0.1, MAX_RESONANCE, 0.1);
    return clamp((resonance - RESONANCE_START) / (RESONANCE_FULL - RESONANCE_START), 0, 1, 0);
  }

  function applySelfResonanceParameters() {
    if (!activeSelfResonance) return;

    const { context, oscillator, gain } = activeSelfResonance;
    const now = context.currentTime;
    const cutoff = clamp(state.cutoff, 40, 8500, 1200);
    const amount = selfAmount();
    const curvedGain = amount * amount * MAX_SELF_GAIN;

    safeParam(oscillator.frequency, cutoff, now, 0.035);
    safeParam(gain.gain, curvedGain, now, 0.055);
  }

  function createSelfResonanceLayer(context, destination) {
    if (activeSelfResonance && activeSelfResonance.context === context) return;
    if (!previousConnect) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = clamp(state.cutoff, 40, 8500, 1200);
    gain.gain.value = 0;

    previousConnect.call(oscillator, gain);
    previousConnect.call(gain, destination);
    oscillator.start();

    activeSelfResonance = {
      context,
      oscillator,
      gain,
    };

    applySelfResonanceParameters();
  }

  function patchConnect() {
    if (!window.AudioNode || window.AudioNode.prototype.__merrinlabSelfResonancePatched) return;

    previousConnect = window.AudioNode.prototype.connect;

    window.AudioNode.prototype.connect = function connectWithSelfResonance(destination, ...rest) {
      const result = previousConnect.call(this, destination, ...rest);

      try {
        if (isDestinationNode(destination)) {
          createSelfResonanceLayer(this.context, destination);
        }
      } catch (_error) {
        // Self resonance is optional. The main synth path must keep working.
      }

      return result;
    };

    window.AudioNode.prototype.__merrinlabSelfResonancePatched = true;
  }

  function readNumberFromControl(selector, fallback) {
    const control = document.querySelector(selector);
    if (!control) return fallback;
    return clamp(control.value, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, fallback);
  }

  function updateStateFromControl(control) {
    const key = control.dataset.visibleAudioControl || control.dataset.audioControl;
    if (key === "cutoff") state.cutoff = clamp(control.value, 40, 8500, state.cutoff);
    if (key === "resonance") state.resonance = clamp(control.value, 0.1, MAX_RESONANCE, state.resonance);
    applySelfResonanceParameters();
    syncSelfResonanceControls();
  }

  function isSelfResonanceControl(target) {
    return Boolean(target?.matches?.('[data-visible-audio-control="cutoff"], [data-visible-audio-control="resonance"], [data-audio-control="cutoff"], [data-audio-control="resonance"]'));
  }

  function updateReadout(key, value, text) {
    document.querySelectorAll(`[data-visible-audio-control="${key}"]`).forEach((control) => {
      control.value = String(value);
      const readout = control.closest(".visible-audio-control-wrap")?.querySelector(".visible-audio-readout");
      if (readout) readout.textContent = text;
    });

    document.querySelectorAll(`[data-audio-control="${key}"]`).forEach((control) => {
      control.value = String(value);
    });

    document.querySelectorAll(`[data-audio-readout="${key}"]`).forEach((readout) => {
      readout.textContent = text;
    });
  }

  function syncSelfResonanceControls() {
    document.querySelectorAll('[data-visible-audio-control="resonance"]').forEach((control) => {
      control.max = String(MAX_RESONANCE);
      control.step = "0.1";
    });

    document.querySelectorAll('[data-audio-control="resonance"]').forEach((control) => {
      control.max = String(MAX_RESONANCE);
      control.step = "0.1";
    });

    const resonance = clamp(state.resonance, 0.1, MAX_RESONANCE, 0.1);
    updateReadout("resonance", resonance.toFixed(1), `${resonance.toFixed(1)} Q`);
  }

  function handleInput(event) {
    const control = event.target;
    if (!isSelfResonanceControl(control)) return;
    updateStateFromControl(control);
  }

  function addStyles() {
    if (document.querySelector("#filter-self-resonance-styles")) return;

    const style = document.createElement("style");
    style.id = "filter-self-resonance-styles";
    style.textContent = `
      .filter-lp-module .module-header h2::after {
        content: " SELF";
        color: #93d36c;
        font-size: 0.64em;
        letter-spacing: 0.08em;
      }
    `;

    document.head.append(style);
  }

  function loadEnvelopeFollowerLayer() {
    if (document.querySelector('script[src="envelope-follower-dynamic-modulation-layer.js"]')) return;

    const script = document.createElement("script");
    script.src = "envelope-follower-dynamic-modulation-layer.js";
    script.defer = true;
    document.head.append(script);
  }

  function initSelfResonance() {
    patchConnect();
    addStyles();

    state.cutoff = readNumberFromControl('[data-visible-audio-control="cutoff"]', readNumberFromControl('[data-audio-control="cutoff"]', state.cutoff));
    state.resonance = readNumberFromControl('[data-visible-audio-control="resonance"]', readNumberFromControl('[data-audio-control="resonance"]', state.resonance));

    syncSelfResonanceControls();
    loadEnvelopeFollowerLayer();
    window.setTimeout(syncSelfResonanceControls, 300);
    window.setTimeout(syncSelfResonanceControls, 900);
  }

  document.addEventListener("input", handleInput, true);
  document.addEventListener("change", handleInput, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSelfResonance);
  } else {
    initSelfResonance();
  }
})();
