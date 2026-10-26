import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../types/game';
import { sound } from '../utils/sound';

interface GameBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCharacter: Character;
}

export const GameBoardModal: React.FC<GameBoardModalProps> = ({
  isOpen,
  onClose,
  selectedCharacter,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const boardTiles = [
    { name: 'START (GAJI)' },
    { name: 'KOS BULANAN' },
    { name: 'KERJA LEMBUR' },
    { name: 'PETAK OTT KPK' },
    { name: 'BELANJA PASAR' },
    { name: 'VIRAL MEDSOS' },
    { name: 'RAZIA & PUNGLI' },
    { name: 'RUMAH SAKIT' },
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
              KARAKTER SIAP BERAKSI
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              SIAP BERTAHAN HIDUP DI INDONESIA!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Karakter Terpilih:{' '}
              <span className="text-comic-yellow font-black">{selectedCharacter.name}</span>{' '}
              <span className="text-slate-400">({selectedCharacter.badge})</span>
            </p>
          </div>

          {/* Character Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
            {/* Player Profile Card */}
            <div className="bg-slate-950 border-3 border-comic-yellow rounded-2xl p-4 shadow-[4px_4px_0px_#FFE600] relative overflow-hidden flex flex-col justify-between">
              <span className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded bg-comic-yellow text-black border border-black">
                KARAKTER UTAMA
              </span>

              <div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-xl border-2 border-black overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: selectedCharacter.color.primary }}
                  >
                    <img
                      src={selectedCharacter.selectedImage || selectedCharacter.image}
                      alt={selectedCharacter.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {selectedCharacter.name}
                    </h3>
                    <p className="text-xs text-slate-400">{selectedCharacter.roleTitle}</p>
                    <p className="text-xs font-bold text-amber-300 mt-1">
                      Modal: {formatCurrency(selectedCharacter.stats.uangAwal)}
                    </p>
                  </div>
                </div>

                {/* Status Pills */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center text-xs font-bold">
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
            </div>

            {/* Special Abilities Card */}
            <div className="bg-slate-950 border-3 border-black rounded-2xl p-4 shadow-comic flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider block mb-2">
                  Kemampuan Khusus Karakter:
                </span>
                <div className="space-y-2 text-xs">
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5">
                    <div className="font-black text-emerald-400 mb-0.5">
                      {selectedCharacter.buff.title}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {selectedCharacter.buff.description}
                    </p>
                  </div>

                  <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-2.5">
                    <div className="font-black text-red-400 mb-0.5">
                      {selectedCharacter.debuff.title}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {selectedCharacter.debuff.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Tingkat Kesulitan:</span>
                <span className="font-black text-comic-yellow">{selectedCharacter.difficulty}</span>
              </div>
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
                  <span className="text-xs font-black text-comic-yellow mb-1">
                    #{i + 1}
                  </span>
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
              className="w-full sm:w-auto px-5 py-3 rounded-xl border-3 border-black bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
            >
              Ganti / Pilih Ulang Karakter
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playStartGame();
                alert('Memulai Babak 1 Board Game "Bertahan Hidup Sebagai WNI"!');
              }}
              className="w-full sm:flex-1 px-6 py-3.5 rounded-xl border-3 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-sm sm:text-base shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
            >
              LEMPAR DADU BABAK 1
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
