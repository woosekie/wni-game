import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CHARACTERS } from '../data/characters';
import type { Character, GameMode, BotPlayer } from '../types/game';
import { CharacterCard } from './CharacterCard';
import { CharacterDetail } from './CharacterDetail';
import { BotConfigPanel } from './BotConfigPanel';
import { MultiplayerPanel } from './MultiplayerPanel';
import { GameBoardModal } from './GameBoardModal';
import { sound } from '../utils/sound';
import {
  Users,
  User,
  Volume2,
  VolumeX,
  Play,
  Gamepad2
} from 'lucide-react';

export const CharacterSelect: React.FC = () => {
  // State
  const [mode, setMode] = useState<GameMode>('singleplayer');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [botCount, setBotCount] = useState<number>(2);
  const [playerName, setPlayerName] = useState<string>('Pemain WNI #1');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Bots initial setup
  const [bots, setBots] = useState<BotPlayer[]>([
    { id: 'bot-1', name: 'Bot Pak RT 🕶️', characterId: 'pejabat' },
    { id: 'bot-2', name: 'Bot Debt Collector ⚡', characterId: 'pegawai' },
    { id: 'bot-3', name: 'Bot Ibu Kost 🔑', characterId: 'pedagang' },
  ]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  const handleModeChange = (newMode: GameMode) => {
    sound.playClick();
    setMode(newMode);
  };

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    setBots((prev) =>
      prev.map((b) => {
        if (b.characterId === char.id) {
          const alternate = CHARACTERS.find((c) => c.id !== char.id);
          return alternate ? { ...b, characterId: alternate.id } : b;
        }
        return b;
      })
    );
  };

  const handleBotCharacterChange = (botId: string, charId: string) => {
    setBots((prev) =>
      prev.map((b) => (b.id === botId ? { ...b, characterId: charId } : b))
    );
  };

  const handleRandomizeBots = () => {
    const available = CHARACTERS.filter((c) => c.id !== selectedCharacter.id);
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    setBots((prev) =>
      prev.map((b, i) => ({
        ...b,
        characterId: (shuffled[i % shuffled.length] || CHARACTERS[0]).id,
      }))
    );
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
      {/* Top Header */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 border-4 border-black rounded-2xl p-4 sm:p-5 shadow-comic-lg backdrop-blur-sm">
          {/* Logo & Game Title */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-comic-red border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center font-black text-2xl text-white transform -rotate-3 select-none">
              🇮🇩
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-comic-yellow text-black border border-black uppercase tracking-wider">
                  BOARD GAME SATIR INDONESIA
                </span>
                <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">v1.0 Pre-Alpha</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide font-comic comic-stroke-sm mt-0.5">
                BERTAHAN HIDUP SEBAGAI WNI
              </h1>
            </div>
          </div>

          {/* Mode Toggle & Audio Control */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            {/* Mode Toggle Buttons */}
            <div className="bg-slate-950 p-1.5 rounded-xl border-3 border-black shadow-comic flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleModeChange('singleplayer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  mode === 'singleplayer'
                    ? 'bg-comic-yellow text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User size={15} className="stroke-[2.5]" />
                <span>Singleplayer (Bot)</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('multiplayer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  mode === 'multiplayer'
                    ? 'bg-comic-blue text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users size={15} className="stroke-[2.5]" />
                <span>Multiplayer</span>
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={soundEnabled ? 'Matikan Suara FX' : 'Nyalakan Suara FX'}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-black shadow-comic text-comic-yellow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-slate-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Character Cards List + Mode Config Panel */}
        <section className="lg:col-span-5 flex flex-col gap-5 order-2 lg:order-1">
          {/* Section Title */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Gamepad2 size={18} className="text-comic-yellow" />
              <h2 className="text-sm font-black uppercase text-slate-200 tracking-wider">
                Pilih Karaktermu ({CHARACTERS.length} Pilihan)
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              Klik kartu untuk detail
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {CHARACTERS.map((char, index) => (
              <CharacterCard
                key={char.id}
                character={char}
                isSelected={selectedCharacter.id === char.id}
                onSelect={handleSelectCharacter}
                index={index}
              />
            ))}
          </div>

          {/* Sub-panel based on Game Mode */}
          <div className="mt-2">
            {mode === 'singleplayer' ? (
              <BotConfigPanel
                botCount={botCount}
                onBotCountChange={setBotCount}
                bots={bots}
                onBotCharacterChange={handleBotCharacterChange}
                onRandomizeBots={handleRandomizeBots}
                playerCharacterId={selectedCharacter.id}
              />
            ) : (
              <MultiplayerPanel
                selectedCharacter={selectedCharacter}
                playerName={playerName}
                onPlayerNameChange={setPlayerName}
              />
            )}
          </div>
        </section>

        {/* Right Column: Large Character Detail Preview */}
        <section className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-4">
          <CharacterDetail character={selectedCharacter} />
        </section>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t-4 border-black p-3 sm:p-4 backdrop-blur-md shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Summary status */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div
              className="w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center p-1"
              style={{ backgroundColor: selectedCharacter.color.primary }}
            >
              <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Karakter Siap Tempur:
              </span>
              <span className="text-sm sm:text-base font-black text-white">
                {selectedCharacter.name} <span className="text-comic-yellow">({selectedCharacter.badge})</span>
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            type="button"
            onClick={handleStartGame}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border-3 border-black bg-comic-yellow hover:bg-yellow-300 text-black font-black text-base sm:text-lg shadow-comic hover:shadow-comic-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <Play size={20} className="fill-black stroke-[2.5]" />
            <span>MULAI BERTAHAN HIDUP 🚀</span>
          </motion.button>
        </div>
      </footer>

      {/* Game Ready Preview Modal */}
      <GameBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={mode}
        selectedCharacter={selectedCharacter}
        botCount={botCount}
        bots={bots}
        playerName={playerName}
      />
    </div>
  );
};
