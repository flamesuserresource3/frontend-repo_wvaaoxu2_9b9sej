import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Mic, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const suggestionsBase = [
  'Arijit Singh',
  'Sid Sriram',
  'SPB',
  'Devi Sri Prasad',
  'Pawan Kalyan',
  'Pushpa',
  'RRR',
  'Baahubali',
  'romantic',
  'sad',
  'mass',
  'melody',
  'dance',
];

const localSongs = [
  {
    id: '1',
    title: 'Inkem Inkem Inkem Kaavaale',
    artist: 'Sid Sriram',
    album: 'Geetha Govindam',
    mood: ['romantic', 'feel-good'],
    cover: 'https://i.scdn.co/image/ab67616d0000b273bfa7630b81b19066e0f2b4a3',
    preview: 'https://p.scdn.co/mp3-preview/36a9b2cfb4b3f1.mp3',
  },
  {
    id: '2',
    title: 'Srivalli',
    artist: 'Javed Ali',
    album: 'Pushpa',
    mood: ['melody', 'romantic'],
    cover: 'https://i.scdn.co/image/ab67616d0000b273a3f2b1b0a7ebf2e6e5132f2d',
    preview: '',
  },
  {
    id: '3',
    title: 'Ramuloo Ramulaa',
    artist: 'Anurag Kulkarni',
    album: 'Ala Vaikunthapurramuloo',
    mood: ['mass', 'dance', 'feel-good'],
    cover: 'https://i.scdn.co/image/ab67616d0000b27342e6f4d2d5d4a1b2989d3d4a',
    preview: '',
  },
];

const SmartSearch = ({ onResults }) => {
  const [q, setQ] = useState('');
  const [list, setList] = useState(localSongs);
  const [loading, setLoading] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = 'te-IN,en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setRecognizing(true);
    rec.onend = () => setRecognizing(false);
    rec.onerror = () => setRecognizing(false);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQ(transcript);
    };
    recRef.current = rec;
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return [];
    return localSongs.filter((s) =>
      [s.title, s.artist, s.album, ...(s.mood || [])]
        .join(' ')
        .toLowerCase()
        .includes(k)
    );
  }, [q]);

  useEffect(() => {
    onResults?.(filtered);
  }, [filtered, onResults]);

  const sug = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return suggestionsBase.slice(0, 6);
    return suggestionsBase.filter((s) => s.toLowerCase().includes(k)).slice(0, 6);
  }, [q]);

  const handleVoice = () => {
    const rec = recRef.current;
    if (!rec) return;
    if (recognizing) rec.stop();
    else rec.start();
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
        <Search className="h-5 w-5 text-white/80" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setListOpen(true)}
          onBlur={() => setTimeout(() => setListOpen(false), 150)}
          placeholder="Search artist, movie, or mood (romantic, mass, sad)"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
        />
        <button
          onClick={handleVoice}
          title="Voice search"
          className={`rounded-xl p-2 transition ${recognizing ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          {recognizing ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Mic className="h-5 w-5 text-white" />}
        </button>
        {q && (
          <button onClick={() => setQ('')} className="rounded-xl p-2 hover:bg-white/10">
            <X className="h-5 w-5 text-white/80" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {listOpen && (sug.length > 0 || filtered.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur"
          >
            {filtered.length > 0 && (
              <div className="divide-y divide-white/5">
                {filtered.map((s) => (
                  <button
                    key={s.id}
                    onMouseDown={() => setQ(s.title)}
                    className="flex w-full items-center gap-3 p-3 text-left hover:bg-white/5"
                  >
                    <img src={s.cover} alt={s.title} className="h-10 w-10 rounded-md object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{s.title}</div>
                      <div className="text-xs text-white/70">{s.artist} • {s.album}</div>
                    </div>
                    <div className="text-[10px] text-white/60">{(s.mood || []).join(' · ')}</div>
                  </button>
                ))}
              </div>
            )}
            <div className="p-2">
              <div className="px-2 pb-1 text-[10px] uppercase tracking-wide text-white/50">Suggestions</div>
              <div className="flex flex-wrap gap-2 p-2">
                {sug.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => setQ(s)}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 hover:bg-white/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;
