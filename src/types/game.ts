export type LuckLevel = 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi';

export interface CharacterTrait {
  title: string;
  description: string;
  iconName?: string;
}

export interface Character {
  id: string;
  name: string;
  roleTitle: string;
  tagline: string;
  image: string; // Path ke /assets/characters/*.jfif atau *.png
  selectedImage?: string; // Path ke asset karakter saat terpilih (selected)
  color: {
    primary: string;
    secondary: string;
    badgeBg: string;
    border: string;
    glow: string;
  };
  stats: {
    uangAwal: number; // e.g. 10_000_000
    kesehatan: number; // 0 - 100
    mental: number; // 0 - 100
    luck: LuckLevel;
  };
  buff: CharacterTrait;
  debuff: CharacterTrait;
  quote: string;
  badge: string;
  difficulty: 'Mudah' | 'Normal' | 'Menengah' | 'Sulit' | 'Hardcore';
}

export type GameMode = 'singleplayer' | 'multiplayer';

export interface BotPlayer {
  id: string;
  name: string;
  characterId: string;
}

export interface GameSetupSelection {
  mode: GameMode;
  selectedCharacter: Character;
  botCount: number;
  bots: BotPlayer[];
  playerName: string;
}
