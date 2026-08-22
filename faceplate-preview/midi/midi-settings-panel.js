// MerrinLab MIDI settings panel
(() => {
  "use strict";

  const settingsControl = Array.from(document.querySelectorAll(".top-control")).find((control) => {
    return control.querySelector(".top-label")?.textContent.trim() === "Settings";
  });
  const menuButton = settingsControl?.querySelector(".menu-button");

  if (!settingsControl || !menuButton) {
    console.error("MerrinLab MIDI: Settings control not found");
    return;
  }

  const style = document.createElement("style");
  style.textContent = `
    .midi-settings-host { position: relative; }
    .midi-settings-panel {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      z-index: 200;
      width: 260px;
      padding: 14px;
      border: 1px solid rgba(215, 184, 132, 0.42);
      border-radius: 14px;
      background: rgba(18, 14, 11, 0.98);
      box-shadow: 0 16px 42px rgba(0, 0, 0, 0.55);
      color: #f1e7d9;
      text-align: left;
    }
    .midi-settings-panel[hidden] { display: none; }
    .midi-settings-panel h3 { margin: 0 0 10px; font-size: 0.82rem; }
    .midi-settings-panel p { margin: 7px 0; font-size: 0.72rem; line-height: 1.4; }
    .midi-settings-panel button {
      width: 100%;
      margin: 8px 0;
      padding: 8px 10px;
      border: 1px solid rgba(215, 184, 132, 0.48);
      border-radius: 999px;
      background: #2a211a;
      color: #f3e8da;
      font: inherit;
      font-size: 0.72rem;
      font-weight: 800;
      cursor: pointer;
    }
  `;
  document.head.append(style);

  settingsControl.classList.add("midi-settings-host");
  menuButton.setAttribute("role", "button");
  menuButton.setAttribute("tabindex", "0");
  menuButton.setAttribute("aria-expanded", "false");

  const panel = document.createElement("section");
  panel.className = "midi-settings-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <h3>MerrinLab MIDI</h3>
    <p id="midi-status">Status: ❌ No MIDI device</p>
    <button type="button" id="midi-connect">Connect MIDI</button>
    <p id="midi-device">Device: none</p>
    <p id="midi-channel">Channel: 1</p>
    <p>Notes: enabled<br>CC: enabled</p>
  `;
  settingsControl.appendChild(panel);

  const status = panel.querySelector("#midi-status");
  const device = panel.querySelector("#midi-device");
  const channel = panel.querySelector("#midi-channel");
  const connectButton = panel.querySelector("#midi-connect");

  let midiAccess = null;
  let activeInput = null;

  function togglePanel(force) {
    const shouldOpen = typeof force === "boolean" ? force : panel.hidden;
    panel.hidden = !shouldOpen;
    menuButton.setAttribute("aria-expanded", String(shouldOpen));
  }

  function chooseInput() {
    if (!midiAccess) return null;
    const inputs = [...midiAccess.inputs.values()].filter(input => input.state !== "disconnected");
    if (!inputs.length) return null;

    const profile = window.MerrinLabLaunchkey25;
    const matcher = profile?.nameMatch;
    const exclude = profile?.inputExclude;
    const matching = matcher
      ? inputs.filter(input => matcher.test(input.name || ""))
      : inputs;

    if (matching.length) {
      const preferred = matching.find(input => !exclude || !exclude.test(input.name || ""));
      return preferred || matching[0];
    }

    return inputs[0];
  }

  function attachInput(input) {
    if (activeInput && activeInput !== input) activeInput.onmidimessage = null;
    activeInput = input;

    if (!input) {
      status.textContent = "Status: ❌ No MIDI device";
      device.textContent = "Device: none";
      return;
    }

    input.onmidimessage = event => {
      const data = Array.from(event.data);
      const statusByte = data[0] || 0;
      channel.textContent = `Channel: ${(statusByte & 0x0f) + 1}`;
      window.dispatchEvent(new CustomEvent("merrinlab-midi", {
        detail: data
      }));
    };

    const configuredChannel = window.MerrinLabLaunchkey25?.channel || 1;
    status.textContent = "Status: ✅ MIDI connected";
    device.textContent = `Device: ${input.name || "MIDI input"}`;
    channel.textContent = `Channel: ${configuredChannel}`;
  }

  function refreshInput() {
    attachInput(chooseInput());
  }

  async function connectMidi() {
    // This runs directly inside the user's click, so Web Audio can be unlocked
    // before requestMIDIAccess yields control back to the browser.
    window.MerrinLabAudio?.start?.();

    if (!navigator.requestMIDIAccess) {
      status.textContent = "Status: ❌ Web MIDI unavailable";
      return;
    }

    connectButton.disabled = true;
    status.textContent = "Status: Connecting…";

    try {
      midiAccess = await navigator.requestMIDIAccess();
      midiAccess.onstatechange = refreshInput;
      refreshInput();
      if (!activeInput) status.textContent = "Status: ❌ No MIDI device";
    } catch (error) {
      status.textContent = "Status: ❌ MIDI permission denied";
      console.error("MerrinLab MIDI connection failed", error);
    } finally {
      connectButton.disabled = false;
    }
  }

  menuButton.addEventListener("click", event => {
    event.stopPropagation();
    togglePanel();
  });

  menuButton.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePanel();
    }
  });

  panel.addEventListener("click", event => event.stopPropagation());
  connectButton.addEventListener("click", connectMidi);

  document.addEventListener("click", () => togglePanel(false));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") togglePanel(false);
  });
})();
