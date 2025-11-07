import React, { useEffect, useMemo, useState } from 'react';
import HeroCover from './components/HeroCover';
import SmartSearch from './components/SmartSearch';
import TrendingGrid from './components/TrendingGrid';
import ControlsBar from './components/ControlsBar';
import AudioPlayer from './components/AudioPlayer';

const seedSongs = [
  {
    id: '1',
    title: 'Samajavaragamana',
    artist: 'Sid Sriram',
    mood: 'romantic',
    poster: 'https://i.imgur.com/o0fE3oB.jpeg',
    previewUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_5c9d7c.mp3?filename=glorious-epic-109726.mp3',
  },
  {
    id: '2',
    title: 'Butta Bomma',
    artist: 'Armaan Malik',
    mood: 'dance',
    poster: 'https://i.imgur.com/5H0o2fN.jpeg',
    previewUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_3b5f9e.mp3?filename=sport-112191.mp3',
  },
  {
    id: '3',
    title: 'Srivalli',
    artist: 'Sid Sriram',
    mood: 'melody',
    poster: 'https://i.imgur.com/2qB3fXU.jpeg',
    previewUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c6b1c1.mp3?filename=epic-cinematic-trailer-112199.mp3',
  },
  {
    id: '4',
    title: 'Ramuloo Ramulaa',
    artist: 'Anurag Kulkarni, Mangli',
    mood: 'party',
    poster: 'https://i.imgur.com/7nQ1j0D.jpeg',
    previewUrl: 'https://cdn.pixabay.com/download/audio/2021/11/16/audio_3b6a5b.mp3?filename=emotional-cinematic-epic-10963.mp3',
  },
];

export default function App() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [songs] = useState(seedSongs);
  const [results, setResults] = useState(seedSongs);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]'); } catch { return []; }
  });
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const displayed = useMemo(() => results, [results]);

  return (
    <div className="min-h-screen bg-black text-slate-100">
      <ControlsBar theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} favorites={favorites} />

      <HeroCover title={language === 'te' ? 'తెలుగు బీట్స్' : 'Telugu Beats'} subtitle={language === 'te' ? 'మూడ్, గాయకుడు లేదా వైబ్ ద్వారా పాటలను కనుగొనండి' : 'Discover Telugu songs by mood, artist, or vibe'} />

      <div className="-mt-10 flex w-full justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-sky-500/20 bg-black/60 p-3 shadow-[0_0_40px_rgba(0,114,255,0.35)] backdrop-blur-xl">
          <SmartSearch songs={songs} onResults={setResults} language={language} />
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] bg-clip-text text-2xl font-bold text-transparent">{language === 'te' ? 'ట్రెండింగ్ పాటలు' : 'Trending Songs'}</h2>
          <span className="text-xs text-slate-400">{displayed.length} {language === 'te' ? 'ఫలితాలు' : 'results'}</span>
        </div>
        <TrendingGrid songs={displayed} onPlay={setCurrent} favorites={favorites} toggleFavorite={toggleFavorite} />
      </div>

      {current && <AudioPlayer track={current} onClose={() => setCurrent(null)} />}
    </div>
  );
}
