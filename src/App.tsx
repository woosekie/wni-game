import { CharacterSelect } from './components/CharacterSelect';

export default function App() {
  return (
    <div
      className="min-h-screen bg-[#0B0F19] bg-cover bg-center bg-no-repeat bg-fixed text-white relative"
      style={{ backgroundImage: "url('/assets/characters/background.jpg')" }}
    >
      {/* Overlay gelap tipis agar teks & UI tetap kontras dan jelas */}
      <div className="fixed inset-0 bg-slate-950/45 pointer-events-none z-0" />
      <div className="relative z-10">
        <CharacterSelect />
      </div>
    </div>
  );
}
