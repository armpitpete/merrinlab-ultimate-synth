// MerrinLab MIDI settings panel
(() => {
  const panel = document.createElement('section');
  panel.className = 'midi-settings-panel';
  panel.innerHTML = `
    <h3>MerrinLab MIDI</h3>
    <p id="midi-status">Status: ❌ No MIDI device</p>
    <button id="midi-connect">Connect MIDI</button>
    <p id="midi-device">Device: none</p>
    <p>Channel: 1</p>
    <p>Notes: enabled<br>CC: enabled</p>
  `;

  document.body.appendChild(panel);

  const status = panel.querySelector('#midi-status');
  const device = panel.querySelector('#midi-device');

  panel.querySelector('#midi-connect').addEventListener('click', async () => {
    if (!navigator.requestMIDIAccess) {
      status.textContent = 'Status: ❌ Web MIDI unavailable';
      return;
    }

    const access = await navigator.requestMIDIAccess();
    const input = [...access.inputs.values()][0];

    if (!input) {
      status.textContent = 'Status: ❌ No MIDI device';
      return;
    }

    input.onmidimessage = event => {
      window.dispatchEvent(new CustomEvent('merrinlab-midi', { detail: event.data }));
    };

    status.textContent = 'Status: ✅ MIDI connected';
    device.textContent = `Device: ${input.name}`;
  });
})();
