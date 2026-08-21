(() => {
  "use strict";

  function midiNoteToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  const router = {
    synth: null,

    connect(engine) {
      this.synth = engine;
    },

    handleMessage(data) {
      const command = data[0] & 0xf0;
      const value1 = data[1];
      const value2 = data[2];

      if (command === 0x90 && value2 > 0) {
        this.noteOn(value1, value2);
      } else if (command === 0x80 || (command === 0x90 && value2 === 0)) {
        this.noteOff(value1);
      } else if (command === 0xb0) {
        this.controlChange(value1, value2);
      } else if (command === 0xe0) {
        this.pitchBend(value1, value2);
      }
    },

    noteOn(note, velocity) {
      if (!this.synth) return;
      const frequency = midiNoteToFrequency(note);
      this.synth.midiNoteOn?.(frequency, velocity / 127);
    },

    noteOff(note) {
      if (!this.synth) return;
      this.synth.midiNoteOff?.(note);
    },

    controlChange(cc, value) {
      window.MerrinLabLaunchkey25CCMap &&
        console.log("CC", cc, value);
    },

    pitchBend(lsb, msb) {
      const bend = ((msb << 7) + lsb - 8192) / 8192;
      this.synth?.midiPitchBend?.(bend);
    }
  };

  window.MerrinLabMIDIRouter = router;
})();
