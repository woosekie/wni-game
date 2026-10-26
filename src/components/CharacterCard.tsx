import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../types/game';
import { sound } from '../utils/sound';
import { Wallet, Sparkles, CheckCircle2 } from 'lucide-react';

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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full group text-left relative p-3 sm:p-3.5 rounded-xl border-3 transition-all cursor-pointer ${
        isSelected
          ? 'border-comic-yellow bg-slate-900/95 shadow-comic-yellow translate-x-1'
          : 'border-black bg-slate-900/70 hover:bg-slate-800/90 shadow-comic hover:shadow-comic-lg'
      }`}
    >
      {/* Selected Indicator Ribbon */}
      {isSelected && (
        <div className="absolute -top-3 -right-2 bg-comic-yellow text-black font-black text-[11px] px-2.5 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1 z-20 animate-bounce">
          <CheckCircle2 size={13} className="stroke-[3]" />
          <span>PILIHANMU</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Character Thumbnail */}
        <div
          className={`relative w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 rounded-lg border-2 border-black overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950 p-1 flex items-center justify-center ${
            isSelected ? 'ring-2 ring-comic-yellow' : ''
          }`}
          style={{ borderColor: isSelected ? character.color.primary : '#000000' }}
        >
          {/* Subtle color glow */}
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundColor: character.color.primary }}
          />

          {!imgError ? (
            <img
              src={character.image}
              alt={character.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] z-10 transition-transform group-hover:scale-110"
            />
          ) : (
            <div className="z-10 flex flex-col items-center justify-center text-center">
              <span className="text-2xl">
                {character.id === 'pejabat' ? '💰' : character.id === 'pegawai' ? '💼' : character.id === 'pedagang' ? '🥬' : character.id === 'influencer' ? '📱' : '🎓'}
              </span>
              <span className="text-[9px] font-black uppercase text-slate-300">
                {character.id}
              </span>
            </div>
          )}
        </div>

        {/* Character Quick Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[10px] font-black px-1.5 py-0.5 rounded border border-black uppercase tracking-wider text-black"
              style={{ backgroundColor: character.color.primary }}
            >
              {character.badge}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {character.difficulty}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-white truncate mt-0.5 group-hover:text-comic-yellow transition-colors">
            {character.name}
          </h3>

          <p className="text-[11px] text-slate-400 truncate">
            {character.roleTitle}
          </p>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2.5 mt-1.5 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-amber-300">
              <Wallet size={12} className="stroke-[2.5]" />
              {formatMoney(character.stats.uangAwal)}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-sky-300">
              <Sparkles size={12} className="stroke-[2.5]" />
              Luck: {character.stats.luck}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
