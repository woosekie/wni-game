import React from 'react';
import { motion } from 'framer-motion';
import { Play, Users, Settings, Music, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

interface MainMenuProps {
  onStartPlay: () => void;
  onOpenCharacterList: () => void;
  onOpenSettings: () => void;
  bgmEnabled: boolean;
  onToggleBgm: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartPlay,
  onOpenCharacterList,
  onOpenSettings,
  bgmEnabled,
  onToggleBgm,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Top Right Audio Controls */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-6 z-40 flex items-center gap-2">
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
      </div>

      {/* Main Menu Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-slate-900/90 border-4 border-black rounded-3xl p-6 sm:p-8 shadow-comic-xl backdrop-blur-sm text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 comic-dots opacity-10 pointer-events-none" />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-block bg-comic-yellow text-black font-black text-xs px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] mb-3">
            BOARD GAME SATIR
          </div>

          {/* Game Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-[3px_3px_0px_#000]">
            Bertahan Hidup Sebagai WNI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 mb-7 font-medium">
            Pilih jalan hidupmu dan hadapi kerasnya realita!
          </p>

          {/* Menu Options */}
          <div className="flex flex-col gap-3.5">
            {/* 1. Mulai Bermain */}
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playStartGame();
                onStartPlay();
              }}
              className="w-full py-3.5 px-5 rounded-2xl border-3 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-sm sm:text-base shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play size={18} className="fill-black text-black" />
              <span>Mulai Bermain</span>
            </motion.button>

            {/* 2. List Semua Character */}
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playClick();
                onOpenCharacterList();
              }}
              className="w-full py-3.5 px-5 rounded-2xl border-3 border-black bg-slate-800 hover:bg-slate-700 text-white font-black text-sm sm:text-base shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Users size={18} className="text-comic-yellow" />
              <span>List Semua Character</span>
            </motion.button>

            {/* 3. Pengaturan */}
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              className="w-full py-3.5 px-5 rounded-2xl border-3 border-black bg-slate-800 hover:bg-slate-700 text-white font-black text-sm sm:text-base shadow-comic hover:shadow-comic-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Settings size={18} className="text-sky-400" />
              <span>Pengaturan</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
