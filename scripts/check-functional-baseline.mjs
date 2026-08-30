import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));
const mustContain = (text, needle, label) => {
  if (!text.includes(needle)) throw new Error(`Missing baseline invariant: ${label}`);
};
const mustNotContain = (text, needle, label) => {
  if (text.includes(needle)) throw new Error(`Forbidden baseline condition: ${label}`);
};

const index = read('faceplate-preview/index.html');
const graph = read('faceplate-preview/effects-output-graph.js');
const delay = read('faceplate-preview/delay-upgrade-layer.js');
const filterRing = read('faceplate-preview/filter-ring-layer.js');
const midiSettings = read('faceplate-preview/midi/midi-settings-panel.js');
const midiBridge = read('faceplate-preview/midi/midi-engine-bridge.js');
const readme = read('README.md');

const requiredModules = [
  'VCO 1',
  'VCO 2',
  'VCO 3',
  'Mixer',
  'Voltage Controlled Lowpass Filter',
  'Sample &amp; Hold',
  'AR Generator',
  'Main VCA',
  'AUX VCA',
  'Low Frequency Osc - 1',
  'Low Frequency Osc - 2',
  'Output Level',
  'ADSR Env. Gen.',
  'Rpt. Gate Rate',
  'Attenuators',
  'State Variable VCF',
  'Signal Mixer',
  'Analog Multiplier',
  'Filter Ring Modulation',
  'CV Inverter',
  'CV Distributor',
  'Ext. Signal Buffer',
  'Envelope Follower',
  'Buffered Outputs',
];
for (const moduleName of requiredModules) mustContain(index, moduleName, `module ${moduleName}`);

const requiredRuntimeScripts = [
  'effects-output-graph.js',
  'audio-engine.js',
  'attenuator-bank.js',
  'midi-runtime-loader.js',
  'vco1-visible-controls.js',
  'attenuator-visible-controls.js',
  'envelope-io-controls.js',
  'first-voice-panel-docking.js',
  'cathedral-reverb-layer.js',
  'signal-mixer-layer.js',
  'filter-ring-layer.js',
];
for (const script of requiredRuntimeScripts) mustContain(index, `src="${script}"`, `runtime script ${script}`);

// Protected output and effects graph.
mustContain(graph, 'input.connect(drive.input)', 'drive first in effects graph');
mustContain(graph, 'drive.output.connect(chorus.input)', 'drive to chorus');
mustContain(graph, 'chorus.output.connect(delay.input)', 'chorus to delay');
mustContain(graph, 'delay.output.connect(reverb.input)', 'delay to reverb');
mustContain(graph, 'reverb.output.connect(svf.input)', 'reverb to SVF');
mustContain(graph, 'masterGain.connect(limiter)', 'master to limiter');
mustContain(graph, 'limiter.connect(context.destination)', 'single protected destination connection');
mustContain(graph, 'destinationConnections: 1', 'single destination ownership record');
mustContain(graph, 'output: { level: 0.08 }', 'bounded output default');
mustContain(graph, 'clamp(state.output.level, 0, 0.16', 'bounded master output');

// Effects remain safe/default-off and delay remains bounded.
mustContain(graph, 'drive: { mix: 0', 'drive default off');
mustContain(graph, 'chorus: { mix: 0', 'chorus default off');
mustContain(graph, 'delay: { mix: 0', 'delay default off');
mustContain(graph, 'reverb: { mix: 0', 'reverb default off');
mustContain(delay, 'const MAX_DELAY_SECONDS = 3', 'delay maximum');
mustContain(delay, 'const MAX_FEEDBACK = 0.85', 'delay feedback maximum');
mustContain(graph, 'createBuffer(2, length, context.sampleRate)', 'stereo reverb impulse');

// MIDI is current-main functionality, not the stale PR #83 foundation.
mustContain(midiSettings, 'navigator.requestMIDIAccess', 'Web MIDI connection');
mustContain(midiBridge, 'audio.noteOn', 'MIDI note on routing');
mustContain(midiBridge, 'audio.noteOff', 'MIDI note off routing');
mustContain(midiBridge, 'audio.pitchBend', 'MIDI pitch bend routing');
mustContain(midiBridge, 'ccMap', 'MIDI CC mapping');

// Filter Ring v0.1 frozen behaviour.
mustContain(index, 'Filter 1 × Filter 2 → Master', 'Filter Ring signal identity');
mustContain(filterRing, 'data-filter-ring-level', 'Filter Ring live control');
mustContain(filterRing, 'setParameter?.("filterRingLevel"', 'Filter Ring audio-engine parameter bridge');
mustContain(index, 'value="0" data-filter-ring-level', 'Filter Ring default off');

// Parked/unaccepted paths must remain out of the production page.
mustNotContain(index, 'filter-self-resonance-layer.js', 'synthetic self-resonance runtime loaded');
mustNotContain(index, 'state-variable-vcf-bp-balance-runtime.js', 'unaccepted BP balance runtime loaded');
if (exists('faceplate-preview/merrinlab-mod-cv-bridge.js')) {
  throw new Error('Unaccepted Sequencer Mod CV bridge must not be present on the Functional Baseline v1.0 production path');
}

// README must describe the real project state.
mustNotContain(readme, 'no audio engine', 'stale README no-audio claim');
mustNotContain(readme, 'no functional controls', 'stale README no-controls claim');
mustContain(readme, 'Functional Baseline v1.0', 'README baseline reference');

console.log('PASS — MerrinLab Ultimate Synth Functional Baseline v1.0 static contract');
