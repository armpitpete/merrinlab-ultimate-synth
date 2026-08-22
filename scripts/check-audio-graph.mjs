import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

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

const combinedSource = [...sources.values()].join("\n");
assert.doesNotMatch(combinedSource, /AudioNode\.prototype\.connect\s*=/, "active scripts must not patch AudioNode.connect");
assert.doesNotMatch(combinedSource, /AudioContextClass\.prototype\.(createGain|createBiquadFilter)\s*=/, "active scripts must not patch AudioContext factories");

const destinationConnections = [...combinedSource.matchAll(/\.connect\(context\.destination\)/g)];
assert.equal(destinationConnections.length, 1, "the active graph must own exactly one destination connection");
assert.match(sources.get("effects-output-graph.js"), /limiter\.connect\(context\.destination\)/, "the limiter must own the destination connection");
assert.match(sources.get("audio-engine.js"), /tremoloGain\.connect\(effectsOutputGraph\.input\)/, "the voice must enter the explicit effects graph");
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

const index = await readFile(join(previewDirectory.pathname, "index.html"), "utf8");
const sampleHoldMarkup = index.match(/<article class="module sample-hold-module">([\s\S]*?)<\/article>/)?.[1] || "";
assert.doesNotMatch(sampleHoldMarkup, /class="knob/, "the Sample & Hold module must not render decorative dials");
const mainVcaMarkup = index.match(/<article class="module main-vca-module[^"]*">([\s\S]*?)<\/article>/)?.[1] || "";
assert.doesNotMatch(mainVcaMarkup, /class="(?:knob|jack)/, "the Main VCA module must not render decorative dials or jacks");
assert.ok(index.indexOf('src="effects-output-graph.js"') < index.indexOf('src="audio-engine.js"'), "the graph must load before the engine");
assert.doesNotMatch(index, /filter-self-resonance-layer\.js/, "the synthetic resonance layer must stay unloaded");
assert.doesNotMatch(index, /state-variable-vcf-bp-balance-runtime\.js/, "the prototype calibration runtime must stay unloaded");

console.log(`Audio graph checks passed for ${activeScripts.length} active scripts.`);
