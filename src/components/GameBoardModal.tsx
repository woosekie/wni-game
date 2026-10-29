import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Dices } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import type { Character } from '../types/game';
import { CharacterDetail } from './CharacterDetail';
import { sound } from '../utils/sound';

interface GameBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FATE_MESSAGES = [
  'Menentukan garis tangan & nasib kelahiranmu...',
  'Mengocok Kartu Keluarga & akta kelahiran...',
  'Mengecek saldo rekening & koneksi orang dalam...',
  'Menghitung beban hidup & cicilan masa depan...',
];

export const GameBoardModal: React.FC<GameBoardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isRolling, setIsRolling] = useState<boolean>(true);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fatedCharacter, setFatedCharacter] = useState<Character>(CHARACTERS[0]);
  const [rollProgress, setRollProgress] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    setIsRolling(true);
    setRollProgress(0);
    setMessageIndex(0);

    // Pick final random character (fate)
    const finalIndex = Math.floor(Math.random() * CHARACTERS.length);
    const chosenChar = CHARACTERS[finalIndex];
    setFatedCharacter(chosenChar);

    let step = 0;
    const totalSteps = 22;
    let timeoutId: ReturnType<typeof setTimeout>;

    const runRoulette = () => {
      step += 1;
      setRollProgress(Math.min(Math.round((step / totalSteps) * 100), 100));

      if (step < totalSteps) {
        setPreviewIndex((prev) => (prev + 1) % CHARACTERS.length);
        setMessageIndex(Math.min(Math.floor((step / totalSteps) * FATE_MESSAGES.length), FATE_MESSAGES.length - 1));
        sound.playClick();

        // Gradually slow down the roulette spin
        const delay = 65 + Math.pow(step / totalSteps, 2.2) * 240;
        timeoutId = setTimeout(runRoulette, delay);
      } else {
        // Land on the fated character
        setPreviewIndex(finalIndex);
        setIsRolling(false);
        sound.playStartGame();
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#FFE600', '#FF2E4D', '#10B981', '#00A8FF', '#A855F7'],
          });
        } catch {}
      }
    };

    timeoutId = setTimeout(runRoulette, 80);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const activeRollChar = CHARACTERS[previewIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        {isRolling ? (
          /* PHASE 1: FATE RANDOMIZER / GACHA KELAHIRAN */
          <motion.div
            key="rolling-fate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-md bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 shadow-comic-xl text-center overflow-hidden my-auto"
          >
            <div className="absolute inset-0 comic-dots opacity-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-comic-yellow text-black font-black text-xs rounded-full border-2 border-black shadow-[2px_2px_0px_#000] mb-3">
                <Dices size={14} className="animate-spin" />
                <span>RODA TAKDIR WNI</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Menentukan Takdir Kelahiranmu...
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 min-h-[20px]">
                {FATE_MESSAGES[messageIndex]}
              </p>

              {/* Cycling Character Card */}
              <motion.div
                key={activeRollChar.id + '-' + rollProgress}
                initial={{ scale: 0.92, opacity: 0.7, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.12 }}
                className="my-6 w-48 h-60 sm:w-52 sm:h-64 rounded-2xl border-4 border-comic-yellow shadow-comic-lg overflow-hidden relative bg-slate-950"
              >
                <img
                  src={activeRollChar.selectedImage || activeRollChar.image}
                  alt={activeRollChar.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="text-sm font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {activeRollChar.name}
                  </div>
                  <div className="text-[10px] text-comic-yellow font-bold truncate">
                    {activeRollChar.roleTitle}
                  </div>
                </div>
              </motion.div>

              {/* Progress Bar */}
              <div className="w-full h-4 rounded-xl border-2 border-black bg-slate-950 p-0.5 overflow-hidden shadow-[2px_2px_0px_#000]">
                <motion.div
                  className="h-full bg-comic-yellow rounded-lg"
                  animate={{ width: `${rollProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-[11px] font-black text-comic-yellow mt-2">
                {rollProgress}% • Takdir tidak bisa dipilih!
              </span>
            </div>
          </motion.div>
        ) : (
          /* PHASE 2: REVEALED FATED CHARACTER USING CHARACTER DETAIL CARD */
          <motion.div
            key="revealed-fate"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 18 }}
            className="relative w-full max-w-5xl my-auto space-y-4"
          >
            {/* Fate Header Banner */}
            <div className="bg-slate-900/95 border-4 border-black rounded-2xl p-4 text-center shadow-comic-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-comic-yellow text-black font-black text-xs rounded-full border-2 border-black shadow-[2px_2px_0px_#000] mb-1.5">
                <Sparkles size={14} />
                <span>TAKDIR KELAHIRANMU TELAH DITENTUKAN!</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans">
                Kamu Lahir di Dunia Sebagai{' '}
                <span className="text-comic-yellow">{fatedCharacter.name}</span>!
              </h2>
            </div>

            {/* Character Detail Card (same as bottom card on Character List page) */}
            <CharacterDetail character={fatedCharacter} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border-3 border-black bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playStartGame();
                  alert(`Selamat berjuang sebagai ${fatedCharacter.name}! Memulai Babak 1 "Bertahan Hidup Sebagai WNI"!`);
                }}
                className="w-full sm:flex-1 px-6 py-3.5 rounded-xl border-3 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-sm sm:text-base shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
              >
                TERIMA TAKDIR & LEMPAR DADU BABAK 1
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
