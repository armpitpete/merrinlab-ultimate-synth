// MerrinLab MIDI engine bridge
(() => {
  window.addEventListener('merrinlab-midi', event => {
    const [status, data1, data2] = event.detail;
    const command = status & 0xf0;
    const channel = (status & 0x0f) + 1;

    if (!window.MerrinLabAudio) return;

    if (command === 0x90 && data2 > 0) {
      window.MerrinLabAudio.noteOn(data1, data2, channel);
    } else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
      window.MerrinLabAudio.noteOff(data1, channel);
    } else if (command === 0xb0) {
      window.MerrinLabAudio.setParameter(data1, data2);
    } else if (command === 0xe0) {
      const value = ((data2 << 7) | data1) - 8192;
      window.MerrinLabAudio.pitchBend(value);
    }
  });
})();
