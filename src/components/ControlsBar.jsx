import React from 'react';
import { Globe, Moon, Sun, Share2, Heart } from 'lucide-react';

export default function ControlsBar({ theme, setTheme, language, setLanguage, favorites = [] }) {
  const isDark = theme !== 'light';

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(language === 'en' ? 'te' : 'en');

  const onShare = async () => {
    const data = {
      title: 'Telugu Beats',
      text: 'Discover Telugu songs by mood, artist, or vibe on Telugu Beats',
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch {}
    } else {
      try { await navigator.clipboard.writeText(data.url); } catch {}
      alert('Link copied!');
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-2 text-slate-200">
          <span className="text-sm font-semibold">Telugu Beats</span>
          <span className="mx-2 h-1.5 w-1.5 rounded-full bg-sky-400/80" />
          <span className="text-xs text-slate-400">Glow Edition</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleLanguage} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">
            <Globe className="h-4 w-4" /> {language === 'en' ? 'English' : 'తెలుగు'}
          </button>
          <button onClick={toggleTheme} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {isDark ? 'Light' : 'Dark'}
          </button>
          <div className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs text-sky-300">
            <Heart className="h-4 w-4" /> {favorites.length}
          </div>
          <button onClick={onShare} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
