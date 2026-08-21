(() => {
  "use strict";

  function midiNoteToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function sendToEngine(name, ...args) {
    if (typeof window[name] === "function") {
      return window[name](...args);
    }

    console.warn(`MIDI bridge waiting for audio engine hook: ${name}`);
    return undefined;
  }

  window.MerrinLabMidiEngineBridge = {
    noteOn(note, velocity) {
      sendToEngine("midiNoteOn", {
        note,
        frequency: midiNoteToFrequency(note),
        velocity: velocity / 127,
      });
    },

    noteOff(note) {
      sendToEngine("midiNoteOff", { note });
    },

    pitchBend(value) {
      const bend = (value - 8192) / 8192;
      sendToEngine("midiPitchBend", bend);
    },

    controlChange(controller, value) {
      sendToEngine("midiControlChange", {
        controller,
        value: value / 127,
      });
    },
  };
})();
