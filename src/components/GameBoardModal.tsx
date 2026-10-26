import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character, BotPlayer, GameMode } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { sound } from '../utils/sound';
import {
  Dice6,
  RotateCcw
} from 'lucide-react';

interface GameBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: GameMode;
  selectedCharacter: Character;
  botCount: number;
  bots: BotPlayer[];
  playerName: string;
}

export const GameBoardModal: React.FC<GameBoardModalProps> = ({
  isOpen,
  onClose,
  mode,
  selectedCharacter,
  botCount,
  bots,
  playerName,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const boardTiles = [
    { name: 'START (GAJI)', emoji: '🏁' },
    { name: 'KOS BULANAN', emoji: '🏠' },
    { name: 'KERJA LEMBUR', emoji: '💼' },
    { name: 'PETAK OTT KPK', emoji: '⚖️' },
    { name: 'BELANJA PASAR', emoji: '🥬' },
    { name: 'VIRAL MEDSOS', emoji: '📱' },
    { name: 'RAZIA & PUNGLI', emoji: '🚨' },
    { name: 'RUMAH SAKIT', emoji: '🏥' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border-4 border-black rounded-3xl p-5 sm:p-7 shadow-comic-xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-black/80">
            <div className="inline-block px-3 py-1 bg-comic-yellow text-black font-black text-xs uppercase tracking-wider rounded-full border-2 border-black shadow-[2px_2px_0px_#000] mb-2">
              🎉 DATA PERMAINAN TERSIMPAN!
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              SIAP BERTAHAN HIDUP DI INDONESIA!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Mode: <span className="text-comic-yellow font-extrabold uppercase">{mode}</span> | Karakter Kamu:{' '}
              <span className="text-white font-black">{selectedCharacter.name}</span>
            </p>
          </div>

          {/* Players Roster */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
            {/* Player Card */}
            <div className="bg-slate-950 border-3 border-comic-yellow rounded-2xl p-4 shadow-[4px_4px_0px_#FFE600] relative overflow-hidden">
              <span className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded bg-comic-yellow text-black border border-black">
                KAMU (PLAYER 1)
              </span>

              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-xl border-2 border-black overflow-hidden flex items-center justify-center p-1"
                  style={{ backgroundColor: selectedCharacter.color.primary }}
                >
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {playerName || selectedCharacter.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedCharacter.roleTitle}</p>
                  <p className="text-xs font-bold text-amber-300 mt-1">
                    Modal: {formatCurrency(selectedCharacter.stats.uangAwal)}
                  </p>
                </div>
              </div>

              {/* Status Pills */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center text-xs font-bold">
                <div className="bg-slate-900 p-1.5 rounded-lg border border-black">
                  <div className="text-[10px] text-slate-400">DARAH</div>
                  <div className="text-emerald-400 font-black">{selectedCharacter.stats.kesehatan}%</div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded-lg border border-black">
                  <div className="text-[10px] text-slate-400">MENTAL</div>
                  <div className="text-sky-400 font-black">{selectedCharacter.stats.mental}%</div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded-lg border border-black">
                  <div className="text-[10px] text-slate-400">LUCK</div>
                  <div className="text-amber-400 font-black">{selectedCharacter.stats.luck}</div>
                </div>
              </div>
            </div>

            {/* Opponents Card */}
            <div className="bg-slate-950 border-3 border-black rounded-2xl p-4 shadow-comic">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider block mb-2">
                {mode === 'singleplayer' ? `Daftar Bot Lawan (${botCount} Bot):` : 'Daftar Teman Main:'}
              </span>

              {mode === 'singleplayer' ? (
                <div className="space-y-2">
                  {bots.slice(0, botCount).map((b, i) => {
                    const char = CHARACTERS.find((c) => c.id === b.characterId) || CHARACTERS[i];
                    return (
                      <div
                        key={b.id}
                        className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-black text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg border border-black flex items-center justify-center"
                            style={{ backgroundColor: char.color.primary }}
                          >
                            <img src={char.image} alt={char.name} className="w-6 h-6 object-contain" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{b.name}</span>
                            <span className="text-[10px] text-slate-400">{char.name}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-amber-300">
                          {formatCurrency(char.stats.uangAwal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs italic">
                  Kode Room: <strong className="text-comic-yellow font-comic text-base">WNI-6942</strong>
                  <br />
                  Siap memulai sesi permainan multiplayer bersama pemain lain!
                </div>
              )}
            </div>
          </div>

          {/* Mini Board Track Preview */}
          <div className="mb-6">
            <span className="text-xs font-black uppercase text-slate-300 block mb-2">
              Preview Lintasan Papan Permainan (Sneak-Peek Board Game):
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
              {boardTiles.map((tile, i) => (
                <div
                  key={i}
                  className="bg-slate-950 border-2 border-black rounded-xl p-2 text-center shadow-[2px_2px_0px_#000] flex flex-col items-center justify-center hover:scale-105 transition-transform"
                >
                  <span className="text-lg sm:text-xl mb-0.5">{tile.emoji}</span>
                  <span className="text-[9px] font-black uppercase text-slate-200 leading-tight">
                    {tile.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t-2 border-black/80">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border-3 border-black bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>Ganti / Pilih Ulang Karakter</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playStartGame();
                alert('🚀 Memulai Babak 1 Board Game "Bertahan Hidup Sebagai WNI"!');
              }}
              className="w-full sm:flex-1 px-6 py-3.5 rounded-xl border-3 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-sm sm:text-base shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Dice6 size={20} className="stroke-[2.5]" />
              <span>LEMPAR DADU BABAK 1 🎲</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
