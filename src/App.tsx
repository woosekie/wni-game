import { useState, useEffect } from 'react';
import { CHARACTERS } from './data/characters';
import type { Character } from './types/game';
import { CharacterSelect } from './components/CharacterSelect';
import { MainMenu } from './components/MainMenu';
import { SettingsModal } from './components/SettingsModal';
import { GameBoardModal, type BotOpponent } from './components/GameBoardModal';
import { GameBoardScreen } from './components/GameBoardScreen';
import { sound } from './utils/sound';

type ScreenView = 'menu' | 'characters' | 'playing';

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [playingCharacter, setPlayingCharacter] = useState<Character>(CHARACTERS[0]);
  const [playingBots, setPlayingBots] = useState<BotOpponent[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.sfxEnabled);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(sound.bgmEnabled);
  const [bgmVolume, setBgmVolume] = useState<number>(sound.bgmVolume);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [gameSessionId, setGameSessionId] = useState<number>(1);

  useEffect(() => {
    const handleFirstGesture = () => {
      sound.startBGM();
      setBgmEnabled(sound.bgmEnabled);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    sound.startBGM();

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  const handleToggleBgm = () => {
    const next = sound.toggleBGM();
    setBgmEnabled(next);
    if (soundEnabled) sound.playClick();
  };

  const handleChangeBgmVolume = (val: number) => {
    setBgmVolume(val);
    sound.setBGMVolume(val);
  };

  const handleAcceptFate = (fatedChar: Character, bots: BotOpponent[]) => {
    setPlayingCharacter(fatedChar);
    setPlayingBots(bots);
    setGameSessionId((prev) => prev + 1);
    setIsModalOpen(false);
    setCurrentView('playing');
  };

  return (
    <div
      className="min-h-screen bg-[#1E140E] bg-cover bg-center bg-no-repeat bg-fixed text-white relative"
      style={{ backgroundImage: "url('/assets/characters/background.jpg')" }}
    >
      {/* Overlay menyesuaikan suasana: bening saat bermain agar background terlihat jelas */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-300 ${
          currentView === 'playing' ? 'bg-[#1E140E]/10' : 'bg-slate-950/45'
        }`}
      />

      <div className="relative z-10">
        {currentView === 'menu' && (
          <MainMenu
            onStartPlay={() => setIsModalOpen(true)}
            onOpenCharacterList={() => setCurrentView('characters')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            bgmEnabled={bgmEnabled}
            onToggleBgm={handleToggleBgm}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {currentView === 'characters' && (
          <CharacterSelect
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
            onBackToMenu={() => setCurrentView('menu')}
            bgmEnabled={bgmEnabled}
            onToggleBgm={handleToggleBgm}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onStartFateRoll={() => setIsModalOpen(true)}
          />
        )}

        {currentView === 'playing' && (
          <GameBoardScreen
            key={gameSessionId}
            character={playingCharacter}
            bots={playingBots}
            onExitToMenu={() => setCurrentView('menu')}
            onPlayAgainFate={() => {
              setIsModalOpen(true);
            }}
            bgmEnabled={bgmEnabled}
            onToggleBgm={handleToggleBgm}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        <GameBoardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAcceptFate={handleAcceptFate}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          bgmEnabled={bgmEnabled}
          onToggleBgm={handleToggleBgm}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          bgmVolume={bgmVolume}
          onChangeBgmVolume={handleChangeBgmVolume}
        />
      </div>
    </div>
  );
}
