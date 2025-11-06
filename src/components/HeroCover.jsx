import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const HeroCover = ({ onExplore, lang }) => {
  const t = {
    en: {
      title: 'Telugu Beats',
      subtitle: 'Emotion-driven song discovery — smart, modern, and personal',
      explore: 'Explore Trending',
      hashtags: '#MassBeat  #RomanticHit  #ChillMood',
    },
    te: {
      title: 'తెలుగు బీట్స్',
      subtitle: 'భావాలకు దగ్గరైన పాటల వెతుకు — స్మార్ట్, మోడర్న్, పర్సనల్',
      explore: 'ట్రెండింగ్ చూడండి',
      hashtags: '#MassBeat  #RomanticHit  #ChillMood',
    },
  }[lang || 'en'];

  return (
    <section className="relative h-[60vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/Z9BMpz-LA54Dlbrj/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Subtle gradient veil to improve text contrast; does not block pointer events */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-end p-6 sm:p-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
        >
          {t.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 max-w-2xl text-base text-white/80 sm:text-lg"
        >
          {t.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center"
        >
          <button
            onClick={onExplore}
            className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black backdrop-blur transition hover:bg-white"
          >
            {t.explore}
          </button>
          <span className="text-sm text-white/70">{t.hashtags}</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroCover;
