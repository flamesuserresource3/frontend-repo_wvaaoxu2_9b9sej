import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Search } from 'lucide-react';

export default function SmartSearch({ songs = [], onResults, language = 'en' }) {
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = language === 'te' ? 'te-IN' : 'en-US';
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setQuery(transcript);
      };
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
    }
  }, [language]);

  useEffect(() => {
    const normalized = query.toLowerCase().trim();
    const res = songs.filter((s) =>
      [s.title, s.artist, s.mood].some((f) => (f || '').toLowerCase().includes(normalized))
    );
    onResults?.(res);
  }, [query, songs, onResults]);

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return songs
      .filter((s) => [s.title, s.artist, s.mood].some((f) => (f || '').toLowerCase().includes(q)))
      .slice(0, 6);
  }, [query, songs]);

  const onVoice = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md">
        <Search className="h-5 w-5 text-sky-300" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={language === 'te' ? 'పాటలు, గాయకులు లేదా మూడ్ కోసం వెతకండి' : 'Search songs, artists, or mood'}
          className="w-full bg-transparent px-2 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          onClick={onVoice}
          className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            listening ? 'bg-sky-500/20 text-sky-300' : 'bg-white/5 text-slate-200 hover:bg-white/10'
          }`}
        >
          <Mic className="mr-1 inline h-4 w-4" /> {listening ? (language === 'te' ? 'వింటుంది…' : 'Listening…') : (language === 'te' ? 'వాయిస్' : 'Voice')}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => setQuery(s.title)}
              className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left last:border-none hover:bg-white/5"
            >
              <img src={s.poster} alt={s.title} className="h-10 w-10 rounded object-cover" />
              <div>
                <div className="text-sm font-semibold text-slate-100">{s.title}</div>
                <div className="text-xs text-slate-400">{s.artist} • {s.mood}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
