import { useEffect, useRef } from "react";

export const useOmnitrixSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playInitSound = () => {
    try {
      // Create audio context on demand (required for browser autoplay policies)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      
      // Create oscillators for sci-fi sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      // Setup filter for that electronic feel
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 1.5);
      
      // First oscillator - base tone
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.exponentialRampToValueAtTime(440, now + 0.5);
      osc1.frequency.exponentialRampToValueAtTime(330, now + 1);
      
      // Second oscillator - harmonics
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(880, now + 0.5);
      osc2.frequency.exponentialRampToValueAtTime(660, now + 1);
      
      // Gain envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gainNode.gain.setValueAtTime(0.15, now + 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2);
      
      // Connect nodes
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Start and stop
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2);
      osc2.stop(now + 2);
      
      // Add a power-up sweep
      setTimeout(() => {
        const sweepOsc = ctx.createOscillator();
        const sweepGain = ctx.createGain();
        
        sweepOsc.type = "sawtooth";
        sweepOsc.frequency.setValueAtTime(100, ctx.currentTime);
        sweepOsc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
        
        sweepGain.gain.setValueAtTime(0.08, ctx.currentTime);
        sweepGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        sweepOsc.connect(sweepGain);
        sweepGain.connect(ctx.destination);
        
        sweepOsc.start();
        sweepOsc.stop(ctx.currentTime + 0.3);
      }, 300);
      
    } catch (error) {
      // console.log("Audio not supported:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { playInitSound };
};
