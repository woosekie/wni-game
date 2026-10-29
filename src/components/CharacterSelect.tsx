import React from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS } from '../data/characters';
import type { Character } from '../types/game';
import { CharacterCard } from './CharacterCard';
import { CharacterDetail } from './CharacterDetail';
import { GameBoardModal } from './GameBoardModal';
import { sound } from '../utils/sound';
import {
  Volume2,
  VolumeX,
  Music,
  ArrowLeft
} from 'lucide-react';

interface CharacterSelectProps {
  selectedCharacter: Character;
  onSelectCharacter: (char: Character) => void;
  onBackToMenu: () => void;
  bgmEnabled: boolean;
  onToggleBgm: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  selectedCharacter,
  onSelectCharacter,
  onBackToMenu,
  bgmEnabled,
  onToggleBgm,
  soundEnabled,
  onToggleSound,
  isModalOpen,
  setIsModalOpen,
}) => {
  const handleSelectCharacter = (char: Character) => {
    onSelectCharacter(char);
    sound.startBGM();
  };

  const handleStartGame = () => {
    sound.playClick();
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white pb-10 pt-4 sm:pt-6 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Horizontal Character Roster Section */}
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 mb-4 sm:mb-5">
          {/* Left: Back Button + Title */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onBackToMenu();
              }}
              className="px-3 py-1.5 rounded-lg border-2 border-black bg-slate-900/90 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-comic active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Menu</span>
            </button>

            <h2 className="text-sm sm:text-base font-black text-white drop-shadow-[2px_2px_0px_#000] bg-slate-900/85 border-2 border-black px-3 py-1.5 rounded-lg shadow-comic">
              Semua Karakter
            </h2>
          </div>

          {/* Right: Audio Controls + Start Game Button */}
          <div className="flex items-center gap-2">
            {/* BGM Toggle Button */}
            <button
              type="button"
              onClick={onToggleBgm}
              title={bgmEnabled ? 'Matikan Musik Latar (BGM)' : 'Nyalakan Musik Latar (BGM)'}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border-2 border-black shadow-comic flex items-center gap-1.5 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-black ${
                bgmEnabled
                  ? 'bg-comic-yellow text-black hover:bg-yellow-300'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Music size={14} className={bgmEnabled ? 'animate-bounce text-black' : 'text-slate-400'} />
              <span>BGM {bgmEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* SFX Toggle Button */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Matikan Suara FX' : 'Nyalakan Suara FX'}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border-2 border-black shadow-comic flex items-center gap-1.5 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-black ${
                soundEnabled
                  ? 'bg-comic-yellow text-black hover:bg-yellow-300'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {soundEnabled ? (
                <Volume2 size={14} className="text-black" />
              ) : (
                <VolumeX size={14} className="text-slate-400" />
              )}
              <span>SFX {soundEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* CTA Start Game Button */}
            <motion.button
              type="button"
              onClick={handleStartGame}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="px-4 sm:px-6 py-1.5 rounded-xl border-2 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-xs sm:text-sm shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer uppercase tracking-wider"
            >
              START GAME
            </motion.button>
          </div>
        </div>

        {/* Horizontal Row: smooth swipe on mobile, 5-column grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-5 gap-3 sm:gap-3.5 overflow-x-auto sm:overflow-visible pt-5 sm:pt-6 pb-3 px-1 scrollbar-thin snap-x snap-mandatory">
          {CHARACTERS.map((char, index) => (
            <div key={char.id} className="flex-shrink-0 w-40 sm:w-auto snap-center flex">
              <CharacterCard
                character={char}
                isSelected={selectedCharacter.id === char.id}
                onSelect={handleSelectCharacter}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Main Character Detail Showcase */}
      <section className="mb-6">
        <CharacterDetail character={selectedCharacter} />
      </section>

      {/* Game Ready Preview Modal */}
      <GameBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
