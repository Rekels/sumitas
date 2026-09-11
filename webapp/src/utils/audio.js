// Simple Web Audio API Synthesizer for mobile-friendly, instant feedback sounds
let audioCtx = null;
let isMuted = localStorage.getItem('sumitas_sound_muted') === 'true';

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundMuted() {
  return isMuted;
}

export function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem('sumitas_sound_muted', isMuted ? 'true' : 'false');
  return isMuted;
}

function playTone(freq, type, duration, vol = 0.1) {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Gracefully handle browser audio restrictions
  }
}

export function playPop() {
  playTone(800, 'sine', 0.1, 0.05);
}

export function playSuccess() {
  // Arpegio ascendente alegre
  playTone(440, 'triangle', 0.15, 0.1); // A4
  setTimeout(() => playTone(554.37, 'triangle', 0.15, 0.1), 100); // C#5
  setTimeout(() => playTone(659.25, 'triangle', 0.3, 0.1), 200); // E5
}

export function playError() {
  // Tono suave indicador de error (no estridente para niños)
  playTone(220, 'sine', 0.15, 0.08);
  setTimeout(() => playTone(180, 'sine', 0.2, 0.08), 120);
}

export function playMagic() {
  // Glissando mágico para celebraciones
  let freq = 400;
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      playTone(freq, 'sine', 0.1, 0.05);
      freq += 80;
    }, i * 30);
  }
}

