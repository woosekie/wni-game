import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CHARACTERS } from '../data/characters';
import type { Character } from '../types/game';
import { CharacterCard } from './CharacterCard';
import { CharacterDetail } from './CharacterDetail';
import { GameBoardModal } from './GameBoardModal';
import { sound } from '../utils/sound';
import {
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';

export const CharacterSelect: React.FC = () => {
  // State
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.sfxEnabled);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(sound.bgmEnabled);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Start BGM on user gesture (respects browser autoplay policies)
    const handleFirstGesture = () => {
      sound.startBGM();
      setBgmEnabled(sound.bgmEnabled);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    // Direct attempt
    sound.startBGM();

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  const handleToggleBgm = () => {
    const next = sound.toggleBGM();
    setBgmEnabled(next);
    if (soundEnabled) sound.playClick();
  };

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    sound.startBGM(); // Ensure BGM continues/starts on selection
  };

  const handleStartGame = () => {
    sound.playStartGame();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#FF2E4D', '#10B981', '#00A8FF', '#A855F7'],
      });
    } catch {}

    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white pb-28 pt-4 sm:pt-6 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Top Right Corner Audio Controls */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-6 z-50 flex items-center gap-2">
        {/* BGM Toggle Button */}
        <button
          type="button"
          onClick={handleToggleBgm}
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
          onClick={handleToggleSound}
          title={soundEnabled ? 'Matikan Suara FX' : 'Nyalakan Suara FX'}
          className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-black shadow-comic text-comic-yellow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} className="text-slate-500" />}
          <span className="text-xs font-black text-white">
            SFX {soundEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Horizontal Character Roster Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-1 mb-4 sm:mb-5">
          <h2 className="text-sm font-black uppercase text-slate-200 tracking-wider">
            Pilih Karaktermu ({CHARACTERS.length} Pilihan)
          </h2>
          <span className="text-[10px] font-bold text-comic-yellow sm:hidden">
            Geser horizontal
          </span>
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

      {/* Bottom Sticky Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t-4 border-black p-3 sm:p-4 backdrop-blur-md shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-end">
          {/* CTA Button */}
          <motion.button
            type="button"
            onClick={handleStartGame}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border-3 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-base sm:text-lg shadow-comic hover:shadow-comic-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center cursor-pointer uppercase tracking-wider"
          >
            MULAI BERTAHAN HIDUP
          </motion.button>
        </div>
      </footer>

      {/* Game Ready Preview Modal */}
      <GameBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCharacter={selectedCharacter}
      />
    </div>
  );
};
