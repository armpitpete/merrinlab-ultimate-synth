(() => {
  "use strict";

  const CHANNEL_COUNT = 6;
  const listeners = new Set();
  const channels = Array.from({ length: CHANNEL_COUNT }, () => ({ source: "off", amount: 1, destination: "off" }));

  function getChannelIndex(channelNumber) {
    const index = Number(channelNumber) - 1;
    if (!Number.isInteger(index) || index < 0 || index >= CHANNEL_COUNT) {
      throw new RangeError(`Attenuator channel must be between 1 and ${CHANNEL_COUNT}`);
    }
    return index;
  }

  function snapshot(channelNumber) {
    return { channel: Number(channelNumber), ...channels[getChannelIndex(channelNumber)] };
  }

  function notify(channelNumber) {
    const state = snapshot(channelNumber);
    listeners.forEach((listener) => listener(state));
    return state;
  }

  function sendRoute(channelNumber) {
    const state = snapshot(channelNumber);
    window.MerrinLabAudio?.setAttenuatorRoute?.(channelNumber, state);
    return notify(channelNumber);
  }

  function setSource(channelNumber, source) {
    channels[getChannelIndex(channelNumber)].source = String(source || "off");
    return sendRoute(channelNumber);
  }

  function setAmount(channelNumber, value) {
    const amount = Number(value);
    channels[getChannelIndex(channelNumber)].amount = Number.isFinite(amount) ? Math.min(1, Math.max(-1, amount)) : 0;
    return sendRoute(channelNumber);
  }

  function setDestination(channelNumber, destination) {
    channels[getChannelIndex(channelNumber)].destination = String(destination || "off");
    return sendRoute(channelNumber);
  }

  function syncAll() {
    channels.forEach((_channel, index) => sendRoute(index + 1));
  }

  function getState() {
    return channels.map((_channel, index) => snapshot(index + 1));
  }

  function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  window.MerrinLabAttenuators = { setSource, setAmount, setDestination, syncAll, getChannel: snapshot, getState, subscribe };
})();
