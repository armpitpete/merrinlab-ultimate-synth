(() => {
  "use strict";

  const MAX_DELAY_SECONDS = 3;
  const MAX_FEEDBACK = 0.85;
  const state = {
    mix: 0,
    time: 0.25,
    feedback: 0.2,
  };

  function clamp(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function applyDelayParameters() {
    window.MerrinLabEffectsOutputGraph?.setParameters("delay", state);
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
