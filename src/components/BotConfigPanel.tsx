import React from 'react';
import { Bot, Dices } from 'lucide-react';
import type { BotPlayer } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { sound } from '../utils/sound';

interface BotConfigPanelProps {
  botCount: number;
  onBotCountChange: (count: number) => void;
  bots: BotPlayer[];
  onBotCharacterChange: (botId: string, characterId: string) => void;
  onRandomizeBots: () => void;
  playerCharacterId: string;
}

export const BotConfigPanel: React.FC<BotConfigPanelProps> = ({
  botCount,
  onBotCountChange,
  bots,
  onBotCharacterChange,
  onRandomizeBots,
  playerCharacterId,
}) => {
  return (
    <div className="bg-slate-900/85 border-3 border-black rounded-2xl p-4 shadow-comic">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black/80 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-comic-yellow text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
            <Bot size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Pengaturan Bot Lawan
            </h3>
            <p className="text-[11px] text-slate-400">
              Pilih jumlah dan peran bot yang akan kamu lawan
            </p>
          </div>
        </div>

        {/* Randomize button */}
        <button
          type="button"
          onClick={() => {
            sound.playSelect();
            onRandomizeBots();
          }}
          className="flex items-center gap-1.5 text-xs font-black bg-slate-800 hover:bg-slate-700 text-comic-yellow border-2 border-black px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <Dices size={14} className="stroke-[2.5]" />
          <span>Acak Bot</span>
        </button>
      </div>

      {/* Bot Count Selector (1-3) */}
      <div className="mb-4">
        <label className="block text-xs font-black uppercase text-slate-300 mb-2">
          Jumlah Lawan Bot (1 - 3 Pemain):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((count) => {
            const isCurrent = botCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onBotCountChange(count);
                }}
                className={`py-2 px-3 rounded-xl border-2 sm:border-3 font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-comic-yellow text-black border-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                    : 'bg-slate-950 text-slate-300 border-black hover:bg-slate-800 shadow-[2px_2px_0px_#000]'
                }`}
              >
                <Bot size={14} className={isCurrent ? 'stroke-[3]' : ''} />
                <span>{count} Bot</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Bots Slots */}
      <div className="space-y-2.5">
        {bots.slice(0, botCount).map((bot, index) => {
          const selectedChar = CHARACTERS.find((c) => c.id === bot.characterId) || CHARACTERS[0];
          return (
            <div
              key={bot.id}
              className="bg-slate-950/80 border-2 border-black rounded-xl p-2.5 shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-black overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: selectedChar.color.primary }}
                >
                  <img
                    src={selectedChar.image}
                    alt={selectedChar.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-slate-800 text-comic-yellow border border-black">
                      Slot {index + 1}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {bot.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Role: <span className="text-slate-200 font-semibold">{selectedChar.name}</span>
                  </p>
                </div>
              </div>

              {/* Character picker for bot */}
              <div className="flex items-center gap-1">
                <select
                  value={bot.characterId}
                  onChange={(e) => {
                    sound.playClick();
                    onBotCharacterChange(bot.id, e.target.value);
                  }}
                  className="bg-slate-900 text-white font-bold text-xs border-2 border-black rounded-lg px-2 py-1.5 shadow-[2px_2px_0px_#000] focus:outline-none focus:border-comic-yellow cursor-pointer"
                >
                  {CHARACTERS.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name} {char.id === playerCharacterId ? '(Karaktermu)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
