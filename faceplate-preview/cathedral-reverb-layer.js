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

  function safeParam(param, value, time, speed = 0.08) {
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
    return Math.min(1, Math.max(0, (size - 0.45) / 0.55));
  }

  function createCathedralImpulse(context) {
    const seconds = 2.6;
    const sampleRate = context.sampleRate;
    const length = Math.floor(sampleRate * seconds);
    const impulse = context.createBuffer(2, length, sampleRate);

    for (let channelIndex = 0; channelIndex < impulse.numberOfChannels; channelIndex += 1) {
      const channel = impulse.getChannelData(channelIndex);
      let previous = 0;

      for (let i = 0; i < length; i += 1) {
        const progress = i / length;
        const decay = Math.pow(1 - progress, 3.3);
        const build = Math.min(1, i / (sampleRate * 0.035));
        const white = Math.random() * 2 - 1;
        previous = previous * 0.72 + white * 0.28;
        channel[i] = previous * decay * build * 0.42;
      }
    }

    return impulse;
  }

  function applyCathedralParameters() {
    if (!activeCathedral) return;

    readCurrentReverbControls();

    const {
      context,
      wetGain,
      tone,
      preDelay,
    } = activeCathedral;

    const now = context.currentTime;
    const cathedralAmount = getCathedralAmount();
    const wet = clamp01(state.mix) * cathedralAmount * 0.5;

    safeParam(wetGain.gain, wet, now, 0.12);
    safeParam(preDelay.delayTime, 0.018 + cathedralAmount * 0.035, now, 0.08);
    safeParam(tone.frequency, 4800 - cathedralAmount * 2100, now, 0.16);
  }

  function createCathedralLayer(context, source, destination) {
    if (activeCathedral && activeCathedral.context === context) return;
    if (!previousConnect) return;

    const input = context.createGain();
    const preDelay = context.createDelay(0.08);
    const convolver = context.createConvolver();
    const tone = context.createBiquadFilter();
    const wetGain = context.createGain();

    preDelay.delayTime.value = 0.025;
    convolver.buffer = createCathedralImpulse(context);
    tone.type = "lowpass";
    tone.frequency.value = 3600;
    wetGain.gain.value = 0;

    previousConnect.call(source, input);
    previousConnect.call(input, preDelay);
    previousConnect.call(preDelay, convolver);
    previousConnect.call(convolver, tone);
    previousConnect.call(tone, wetGain);
    previousConnect.call(wetGain, destination);

    activeCathedral = {
      context,
      wetGain,
      tone,
      preDelay,
      convolver,
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
