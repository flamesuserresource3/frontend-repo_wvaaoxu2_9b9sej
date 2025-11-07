import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX, RotateCcw, X } from 'lucide-react';

export default function AudioPlayer({ track, onClose }) {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [vol, setVol] = useState(0.9);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!track) return;
    const audio = audioRef.current;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const src = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext('2d');
      const { width, height } = canvas;
      c.clearRect(0, 0, width, height);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const barWidth = (width / bufferLength) * 1.5;
      for (let i = 0, x = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255;
        const barHeight = v * height;
        const grad = c.createLinearGradient(0, height - barHeight, 0, height);
        grad.addColorStop(0, '#00C6FF');
        grad.addColorStop(1, '#0072FF');
        c.fillStyle = grad;
        c.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      try { ctx.close(); } catch {}
    };
  }, [track]);

  useEffect(() => {
    if (!track) return;
    const audio = audioRef.current;
    const onTime = () => setTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnd = () => onClose?.();
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnd);
    audio.volume = vol;
    audio.loop = loop;
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnd);
    };
  }, [track, onClose, vol, loop]);

  useEffect(() => {
    if (track) {
      setPlaying(true);
      const audio = audioRef.current;
      audio.play().catch(() => setPlaying(false));
    }
  }, [track]);

  if (!track) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const fmt = (s) => {
    if (!s && s !== 0) return '0:00';
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto mb-4 w-[95%] max-w-4xl overflow-hidden rounded-2xl border border-sky-500/30 bg-black/80 shadow-[0_0_30px_rgba(0,114,255,0.35)] backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="flex items-center gap-3">
            <img src={track.poster} alt={track.title} className="h-14 w-14 rounded-md object-cover" />
            <div>
              <div className="text-sm font-semibold text-slate-100">{track.title}</div>
              <div className="text-xs text-slate-400">{track.artist}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <canvas ref={canvasRef} width={600} height={60} className="w-full rounded-md bg-gradient-to-r from-white/0 to-white/0" />
            <div className="flex items-center gap-3">
              <button onClick={toggle} className="rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] p-2 text-white">
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={time}
                onChange={(e) => {
                  const t = Number(e.target.value);
                  setTime(t);
                  audioRef.current.currentTime = t;
                }}
                className="w-full accent-sky-500"
              />
              <div className="text-xs tabular-nums text-slate-300">
                {fmt(time)} / {fmt(duration)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setLoop((v) => !v)} className={`rounded-lg px-2 py-2 text-xs ${loop ? 'bg-sky-500/20 text-sky-300' : 'bg-white/5 text-slate-200'}`}>
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={() => setMuted((m) => { const nv = !m; audioRef.current.muted = nv; return nv; })} className="rounded-lg bg-white/5 px-2 py-2 text-slate-200">
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={vol}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVol(v);
                audioRef.current.volume = v;
              }}
              className="w-24 accent-sky-500"
            />
            <button onClick={onClose} className="rounded-lg bg-white/5 px-2 py-2 text-slate-200">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <audio ref={audioRef} src={track.previewUrl} preload="metadata" />
      </div>
    </div>
  );
}
