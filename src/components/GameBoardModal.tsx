import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CHARACTERS } from '../data/characters';
import type { Character } from '../types/game';
import { CharacterDetail } from './CharacterDetail';
import { sound } from '../utils/sound';

export interface BotOpponent {
  id: string;
  name: string;
  character: Character;
}

interface GameBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptFate: (fatedCharacter: Character, bots: BotOpponent[]) => void;
}

const FATE_MESSAGES = [
  'Menentukan garis tangan & nasib kelahiranmu...',
  'Mengocok Kartu Keluarga & akta kelahiran...',
  'Mengecek saldo rekening & koneksi orang dalam...',
  'Menghitung beban hidup & cicilan masa depan...',
];

const BOT_NAMES = ['Bot Agus', 'Bot Siti', 'Bot Bambang', 'Bot Rina'];

function generateBotOpponents(playerChar: Character, count: number): BotOpponent[] {
  const otherChars = CHARACTERS.filter((c) => c.id !== playerChar.id);
  const shuffled = [...otherChars].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, idx) => ({
    id: `bot-${idx + 1}`,
    name: BOT_NAMES[idx] || `Bot ${idx + 1}`,
    character: shuffled[idx % shuffled.length],
  }));
}

export const GameBoardModal: React.FC<GameBoardModalProps> = ({
  isOpen,
  onClose,
  onAcceptFate,
}) => {
  const [isRolling, setIsRolling] = useState<boolean>(true);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fatedCharacter, setFatedCharacter] = useState<Character>(CHARACTERS[0]);
  const [rollProgress, setRollProgress] = useState<number>(0);
  const [botCount, setBotCount] = useState<number>(3);
  const [botOpponents, setBotOpponents] = useState<BotOpponent[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    setIsRolling(true);
    setRollProgress(0);
    setMessageIndex(0);

    const finalIndex = Math.floor(Math.random() * CHARACTERS.length);
    const chosenChar = CHARACTERS[finalIndex];
    setFatedCharacter(chosenChar);
    setBotOpponents(generateBotOpponents(chosenChar, botCount));

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

        const delay = 65 + Math.pow(step / totalSteps, 2.2) * 240;
        timeoutId = setTimeout(runRoulette, delay);
      } else {
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

  const handleBotCountChange = (newCount: number) => {
    sound.playClick();
    setBotCount(newCount);
    setBotOpponents(generateBotOpponents(fatedCharacter, newCount));
  };

  if (!isOpen) return null;

  const activeRollChar = CHARACTERS[previewIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        {isRolling ? (
          <motion.div
            key="rolling-fate"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="relative w-full max-w-md bg-slate-900 border-4 border-black rounded-2xl p-6 sm:p-8 shadow-comic-lg text-center overflow-hidden my-auto"
          >
            <div className="relative z-10 flex flex-col items-center">
              <div className="inline-block px-3 py-0.5 bg-comic-yellow text-black font-black text-[11px] rounded-md border-2 border-black shadow-[2px_2px_0px_#000] mb-3">
                PENENTUAN TAKDIR
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Menentukan Nasib Kelahiranmu...
              </h2>
              <p className="text-xs text-white font-light mt-1.5 min-h-[20px]">
                {FATE_MESSAGES[messageIndex]}
              </p>

              {/* Cycling Character Card */}
              <motion.div
                key={activeRollChar.id + '-' + rollProgress}
                initial={{ scale: 0.94, opacity: 0.75 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="my-6 w-48 h-60 sm:w-52 sm:h-64 rounded-2xl border-4 border-black shadow-comic-lg overflow-hidden relative bg-slate-950"
              >
                <img
                  src={activeRollChar.selectedImage || activeRollChar.image}
                  alt={activeRollChar.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="text-sm font-black text-white">
                    {activeRollChar.name}
                  </div>
                  <div className="text-[11px] text-white font-light truncate">
                    {activeRollChar.roleTitle}
                  </div>
                </div>
              </motion.div>

              {/* Progress Bar */}
              <div className="w-full h-4 rounded-md border-2 border-black bg-slate-950 p-0.5 overflow-hidden shadow-[2px_2px_0px_#000]">
                <motion.div
                  className="h-full bg-comic-yellow rounded-sm"
                  animate={{ width: `${rollProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-xs font-black text-comic-yellow mt-2">
                {rollProgress}%
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="revealed-fate"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-5xl my-auto space-y-3.5"
          >
            {/* Fate Header Banner */}
            <div className="bg-slate-900 border-4 border-black rounded-2xl p-3.5 text-center shadow-comic">
              <div className="inline-block px-3 py-0.5 bg-comic-yellow text-black font-black text-[11px] rounded-md border-2 border-black shadow-[2px_2px_0px_#000] mb-1">
                TAKDIR KELAHIRANMU
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Kamu Lahir di Dunia Sebagai{' '}
                <span className="text-comic-yellow">{fatedCharacter.name}</span>
              </h2>
            </div>

            {/* Character Detail Card */}
            <CharacterDetail character={fatedCharacter} />

            {/* Bot Opponents Selection */}
            <div className="bg-slate-900 border-4 border-black rounded-2xl p-4 shadow-comic">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white">
                    Lawan Bot ({botCount} Pemain Bot)
                  </h3>
                  <p className="text-[11px] text-white font-light">
                    Bot juga mendapatkan peran secara acak untuk bersaing di papan permainan
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => handleBotCountChange(cnt)}
                      className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs cursor-pointer transition-all ${
                        botCount === cnt
                          ? 'bg-comic-yellow text-black shadow-[2px_2px_0px_#000]'
                          : 'bg-slate-950 text-white hover:bg-slate-800'
                      }`}
                    >
                      {cnt} Bot
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {botOpponents.map((bot) => (
                  <div
                    key={bot.id}
                    className="bg-slate-950 border-2 border-black rounded-xl p-2.5 flex items-center gap-3 shadow-[2px_2px_0px_#000]"
                  >
                    <img
                      src={bot.character.image}
                      alt={bot.character.name}
                      className="w-11 h-11 rounded-lg object-cover object-top border-2 border-black flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white truncate">
                        {bot.name}
                      </div>
                      <div className="text-[11px] text-white font-light truncate">
                        {bot.character.name}
                      </div>
                      <div className="text-[11px] text-green-400 font-bold">
                        Rp {(bot.character.stats.uangAwal / 1000000).toFixed(1).replace('.0', '')} Jt
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border-3 border-black bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-comic active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playStartGame();
                  onAcceptFate(fatedCharacter, botOpponents);
                }}
                className="w-full sm:flex-1 px-6 py-3.5 rounded-xl border-3 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-sm sm:text-base shadow-comic active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
              >
                MULAI PERMAINAN
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
