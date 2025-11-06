import React from 'react';
import { Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const moodGradients = {
  'feel-good': 'from-emerald-500/70 via-teal-400/60 to-cyan-500/70',
  romantic: 'from-pink-500/70 via-rose-400/60 to-fuchsia-500/70',
  mass: 'from-yellow-500/70 via-orange-500/60 to-red-500/70',
  melody: 'from-indigo-500/70 via-blue-500/60 to-violet-500/70',
  fresh: 'from-sky-500/70 via-cyan-400/60 to-teal-500/70',
};

const Card = ({ song, onPlay, onFav }) => {
  const mood = (song.mood && song.mood[0]) || 'fresh';
  const grad = moodGradients[mood] || moodGradients.fresh;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${grad} opacity-20`} />
      <img src={song.cover} alt={song.title} className="h-40 w-full object-cover" />
      <div className="flex items-start gap-3 p-3">
        <img src={song.cover} alt="" className="h-12 w-12 rounded-md object-cover" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">{song.title}</div>
          <div className="truncate text-xs text-white/70">{song.artist} • {song.album}</div>
        </div>
        <button onClick={() => onFav(song)} className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white">
          <Heart className="h-5 w-5" />
        </button>
      </div>
      <div className="p-3 pt-0">
        <button
          onClick={() => onPlay(song)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-black transition hover:bg-white"
        >
          <Play className="h-4 w-4" /> Preview
        </button>
      </div>
    </motion.div>
  );
};

const TrendingGrid = ({ title, songs, onPlay, onFav }) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {songs.map((s) => (
          <Card key={s.id} song={s} onPlay={onPlay} onFav={onFav} />
        ))}
      </div>
    </section>
  );
};

export default TrendingGrid;
