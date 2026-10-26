import React, { useState } from 'react';
import { Users, Copy, Check, UserPlus } from 'lucide-react';
import type { Character } from '../types/game';
import { sound } from '../utils/sound';

interface MultiplayerPanelProps {
  selectedCharacter: Character;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
}

export const MultiplayerPanel: React.FC<MultiplayerPanelProps> = ({
  selectedCharacter,
  playerName,
  onPlayerNameChange,
}) => {
  const [copied, setCopied] = useState(false);
  const roomCode = 'WNI-6942';

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/85 border-3 border-black rounded-2xl p-4 shadow-comic space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-comic-blue text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
            <Users size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Lobby Multiplayer
            </h3>
            <p className="text-[11px] text-slate-400">
              Bermain bersama teman secara online atau pass & play
            </p>
          </div>
        </div>

        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-400 text-black border border-black animate-pulse">
          ONLINE ROOM
        </span>
      </div>

      {/* Room Code Box */}
      <div className="bg-slate-950 border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_#000] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Kode Ruangan (Room Code):
          </span>
          <span className="font-black text-xl text-comic-yellow tracking-widest comic-stroke-sm">
            {roomCode}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-black bg-comic-yellow text-black border-2 border-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#000] hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} className="stroke-[2.5]" />}
          <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
        </button>
      </div>

      {/* Nickname Input */}
      <div>
        <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">
          Nama Pemain Kamu:
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          placeholder="Masukkan nama / alias kamu..."
          className="w-full bg-slate-950 text-white font-bold text-xs sm:text-sm border-2 border-black rounded-xl px-3 py-2 shadow-[2px_2px_0px_#000] focus:outline-none focus:border-comic-blue placeholder:text-slate-600"
        />
      </div>

      {/* Player Slots (4 Max) */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase text-slate-300 block">
          Daftar Slot Pemain (Max 4 Orang):
        </span>

        {/* Slot 1: Host */}
        <div className="bg-slate-950 border-2 border-comic-yellow rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center font-black text-xs text-black"
              style={{ backgroundColor: selectedCharacter.color.primary }}
            >
              1
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{playerName || 'Pemain 1'}</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-black border border-black">
                  HOST
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Karakter: <span className="text-comic-yellow font-bold">{selectedCharacter.name}</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
            <Check size={14} className="stroke-[3]" />
            SIAP
          </span>
        </div>

        {/* Slot 2, 3, 4: Waiting */}
        {[2, 3, 4].map((slot) => (
          <div
            key={slot}
            className="bg-slate-950/50 border-2 border-dashed border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-slate-500"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-600">
                {slot}
              </div>
              <span className="text-xs font-medium italic">
                Menunggu teman bergabung...
              </span>
            </div>
            <UserPlus size={14} className="text-slate-600" />
          </div>
        ))}
      </div>
    </div>
  );
};
