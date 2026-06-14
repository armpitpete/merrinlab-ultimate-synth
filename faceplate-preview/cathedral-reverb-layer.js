(() => {
  "use strict";

  const MAX_REVERB_WET_GAIN = 0.38;
  const REVERB_DECAY_SECONDS = 4.6;
  const REVERB_PRE_DELAY_SECONDS = 0.045;

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
    return Math.min(1, Math.max(0, (size - 0.35) / 0.65));
  }

  function createCathedralImpulse(context) {
    const length = Math.max(1, Math.floor(context.sampleRate * REVERB_DECAY_SECONDS));
    const impulse = context.createBuffer(2, length, context.sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const channelData = impulse.getChannelData(channel);

      for (let index = 0; index < length; index += 1) {
        const position = index / length;
        const slowTail = Math.pow(1 - position, 1.28);
        const lateBloom = Math.sin(position * Math.PI) * 0.18;
        const earlyReflection = index < context.sampleRate * 0.18 ? 0.42 : 1;
        const stereoOffset = channel === 0 ? 0.91 : 1.0;

        channelData[index] = (Math.random() * 2 - 1) * (slowTail + lateBloom) * earlyReflection * stereoOffset * 0.55;
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
      preDelay,
    } = activeCathedral;

    const now = context.currentTime;
    const cathedralAmount = getCathedralAmount();
    const wet = clamp01(state.mix) * cathedralAmount * MAX_REVERB_WET_GAIN;

    safeParam(wetGain.gain, wet, now, 0.04);
    safeParam(preDelay.delayTime, REVERB_PRE_DELAY_SECONDS, now, 0.04);
  }

  function createCathedralLayer(context, source, destination) {
    if (activeCathedral && activeCathedral.context === context) return;
    if (!previousConnect) return;

    const input = context.createGain();
    const preDelay = context.createDelay(0.12);
    const convolver = context.createConvolver();
    const wetGain = context.createGain();

    preDelay.delayTime.value = REVERB_PRE_DELAY_SECONDS;
    convolver.buffer = createCathedralImpulse(context);
    wetGain.gain.value = 0;

    previousConnect.call(source, input);
    previousConnect.call(input, preDelay);
    previousConnect.call(preDelay, convolver);
    previousConnect.call(convolver, wetGain);
    previousConnect.call(wetGain, destination);

    activeCathedral = {
      context,
      wetGain,
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
