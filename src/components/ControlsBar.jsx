import React from 'react';
import { Languages, Sun, Moon, Monitor, Heart, Share2 } from 'lucide-react';

const ControlsBar = ({ theme, setTheme, lang, setLang, favorites, onShare }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10"
        >
          <Languages className="h-4 w-4" /> {lang === 'en' ? 'తెలుగు' : 'English'}
        </button>
        <div className="flex overflow-hidden rounded-xl border border-white/10">
          {[
            { key: 'light', Icon: Sun },
            { key: 'dark', Icon: Moon },
            { key: 'system', Icon: Monitor },
          ].map(({ key, Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`flex items-center gap-2 px-3 py-2 text-sm ${theme === key ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'}`}
            >
              <Icon className="h-4 w-4" /> {key}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm text-white/90">
          <Heart className="h-4 w-4" /> {favorites.length}
        </div>
        <button onClick={onShare} className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-black hover:bg-white">
          <Share2 className="h-4 w-4" /> Share App
        </button>
      </div>
    </div>
  );
};

export default ControlsBar;
