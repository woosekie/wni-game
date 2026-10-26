import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../types/game';
import { StatBar } from './StatBar';
const stickerMap: Record<string, { text: string; bg: string; textCol: string }> = {
  pejabat: { text: 'CUAN RAKYAT!', bg: 'bg-amber-400', textCol: 'text-black' },
  pegawai: { text: 'DEADLINE BOS!', bg: 'bg-sky-400', textCol: 'text-black' },
  pedagang: { text: 'SEGAR & IRIT!', bg: 'bg-emerald-400', textCol: 'text-black' },
  influencer: { text: 'VIRAL GASSS!', bg: 'bg-fuchsia-400', textCol: 'text-black' },
  mahasiswa: { text: 'MERDEKA!', bg: 'bg-orange-500', textCol: 'text-white' },
};

interface CharacterDetailProps {
  character: Character;
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({ character }) => {
  const [imgError, setImgError] = useState(false);
  const displayImage = character.selectedImage || character.image;

  useEffect(() => {
    setImgError(false);
  }, [character.id, displayImage]);

  const formatCurrency = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  const getLuckStars = (luck: Character['stats']['luck']) => {
    switch (luck) {
      case 'Rendah':
        return '★☆☆☆ (Rendah)';
      case 'Sedang':
        return '★★☆☆ (Sedang)';
      case 'Tinggi':
        return '★★★☆ (Tinggi)';
      case 'Sangat Tinggi':
        return '★★★★ (Sangat Tinggi)';
    }
  };

  const sticker = stickerMap[character.id] || { text: 'WNI SEJATI!', bg: 'bg-yellow-400', textCol: 'text-black' };

  return (
    <div className="relative bg-slate-900/90 border-4 border-black rounded-2xl p-4 sm:p-6 shadow-comic-lg overflow-hidden backdrop-blur-sm">
      {/* Background Comic Accents */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: character.color.primary }}
      />
      <div className="absolute inset-0 comic-dots opacity-10 pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={character.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {/* Main Visual & Stats Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual Character Illustration */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[260px] sm:min-h-[320px]">
              {/* Halftone circular frame behind character */}
              <div
                className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border-4 border-black shadow-comic flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${character.color.primary}18` }}
              >
                <div className="absolute inset-0 comic-stripes opacity-20" />
                <div
                  className="w-40 h-40 rounded-full border-2 border-dashed border-black/60"
                  style={{ borderColor: character.color.primary }}
                />
              </div>

              {/* Floating Comic Sticker */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: [-10, 8, -10] }}
                transition={{
                  scale: { duration: 0.3 },
                  rotate: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
                }}
                className={`absolute top-2 right-4 sm:right-6 ${sticker.bg} ${sticker.textCol} font-black text-[11px] sm:text-xs px-3 py-1 rounded-md border-2 border-black shadow-[3px_3px_0px_#000] z-30 transform -rotate-12 select-none`}
              >
                {sticker.text}
              </motion.div>

              {/* Animated Floating Character Card Frame */}
              <motion.div
                animate={{ y: [-6, 6, -6], rotate: [-0.5, 0.5, -0.5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-20 w-56 h-72 sm:w-64 sm:h-80 flex items-center justify-center"
              >
                {!imgError ? (
                  <div className="w-full h-full rounded-2xl border-4 border-black shadow-comic-lg overflow-hidden relative bg-slate-900 group">
                    <img
                      key={displayImage}
                      src={displayImage}
                      alt={character.name}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover object-top select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Comic card bottom gradient & label */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase text-black shadow-[1px_1px_0px_#000]"
                        style={{ backgroundColor: character.color.primary }}
                      >
                        {character.badge}
                      </span>
                      <span className="text-[11px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate max-w-[120px]">
                        {character.name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-slate-800 border-4 border-black shadow-comic flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-6xl mb-2">
                      {character.id === 'pejabat' ? '💰' : character.id === 'pegawai' ? '💼' : character.id === 'pedagang' ? '🥬' : character.id === 'influencer' ? '📱' : '🎓'}
                    </span>
                    <span className="text-xs font-black text-comic-yellow uppercase break-all">
                      {displayImage}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      File gambar karakter
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Satiric Quote Box moved under character portrait */}
              <div className="relative mt-4 w-full max-w-[260px] sm:max-w-[280px] bg-slate-950/90 border-2 border-black rounded-xl p-2.5 sm:p-3 shadow-[3px_3px_0px_#000] z-20">
                <p className="text-[11px] sm:text-xs text-slate-300 italic font-medium leading-relaxed text-center">
                  "{character.quote.replace(/^"|"$/g, '')}"
                </p>
              </div>
            </div>

            {/* Stats & Progress Bars Section */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="bg-slate-950/70 border-3 border-black rounded-xl p-4 shadow-[4px_4px_0px_#000] space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Status Awal Kehidupan
                  </span>
                  <span className="text-xs font-bold text-comic-yellow">
                    Kondisi Awal Game
                  </span>
                </div>

                {/* 1. Uang Awal */}
                <StatBar
                  label="Uang Awal"
                  sublabel="Modal Tunai"
                  value={character.stats.uangAwal}
                  max={10000000}
                  displayValue={formatCurrency(character.stats.uangAwal)}
                  colorScheme="gold"
                />

                {/* 2. Kesehatan */}
                <StatBar
                  label="Kesehatan"
                  sublabel="Fisik & Stamina"
                  value={character.stats.kesehatan}
                  max={100}
                  displayValue={`${character.stats.kesehatan} / 100`}
                  colorScheme="emerald"
                />

                {/* 3. Mental */}
                <StatBar
                  label="Kesehatan Mental"
                  sublabel="Kewarasan"
                  value={character.stats.mental}
                  max={100}
                  displayValue={`${character.stats.mental} / 100`}
                  colorScheme="sky"
                />

                {/* 4. Luck Level */}
                <div className="pt-1 flex items-center justify-between text-xs sm:text-sm font-bold bg-slate-900/80 px-3 py-2 rounded-lg border border-black/80">
                  <span className="text-slate-300 uppercase tracking-wider font-extrabold text-xs">
                    Tingkat Keberuntungan:
                  </span>
                  <span className="text-amber-300 font-black tracking-wide">
                    {getLuckStars(character.stats.luck)}
                  </span>
                </div>
              </div>

              {/* Buff & Debuff Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Buff (Hijau) */}
                <div className="bg-emerald-950/40 border-2 sm:border-3 border-emerald-500 rounded-xl p-3 sm:p-3.5 shadow-[3px_3px_0px_#059669] flex flex-col justify-between">
                  <div>
                    <div className="text-emerald-400 font-black text-xs uppercase mb-1.5">
                      BUFF SPESIAL
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white mb-1">
                      {character.buff.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-emerald-200/90 leading-relaxed">
                      {character.buff.description}
                    </p>
                  </div>
                </div>

                {/* Debuff (Merah) */}
                <div className="bg-rose-950/40 border-2 sm:border-3 border-rose-500 rounded-xl p-3 sm:p-3.5 shadow-[3px_3px_0px_#DC2626] flex flex-col justify-between">
                  <div>
                    <div className="text-rose-400 font-black text-xs uppercase mb-1.5">
                      DEBUFF BAHAYA
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white mb-1">
                      {character.debuff.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-rose-200/90 leading-relaxed">
                      {character.debuff.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
