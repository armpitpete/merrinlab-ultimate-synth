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
assert.match(sources.get("audio-engine.js"), /if \(!audioContext \|\| !isSampleHoldActive\(\)\) return;/, "inactive Sample & Hold must not automate the A oscillator");

const index = await readFile(join(previewDirectory.pathname, "index.html"), "utf8");
assert.ok(index.indexOf('src="effects-output-graph.js"') < index.indexOf('src="audio-engine.js"'), "the graph must load before the engine");
assert.doesNotMatch(index, /filter-self-resonance-layer\.js/, "the synthetic resonance layer must stay unloaded");
assert.doesNotMatch(index, /state-variable-vcf-bp-balance-runtime\.js/, "the prototype calibration runtime must stay unloaded");

console.log(`Audio graph checks passed for ${activeScripts.length} active scripts.`);
