(() => {
  "use strict";

  async function initMIDI(router) {
    if (!navigator.requestMIDIAccess) {
      throw new Error("Web MIDI is not supported in this browser");
    }

    const access = await navigator.requestMIDIAccess();

    for (const input of access.inputs.values()) {
      connectInput(input, router);
    }

    access.onstatechange = event => {
      if (event.port && event.port.type === "input" && event.port.state === "connected") {
        connectInput(event.port, router);
      }
    };
  }

  function connectInput(input, router) {
    input.onmidimessage = event => router.handleMessage(event.data);

    console.log("MIDI connected:", input.name);
  }

  window.MerrinLabMIDIInput = { initMIDI };
})();
