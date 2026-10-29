import React from 'react';
import { motion } from 'framer-motion';
import { Music, Volume2, VolumeX } from 'lucide-react';
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
      <div className="fixed top-4 right-5 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleBgm}
          title={bgmEnabled ? 'Matikan Musik Latar (BGM)' : 'Nyalakan Musik Latar (BGM)'}
          className={`px-3 py-2 rounded-xl border-2 border-black shadow-comic flex items-center gap-1.5 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-black ${
            bgmEnabled
              ? 'bg-comic-yellow text-black hover:bg-yellow-300'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Music size={14} className={bgmEnabled ? 'text-black' : 'text-slate-400'} />
          <span>BGM {bgmEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Matikan Suara FX' : 'Nyalakan Suara FX'}
          className={`px-3 py-2 rounded-xl border-2 border-black shadow-comic flex items-center gap-1.5 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-black ${
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

      {/* Main Menu Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-slate-900/95 border-4 border-black rounded-2xl p-6 sm:p-8 shadow-comic-lg text-center"
      >
        <div className="mb-7">
          <div className="inline-block bg-comic-yellow text-black font-black text-[11px] px-3 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0px_#000] mb-3">
            SIMULASI PAPAN PERMAINAN
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Bertahan Hidup Sebagai WNI
          </h1>
          <p className="text-xs text-white font-light mt-1.5">
            Hadapi kerasnya realita hidup dari gajian ke gajian
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playStartGame();
              onStartPlay();
            }}
            className="w-full py-3.5 px-5 rounded-xl border-3 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-sm sm:text-base shadow-comic active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Mulai Bermain
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenCharacterList();
            }}
            className="w-full py-3.5 px-5 rounded-xl border-3 border-black bg-slate-950 hover:bg-slate-800 text-white font-black text-sm sm:text-base shadow-comic active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            List Semua Character
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="w-full py-3.5 px-5 rounded-xl border-3 border-black bg-slate-950 hover:bg-slate-800 text-white font-black text-sm sm:text-base shadow-comic active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Pengaturan
          </button>
        </div>
      </motion.div>
    </div>
  );
};
