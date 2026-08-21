// MerrinLab MIDI engine bridge
(() => {
  "use strict";

  const heldNotes = [];
  let currentNote = null;
  let pitchBend = 0;

  const ccMap = {
    21: ["vcoLevel", 0, 0.7],
    22: ["vco2Level", 0, 0.45],
    23: ["vco3Level", 0, 0.4],
    24: ["cutoff", 120, 6500],
    25: ["resonance", 0.1, 12],
    26: ["lfo1Rate", 0.05, 12],
    27: ["lfo1Mod", 0, 1],
    28: ["delayMix", 0, 1]
  };

  function midiNoteToFrequency(note, bend = 0) {
    const semitones = bend * 2;
    return 440 * Math.pow(2, ((note - 69) + semitones) / 12);
  }

  function getAudioControl(key) {
    return document.querySelector(`[data-audio-control="${key}"]`);
  }

  function setAudioControl(key, value) {
    const control = getAudioControl(key);
    if (!control) return false;

    control.value = String(value);
    control.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }

  function clickAudioAction(action) {
    const button = document.querySelector(`[data-audio-action="${action}"]`);
    if (!button) return false;
    button.click();
    return true;
  }

  function applyCurrentPitch() {
    if (currentNote === null) return false;
    const frequency = midiNoteToFrequency(currentNote, pitchBend);
    return setAudioControl("coarseFreq", Math.min(880, Math.max(55, frequency)));
  }

  function removeHeldNote(note) {
    for (let i = heldNotes.length - 1; i >= 0; i -= 1) {
      if (heldNotes[i] === note) heldNotes.splice(i, 1);
    }
  }

  window.MerrinLabAudio = {
    start() {
      return clickAudioAction("start");
    },

    noteOn(note, velocity, channel) {
      removeHeldNote(note);
      heldNotes.push(note);
      currentNote = note;
      applyCurrentPitch();
      clickAudioAction("gate-on");
      window.dispatchEvent(new CustomEvent("merrinlab-midi-note", {
        detail: { type: "noteon", note, velocity, channel }
      }));
    },

    noteOff(note, channel) {
      removeHeldNote(note);

      if (currentNote !== note) return;

      if (heldNotes.length) {
        currentNote = heldNotes[heldNotes.length - 1];
        applyCurrentPitch();
      } else {
        currentNote = null;
        clickAudioAction("gate-off");
      }

      window.dispatchEvent(new CustomEvent("merrinlab-midi-note", {
        detail: { type: "noteoff", note, channel }
      }));
    },

    pitchBend(rawValue) {
      pitchBend = Math.max(-1, Math.min(1, rawValue / 8192));
      applyCurrentPitch();
    },

    controlChange(cc, value) {
      const mapping = ccMap[cc];
      if (!mapping) return false;
      const [key, min, max] = mapping;
      const normalized = Math.max(0, Math.min(127, value)) / 127;
      return setAudioControl(key, min + normalized * (max - min));
    },

    setParameter(key, value) {
      return setAudioControl(key, value);
    }
  };

  window.addEventListener("merrinlab-midi", event => {
    const [status, data1, data2] = event.detail;
    const command = status & 0xf0;
    const channel = (status & 0x0f) + 1;

    if (command === 0x90 && data2 > 0) {
      window.MerrinLabAudio.noteOn(data1, data2, channel);
    } else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
      window.MerrinLabAudio.noteOff(data1, channel);
    } else if (command === 0xb0) {
      window.MerrinLabAudio.controlChange(data1, data2, channel);
    } else if (command === 0xe0) {
      const value = ((data2 << 7) | data1) - 8192;
      window.MerrinLabAudio.pitchBend(value);
    }
  });
})();
