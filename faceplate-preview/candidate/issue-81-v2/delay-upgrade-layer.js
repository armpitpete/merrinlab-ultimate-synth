(() => {
  "use strict";

  const MAX_DELAY_SECONDS = 3;
  const MAX_FEEDBACK = 0.85;
  const MAX_WET_GAIN = 0.7;

  const state = {
    mix: 0,
    time: 0.25,
    feedback: 0.2,
  };

  let previousConnect = null;
  let activeDelay = null;

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

  function safeParam(param, value, time, speed = 0.04) {
    param.cancelScheduledValues(time);
    param.setTargetAtTime(value, time, speed);
  }

  function applyDelayParameters() {
    if (!activeDelay) return;

    const { context, delayNode, feedbackGain, wetGain, feedbackTone } = activeDelay;
    const now = context.currentTime;
    const feedback = clamp(state.feedback, 0, MAX_FEEDBACK, 0.2);

    safeParam(delayNode.delayTime, clamp(state.time, 0.05, MAX_DELAY_SECONDS, 0.25), now, 0.05);
    safeParam(feedbackGain.gain, feedback, now, 0.05);
    safeParam(wetGain.gain, clamp(state.mix, 0, 1, 0) * MAX_WET_GAIN, now, 0.04);
    safeParam(feedbackTone.frequency, 5200 - feedback * 2200, now, 0.12);
  }

  function createDelayLayer(context, source, destination) {
    if (activeDelay && activeDelay.context === context) return;
    if (!previousConnect) return;

    const input = context.createGain();
    const delayNode = context.createDelay(MAX_DELAY_SECONDS + 0.2);
    const feedbackTone = context.createBiquadFilter();
    const feedbackGain = context.createGain();
    const wetGain = context.createGain();

    delayNode.delayTime.value = state.time;
    feedbackTone.type = "lowpass";
    feedbackTone.frequency.value = 4600;
    feedbackGain.gain.value = state.feedback;
    wetGain.gain.value = 0;

    previousConnect.call(source, input);
    previousConnect.call(input, delayNode);
    previousConnect.call(delayNode, feedbackTone);
    previousConnect.call(feedbackTone, feedbackGain);
    previousConnect.call(feedbackGain, delayNode);
    previousConnect.call(delayNode, wetGain);
    previousConnect.call(wetGain, destination);

    activeDelay = {
      context,
      delayNode,
      feedbackTone,
      feedbackGain,
      wetGain,
    };

    applyDelayParameters();
  }

  function patchConnect() {
    if (!window.AudioNode || window.AudioNode.prototype.__merrinlabDelayUpgradePatched) return;

    previousConnect = window.AudioNode.prototype.connect;

    window.AudioNode.prototype.connect = function connectWithUpgradedDelay(destination, ...rest) {
      const result = previousConnect.call(this, destination, ...rest);

      try {
        if (isDestinationNode(destination)) {
          createDelayLayer(this.context, this, destination);
        }
      } catch (_error) {
        // Delay is optional. The dry synth path must keep working.
      }

      return result;
    };

    window.AudioNode.prototype.__merrinlabDelayUpgradePatched = true;
  }

  function visibleValueToState(key, value, isFaceplate) {
    if (key === "delayMix") return clamp(isFaceplate ? Number(value) / 100 : value, 0, 1, 0);
    if (key === "delayTime") return clamp(value, 0.05, MAX_DELAY_SECONDS, state.time);
    if (key === "delayFeedback") return clamp(isFaceplate ? Number(value) / 100 : value, 0, MAX_FEEDBACK, state.feedback);
    return 0;
  }

  function setStateFromControl(control) {
    const visibleKey = control.dataset.visibleAudioControl;
    const sourceKey = control.dataset.audioControl;
    const key = visibleKey || sourceKey;
    const isFaceplate = Boolean(visibleKey);

    if (key === "delayMix") state.mix = visibleValueToState(key, control.value, isFaceplate);
    if (key === "delayTime") state.time = visibleValueToState(key, control.value, isFaceplate);
    if (key === "delayFeedback") state.feedback = visibleValueToState(key, control.value, isFaceplate);

    applyDelayParameters();
    syncDelayControls();
  }

  function setControlLimits() {
    document.querySelectorAll('[data-visible-audio-control="delayTime"]').forEach((control) => {
      control.min = "0.05";
      control.max = String(MAX_DELAY_SECONDS);
      control.step = "0.01";
    });

    document.querySelectorAll('[data-audio-control="delayTime"]').forEach((control) => {
      control.min = "0.05";
      control.max = String(MAX_DELAY_SECONDS);
      control.step = "0.01";
    });

    document.querySelectorAll('[data-visible-audio-control="delayFeedback"]').forEach((control) => {
      control.min = "0";
      control.max = String(Math.round(MAX_FEEDBACK * 100));
      control.step = "1";
    });

    document.querySelectorAll('[data-audio-control="delayFeedback"]').forEach((control) => {
      control.min = "0";
      control.max = String(MAX_FEEDBACK);
      control.step = "0.01";
    });
  }

  function updateFaceplateControl(key, value, readoutText) {
    document.querySelectorAll(`[data-visible-audio-control="${key}"]`).forEach((control) => {
      control.value = String(value);
      const readout = control.closest(".visible-audio-control-wrap")?.querySelector(".visible-audio-readout");
      if (readout) readout.textContent = readoutText;
    });
  }

  function updateSourceControl(key, value, readoutText) {
    document.querySelectorAll(`[data-audio-control="${key}"]`).forEach((control) => {
      control.value = String(value);
    });

    document.querySelectorAll(`[data-audio-readout="${key}"]`).forEach((readout) => {
      readout.textContent = readoutText;
    });
  }

  function syncDelayControls() {
    setControlLimits();

    const mixPercent = Math.round(clamp(state.mix, 0, 1, 0) * 100);
    const feedbackPercent = Math.round(clamp(state.feedback, 0, MAX_FEEDBACK, 0) * 100);
    const timeSeconds = clamp(state.time, 0.05, MAX_DELAY_SECONDS, 0.25);

    updateFaceplateControl("delayMix", mixPercent, `${mixPercent}%`);
    updateFaceplateControl("delayTime", timeSeconds.toFixed(2), `${timeSeconds.toFixed(2)} s`);
    updateFaceplateControl("delayFeedback", feedbackPercent, `${feedbackPercent}%`);

    updateSourceControl("delayMix", state.mix.toFixed(2), `${mixPercent} %`);
    updateSourceControl("delayTime", timeSeconds.toFixed(2), `${timeSeconds.toFixed(2)} s`);
    updateSourceControl("delayFeedback", state.feedback.toFixed(2), `${feedbackPercent} %`);
  }

  function isDelayControl(target) {
    return Boolean(target?.matches?.('[data-visible-audio-control="delayMix"], [data-visible-audio-control="delayTime"], [data-visible-audio-control="delayFeedback"], [data-audio-control="delayMix"], [data-audio-control="delayTime"], [data-audio-control="delayFeedback"]'));
  }

  function handleDelayControl(event) {
    const control = event.target;
    if (!isDelayControl(control)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    setStateFromControl(control);
  }

  function addStyles() {
    if (document.querySelector("#delay-upgrade-layer-styles")) return;

    const style = document.createElement("style");
    style.id = "delay-upgrade-layer-styles";
    style.textContent = `
      .delay-module .module-header h2::after {
        content: " 3s";
        color: #93d36c;
        font-size: 0.68em;
        letter-spacing: 0.08em;
      }
    `;

    document.head.append(style);
  }

  function loadChorusEffectLayer() {
    if (document.querySelector('script[src="chorus-effect-layer.js"]')) return;

    const script = document.createElement("script");
    script.src = "chorus-effect-layer.js";
    script.defer = true;
    document.head.append(script);
  }

  function initDelayUpgradeLayer() {
    patchConnect();
    addStyles();
    syncDelayControls();
    loadChorusEffectLayer();
    window.setTimeout(syncDelayControls, 250);
    window.setTimeout(syncDelayControls, 750);
  }

  document.addEventListener("input", handleDelayControl, true);
  document.addEventListener("change", handleDelayControl, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDelayUpgradeLayer);
  } else {
    initDelayUpgradeLayer();
  }
})();
