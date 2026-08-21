(() => {
  "use strict";

  function noteToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function getEngine() {
    return window.MerrinLabAudio || null;
  }

  window.addEventListener("merrinlab-midi", (event) => {
    const data = event.detail;
    const command = data[0] & 0xf0;
    const value1 = data[1];
    const value2 = data[2];
    const engine = getEngine();

    if (!engine) return;

    if (command === 0x90 && value2 > 0) {
      engine.noteOn?.(noteToFrequency(value1), value2 / 127, value1);
    }

    if (command === 0x80 || (command === 0x90 && value2 === 0)) {
      engine.noteOff?.(value1);
    }

    if (command === 0xb0) {
      engine.setParameter?.(`midiCC${value1}`, value2 / 127);
    }

    if (command === 0xe0) {
      const bend = ((value2 << 7) | value1) - 8192;
      engine.pitchBend?.(bend / 8192);
    }
  });
})();
