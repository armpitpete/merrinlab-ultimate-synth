import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import vm from "node:vm";

const previewDirectory = new URL("../faceplate-preview/", import.meta.url);
const entries = await readdir(previewDirectory, { withFileTypes: true });
const activeScripts = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
  .map((entry) => entry.name)
  .sort();

const sources = new Map();
for (const filename of activeScripts) {
  sources.set(filename, await readFile(join(previewDirectory.pathname, filename), "utf8"));
}
const midiEngineBridgeSource = await readFile(join(previewDirectory.pathname, "midi/midi-engine-bridge.js"), "utf8");

const combinedSource = [...sources.values()].join("\n");
assert.doesNotMatch(combinedSource, /AudioNode\.prototype\.connect\s*=/, "active scripts must not patch AudioNode.connect");
assert.doesNotMatch(combinedSource, /AudioContextClass\.prototype\.(createGain|createBiquadFilter|createOscillator)\s*=/, "active scripts must not patch AudioContext factories");

const destinationConnections = [...combinedSource.matchAll(/\.connect\(context\.destination\)/g)];
assert.equal(destinationConnections.length, 1, "the active graph must own exactly one destination connection");
assert.match(sources.get("effects-output-graph.js"), /limiter\.connect\(context\.destination\)/, "the limiter must own the destination connection");
assert.match(sources.get("audio-engine.js"), /tremoloGain\.connect\(effectsOutputGraph\.input\)/, "the voice must enter the explicit effects graph");
assert.match(sources.get("effects-output-graph.js"), /reverb\.output\.connect\(svf\.input\)/, "the State Variable VCF must remain inside the explicit effects/output graph");
assert.match(sources.get("effects-output-graph.js"), /modeFilter\.Q, isBandpass \? 0\.707 : resonance/, "LP and HP resonance must use the Biquad Q directly");
assert.match(sources.get("effects-output-graph.js"), /bpGain\.gain, isBandpass \? 1 : 0/, "band-pass level must not use cutoff-dependent gain compensation");
assert.match(sources.get("effects-output-graph.js"), /svf: \{ \.\.\.state\.svf \}/, "debug state must expose the applied State Variable VCF parameters");
assert.match(sources.get("audio-engine.js"), /filter\.Q\.value = state\.resonance/, "main resonance must use the base Biquad Q");
assert.match(sources.get("audio-engine.js"), /linearRampToValueAtTime\(0, now \+ release\)/, "release must end at digital silence");
assert.doesNotMatch(sources.get("audio-engine.js"), /linearRampToValueAtTime\(0\.0001, now \+ release\)/, "release must not leave a fixed-pitch oscillator leak");
assert.match(sources.get("audio-engine.js"), /if \(clamp\(state\.sampleHoldPitchMod, "sampleHoldPitchMod"\) > 0\) \{\s+applyVco1Frequency/, "Sample & Hold must not automate the A oscillator when pitch amount is zero");
assert.match(sources.get("audio-engine.js"), /triggerFilterEnvelopeOn\(now\)/, "filter envelope modulation must follow note-on");
assert.match(sources.get("audio-engine.js"), /triggerFilterEnvelopeOff\(now, release\)/, "filter envelope modulation must follow release");
assert.match(sources.get("vco1-visible-controls.js"), /key: "filterEnvelopeMod"/, "the filter AR modulation slider must be visible");
assert.match(sources.get("vco1-visible-controls.js"), /key: "filterExtCv"/, "the filter Ext CV slider must be visible");
assert.match(sources.get("vco1-visible-controls.js"), /\.control\.is-audio-linked > \.knob/, "slider-backed controls must hide decorative knobs");
assert.match(sources.get("audio-engine.js"), /\["track", "Track & Hold"\]/, "Track & Hold mode must be available");
assert.match(sources.get("audio-engine.js"), /sampleHoldGlide: \[0, 1\]/, "Sample & Hold glide must have an engine range");
assert.match(sources.get("audio-engine.js"), /async function triggerSampleHold\(\)/, "manual Sample & Hold capture must reach the engine");
assert.match(sources.get("audio-engine.js"), /if \(state\.sampleHoldMode === "track"\) \{\s+stopSampleHoldTimer\(\)/, "Track & Hold must stop tracking on release");
assert.match(sources.get("vco1-visible-controls.js"), /key: "sampleHoldInput"/, "the Sample & Hold input selector must be visible");
assert.match(sources.get("vco1-visible-controls.js"), /key: "sampleHoldMode"/, "the Sample/Track mode selector must be visible");
assert.match(sources.get("vco1-visible-controls.js"), /key: "sampleHoldGlide"/, "the Sample & Hold glide slider must be visible");
assert.match(sources.get("vco1-visible-controls.js"), /dataset\.sampleHoldTrigger/, "the manual capture button must be installed");
assert.match(sources.get("audio-engine.js"), /vcaEnvelopeMod: 1,/, "the Main VCA envelope must remain audible by default");
assert.match(sources.get("audio-engine.js"), /function getVcaTarget\(envelopeLevel = 1\)/, "the Main VCA controls must share one gain calculation");
assert.match(sources.get("audio-engine.js"), /const extCvScale = 1 \+ clamp\(state\.vcaExtCv, "vcaExtCv"\)/, "the Main VCA Ext CV must scale the gated signal");
assert.match(sources.get("vco1-visible-controls.js"), /key: "vcaInitialLevel"/, "the Main VCA Initial Level slider must be visible");
assert.match(sources.get("vco1-visible-controls.js"), /key: "vcaEnvelopeMod"/, "the Main VCA AR Mod slider must be visible");
assert.match(sources.get("vco1-visible-controls.js"), /key: "vcaExtCv"/, "the Main VCA Ext CV slider must be visible");
assert.match(sources.get("audio-engine.js"), /function setAttenuatorRoute\(channelNumber, patch = \{\}\)/, "attenuator routes must reach the audio engine");
assert.match(sources.get("audio-engine.js"), /source\.connect\(routeNode\.gain\);\s+routeNode\.gain\.connect\(destination\.param\)/, "attenuators must connect a real modulation source through a GainNode to an AudioParam");
assert.match(sources.get("audio-engine.js"), /if \(destination === "mainVca" && tremoloGain\)/, "attenuator VCA modulation must stay downstream of the release gate");
assert.doesNotMatch(sources.get("lfo-shape-controls.js"), /prototype\.createOscillator/, "LFO shape controls must not monkey-patch oscillator creation");
assert.match(sources.get("lfo-shape-controls.js"), /script\.src = "adsr-visible-controls\.js"/, "the LFO bridge must continue the ADSR interface load chain");
assert.match(sources.get("lfo-shape-controls.js"), /if \(document\.readyState === "loading"\)[\s\S]+else \{\s+init\(\)/, "the dynamically loaded LFO bridge must initialize after DOMContentLoaded");
assert.match(sources.get("audio-engine.js"), /applyLfoShape\("lfo1"\)/, "LFO-1 shape must be owned by the engine");
assert.match(sources.get("audio-engine.js"), /applyLfoShape\("lfo2"\)/, "LFO-2 shape must be owned by the engine");
assert.match(sources.get("audio-engine.js"), /function applyAuxVcaRouting\(\)/, "AUX VCA must own an explicit route");
assert.match(sources.get("audio-engine.js"), /if \(state\.auxVcaDestination === "mainVca"\) return mainVca/, "AUX VCA must route through the release-controlled Main VCA");
assert.match(sources.get("audio-engine.js"), /const cvOffset = usesBipolarCv \? cvAmount \/ 2 : 0/, "AUX VCA bipolar CV sources must be shifted into a non-negative gain range");
assert.match(sources.get("vco1-visible-controls.js"), /key: "repeatGateTarget"/, "Repeat Gate target selection must be visible");
assert.match(sources.get("audio-engine.js"), /state\.repeatGateTarget === "sampleHold"/, "Repeat Gate must be able to trigger Sample & Hold");
assert.match(sources.get("audio-engine.js"), /merrinlab:gate-state/, "the envelope interface must receive gate state");
assert.match(sources.get("audio-engine.js"), /function createVcoProcessor\(oscillatorNode, outputGain, config\)/, "all VCOs must use the explicit processor path");
assert.match(sources.get("audio-engine.js"), /pitchGain\.connect\(oscillatorNode\.detune\)/, "VCO pitch modulation must reach oscillator detune");
assert.match(sources.get("audio-engine.js"), /linearFmGain\.connect\(oscillatorNode\.frequency\)/, "VCO linear FM must reach oscillator frequency");
assert.match(sources.get("audio-engine.js"), /pwmGain\.connect\(pulseShaper\)/, "VCO PWM must reach the pulse comparator");
assert.match(sources.get("audio-engine.js"), /pulseShaper\.oversample = "4x"/, "pulse generation must use oversampled shaping");
assert.match(sources.get("audio-engine.js"), /applyAllVcoModulationRoutes\(\)/, "all VCO modulation routes must be installed together");

const midiListeners = new Map();
const midiDocumentListeners = new Map();
const midiCalls = { noteOn: [], noteOff: [], panic: 0 };
const midiDocument = {
  hidden: true,
  addEventListener: (name, listener) => midiDocumentListeners.set(name, listener),
};
const midiWindow = {
  MerrinLabAudio: {
    noteOn: (...args) => midiCalls.noteOn.push(args),
    noteOff: (...args) => midiCalls.noteOff.push(args),
    panic: () => { midiCalls.panic += 1; },
    setParameter: () => {},
    pitchBend: () => {},
  },
  addEventListener: (name, listener) => midiListeners.set(name, listener),
  dispatchEvent: () => {},
};
vm.runInNewContext(midiEngineBridgeSource, { window: midiWindow, document: midiDocument, CustomEvent: class {} });
const midiMessage = midiListeners.get("merrinlab-midi");
midiMessage({ detail: [0x90, 60, 100] });
assert.equal(midiCalls.noteOn.length, 0, "a hidden synth tab must ignore MIDI note-on messages");
midiDocumentListeners.get("visibilitychange")();
assert.equal(midiCalls.panic, 1, "a synth tab must panic-silence itself when it becomes hidden");
midiDocument.hidden = false;
midiMessage({ detail: [0x90, 60, 100] });
assert.equal(midiCalls.noteOn.length, 1, "the visible synth tab must continue receiving MIDI notes");

const routed = [];
const attenuatorWindow = { MerrinLabAudio: { setAttenuatorRoute: (...args) => routed.push(args) } };
vm.runInNewContext(sources.get("attenuator-bank.js"), { window: attenuatorWindow });
const attenuators = attenuatorWindow.MerrinLabAttenuators;
assert.equal(attenuators.getState().length, 6, "the attenuator bank must expose six channels");
attenuators.setSource(1, "lfo1");
attenuators.setAmount(1, 0.5);
attenuators.setDestination(1, "filterCutoff");
assert.equal(JSON.stringify(attenuators.getChannel(1)), JSON.stringify({ channel: 1, source: "lfo1", amount: 0.5, destination: "filterCutoff" }), "an attenuator must store a real source, amount and destination route");
assert.equal(routed.at(-1)[0], 1, "attenuator channel updates must reach the same engine channel");
assert.equal(routed.at(-1)[1].destination, "filterCutoff", "attenuator destination updates must reach the engine");

const index = await readFile(join(previewDirectory.pathname, "index.html"), "utf8");
const entryScripts = [...index.matchAll(/<script\s+src="([^"]+)"/g)].map((match) => match[1]);
const reachableScripts = new Set(entryScripts);
const pendingScripts = [...entryScripts];
while (pendingScripts.length) {
  const filename = pendingScripts.shift();
  const source = sources.get(filename) || "";
  for (const match of source.matchAll(/script\.src\s*=\s*"([^"]+)"/g)) {
    const dependency = match[1];
    assert.ok(sources.has(dependency), `${filename} must only load an existing script (${dependency})`);
    if (!reachableScripts.has(dependency)) {
      reachableScripts.add(dependency);
      pendingScripts.push(dependency);
    }
  }
}
for (const requiredScript of ["lfo-shape-controls.js", "adsr-visible-controls.js", "envelope-mode-visible-controls.js", "envelope-io-controls.js"]) {
  assert.ok(reachableScripts.has(requiredScript), `${requiredScript} must remain reachable from index.html`);
}
const sampleHoldMarkup = index.match(/<article class="module sample-hold-module">([\s\S]*?)<\/article>/)?.[1] || "";
assert.doesNotMatch(sampleHoldMarkup, /class="knob/, "the Sample & Hold module must not render decorative dials");
const vcoBankMarkup = index.match(/<section class="vco-bank"[^>]*>([\s\S]*?)<\/section>/)?.[1] || "";
assert.doesNotMatch(vcoBankMarkup, /class="(?:knob|jack|switch-control)/, "the VCO bank must not render decorative dials, sockets or switches");
assert.equal((vcoBankMarkup.match(/Pitch Mod Source/g) || []).length, 3, "each VCO must expose a live pitch modulation source");
assert.equal((vcoBankMarkup.match(/Linear FM Source/g) || []).length, 3, "each VCO must expose a live linear FM source");
assert.equal((vcoBankMarkup.match(/PWM Source/g) || []).length, 3, "each VCO must expose a live PWM source");
assert.doesNotMatch(vcoBankMarkup, />SYNC</, "unsupported hard-sync must not be presented as a functional control");
const mainVcaMarkup = index.match(/<article class="module main-vca-module[^"]*">([\s\S]*?)<\/article>/)?.[1] || "";
assert.doesNotMatch(mainVcaMarkup, /class="(?:knob|jack)/, "the Main VCA module must not render decorative dials or jacks");
const attenuatorMarkup = index.match(/<article class="module attenuators-module[^"]*">([\s\S]*?)<\/article>/)?.[1] || "";
assert.doesNotMatch(attenuatorMarkup, /class="(?:knob|jack)/, "the attenuator bank must not render decorative dials or jacks");
assert.equal((attenuatorMarkup.match(/data-attenuator-source=/g) || []).length, 6, "the attenuator bank must expose six source selectors");
assert.equal((attenuatorMarkup.match(/data-attenuator-amount=/g) || []).length, 6, "the attenuator bank must expose six amount sliders");
assert.equal((attenuatorMarkup.match(/data-attenuator-destination=/g) || []).length, 6, "the attenuator bank must expose six destination selectors");
assert.doesNotMatch(attenuatorMarkup, /data-attenuator-input=/, "the attenuator bank must not expose a fake manual input calculator");
const auxVcaMarkup = index.match(/<article class="module aux-vca-module[^>]*>([\s\S]*?)<\/article>/)?.[1] || "";
assert.doesNotMatch(auxVcaMarkup, /class="(?:knob|jack)/, "the AUX VCA must not render decorative dials or jacks");
const stateVariableVcfMarkup = index.match(/<article class="module utility-module state-variable-vcf-module"[^>]*>([\s\S]*?)<\/article>/)?.[1] || "";
assert.ok(stateVariableVcfMarkup, "the State Variable VCF module must remain present");
assert.doesNotMatch(stateVariableVcfMarkup, /class="(?:knob|jack)/, "the State Variable VCF must not render decorative dials or jacks");
assert.equal((stateVariableVcfMarkup.match(/data-svf-control=/g) || []).length, 5, "the State Variable VCF must expose exactly five live controls");
assert.match(stateVariableVcfMarkup, /max="12"[^>]*data-svf-control="resonance"/, "State Variable VCF resonance must use the visible 0–12 range");
assert.match(stateVariableVcfMarkup, /Main bus[\s\S]*data-svf-path-mode[\s\S]*Master/, "the fixed State Variable VCF signal path must be visible");
assert.match(stateVariableVcfMarkup, /data-svf-meter/, "the State Variable VCF must expose a real wet-output meter");
assert.doesNotMatch(sources.get("state-variable-vcf-layer.js"), /svf-floating-monitor|localStorage|AudioNode\.prototype/, "the State Variable VCF interface must not create a floating monitor or patch the audio graph");
assert.match(sources.get("state-variable-vcf-layer.js"), /widthInput\.disabled = !isBandpass/, "BP Width must be disabled outside band-pass mode");
const lfoMarkup = index.match(/<article class="module lfo-module lfo1-module[^>]*>([\s\S]*?)<\/article>/)?.[1] || "";
assert.doesNotMatch(lfoMarkup, /class="(?:knob|jack)/, "LFO modules must use live controls rather than decorative dials or jacks");
const adsrMarkup = index.match(/<article class="module adsr-module[^>]*>([\s\S]*?)<\/article>/)?.[1] || "";
assert.doesNotMatch(adsrMarkup, /class="(?:knob|jack)/, "the ADSR module must use live sliders and buttons rather than decorative dials or jacks");
assert.ok(index.indexOf('src="attenuator-bank.js"') < index.indexOf('src="attenuator-visible-controls.js"'), "the attenuator engine must load before its interface");
assert.ok(index.indexOf('src="effects-output-graph.js"') < index.indexOf('src="audio-engine.js"'), "the graph must load before the engine");
assert.doesNotMatch(index, /filter-self-resonance-layer\.js/, "the synthetic resonance layer must stay unloaded");
assert.doesNotMatch(index, /state-variable-vcf-bp-balance-runtime\.js/, "the prototype calibration runtime must stay unloaded");

console.log(`Audio graph checks passed for ${activeScripts.length} active scripts.`);
