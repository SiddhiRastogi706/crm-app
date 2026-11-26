// Web Audio API Synthesized Bell Chime Engine (Zero external assets required)

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const isSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem('pulse_sound_enabled');
  return val === null ? true : val === 'true';
};

export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pulse_sound_enabled', enabled ? 'true' : 'false');
};

/**
 * Synthesizes a realistic, high-fidelity crystal bell chime
 * @param type 'urgent' for double high-alert chime, 'ticket' for warm support desk ding-dong
 */
export const playNotificationChime = (type: 'urgent' | 'ticket' | 'default' = 'ticket'): void => {
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseVolume = 0.75; // Clear, loud, audible volume

    if (type === 'urgent') {
      // 🚨 URGENT: Dual-harmonic alert bell chime (Ding-Ding-Dong)
      // Pulse 1 (High Crystal Alert)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now); // C6
      osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.1); // E6
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(baseVolume, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Pulse 2 (Harmonic echo)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.5, now + 0.15); // E6
      osc2.frequency.exponentialRampToValueAtTime(1567.98, now + 0.25); // G6
      gain2.gain.setValueAtTime(0, now + 0.15);
      gain2.gain.linearRampToValueAtTime(baseVolume * 0.9, now + 0.17);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);

      // Pulse 3 (Deep resonant bell sustain)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(880, now + 0.3); // A5
      gain3.gain.setValueAtTime(0, now + 0.3);
      gain3.gain.linearRampToValueAtTime(baseVolume * 0.8, now + 0.34);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.3);
      osc3.stop(now + 1.25);
    } else {
      // 🔔 TICKET / INBOUND EMAIL: Classic two-tone warm reception bell (Ding-Dong)
      // Note 1: Ding (High bell strike)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(784, now); // G5
      osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.08); // B5
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(baseVolume, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.65);

      // Note 2: Dong (Warm resonant sustain)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now + 0.18); // E5
      gain2.gain.setValueAtTime(0, now + 0.18);
      gain2.gain.linearRampToValueAtTime(baseVolume * 0.85, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 1.15);
    }
  } catch (err) {
    console.warn('Audio chime playback notice:', err);
  }
};

// Global auto-listener: Automatically plays bell chime whenever a notification or ticket event fires
if (typeof window !== 'undefined') {
  window.addEventListener('pulse:notification-created', (event: any) => {
    const detail = event?.detail;
    const isUrgent =
      detail?.title?.toLowerCase().includes('urgent') ||
      detail?.message?.toLowerCase().includes('critical') ||
      detail?.message?.toLowerCase().includes('outage');
    playNotificationChime(isUrgent ? 'urgent' : 'ticket');
  });

  window.addEventListener('pulse:ticket-created', (event: any) => {
    const detail = event?.detail;
    const isUrgent = detail?.priority === 'urgent' || detail?.priority === 'high';
    playNotificationChime(isUrgent ? 'urgent' : 'ticket');
  });
}
