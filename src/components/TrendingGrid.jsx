import React from 'react';
import { Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrendingGrid({ songs = [], onPlay, favorites = [], toggleFavorite }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-6 sm:grid-cols-3 md:grid-cols-4">
      {songs.map((song) => {
        const liked = favorites.includes(song.id);
        return (
          <motion.div
            key={song.id}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-sky-500/20 bg-white/5 shadow-xl shadow-sky-500/10 backdrop-blur-sm"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img src={song.poster} alt={song.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(0,198,255,0.35) 0%, rgba(0,114,255,0.25) 50%, rgba(0,114,255,0.0) 100%)' }} />
            </div>
            <div className="absolute inset-x-0 bottom-0 space-y-2 p-3">
              <div className="text-sm font-semibold text-slate-100">{song.title}</div>
              <div className="text-xs text-slate-300">{song.artist}</div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => onPlay?.(song)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/20"
                >
                  <Play className="h-4 w-4" /> Preview
                </button>
                <button
                  onClick={() => toggleFavorite?.(song.id)}
                  className={`ml-auto inline-flex items-center rounded-xl border px-2.5 py-2 text-xs font-medium transition ${
                    liked ? 'border-sky-500/40 bg-sky-500/10 text-sky-300' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`mr-1 h-4 w-4 ${liked ? 'fill-sky-400 text-sky-400' : ''}`} /> {liked ? 'Saved' : 'Favorite'}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
