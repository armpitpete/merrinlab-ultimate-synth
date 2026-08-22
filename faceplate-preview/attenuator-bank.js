(() => {
  "use strict";

  const CHANNEL_COUNT = 6;
  const listeners = new Set();
  const channels = Array.from({ length: CHANNEL_COUNT }, () => ({
    input: 0,
    amount: 1,
    output: 0,
  }));

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function getChannelIndex(channelNumber) {
    const index = Number(channelNumber) - 1;
    if (!Number.isInteger(index) || index < 0 || index >= CHANNEL_COUNT) {
      throw new RangeError(`Attenuator channel must be between 1 and ${CHANNEL_COUNT}`);
    }
    return index;
  }

  function snapshot(channelNumber) {
    const channel = channels[getChannelIndex(channelNumber)];
    return { channel: Number(channelNumber), ...channel };
  }

  function notify(channelNumber) {
    const state = snapshot(channelNumber);
    listeners.forEach((listener) => listener(state));
    return state;
  }

  function updateOutput(channel) {
    channel.output = channel.input * channel.amount;
  }

  function setInput(channelNumber, value) {
    const channel = channels[getChannelIndex(channelNumber)];
    channel.input = clamp(value, -1, 1);
    updateOutput(channel);
    return notify(channelNumber);
  }

  function setAmount(channelNumber, value) {
    const channel = channels[getChannelIndex(channelNumber)];
    channel.amount = clamp(value, 0, 1);
    updateOutput(channel);
    return notify(channelNumber);
  }

  function getState() {
    return channels.map((_channel, index) => snapshot(index + 1));
  }

  function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  window.MerrinLabAttenuators = {
    setInput,
    setAmount,
    getChannel: snapshot,
    getState,
    subscribe,
  };
})();
