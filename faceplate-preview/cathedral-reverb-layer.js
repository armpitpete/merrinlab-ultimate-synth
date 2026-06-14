(() => {
  "use strict";

  const state = {
    mix: 0,
    size: 0.45,
  };

  let previousConnect = null;
  let activeCathedral = null;

  function clamp01(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.min(1, Math.max(0, number));
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

  function readCurrentReverbControls() {
    const mixControl = document.querySelector('[data-reverb-control="mix"]');
    const sizeControl = document.querySelector('[data-reverb-control="size"]');

    if (mixControl) state.mix = clamp01(mixControl.value);
    if (sizeControl) state.size = clamp01(sizeControl.value);
  }

  function getCathedralAmount() {
    const size = clamp01(state.size);
    return Math.min(1, Math.max(0, (size - 0.35) / 0.65));
  }

  function applyCathedralParameters() {
    if (!activeCathedral) return;

    readCurrentReverbControls();

    const {
      context,
      wetGain,
      tone,
      delayA,
      delayB,
      delayC,
      delayD,
    } = activeCathedral;

    const now = context.currentTime;
    const size = clamp01(state.size);
    const cathedralAmount = getCathedralAmount();
    const wet = clamp01(state.mix) * cathedralAmount * 0.48;

    safeParam(wetGain.gain, wet, now, 0.08);
    safeParam(tone.frequency, 4200 - cathedralAmount * 1900, now, 0.12);

    safeParam(delayA.delayTime, 0.28 + size * 0.22, now, 0.08);
    safeParam(delayB.delayTime, 0.46 + size * 0.34, now, 0.08);
    safeParam(delayC.delayTime, 0.72 + size * 0.38, now, 0.08);
    safeParam(delayD.delayTime, 0.94 + size * 0.46, now, 0.08);
  }

  function createCathedralLayer(context, source, destination) {
    if (activeCathedral && activeCathedral.context === context) return;
    if (!previousConnect) return;

    const input = context.createGain();
    const delayA = context.createDelay(1.5);
    const delayB = context.createDelay(1.5);
    const delayC = context.createDelay(1.5);
    const delayD = context.createDelay(1.5);
    const gainA = context.createGain();
    const gainB = context.createGain();
    const gainC = context.createGain();
    const gainD = context.createGain();
    const tone = context.createBiquadFilter();
    const wetGain = context.createGain();

    delayA.delayTime.value = 0.38;
    delayB.delayTime.value = 0.62;
    delayC.delayTime.value = 0.92;
    delayD.delayTime.value = 1.18;

    gainA.gain.value = 0.28;
    gainB.gain.value = 0.22;
    gainC.gain.value = 0.17;
    gainD.gain.value = 0.13;

    tone.type = "lowpass";
    tone.frequency.value = 3200;
    wetGain.gain.value = 0;

    previousConnect.call(source, input);
    previousConnect.call(input, delayA);
    previousConnect.call(input, delayB);
    previousConnect.call(input, delayC);
    previousConnect.call(input, delayD);
    previousConnect.call(delayA, gainA);
    previousConnect.call(delayB, gainB);
    previousConnect.call(delayC, gainC);
    previousConnect.call(delayD, gainD);
    previousConnect.call(gainA, tone);
    previousConnect.call(gainB, tone);
    previousConnect.call(gainC, tone);
    previousConnect.call(gainD, tone);
    previousConnect.call(tone, wetGain);
    previousConnect.call(wetGain, destination);

    activeCathedral = {
      context,
      wetGain,
      tone,
      delayA,
      delayB,
      delayC,
      delayD,
    };

    applyCathedralParameters();
  }

  function patchConnect() {
    if (!window.AudioNode || window.AudioNode.prototype.__merrinlabCathedralReverbPatched) return;

    previousConnect = window.AudioNode.prototype.connect;

    window.AudioNode.prototype.connect = function connectWithCathedralReverb(destination, ...rest) {
      const result = previousConnect.call(this, destination, ...rest);

      try {
        if (isDestinationNode(destination)) {
          createCathedralLayer(this.context, this, destination);
        }
      } catch (_error) {
        // The cathedral layer is optional. The dry synth path must keep working.
      }

      return result;
    };

    window.AudioNode.prototype.__merrinlabCathedralReverbPatched = true;
  }

  function handleControl(event) {
    const control = event.target.closest("[data-reverb-control]");
    if (!control) return;

    if (control.dataset.reverbControl === "mix") state.mix = clamp01(control.value);
    if (control.dataset.reverbControl === "size") state.size = clamp01(control.value);
    applyCathedralParameters();
  }

  patchConnect();
  document.addEventListener("input", handleControl);
  document.addEventListener("change", handleControl);
})();
