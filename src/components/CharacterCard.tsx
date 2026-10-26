import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../types/game';
import { sound } from '../utils/sound';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: (character: Character) => void;
  index: number;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected,
  onSelect,
  index,
}) => {
  const [imgError, setImgError] = useState(false);
  const activeImage = isSelected && character.selectedImage ? character.selectedImage : character.image;

  useEffect(() => {
    setImgError(false);
  }, [activeImage]);

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      const jt = amount / 1000000;
      return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)} Jt`;
    }
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleClick = () => {
    sound.playClick();
    onSelect(character);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`relative group flex flex-col p-2.5 sm:p-3 rounded-2xl border-3 transition-all cursor-pointer text-left w-full h-full ${
        isSelected
          ? 'border-comic-yellow bg-slate-900 shadow-comic-yellow -translate-y-1.5 ring-2 ring-comic-yellow/50'
          : 'border-black bg-slate-900/80 hover:bg-slate-800/95 shadow-comic hover:shadow-comic-lg'
      }`}
    >
      {/* Selected Indicator Ribbon */}
      {isSelected && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-comic-yellow text-black font-black text-[10px] sm:text-[11px] px-3 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] whitespace-nowrap animate-pulse">
            PILIHANMU
          </div>
        </div>
      )}

      {/* Character Portrait Frame */}
      <div
        className="relative w-full aspect-[4/5] rounded-xl border-2 border-black overflow-hidden bg-slate-950 mb-2.5 flex items-center justify-center flex-shrink-0"
        style={{ borderColor: isSelected ? character.color.primary : '#000000' }}
      >
        {/* Subtle delicate tint (reduced from 25% to 4%) */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none z-10"
          style={{ backgroundColor: character.color.primary }}
        />

        {!imgError ? (
          <img
            key={activeImage}
            src={activeImage}
            alt={character.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="z-10 flex flex-col items-center justify-center text-center p-2">
            <span className="text-xs font-black uppercase text-slate-300">
              {character.name}
            </span>
          </div>
        )}

        {/* Role Badge pinned at top-left */}
        <span
          className="absolute top-1.5 left-1.5 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded border border-black uppercase text-black z-20 shadow-[1px_1px_0px_#000]"
          style={{ backgroundColor: character.color.primary }}
        >
          {character.badge}
        </span>
      </div>

      {/* Character Info */}
      <div className="w-full flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-white truncate leading-tight group-hover:text-comic-yellow transition-colors">
            {character.name}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
            {character.roleTitle}
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-800 text-[10px] sm:text-[11px] font-bold">
          <span className="text-amber-300">
            {formatMoney(character.stats.uangAwal)}
          </span>
          <span className="text-sky-300">
            {character.stats.luck}
          </span>
        </div>
      </div>
    </motion.button>
  );
};
