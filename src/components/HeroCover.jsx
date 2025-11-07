import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function HeroCover({ title = 'Telugu Beats', subtitle = 'Discover Telugu songs by mood, artist, or vibe' }) {
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden rounded-b-3xl bg-black">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Z9BMpz-LA54Dlbrj/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Soft gradient overlay to keep 3D visible and interactive */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 max-w-2xl text-balance text-base text-slate-200/90 sm:text-lg"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
