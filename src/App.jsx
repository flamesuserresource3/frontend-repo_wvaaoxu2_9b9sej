import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroCover from './components/HeroCover';
import SmartSearch from './components/SmartSearch';
import TrendingGrid from './components/TrendingGrid';
import ControlsBar from './components/ControlsBar';
import AudioPlayer from './components/AudioPlayer';

const seedSongs = [
  {
    id: '1',
    title: 'Inkem Inkem Inkem Kaavaale',
    artist: 'Sid Sriram',
    album: 'Geetha Govindam',
    mood: ['romantic', 'feel-good'],
    cover: 'https://i.scdn.co/image/ab67616d0000b273bfa7630b81b19066e0f2b4a3',
    preview: 'https://cdn.pixabay.com/download/audio/2022/03/01/audio_1a2b.mp3?filename=romantic-preview.mp3',
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
  {
    id: '4',
    title: 'Samajavaragamana',
    artist: 'Sid Sriram',
    album: 'Ala Vaikunthapurramuloo',
    mood: ['melody', 'feel-good'],
    cover: 'https://i.scdn.co/image/ab67616d0000b273f6f3a0e64ea6b2e0d69f3f93',
    preview: '',
  },
];

const sections = [
  { key: 'feel-good', title: 'Feel-Good Vibes' },
  { key: 'romantic', title: 'Heart Touching Melodies' },
  { key: 'mass', title: 'Mass Beats' },
  { key: 'fresh', title: 'Fresh Releases' },
];

export default function App() {
  const [theme, setTheme] = useState('system');
  const [lang, setLang] = useState('en');
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [playSong, setPlaySong] = useState(null);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const root = window.document.documentElement;
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (t) => {
      const isDark = t === 'dark' || (t === 'system' && darkQuery.matches);
      root.classList.toggle('dark', isDark);
    };
    apply(theme);
    const onChange = () => apply('system');
    darkQuery.addEventListener('change', onChange);
    return () => darkQuery.removeEventListener('change', onChange);
  }, [theme]);

  const handleFav = (song) => {
    setFavorites((prev) => {
      const exists = prev.find((s) => s.id === song.id);
      if (exists) return prev.filter((s) => s.id !== song.id);
      return [song, ...prev];
    });
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'Telugu Beats',
      text: 'Discover Telugu songs by emotion — Telugu Beats',
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else alert('Copy link: ' + shareData.url);
    } catch (e) {
      console.error(e);
    }
  };

  const categorized = React.useMemo(() => {
    const map = {
      'feel-good': [],
      romantic: [],
      mass: [],
      fresh: [],
    };
    seedSongs.forEach((s) => {
      if ((s.mood || []).includes('feel-good')) map['feel-good'].push(s);
      if ((s.mood || []).includes('romantic')) map['romantic'].push(s);
      if ((s.mood || []).includes('mass')) map['mass'].push(s);
      map['fresh'].push(s);
    });
    return map;
  }, []);

  // Start playing a selected song in the real-time player
  const startPreview = (song) => {
    setPlaySong(song);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
        <HeroCover
          onExplore={() => {
            const el = document.getElementById('discover');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          lang={lang}
        />

        <div id="discover" className="space-y-6">
          <ControlsBar
            theme={theme}
            setTheme={setTheme}
            lang={lang}
            setLang={setLang}
            favorites={favorites}
            onShare={handleShareApp}
          />

          <SmartSearch onResults={setResults} />

          <AnimatePresence>
            {results && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-3"
              >
                <div className="text-sm font-semibold text-white/80">Instant results</div>
                <TrendingGrid title="Results" songs={results} onPlay={startPreview} onFav={handleFav} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-10">
            {sections.map((sec) => (
              <motion.div
                key={sec.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingGrid
                  title={sec.title}
                  songs={categorized[sec.key] || []}
                  onPlay={startPreview}
                  onFav={handleFav}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AudioPlayer
        track={playSong}
        onClose={() => setPlaySong(null)}
        onEnded={() => setPlaySong(null)}
      />
    </div>
  );
}
