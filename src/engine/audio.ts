// Procedural audio via Web Audio API — no external sound files, matches the
// "no paid services / no external asset dependency" constraint from the brief.
// Dev B owns this: it's pure logic, zero React, zero DOM beyond the AudioContext.
//
// Everything here is lazy — the AudioContext is only created on first user
// gesture (browsers block autoplay otherwise), and every sound is synthesized
// on the fly from oscillators/noise buffers rather than loaded from disk.

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientNodes: { stop: () => void } | null = null;
let ambientOn = false;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noiseBuffer(context: AudioContext, seconds: number): AudioBuffer {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Toggle a low, unsettling ambient room-tone loop — hum + filtered noise + a
 * slow-breathing LFO. Meant to sit under the whole app while it's open. */
export function toggleAmbient(): boolean {
  const context = getCtx();
  if (ambientOn) {
    ambientNodes?.stop();
    ambientNodes = null;
    ambientOn = false;
    return false;
  }

  // Low hum
  const hum = context.createOscillator();
  hum.type = "sine";
  hum.frequency.value = 55;
  const humGain = context.createGain();
  humGain.gain.value = 0.05;

  // Second detuned hum for unease
  const hum2 = context.createOscillator();
  hum2.type = "sine";
  hum2.frequency.value = 55.6;
  const hum2Gain = context.createGain();
  hum2Gain.gain.value = 0.035;

  // Filtered noise bed (room tone)
  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer(context, 4);
  noise.loop = true;
  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 380;
  const noiseGain = context.createGain();
  noiseGain.gain.value = 0.02;

  // Slow LFO breathing the hum's volume, so it doesn't feel static
  const lfo = context.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = context.createGain();
  lfoGain.gain.value = 0.015;
  lfo.connect(lfoGain);
  lfoGain.connect(humGain.gain);

  hum.connect(humGain);
  hum2.connect(hum2Gain);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);

  humGain.connect(masterGain!);
  hum2Gain.connect(masterGain!);
  noiseGain.connect(masterGain!);

  hum.start();
  hum2.start();
  noise.start();
  lfo.start();

  ambientNodes = {
    stop: () => {
      [hum, hum2, lfo].forEach((o) => {
        try {
          o.stop();
        } catch {
          /* already stopped */
        }
      });
      try {
        noise.stop();
      } catch {
        /* already stopped */
      }
    },
  };
  ambientOn = true;
  return true;
}

export function isAmbientOn() {
  return ambientOn;
}

/** Short, low "thud" — played when two evidence cards get connected on the board. */
export function playConnectionThud() {
  const context = getCtx();
  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(140, context.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, context.currentTime + 0.18);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.4, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22);

  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start();
  osc.stop(context.currentTime + 0.25);
}

/** A soft click, used per-character by TypewriterText. Deliberately tiny and
 * high-passed so it reads as a keystroke, not a beep. */
export function playTypeTick() {
  const context = getCtx();
  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer(context, 0.03);
  const filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 2200;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.05, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.03);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain!);
  noise.start();
  noise.stop(context.currentTime + 0.03);
}

/** A single low, dry "stamp"/thump — used when a contradiction is flagged or
 * a theory is submitted, anything that should feel consequential. */
export function playStamp() {
  const context = getCtx();
  const osc = context.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(90, context.currentTime);
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.25, context.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start();
  osc.stop(context.currentTime + 0.13);
}
