import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX, Repeat, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// A real-time audio player with seek, volume, and a live visualizer using Web Audio API
const AudioPlayer = ({ track, onClose, onEnded }) => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const ctxRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 - 1
  const [time, setTime] = useState({ cur: 0, dur: 0 });
  const [volume, setVolume] = useState(0.9);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);

  const timeFmt = (sec) => {
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Setup audio element when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(0);
    setTime({ cur: 0, dur: 0 });
    setPlaying(false);
    if (!track?.preview) return;
    audio.src = track.preview;
    audio.loop = loop;
    audio.volume = muted ? 0 : volume;
    audio.currentTime = 0;
    const onLoaded = () => {
      setTime((t) => ({ ...t, dur: audio.duration || 0 }));
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    audio.addEventListener('loadedmetadata', onLoaded);
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [track]);

  // Handle loop, mute, volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = loop;
  }, [loop]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);
  useEffect(() => {
    if (audioRef.current && !muted) audioRef.current.volume = volume;
  }, [volume, muted]);

  // Progress/time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      const cur = audio.currentTime || 0;
      const dur = audio.duration || 0;
      setTime({ cur, dur });
      setProgress(dur ? cur / dur : 0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
      onEnded?.();
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
    };
  }, [onEnded]);

  // Visualizer
  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const actx = new AudioCtx();
    const analyser = actx.createAnalyser();
    analyser.fftSize = 256;

    const source = actx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(actx.destination);

    analyserRef.current = analyser;
    sourceRef.current = source;
    ctxRef.current = actx;

    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const barWidth = (width / bufferLength) * 1.8;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255; // 0..1
        const barHeight = v * height;
        const hue = 260 - i; // purple-blue-ish
        ctx.fillStyle = `hsla(${hue}, 90%, ${50 + v * 20}%, 0.9)`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      try {
        source.disconnect();
        analyser.disconnect();
      } catch {}
      actx.close();
    };
  }, [track]);

  const seek = (p) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;
    audio.currentTime = p * audio.duration;
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  };

  const VolIcon = muted || volume === 0 ? VolumeX : Volume2;

  if (!track) return null;

  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 z-50 w-[92%] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur md:w-[840px]"
        >
          <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
            <img src={track.cover} alt="" className="h-14 w-14 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{track.title}</div>
              <div className="truncate text-xs text-white/70">{track.artist} • {track.album}</div>
              {!track.preview && (
                <div className="mt-1 text-[11px] text-rose-300/80">Preview unavailable — demo track only.</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggle} className="rounded-xl bg-white/90 p-2 text-black hover:bg-white">
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button onClick={() => setLoop((l) => !l)} className={`rounded-xl p-2 ${loop ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'}`}>
                <Repeat className="h-5 w-5" />
              </button>
              <button onClick={onClose} className="rounded-xl p-2 text-white/80 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 p-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="range"
                min={0}
                max={1000}
                value={Math.round(progress * 1000)}
                onChange={(e) => seek(Number(e.target.value) / 1000)}
                className="w-full accent-white"
              />
              <div className="mt-1 flex justify-between text-[11px] text-white/70">
                <span>{timeFmt(time.cur)}</span>
                <span>{timeFmt(time.dur)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMuted((m) => !m)} className="rounded-xl p-2 text-white/80 hover:bg-white/10">
                <VolIcon className="h-5 w-5" />
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : Math.round(volume * 100)}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="w-28 accent-white"
              />
            </div>
          </div>

          <div className="h-16 w-full border-t border-white/10 bg-black/30">
            <canvas ref={canvasRef} className="h-16 w-full" width={1200} height={64} />
          </div>

          <audio ref={audioRef} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioPlayer;
