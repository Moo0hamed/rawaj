type SoundName = "click" | "win" | "lose" | "pop" | "spin" | "level" | "error";

let ctx: AudioContext | null = null;

const patterns: Record<SoundName, { freq: number; to: number; duration: number; type: OscillatorType }[]> = {
  click: [{ freq: 520, to: 620, duration: 0.08, type: "square" }],
  pop: [{ freq: 700, to: 980, duration: 0.09, type: "triangle" }],
  win: [
    { freq: 523, to: 523, duration: 0.1, type: "square" },
    { freq: 659, to: 659, duration: 0.1, type: "square" },
    { freq: 784, to: 1046, duration: 0.18, type: "square" },
  ],
  lose: [
    { freq: 300, to: 220, duration: 0.16, type: "sawtooth" },
    { freq: 180, to: 120, duration: 0.22, type: "sawtooth" },
  ],
  spin: [{ freq: 200, to: 900, duration: 0.5, type: "triangle" }],
  level: [
    { freq: 523, to: 523, duration: 0.09, type: "triangle" },
    { freq: 784, to: 784, duration: 0.09, type: "triangle" },
    { freq: 1046, to: 1318, duration: 0.22, type: "triangle" },
  ],
  error: [{ freq: 220, to: 160, duration: 0.14, type: "square" }],
};

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    ctx = ctx ?? new AudioCtor();
    if (ctx.state === "suspended") void ctx.resume();

    let offset = 0;
    for (const note of patterns[name]) {
      const start = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = note.type;
      osc.frequency.setValueAtTime(note.freq, start);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, note.to), start + note.duration);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.045, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + note.duration + 0.02);
      offset += note.duration * 0.85;
    }
  } catch {
    /* الصوت اختياري ولا يجب أن يكسر التجربة */
  }
}
