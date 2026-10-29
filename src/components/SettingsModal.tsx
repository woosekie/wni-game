import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgmEnabled: boolean;
  onToggleBgm: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  bgmVolume: number;
  onChangeBgmVolume: (val: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  bgmEnabled,
  onToggleBgm,
  soundEnabled,
  onToggleSound,
  bgmVolume,
  onChangeBgmVolume,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-slate-900 border-4 border-black rounded-2xl p-5 sm:p-6 shadow-comic-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-5">
            <h2 className="text-lg sm:text-xl font-black text-white">
              Pengaturan
            </h2>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {/* BGM Toggle */}
            <div className="bg-slate-950/80 border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_#000] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-black text-white">
                    Musik Latar (BGM)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Musik tema selama permainan berlangsung
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleBgm}
                  className={`px-3 py-1.5 rounded-xl border-2 border-black shadow-comic flex items-center gap-1.5 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-black ${
                    bgmEnabled
                      ? 'bg-comic-yellow text-black hover:bg-yellow-300'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Music size={14} className={bgmEnabled ? 'text-black' : 'text-slate-400'} />
                  <span>BGM {bgmEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Volume Musik</span>
                  <span className="text-comic-yellow font-black">{Math.round(bgmVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={bgmVolume}
                  onChange={(e) => onChangeBgmVolume(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>
            </div>

            {/* SFX Toggle */}
            <div className="bg-slate-950/80 border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_#000] flex items-center justify-between">
              <div>
                <div className="text-xs sm:text-sm font-black text-white">
                  Efek Suara (SFX)
                </div>
                <div className="text-[11px] text-slate-400">
                  Suara tombol, klik, dan aksi permainan
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleSound}
                className={`px-3 py-1.5 rounded-xl border-2 border-black shadow-comic flex items-center gap-1.5 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-black ${
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
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="mt-6 w-full py-2.5 rounded-xl border-3 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-sm shadow-comic active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Simpan & Tutup
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
