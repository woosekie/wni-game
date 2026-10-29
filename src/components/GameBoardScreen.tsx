import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, Music, Volume2, VolumeX } from 'lucide-react';
import type { Character } from '../types/game';
import type { BotOpponent } from './GameBoardModal';
import { sound } from '../utils/sound';

interface GameBoardScreenProps {
  character: Character;
  bots: BotOpponent[];
  onExitToMenu: () => void;
  onPlayAgainFate: () => void;
  bgmEnabled: boolean;
  onToggleBgm: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

interface BoardTile {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  category: 'start' | 'cost' | 'work' | 'hazard' | 'bonus' | 'heal';
  col: number;
  row: number;
}

export interface MatchParticipant {
  id: string;
  name: string;
  shortLabel: string;
  isBot: boolean;
  character: Character;
  money: number;
  health: number;
  mental: number;
  position: number;
  lap: number;
  isEliminated: boolean;
  eliminatedReason?: string;
}

const DEFAULT_TILE_IMAGE = '/assets/tiles/kos.jfif';

// 40 Steps arranged clockwise on a 14x8 perimeter grid
const BOARD_TILES: BoardTile[] = [
  // Top row: left to right (col 1..14, row 1) -> #1 to #14
  { id: 0, name: 'START / GAJIAN', subtitle: 'Gaji Bulanan', image: DEFAULT_TILE_IMAGE, category: 'start', col: 1, row: 1 },
  { id: 1, name: 'TAGIHAN KOS', subtitle: 'Sewa & Air', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 2, row: 1 },
  { id: 2, name: 'PECEL LELE', subtitle: 'Makan Malam', image: DEFAULT_TILE_IMAGE, category: 'heal', col: 3, row: 1 },
  { id: 3, name: 'MACET TOTAL', subtitle: 'Tua di Jalan', image: DEFAULT_TILE_IMAGE, category: 'hazard', col: 4, row: 1 },
  { id: 4, name: 'BELANJA PASAR', subtitle: 'Sembako Dapur', image: DEFAULT_TILE_IMAGE, category: 'heal', col: 5, row: 1 },
  { id: 5, name: 'PARKIR GAIB', subtitle: 'Tiba-tiba Muncul', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 6, row: 1 },
  { id: 6, name: 'KERJA LEMBUR', subtitle: 'Kejar Deadline', image: DEFAULT_TILE_IMAGE, category: 'work', col: 7, row: 1 },
  { id: 7, name: 'TANGGAL KEMBAR', subtitle: 'Kalap Checkout', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 8, row: 1 },
  { id: 8, name: 'PUNGLI ORMAS', subtitle: 'Uang Koordinasi', image: DEFAULT_TILE_IMAGE, category: 'hazard', col: 9, row: 1 },
  { id: 9, name: 'NGOPI SKENA', subtitle: 'Es Kopi Susu', image: DEFAULT_TILE_IMAGE, category: 'heal', col: 10, row: 1 },
  { id: 10, name: 'VIRAL MEDSOS', subtitle: 'Konten FYP', image: DEFAULT_TILE_IMAGE, category: 'bonus', col: 11, row: 1 },
  { id: 11, name: 'BELI KUOTA', subtitle: 'Paket Data', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 12, row: 1 },
  { id: 12, name: 'KONDANGAN', subtitle: 'Amplop Teman', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 13, row: 1 },
  { id: 13, name: 'JOB FREELANCE', subtitle: 'Proyek Cair', image: DEFAULT_TILE_IMAGE, category: 'bonus', col: 14, row: 1 },

  // Right column: top to bottom (col 14, row 2..7) -> #15 to #20
  { id: 14, name: 'RANJAU PAKU', subtitle: 'Tambal Ban', image: DEFAULT_TILE_IMAGE, category: 'hazard', col: 14, row: 2 },
  { id: 15, name: 'DAPAT ARISAN', subtitle: 'Kocokan Warga', image: DEFAULT_TILE_IMAGE, category: 'bonus', col: 14, row: 3 },
  { id: 16, name: 'PAJAK & IURAN', subtitle: 'Potongan Wajib', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 14, row: 4 },
  { id: 17, name: 'NETIZEN JULID', subtitle: 'Drama Medsos', image: DEFAULT_TILE_IMAGE, category: 'hazard', col: 14, row: 5 },
  { id: 18, name: 'TOKEN LISTRIK', subtitle: 'Pulsa Listrik', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 14, row: 6 },
  { id: 19, name: 'BANSOS CAIR', subtitle: 'Bantuan Tunai', image: DEFAULT_TILE_IMAGE, category: 'bonus', col: 14, row: 7 },

  // Bottom row: right to left (col 14..1, row 8) -> #21 to #34
  { id: 20, name: 'TETANGGA JULID', subtitle: 'Kapan Nikah?', image: DEFAULT_TILE_IMAGE, category: 'hazard', col: 14, row: 8 },
  { id: 21, name: 'WARUNG MADURA', subtitle: 'Buka 24 Jam', image: DEFAULT_TILE_IMAGE, category: 'heal', col: 13, row: 8 },
  { id: 22, name: 'TEROR PINJOL', subtitle: 'Kontak Darurat', image: DEFAULT_TILE_IMAGE, category: 'hazard', col: 12, row: 8 },
  { id: 23, name: 'BONUS TARGET', subtitle: 'Insentif Kerja', image: DEFAULT_TILE_IMAGE, category: 'bonus', col: 11, row: 8 },
  { id: 24, name: 'RUMAH SAKIT', subtitle: 'Berobat / BPJS', image: DEFAULT_TILE_IMAGE, category: 'heal', col: 10, row: 8 },
  { id: 25, name: 'BANJIR & MOGOK', subtitle: 'Servis Motor', image: DEFAULT_TILE_IMAGE, category: 'hazard', col: 9, row: 8 },
  { id: 26, name: 'REZEKI THR', subtitle: 'Tunjangan Cair', image: DEFAULT_TILE_IMAGE, category: 'bonus', col: 8, row: 8 },
  { id: 27, name: 'GEDUNG KPK', subtitle: 'Audit Harta', image: DEFAULT_TILE_IMAGE, category: 'hazard', col: 7, row: 8 },
  { id: 28, name: 'IURAN RT', subtitle: 'Sampah & Ronda', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 6, row: 8 },
  { id: 29, name: 'LARI PAGI CFD', subtitle: 'Olahraga Murah', image: DEFAULT_TILE_IMAGE, category: 'heal', col: 5, row: 8 },
  { id: 30, name: 'CABAI NAIK', subtitle: 'Inflasi Pangan', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 4, row: 8 },
  { id: 31, name: 'HEALING WEEKEND', subtitle: 'Rehat Sejenak', image: DEFAULT_TILE_IMAGE, category: 'heal', col: 3, row: 8 },
  { id: 32, name: 'WIFI & KONSUMSI', subtitle: 'Gratisan Rapat', image: DEFAULT_TILE_IMAGE, category: 'bonus', col: 2, row: 8 },
  { id: 33, name: 'TAGIHAN PAYLATER', subtitle: 'Jatuh Tempo', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 1, row: 8 },

  // Left column: bottom to top (col 1, row 7..2) -> #35 to #40
  { id: 34, name: 'MENANG GIVEAWAY', subtitle: 'Rezeki Medsos', image: DEFAULT_TILE_IMAGE, category: 'bonus', col: 1, row: 7 },
  { id: 35, name: 'ANTRE BIROKRASI', subtitle: 'Fotokopi KTP', image: DEFAULT_TILE_IMAGE, category: 'hazard', col: 1, row: 6 },
  { id: 36, name: 'MIDNIGHT SALE', subtitle: 'Beli Baju Baru', image: DEFAULT_TILE_IMAGE, category: 'heal', col: 1, row: 5 },
  { id: 37, name: 'ANTRE BENSIN', subtitle: 'Isi Full Tank', image: DEFAULT_TILE_IMAGE, category: 'cost', col: 1, row: 4 },
  { id: 38, name: 'JUAL PRELOVED', subtitle: 'Beres Kamar', image: DEFAULT_TILE_IMAGE, category: 'bonus', col: 1, row: 3 },
  { id: 39, name: 'KEROKAN ANGIN', subtitle: 'Merah Bata', image: DEFAULT_TILE_IMAGE, category: 'heal', col: 1, row: 2 },
];

interface TurnEventLog {
  turn: number;
  actorName: string;
  actorIsBot: boolean;
  tileId: number;
  tileName: string;
  tileSubtitle: string;
  tileImage: string;
  tileCategory: BoardTile['category'];
  title: string;
  description: string;
  traitTriggered?: string;
  deltaMoney: number;
  deltaHealth: number;
  deltaMental: number;
}

// Graphical 6-sided ivory die face matching the warm illustration palette
const DieFace: React.FC<{ value: number; isRolling: boolean }> = ({ value, isRolling }) => {
  const pipPositions: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };
  const activePips = pipPositions[value] || [4];

  return (
    <motion.div
      animate={isRolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="w-12 h-12 rounded-xl bg-[#FFFDF8] border-3 border-[#1E140E] shadow-[3px_3px_0px_#1E140E] p-2 grid grid-cols-3 grid-rows-3 gap-0.5 flex-shrink-0"
    >
      {Array.from({ length: 9 }, (_, idx) => (
        <div key={idx} className="flex items-center justify-center">
          {activePips.includes(idx) && (
            <div className={`w-2 h-2 rounded-full ${value === 1 ? 'bg-[#C85A3A] w-2.5 h-2.5' : 'bg-[#1E140E]'}`} />
          )}
        </div>
      ))}
    </motion.div>
  );
};

// Warm illustrated progress bar for the player's HUD
const IllustratedStatBar: React.FC<{
  label: string;
  sublabel: string;
  value: number;
  max?: number;
  displayValue: string;
  fillClass: string;
  textClass: string;
}> = ({ label, sublabel, value, max = 100, displayValue, fillClass, textClass }) => {
  const pct = Math.min(Math.max((value / max) * 100, 6), 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-[#1E140E]">{label}</span>
          <span className="text-[10px] text-[#6E503B] font-medium hidden sm:inline">({sublabel})</span>
        </div>
        <span className={`font-black text-xs ${textClass}`}>{displayValue}</span>
      </div>
      <div className="relative h-3.5 w-full rounded-md border-2 border-[#1E140E] bg-[#E8D5B5] shadow-[2px_2px_0px_#1E140E] overflow-hidden p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`h-full rounded-xs ${fillClass} relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30" />
        </motion.div>
      </div>
    </div>
  );
};

function createInitialParticipants(playerChar: Character, bots: BotOpponent[]): MatchParticipant[] {
  const human: MatchParticipant = {
    id: 'player',
    name: 'Kamu',
    shortLabel: 'KAMU',
    isBot: false,
    character: playerChar,
    money: playerChar.stats.uangAwal,
    health: playerChar.stats.kesehatan,
    mental: playerChar.stats.mental,
    position: 0,
    lap: 1,
    isEliminated: false,
  };

  const botParticipants: MatchParticipant[] = bots.map((b, idx) => ({
    id: b.id,
    name: b.name,
    shortLabel: `B${idx + 1}`,
    isBot: true,
    character: b.character,
    money: b.character.stats.uangAwal,
    health: b.character.stats.kesehatan,
    mental: b.character.stats.mental,
    position: 0,
    lap: 1,
    isEliminated: false,
  }));

  return [human, ...botParticipants];
}

export const GameBoardScreen: React.FC<GameBoardScreenProps> = ({
  character,
  bots,
  onExitToMenu,
  onPlayAgainFate,
  bgmEnabled,
  onToggleBgm,
  soundEnabled,
  onToggleSound,
}) => {
  const [participants, setParticipants] = useState<MatchParticipant[]>(() =>
    createInitialParticipants(character, bots)
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [totalTurns, setTotalTurns] = useState<number>(0);

  const [diceValue, setDiceValue] = useState<number>(1);
  const [effectiveSteps, setEffectiveSteps] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const [tilePopupEvent, setTilePopupEvent] = useState<TurnEventLog | null>(null);

  const [currentEvent, setCurrentEvent] = useState<TurnEventLog>({
    turn: 0,
    actorName: 'Kamu',
    actorIsBot: false,
    tileId: 1,
    tileName: 'START / GAJIAN',
    tileSubtitle: 'Gaji Bulanan',
    tileImage: DEFAULT_TILE_IMAGE,
    tileCategory: 'start',
    title: `Selamat Datang, ${character.name}`,
    description: `Kamu bersaing melawan ${bots.length} Bot melewati 40 petak kehidupan WNI. Capai tabungan Rp 15.000.000 atau bertahan paling akhir untuk menang.`,
    deltaMoney: 0,
    deltaHealth: 0,
    deltaMental: 0,
  });

  const [logs, setLogs] = useState<TurnEventLog[]>([]);
  const [endState, setEndState] = useState<{
    isVictory: boolean;
    title: string;
    message: string;
  } | null>(null);

  const participantsRef = useRef(participants);
  participantsRef.current = participants;

  const endStateRef = useRef(endState);
  endStateRef.current = endState;

  const formatMoney = (val: number) => {
    const abs = Math.abs(val);
    const prefix = val < 0 ? '-Rp ' : 'Rp ';
    return prefix + abs.toLocaleString('id-ID');
  };

  // Warm cel-shaded category colors harmonized with kos.jfif & background.jpg
  const getCategoryHeaderColor = (cat: BoardTile['category']) => {
    switch (cat) {
      case 'start':
        return 'bg-[#F5B841] text-[#1E140E]';
      case 'bonus':
        return 'bg-[#4E8C52] text-[#FFFDF8]';
      case 'heal':
        return 'bg-[#4B8EB3] text-[#FFFDF8]';
      case 'work':
        return 'bg-[#E08A3C] text-[#1E140E]';
      case 'hazard':
        return 'bg-[#B84030] text-[#FFFDF8]';
      case 'cost':
      default:
        return 'bg-[#D96B43] text-[#FFFDF8]';
    }
  };

  const getCategorySticker = (cat: BoardTile['category']) => {
    switch (cat) {
      case 'start':
        return { text: 'GAJIAN!', bg: 'bg-[#F5B841]', textCol: 'text-[#1E140E]' };
      case 'bonus':
        return { text: 'REZEKI!', bg: 'bg-[#4E8C52]', textCol: 'text-[#FFFDF8]' };
      case 'heal':
        return { text: 'PULIH!', bg: 'bg-[#4B8EB3]', textCol: 'text-[#FFFDF8]' };
      case 'work':
        return { text: 'LEMBUR!', bg: 'bg-[#E08A3C]', textCol: 'text-[#1E140E]' };
      case 'hazard':
        return { text: 'APES!', bg: 'bg-[#B84030]', textCol: 'text-[#FFFDF8]' };
      case 'cost':
      default:
        return { text: 'TAGIHAN!', bg: 'bg-[#D96B43]', textCol: 'text-[#FFFDF8]' };
    }
  };

  const computeTileEffect = (
    actor: MatchParticipant,
    tileIndex: number,
    passedStart: boolean
  ) => {
    const tile = BOARD_TILES[tileIndex];
    const charId = actor.character.id;
    let dMoney = 0;
    let dHealth = 0;
    let dMental = 0;
    let traitNote = '';
    let desc = '';

    if (charId === 'pedagang') {
      dMoney += 250000;
      traitNote = 'Buff Pedagang: +Rp 250.000 Cashflow Harian';
    }

    if (passedStart && tileIndex !== 0) {
      if (charId === 'mahasiswa') {
        traitNote = (traitNote ? traitNote + ' • ' : '') + 'Debuff Mahasiswa: Tanpa Gaji Tetap di START';
      } else if (charId === 'pegawai') {
        dMoney += 2000000;
        traitNote = (traitNote ? traitNote + ' • ' : '') + 'Lewat START: Gaji +Rp 2.500.000 (Pajak -Rp 500.000)';
      } else {
        dMoney += 2500000;
        traitNote = (traitNote ? traitNote + ' • ' : '') + 'Lewat START: Gaji Bulanan +Rp 2.500.000';
      }
    }

    const isDiscountRole = charId === 'pedagang' || charId === 'mahasiswa';
    const mentalMultiplier = charId === 'pegawai' ? 2 : 1;

    switch (tile.id) {
      case 0: {
        if (charId === 'mahasiswa') {
          dMoney += 500000;
          dMental += 5;
          desc = 'Mendarat di START. Dapat kiriman uang saku Rp 500.000.';
          traitNote = 'Debuff Mahasiswa: Nol Gaji Tetap';
        } else if (charId === 'pegawai') {
          dMoney += 2500000;
          dMental += 8;
          desc = 'Mendarat di hari Gajian. Gaji Rp 3.000.000 cair (dipotong pajak Rp 500.000).';
          traitNote = 'Buff Payroll Pasti & Auto-Debet Pajak';
        } else {
          dMoney += 3000000;
          dMental += 8;
          desc = 'Mendarat di petak Gajian. Pemasukan bulanan Rp 3.000.000 cair.';
        }
        break;
      }
      case 1: {
        const cost = charId === 'mahasiswa' ? 300000 : charId === 'pedagang' ? 400000 : 800000;
        dMoney -= cost;
        desc = `Ibu Kos mengetuk pintu kamar. Tagihan sewa kos dan air bulanan jatuh tempo sebesar ${formatMoney(cost)}.`;
        if (isDiscountRole) traitNote = (traitNote ? traitNote + ' • ' : '') + 'Buff Diskon Biaya Kos';
        break;
      }
      case 2: {
        const cost = isDiscountRole ? 75000 : 150000;
        dMoney -= cost;
        dHealth += 8;
        dMental += 6;
        desc = `Makan malam pecel lele pinggir jalan seharga ${formatMoney(cost)}. Fisik dan suasana hati membaik.`;
        break;
      }
      case 3: {
        dHealth -= 6;
        dMental -= 8 * mentalMultiplier;
        desc = 'Terjebak kemacetan parah selama 2 jam di jalan raya. Badan pegal dan pikiran penat.';
        break;
      }
      case 4: {
        const cost = isDiscountRole ? 200000 : 400000;
        dMoney -= cost;
        dHealth += 12;
        dMental += 4;
        desc = `Belanja bahan makanan segar di pasar seharga ${formatMoney(cost)}. Stamina tubuh meningkat.`;
        break;
      }
      case 5: {
        if (charId === 'pejabat') {
          desc = 'Juru parkir langsung memberi hormat dan membukakan jalan untuk mobil dinas.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Buff Pejabat: Bebas Pungutan';
        } else {
          dMoney -= 120000;
          dMental -= 4;
          desc = 'Bayar akumulasi parkir liar yang muncul tiba-tiba saat menarik mundur motor (-Rp 120.000).';
        }
        break;
      }
      case 6: {
        dMoney += 950000;
        dHealth -= 10;
        dMental -= 10 * mentalMultiplier;
        desc = 'Lembur sampai larut malam demi mengejar tenggat pekerjaan. Dapat tambahan Rp 950.000.';
        if (charId === 'pegawai') traitNote = (traitNote ? traitNote + ' • ' : '') + 'Debuff Pegawai: Burnout 2x Lipat';
        break;
      }
      case 7: {
        dMoney -= 550000;
        dMental += 10;
        desc = 'Tergoda belanja barang diskon saat promo tanggal kembar (-Rp 550.000).';
        break;
      }
      case 8: {
        if (charId === 'pejabat') {
          desc = 'Oknum pungli langsung mundur begitu melihat pelat nomor dinas.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Buff Pejabat: Kebal Pungutan Ormas';
        } else if (charId === 'pedagang') {
          dMoney -= 1200000;
          dMental -= 12;
          desc = 'Lapak dagangan terkena penertiban dan pungutan ganda (-Rp 1.200.000).';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Debuff Pedagang: Denda Pungli 2x Lipat';
        } else {
          dMoney -= 600000;
          dMental -= 8;
          desc = 'Dimintai iuran keamanan dan koordinasi lingkungan sebesar Rp 600.000.';
        }
        break;
      }
      case 9: {
        const cost = isDiscountRole ? 100000 : 250000;
        dMoney -= cost;
        dMental += 14;
        desc = `Rehat sejenak membeli es kopi susu (${formatMoney(cost)}). Pikiran kembali segar.`;
        break;
      }
      case 10: {
        if (charId === 'influencer') {
          dMoney += 2500000;
          dMental += 15;
          desc = 'Konten menembus jutaan penonton. Brand besar langsung membayar endorse Rp 2.500.000.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Buff Influencer: Jackpot Endorse';
        } else {
          dMoney += 800000;
          dMental += 8;
          desc = 'Video unggahan mendadak viral dan menghasilkan komisi Rp 800.000.';
        }
        break;
      }
      case 11: {
        dMoney -= 250000;
        desc = 'Kuota internet habis di tengah bulan. Beli paket data Rp 250.000.';
        break;
      }
      case 12: {
        dMoney -= 450000;
        dHealth += 6;
        dMental += 5;
        desc = 'Menghadiri undangan pernikahan teman dan mengisi amplop Rp 450.000.';
        break;
      }
      case 13: {
        if (charId === 'mahasiswa') {
          dMoney += 1800000;
          dMental += 12;
          desc = 'Dana beasiswa dan bayaran proyek lepas cair bersamaan sebesar Rp 1.800.000.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Spesial Mahasiswa: Beasiswa & Freelance';
        } else {
          dMoney += 1000000;
          dHealth -= 5;
          desc = 'Menyelesaikan pekerjaan sampingan akhir pekan dengan bayaran Rp 1.000.000.';
        }
        break;
      }
      case 14: {
        dMoney -= 200000;
        dHealth -= 5;
        dMental -= 6 * mentalMultiplier;
        desc = 'Ban kendaraan bocor terkena paku di jalan. Biaya ganti ban Rp 200.000.';
        break;
      }
      case 15: {
        dMoney += 1200000;
        dMental += 10;
        desc = 'Nama keluar saat undian arisan warga, menerima uang tunai Rp 1.200.000.';
        break;
      }
      case 16: {
        if (charId === 'pejabat') {
          desc = 'Seluruh tagihan pajak ditanggung oleh tunjangan fasilitas jabatan.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Buff Pejabat: Kebal Potongan Pajak';
        } else {
          dMoney -= 750000;
          dMental -= 5;
          desc = 'Membayar kewajiban pajak dan iuran bulanan sebesar Rp 750.000.';
        }
        break;
      }
      case 17: {
        if (charId === 'influencer') {
          dMoney -= 1500000;
          dMental -= 30;
          desc = 'Terkena gelombang boikot warganet. Kontrak batal Rp 1.500.000 dan mental turun drastis.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Debuff Influencer: Cancel Culture';
        } else {
          dMental -= 12 * mentalMultiplier;
          desc = 'Perdebatan panas di media sosial menguras kewarasanmu seharian.';
        }
        break;
      }
      case 18: {
        const cost = isDiscountRole ? 175000 : 350000;
        dMoney -= cost;
        desc = `Meteran listrik berbunyi nyaring tengah malam. Isi ulang token listrik ${formatMoney(cost)}.`;
        break;
      }
      case 19: {
        dMoney += 650000;
        dMental += 6;
        desc = 'Menerima pencairan dana bantuan tunai sebesar Rp 650.000.';
        break;
      }
      case 20: {
        dMental -= 10 * mentalMultiplier;
        desc = 'Pertanyaan basa-basi tetangga soal urusan pribadi membuat suasana hati memburuk.';
        break;
      }
      case 21: {
        dMoney -= 120000;
        dHealth += 10;
        dMental += 6;
        desc = 'Belanja kebutuhan tengah malam di Warung Madura 24 jam (-Rp 120.000).';
        break;
      }
      case 22: {
        dMoney -= 300000;
        dMental -= 12 * mentalMultiplier;
        desc = 'Nomor telepon dijadikan kontak darurat pinjaman online teman (-Rp 300.000).';
        break;
      }
      case 23: {
        dMoney += 1100000;
        dMental += 8;
        desc = 'Target pekerjaan tercapai. Menerima bonus insentif sebesar Rp 1.100.000.';
        break;
      }
      case 24: {
        if (charId === 'pegawai') {
          dHealth += 25;
          dMental += 5;
          desc = 'Pemeriksaan kesehatan dan obat di Rumah Sakit ditanggung penuh oleh BPJS Swasta.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Buff Pegawai: Gratis Berobat RS';
        } else {
          dMoney -= 800000;
          dHealth += 25;
          desc = 'Berobat ke Rumah Sakit seharga Rp 800.000. Kondisi fisik pulih +25.';
        }
        break;
      }
      case 25: {
        dMoney -= 450000;
        dHealth -= 8;
        dMental -= 8 * mentalMultiplier;
        desc = 'Kendaraan mogok akibat menerobos genangan banjir. Biaya perbaikan Rp 450.000.';
        break;
      }
      case 26: {
        dMoney += 1500000;
        dMental += 12;
        desc = 'Menerima pencairan Tunjangan Hari Raya sebesar Rp 1.500.000.';
        break;
      }
      case 27: {
        if (charId === 'pejabat') {
          const totalAfterPassive = Math.max(0, actor.money + dMoney);
          const penalty = Math.round(totalAfterPassive * 0.8);
          dMoney -= penalty;
          dMental -= 25;
          desc = `Terkena Operasi Tangkap Tangan KPK. 80% harta kekayaan (${formatMoney(penalty)}) disita.`;
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Debuff Pejabat: Target OTT KPK (-80% Harta)';
        } else {
          dMoney += 350000;
          dMental += 5;
          desc = 'Berpartisipasi dalam audit publik dan menerima kompensasi Rp 350.000.';
        }
        break;
      }
      case 28: {
        const cost = isDiscountRole ? 100000 : 200000;
        dMoney -= cost;
        desc = `Membayar iuran kebersihan dan keamanan lingkungan RT sebesar ${formatMoney(cost)}.`;
        break;
      }
      case 29: {
        dMoney -= 100000;
        dHealth += 16;
        dMental += 10;
        desc = 'Olahraga pagi di Car Free Day dan sarapan sehat (-Rp 100.000).';
        break;
      }
      case 30: {
        if (charId === 'pedagang') {
          dMoney += 850000;
          dMental += 10;
          desc = 'Harga komoditas pangan naik. Dagangan sayur laris manis dengan keuntungan Rp 850.000.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Berkah Pedagang: Untung Saat Harga Naik';
        } else {
          const cost = charId === 'mahasiswa' ? 200000 : 450000;
          dMoney -= cost;
          dMental -= 5;
          desc = `Kenaikan harga bahan pokok membuat pengeluaran dapur bertambah ${formatMoney(cost)}.`;
        }
        break;
      }
      case 31: {
        const cost = isDiscountRole ? 200000 : 400000;
        dMoney -= cost;
        dHealth += 10;
        dMental += 20;
        desc = `Beristirahat di akhir pekan seharga ${formatMoney(cost)}. Kewarasan kembali pulih.`;
        break;
      }
      case 32: {
        dMoney += 300000;
        dHealth += 6;
        dMental += 6;
        desc = 'Mendapat konsumsi rapat gratis dan menghemat uang makan harian Rp 300.000.';
        break;
      }
      case 33: {
        dMoney -= 650000;
        dMental -= 8 * mentalMultiplier;
        desc = 'Tagihan cicilan Paylater bulan lalu jatuh tempo sebesar Rp 650.000.';
        break;
      }
      case 34: {
        dMoney += 900000;
        dMental += 10;
        desc = 'Memenangkan undian berhadiah di media sosial sebesar Rp 900.000.';
        break;
      }
      case 35: {
        if (charId === 'pejabat') {
          dMoney += 500000;
          dMental += 5;
          desc = 'Kunjungan kerja ke kantor layanan publik dan menerima uang perjalanan dinas Rp 500.000.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Buff Pejabat: Jalur VIP Birokrasi';
        } else {
          dMoney -= 150000;
          dHealth -= 6;
          dMental -= 12 * mentalMultiplier;
          desc = 'Mengantre pengurusan dokumen seharian dan keluar biaya administrasi Rp 150.000.';
        }
        break;
      }
      case 36: {
        const cost = isDiscountRole ? 150000 : 300000;
        dMoney -= cost;
        dMental += 15;
        desc = `Membeli pakaian baru saat diskon tengah malam (${formatMoney(cost)}).`;
        break;
      }
      case 37: {
        if (charId === 'pejabat') {
          desc = 'Bahan bakar kendaraan dinas ditanggung sepenuhnya oleh anggaran kantor.';
          traitNote = (traitNote ? traitNote + ' • ' : '') + 'Buff Pejabat: BBM Dinas Gratis';
        } else {
          dMoney -= 180000;
          dHealth -= 4;
          desc = 'Mengantre di SPBU dan mengisi bahan bakar penuh seharga Rp 180.000.';
        }
        break;
      }
      case 38: {
        dMoney += 600000;
        dMental += 6;
        desc = 'Menjual barang pribadi yang masih layak pakai dengan hasil Rp 600.000.';
        break;
      }
      case 39: {
        dMoney -= 50000;
        dHealth += 18;
        dMental += 8;
        desc = 'Istirahat dan kerokan saat masuk angin (-Rp 50.000). Stamina tubuh kembali pulih.';
        break;
      }
    }

    return { tile, dMoney, dHealth, dMental, traitNote, desc };
  };

  const advanceToNextTurn = (updatedList: MatchParticipant[], currentIdx: number) => {
    const total = updatedList.length;
    for (let offset = 1; offset <= total; offset++) {
      const candidateIdx = (currentIdx + offset) % total;
      if (!updatedList[candidateIdx].isEliminated) {
        if (candidateIdx <= currentIdx) {
          setRoundNumber((r) => r + 1);
        }
        setActiveIndex(candidateIdx);
        return;
      }
    }
  };

  const handleCloseTilePopup = () => {
    sound.playClick();
    setTilePopupEvent(null);
    if (!endStateRef.current) {
      advanceToNextTurn(participantsRef.current, 0);
    }
  };

  const executeTurnForIndex = (actorIdx: number) => {
    const currentList = participantsRef.current;
    const actor = currentList[actorIdx];
    if (!actor || actor.isEliminated || endStateRef.current) return;

    setIsMoving(true);
    sound.playClick();

    const rawRoll = Math.floor(Math.random() * 6) + 1;
    const totalSteps = actor.character.id === 'mahasiswa' ? rawRoll * 2 : rawRoll;

    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
      shuffleCount += 1;
      setDiceValue(Math.floor(Math.random() * 6) + 1);

      if (shuffleCount >= 5) {
        clearInterval(shuffleInterval);
        setDiceValue(rawRoll);
        setEffectiveSteps(actor.character.id === 'mahasiswa' ? totalSteps : null);

        let stepTaken = 0;
        let curPos = actor.position;
        let curLap = actor.lap;
        let passedStart = false;

        const moveInterval = setInterval(() => {
          stepTaken += 1;
          curPos = (curPos + 1) % BOARD_TILES.length;
          if (curPos === 0) {
            passedStart = true;
            curLap += 1;
          }

          setParticipants((prev) =>
            prev.map((p, idx) =>
              idx === actorIdx ? { ...p, position: curPos, lap: curLap } : p
            )
          );
          sound.playClick();

          if (stepTaken >= totalSteps) {
            clearInterval(moveInterval);
            sound.playSelect();

            const { tile, dMoney, dHealth, dMental, traitNote, desc } = computeTileEffect(
              actor,
              curPos,
              passedStart
            );

            const nextMoney = actor.money + dMoney;
            const nextHealth = Math.max(0, Math.min(100, actor.health + dHealth));
            const nextMental = Math.max(0, Math.min(100, actor.mental + dMental));

            let eliminated = false;
            let elimReason = '';
            if (nextMoney < 0) {
              eliminated = true;
              elimReason = 'Bangkrut & Terlilit Utang';
            } else if (nextHealth <= 0) {
              eliminated = true;
              elimReason = 'Kesehatan Fisik Mencapai 0';
            } else if (nextMental <= 0) {
              eliminated = true;
              elimReason = 'Kesehatan Mental Mencapai 0';
            }

            const updatedList = participantsRef.current.map((p, idx) =>
              idx === actorIdx
                ? {
                    ...p,
                    position: curPos,
                    lap: curLap,
                    money: nextMoney,
                    health: nextHealth,
                    mental: nextMental,
                    isEliminated: eliminated,
                    eliminatedReason: elimReason || undefined,
                  }
                : p
            );

            setParticipants(updatedList);

            const nextTurnNum = totalTurns + 1;
            setTotalTurns(nextTurnNum);

            const eventEntry: TurnEventLog = {
              turn: nextTurnNum,
              actorName: `${actor.name} (${actor.character.name})`,
              actorIsBot: actor.isBot,
              tileId: tile.id + 1,
              tileName: tile.name,
              tileSubtitle: tile.subtitle,
              tileImage: tile.image,
              tileCategory: tile.category,
              title: `${actor.name} mendarat di Petak #${tile.id + 1}: ${tile.name}`,
              description: eliminated ? `${desc} (${actor.name} Gugur: ${elimReason})` : desc,
              traitTriggered: traitNote || undefined,
              deltaMoney: dMoney,
              deltaHealth: dHealth,
              deltaMental: dMental,
            };

            setCurrentEvent(eventEntry);
            setLogs((prev) => [eventEntry, ...prev.slice(0, 19)]);

            const humanPlayer = updatedList[0];
            const aliveBots = updatedList.slice(1).filter((b) => !b.isEliminated);

            if (humanPlayer.isEliminated) {
              setEndState({
                isVictory: false,
                title: 'PERMAINAN BERAKHIR',
                message: `Kamu gagal bertahan hidup karena: ${humanPlayer.eliminatedReason}.`,
              });
              setIsMoving(false);
              return;
            }

            if (nextMoney >= 15000000) {
              if (!actor.isBot) {
                sound.playStartGame();
                try {
                  confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
                } catch {}
                setEndState({
                  isVictory: true,
                  title: 'MERDEKA FINANSIAL',
                  message: `Sebagai ${actor.character.name}, tabunganmu berhasil mencapai ${formatMoney(nextMoney)} dan mengalahkan seluruh Bot.`,
                });
              } else {
                setEndState({
                  isVictory: false,
                  title: `${actor.name.toUpperCase()} MENANG`,
                  message: `${actor.name} (${actor.character.name}) berhasil mencapai target ${formatMoney(nextMoney)} lebih dulu.`,
                });
              }
              setIsMoving(false);
              return;
            }

            if (aliveBots.length === 0 && updatedList.length > 1) {
              sound.playStartGame();
              try {
                confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
              } catch {}
              setEndState({
                isVictory: true,
                title: 'PENYINTAS TERAKHIR',
                message: 'Seluruh Bot lawan telah gugur. Kamu menang sebagai warga yang bertahan paling akhir.',
              });
              setIsMoving(false);
              return;
            }

            setIsMoving(false);

            if (!actor.isBot) {
              setTilePopupEvent(eventEntry);
            } else {
              advanceToNextTurn(updatedList, actorIdx);
            }
          }
        }, 145);
      }
    }, 50);
  };

  useEffect(() => {
    const currentActor = participants[activeIndex];
    if (!currentActor || !currentActor.isBot || isMoving || endState || tilePopupEvent) return;

    const timer = setTimeout(() => {
      executeTurnForIndex(activeIndex);
    }, 850);

    return () => clearTimeout(timer);
  }, [activeIndex, isMoving, endState, tilePopupEvent]);

  const handleResetMatch = () => {
    sound.playClick();
    const fresh = createInitialParticipants(character, bots);
    setParticipants(fresh);
    setActiveIndex(0);
    setRoundNumber(1);
    setTotalTurns(0);
    setEffectiveSteps(null);
    setTilePopupEvent(null);
    setEndState(null);
    setLogs([]);
    setCurrentEvent({
      turn: 0,
      actorName: 'Kamu',
      actorIsBot: false,
      tileId: 1,
      tileName: 'START / GAJIAN',
      tileSubtitle: 'Gaji Bulanan',
      tileImage: DEFAULT_TILE_IMAGE,
      tileCategory: 'start',
      title: 'Permainan Dimulai Ulang',
      description: `Lempar dadu untuk kembali bersaing melawan ${bots.length} Bot di 40 petak kehidupan WNI.`,
      deltaMoney: 0,
      deltaHealth: 0,
      deltaMental: 0,
    });
  };

  const human = participants[0];
  const activeParticipant = participants[activeIndex] || human;
  const isHumanTurn = activeIndex === 0 && !isMoving && !endState && !tilePopupEvent;

  const totalHumanExpense = logs
    .filter((l) => !l.actorIsBot && l.deltaMoney < 0)
    .reduce((acc, cur) => acc + Math.abs(cur.deltaMoney), 0);

  return (
    <div className="min-h-screen w-full text-[#1E140E] py-3 px-3 sm:px-5 flex flex-col justify-between gap-2.5">
      {/* TOP BAR - Flush to Top-Left & Top-Right Corners */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2">
        {/* Top-Left: Menu + Round Indicator */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onExitToMenu();
            }}
            className="px-3.5 py-2 rounded-xl border-2 border-[#1E140E] bg-[#FBF3E4] hover:bg-[#F3E3C6] text-[#1E140E] font-black text-xs sm:text-sm shadow-[3px_3px_0px_#1E140E] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Menu Utama</span>
          </button>

          <div className="bg-[#FBF3E4] border-2 border-[#1E140E] px-3.5 py-2 rounded-xl shadow-[3px_3px_0px_#1E140E] text-xs sm:text-sm font-black flex items-center gap-2 text-[#1E140E]">
            <span className="bg-[#F5B841] text-[#1E140E] px-2 py-0.2 rounded border border-[#1E140E] text-xs">
              Putaran #{roundNumber}
            </span>
            <span className="text-[#9E7B5D]">|</span>
            <span>
              Giliran:{' '}
              <span className={activeParticipant.isBot ? 'text-[#2C6E91]' : 'text-[#2E7D32]'}>
                {activeParticipant.name}
              </span>
            </span>
          </div>
        </div>

        {/* Center Top: Player & Bot Turn Strip */}
        <div className="flex flex-wrap items-center gap-2">
          {participants.map((p, idx) => {
            const isCurrentTurn = idx === activeIndex && !p.isEliminated;
            return (
              <div
                key={p.id}
                className={`px-2.5 py-1.5 rounded-xl border-2 border-[#1E140E] flex items-center gap-2 text-xs transition-all ${
                  p.isEliminated
                    ? 'bg-[#E5D5BC]/70 opacity-55 line-through'
                    : isCurrentTurn
                    ? 'bg-[#FFF9EE] ring-2 ring-[#F5B841] -translate-y-0.5 shadow-[3px_3px_0px_#1E140E]'
                    : 'bg-[#FBF3E4]/95 shadow-[2px_2px_0px_#1E140E]'
                }`}
              >
                <img
                  src={p.character.image}
                  alt={p.name}
                  className="w-7 h-7 rounded-lg object-cover object-top border-2 border-[#1E140E] bg-[#EAD7B7]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-[#1E140E] text-[11px]">{p.name}</span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-[#F5B841] text-[#1E140E] border border-[#1E140E]">
                      #{p.position + 1}
                    </span>
                  </div>
                  <div className="text-[10px] font-black text-[#2E7D32]">
                    {p.isEliminated ? 'GUGUR' : formatMoney(p.money)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top-Right: Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleBgm}
            className={`px-3 py-2 rounded-xl border-2 border-[#1E140E] shadow-[3px_3px_0px_#1E140E] flex items-center gap-1.5 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-black ${
              bgmEnabled
                ? 'bg-[#F5B841] text-[#1E140E] hover:bg-[#F8CC58]'
                : 'bg-[#E5D5BC] text-[#6E503B] hover:bg-[#DAC6A7]'
            }`}
          >
            <Music size={14} className={bgmEnabled ? 'text-[#1E140E]' : 'text-[#6E503B]'} />
            <span>BGM {bgmEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className={`px-3 py-2 rounded-xl border-2 border-[#1E140E] shadow-[3px_3px_0px_#1E140E] flex items-center gap-1.5 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-black ${
              soundEnabled
                ? 'bg-[#F5B841] text-[#1E140E] hover:bg-[#F8CC58]'
                : 'bg-[#E5D5BC] text-[#6E503B] hover:bg-[#DAC6A7]'
            }`}
          >
            {soundEnabled ? (
              <Volume2 size={14} className="text-[#1E140E]" />
            ) : (
              <VolumeX size={14} className="text-[#6E503B]" />
            )}
            <span>SFX {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* CENTER: 40-STEP ILLUSTRATED TABLETOP BOARD (14 cols x 8 rows) */}
      <div className="w-full max-w-[1640px] mx-auto bg-[#1E140E]/25 border-4 border-[#1E140E] rounded-2xl p-2 sm:p-3 shadow-[6px_6px_0px_#1E140E] overflow-x-auto">
        <div
          className="min-w-[1040px] grid gap-1.5"
          style={{
            gridTemplateColumns: 'repeat(14, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(8, minmax(0, 1fr))',
          }}
        >
          {BOARD_TILES.map((tile) => {
            const occupants = participants.filter(
              (p) => !p.isEliminated && p.position === tile.id
            );
            const isHumanHere = occupants.some((p) => !p.isBot);
            const hasAnyone = occupants.length > 0;
            const headerStrip = getCategoryHeaderColor(tile.category);

            return (
              <div
                key={tile.id}
                style={{ gridColumnStart: tile.col, gridRowStart: tile.row }}
                className={`relative rounded-xl border-2 flex flex-col justify-between transition-all select-none overflow-hidden bg-[#EAD8BC] h-[62px] sm:h-[68px] ${
                  isHumanHere
                    ? 'border-[#1E140E] ring-3 ring-[#F5B841] z-10 -translate-y-0.5 shadow-[3px_3px_0px_#1E140E]'
                    : hasAnyone
                    ? 'border-[#1E140E] ring-2 ring-[#4B8EB3] z-10 shadow-[2px_2px_0px_#1E140E]'
                    : 'border-[#1E140E] shadow-[2px_2px_0px_#1E140E]'
                }`}
              >
                {/* Illustrated Tabletop Top Category Strip */}
                <div className={`w-full px-1.5 py-0.5 border-b border-[#1E140E] flex items-center justify-between ${headerStrip}`}>
                  <span className="text-[8px] font-black leading-none">
                    #{tile.id + 1}
                  </span>
                </div>

                {/* Tile Illustration (kos.jfif) slightly toned down when idle */}
                <div className="relative flex-1 w-full overflow-hidden bg-[#2A1D15]">
                  <img
                    src={tile.image}
                    alt={tile.name}
                    className={`w-full h-full object-cover ${hasAnyone ? 'brightness-100' : 'brightness-[0.85]'}`}
                  />
                </div>

                {/* Toned-down Warm Sand Bottom Nameplate */}
                <div className="w-full bg-[#EAD8BC] border-t border-[#1E140E] px-1 py-0.5">
                  <div className="text-[7px] sm:text-[8px] font-extrabold text-[#1E140E] leading-tight truncate text-center">
                    {tile.name}
                  </div>
                </div>

                {/* Pawns on this tile */}
                {occupants.length > 0 && (
                  <div className="absolute top-0.5 right-0.5 z-20 flex items-center -space-x-1">
                    {occupants.map((occ) => (
                      <motion.div
                        key={occ.id}
                        layoutId={`pawn-${occ.id}`}
                        transition={{ type: 'spring', stiffness: 360, damping: 25 }}
                        title={`${occ.name} (${occ.character.name})`}
                        className={`flex items-center gap-0.5 border border-[#1E140E] rounded-full px-1 py-0.2 shadow-[1px_1px_0px_#1E140E] ${
                          occ.isBot
                            ? 'bg-[#4B8EB3] text-[#FFFDF8]'
                            : 'bg-[#F5B841] text-[#1E140E] z-30'
                        }`}
                      >
                        <img
                          src={occ.character.selectedImage || occ.character.image}
                          alt={occ.name}
                          className="w-3.5 h-3.5 rounded-full object-cover object-top border border-[#1E140E]"
                        />
                        <span className="text-[7px] font-black">{occ.shortLabel}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* CENTER TABLETOP ARENA (cols 2..13, rows 2..7) - Transparent & Dimmed so Background Shines Through */}
          <div
            style={{ gridColumn: '2 / span 12', gridRow: '2 / span 6' }}
            className="border-2 border-[#1E140E]/80 rounded-xl p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden bg-[#1A120D]/30"
          >
            {/* Top Status Row (Semi-transparent Warm Espresso Badges) */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="bg-[#241913]/75 backdrop-blur-xs border-2 border-[#120B07] rounded-xl px-3 py-1.5 shadow-[3px_3px_0px_#120B07] flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-md border border-[#120B07] font-black text-[10px] sm:text-[11px] ${
                    activeParticipant.isBot ? 'bg-[#3E7696] text-[#F5EAD8]' : 'bg-[#D9A336] text-[#1E140E]'
                  }`}
                >
                  {activeParticipant.isBot ? `GILIRAN ${activeParticipant.name.toUpperCase()}` : 'GILIRANMU'}
                </span>
                <span className="text-xs font-black text-[#EFE2CE]">
                  {activeParticipant.character.name}
                </span>
              </div>

              <div className="bg-[#241913]/75 backdrop-blur-xs border-2 border-[#120B07] rounded-xl px-3 py-1.5 shadow-[3px_3px_0px_#120B07] text-xs font-bold text-[#D6C3A5]">
                Target Menang: <span className="font-black text-[#68B06C]">Rp 15.000.000</span>
              </div>
            </div>

            {/* Center Split: Semi-transparent Warm Story Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEvent.turn + '-' + currentEvent.tileName + '-' + currentEvent.actorName}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 my-auto py-2 flex items-center justify-center w-full"
              >
                <div className="bg-[#241913]/75 backdrop-blur-sm border-3 border-[#120B07] rounded-2xl p-3.5 sm:p-4 shadow-[5px_5px_0px_#120B07] flex flex-col sm:flex-row items-center gap-4 max-w-2xl w-full">
                  {/* Framed Tile Illustration Card */}
                  <div className="relative w-32 sm:w-40 aspect-[4/3] rounded-xl border-2 border-[#120B07] bg-[#1E140E] shadow-[3px_3px_0px_#120B07] overflow-hidden flex-shrink-0">
                    <img
                      src={currentEvent.tileImage}
                      alt={currentEvent.tileName}
                      className="w-full h-full object-cover brightness-90"
                    />
                    <div
                      className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md border border-[#120B07] text-[9px] font-black shadow-[1px_1px_0px_#120B07] ${getCategoryHeaderColor(
                        currentEvent.tileCategory
                      )}`}
                    >
                      PETAK #{currentEvent.tileId}
                    </div>
                  </div>

                  {/* Event Details Box */}
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="inline-block px-2 py-0.5 rounded bg-[#3B2A20]/90 border border-[#120B07] text-[10px] font-extrabold text-[#DFC49B]">
                      {currentEvent.tileSubtitle}
                    </div>
                    <h3 className="text-sm sm:text-lg font-black text-[#F4E8D6] leading-tight">
                      {currentEvent.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D0BCA0] font-normal leading-relaxed">
                      {currentEvent.description}
                    </p>

                    {currentEvent.traitTriggered && (
                      <div className="inline-block bg-[#3A291D]/90 border border-[#120B07] text-[#E6B84F] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {currentEvent.traitTriggered}
                      </div>
                    )}

                    {currentEvent.turn > 0 && (
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        {currentEvent.deltaMoney !== 0 && (
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-md border-2 border-[#120B07] shadow-[2px_2px_0px_#120B07] ${
                              currentEvent.deltaMoney > 0
                                ? 'bg-[#467E4A] text-[#F5EAD8]'
                                : 'bg-[#C05638] text-[#F5EAD8]'
                            }`}
                          >
                            {currentEvent.deltaMoney > 0 ? '+' : ''}
                            {formatMoney(currentEvent.deltaMoney)}
                          </span>
                        )}
                        {currentEvent.deltaHealth !== 0 && (
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-md border-2 border-[#120B07] shadow-[2px_2px_0px_#120B07] ${
                              currentEvent.deltaHealth > 0
                                ? 'bg-[#467E4A] text-[#F5EAD8]'
                                : 'bg-[#A63A2B] text-[#F5EAD8]'
                            }`}
                          >
                            Kesehatan {currentEvent.deltaHealth > 0 ? '+' : ''}
                            {currentEvent.deltaHealth}
                          </span>
                        )}
                        {currentEvent.deltaMental !== 0 && (
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-md border-2 border-[#120B07] shadow-[2px_2px_0px_#120B07] ${
                              currentEvent.deltaMental > 0
                                ? 'bg-[#3E7696] text-[#F5EAD8]'
                                : 'bg-[#A63A2B] text-[#F5EAD8]'
                            }`}
                          >
                            Mental {currentEvent.deltaMental > 0 ? '+' : ''}
                            {currentEvent.deltaMental}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Action Bar: Semi-transparent Dice Tray + Roll Button */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="bg-[#241913]/75 backdrop-blur-xs border-2 border-[#120B07] rounded-2xl px-4 py-2 shadow-[4px_4px_0px_#120B07] flex items-center gap-3">
                <DieFace value={diceValue} isRolling={isMoving} />

                {effectiveSteps && (
                  <span className="text-xs font-black bg-[#C97A32] text-[#1E140E] px-2.5 py-1.5 rounded-lg border-2 border-[#120B07] shadow-[2px_2px_0px_#120B07]">
                    ×2 Langkah ({effectiveSteps})
                  </span>
                )}

                <button
                  type="button"
                  disabled={!isHumanTurn}
                  onClick={() => executeTurnForIndex(0)}
                  className={`py-2.5 px-6 rounded-xl border-2 border-[#120B07] font-black text-xs sm:text-sm shadow-[3px_3px_0px_#120B07] transition-all ${
                    !isHumanTurn
                      ? 'bg-[#3D2D23] text-[#9C846C] cursor-wait'
                      : 'bg-[#DFA83C] hover:bg-[#EBB64C] text-[#1E140E] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                  }`}
                >
                  {activeParticipant.isBot
                    ? `GILIRAN ${activeParticipant.name.toUpperCase()}...`
                    : isMoving
                    ? 'MELANGKAH...'
                    : 'LEMPAR DADU'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM HUD: POJOK KIRI BAWAH (KARAKTER & STAT) & POJOK KANAN BAWAH (RIWAYAT PENGELUARAN) */}
      <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-4">
        {/* POJOK KIRI BAWAH: KARAKTER & STAT-STATNYA */}
        <div className="w-full lg:w-[560px] xl:w-[640px] bg-[#FBF3E4] border-3 border-[#1E140E] rounded-2xl p-4 shadow-[5px_5px_0px_#1E140E] flex flex-col sm:flex-row items-center gap-4">
          {/* Character Portrait Frame */}
          <div className="flex items-center sm:flex-col gap-3 sm:gap-2 sm:w-36 flex-shrink-0 w-full sm:text-center border-b sm:border-b-0 sm:border-r border-[#D8C3A2] pb-3 sm:pb-0 sm:pr-4">
            <div className="w-16 h-20 sm:w-24 sm:h-28 rounded-xl border-2 border-[#1E140E] shadow-[3px_3px_0px_#1E140E] overflow-hidden flex-shrink-0 bg-[#EAD7B7]">
              <img
                src={human.character.selectedImage || human.character.image}
                alt={human.character.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-[#1E140E] truncate leading-tight">
                {human.character.name}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#6E503B] font-semibold truncate mt-0.5">
                {human.character.roleTitle}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex-1 w-full space-y-2.5">
            <div className="flex items-center justify-between bg-[#F4E4C8] border-2 border-[#1E140E] rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#1E140E]">
              <span className="text-xs sm:text-sm font-black text-[#1E140E] leading-tight">
                Uang Tunai
              </span>
              <span className="text-sm sm:text-base font-black text-[#2E7D32]">
                {formatMoney(human.money)}
              </span>
            </div>

            <IllustratedStatBar
              label="Kesehatan"
              sublabel="Fisik & Stamina"
              value={human.health}
              max={100}
              displayValue={`${human.health} / 100`}
              fillClass="bg-[#4E8C52]"
              textClass="text-[#2E7D32]"
            />

            <IllustratedStatBar
              label="Kesehatan Mental"
              sublabel="Kewarasan"
              value={human.mental}
              max={100}
              displayValue={`${human.mental} / 100`}
              fillClass="bg-[#4B8EB3]"
              textClass="text-[#2C6E91]"
            />
          </div>
        </div>

        {/* POJOK KANAN BAWAH: RIWAYAT PENGELUARAN & MUTASI */}
        <div className="w-full lg:w-[560px] xl:w-[640px] bg-[#FBF3E4] border-3 border-[#1E140E] rounded-2xl p-4 shadow-[5px_5px_0px_#1E140E] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-[#D8C3A2] pb-2 mb-2.5">
            <span className="text-xs sm:text-sm font-black text-[#1E140E] leading-tight">
              Riwayat Pengeluaran & Mutasi
            </span>
            <span className="text-xs font-black bg-[#D96B43] text-[#FFFDF8] px-2.5 py-0.5 rounded-lg border border-[#1E140E] shadow-[2px_2px_0px_#1E140E]">
              Total Keluar: -Rp {totalHumanExpense.toLocaleString('id-ID')}
            </span>
          </div>

          {logs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-6 text-xs text-[#6E503B] font-medium italic">
              Belum ada catatan mutasi. Lempar dadu untuk memulai perjalanan.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="bg-[#F4E4C8] border-2 border-[#1E140E] rounded-xl px-3 py-1.5 text-xs flex items-center justify-between gap-2 shadow-[2px_2px_0px_#1E140E]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded border border-[#1E140E] ${
                          log.actorIsBot ? 'bg-[#4B8EB3] text-[#FFFDF8]' : 'bg-[#F5B841] text-[#1E140E]'
                        }`}
                      >
                        {log.actorIsBot ? 'BOT' : 'KAMU'}
                      </span>
                      <span className="font-black text-[#1E140E] truncate">
                        Petak #{log.tileId} {log.tileName}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#5C402C] font-medium truncate mt-0.5">
                      {log.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {log.deltaMoney !== 0 ? (
                      <span
                        className={`font-black whitespace-nowrap px-2 py-0.5 rounded border border-[#1E140E] text-[11px] ${
                          log.deltaMoney > 0
                            ? 'bg-[#4E8C52] text-[#FFFDF8]'
                            : 'bg-[#D96B43] text-[#FFFDF8]'
                        }`}
                      >
                        {log.deltaMoney > 0 ? '+' : ''}
                        {formatMoney(log.deltaMoney)}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-[#6E503B]">Rp 0</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL KARTU PETAK SAAT BIDAKMU MENDARAT */}
      <AnimatePresence>
        {tilePopupEvent && !endState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E140E]/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-[#FBF3E4] border-4 border-[#1E140E] rounded-2xl overflow-hidden shadow-[8px_8px_0px_#1E140E] p-4 sm:p-5 space-y-4"
            >
              {/* Top Card Header Bar */}
              <div
                className={`px-3.5 py-2 rounded-xl border-2 border-[#1E140E] shadow-[2px_2px_0px_#1E140E] flex items-center justify-between ${getCategoryHeaderColor(
                  tilePopupEvent.tileCategory
                )}`}
              >
                <span className="text-xs font-black">PETAK #{tilePopupEvent.tileId}</span>
                <span className="text-xs font-black uppercase">{tilePopupEvent.tileSubtitle}</span>
              </div>

              {/* Framed Tile Illustration (kos.jfif) with Floating Sticker */}
              <div className="relative">
                {(() => {
                  const sticker = getCategorySticker(tilePopupEvent.tileCategory);
                  return (
                    <div
                      className={`absolute -top-2 -right-2 z-20 ${sticker.bg} ${sticker.textCol} font-black text-xs px-3 py-1 rounded-md border-2 border-[#1E140E] shadow-[3px_3px_0px_#1E140E] transform rotate-6 select-none`}
                    >
                      {sticker.text}
                    </div>
                  );
                })()}

                <div className="relative w-full aspect-[4/3] rounded-xl border-3 border-[#1E140E] overflow-hidden bg-[#F4E4C8] shadow-[4px_4px_0px_#1E140E]">
                  <img
                    src={tilePopupEvent.tileImage}
                    alt={tilePopupEvent.tileName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1E140E]/85 via-[#1E140E]/30 to-transparent pt-8 pb-2.5 px-3">
                    <h3 className="text-lg sm:text-xl font-black text-[#FFFDF8] leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                      {tilePopupEvent.tileName}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Narrative & Stat Changes */}
              <div className="bg-[#F4E4C8] border-2 border-[#1E140E] rounded-xl p-3.5 text-center space-y-3 shadow-[3px_3px_0px_#1E140E]">
                <p className="text-xs sm:text-sm text-[#1E140E] font-medium leading-relaxed">
                  {tilePopupEvent.description}
                </p>

                {tilePopupEvent.traitTriggered && (
                  <div className="inline-block bg-[#FBF3E4] border border-[#1E140E] text-[#5C3A24] text-[11px] font-bold px-2.5 py-0.5 rounded">
                    {tilePopupEvent.traitTriggered}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {tilePopupEvent.deltaMoney !== 0 && (
                    <span
                      className={`text-xs sm:text-sm font-black px-3 py-1 rounded-lg border-2 border-[#1E140E] shadow-[2px_2px_0px_#1E140E] ${
                        tilePopupEvent.deltaMoney > 0
                          ? 'bg-[#4E8C52] text-[#FFFDF8]'
                          : 'bg-[#D96B43] text-[#FFFDF8]'
                      }`}
                    >
                      {tilePopupEvent.deltaMoney > 0 ? '+' : ''}
                      {formatMoney(tilePopupEvent.deltaMoney)}
                    </span>
                  )}
                  {tilePopupEvent.deltaHealth !== 0 && (
                    <span
                      className={`text-xs sm:text-sm font-black px-3 py-1 rounded-lg border-2 border-[#1E140E] shadow-[2px_2px_0px_#1E140E] ${
                        tilePopupEvent.deltaHealth > 0
                          ? 'bg-[#4E8C52] text-[#FFFDF8]'
                          : 'bg-[#B84030] text-[#FFFDF8]'
                      }`}
                    >
                      Kesehatan {tilePopupEvent.deltaHealth > 0 ? '+' : ''}
                      {tilePopupEvent.deltaHealth}
                    </span>
                  )}
                  {tilePopupEvent.deltaMental !== 0 && (
                    <span
                      className={`text-xs sm:text-sm font-black px-3 py-1 rounded-lg border-2 border-[#1E140E] shadow-[2px_2px_0px_#1E140E] ${
                        tilePopupEvent.deltaMental > 0
                          ? 'bg-[#4B8EB3] text-[#FFFDF8]'
                          : 'bg-[#B84030] text-[#FFFDF8]'
                      }`}
                    >
                      Mental {tilePopupEvent.deltaMental > 0 ? '+' : ''}
                      {tilePopupEvent.deltaMental}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseTilePopup}
                className="w-full py-3 px-5 rounded-xl border-3 border-[#1E140E] bg-[#F5B841] hover:bg-[#F8CC58] text-[#1E140E] font-black text-sm shadow-[4px_4px_0px_#1E140E] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                {tilePopupEvent.deltaMoney < 0 ? 'BAYAR & LANJUTKAN GILIRAN' : 'TERIMA & LANJUTKAN GILIRAN'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Game Over / Victory Overlay Modal */}
      <AnimatePresence>
        {endState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E140E]/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-md bg-[#FBF3E4] border-4 border-[#1E140E] rounded-2xl p-6 text-center shadow-[8px_8px_0px_#1E140E] space-y-4"
            >
              <div
                className={`inline-block px-3 py-1 rounded-md border-2 border-[#1E140E] font-black text-xs shadow-[2px_2px_0px_#1E140E] ${
                  endState.isVictory ? 'bg-[#F5B841] text-[#1E140E]' : 'bg-[#B84030] text-[#FFFDF8]'
                }`}
              >
                {endState.isVictory ? 'MENANG' : 'KALAH'}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#1E140E]">
                {endState.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#3D2A1D] font-medium leading-relaxed">
                {endState.message}
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                {endState.isVictory && (
                  <button
                    type="button"
                    onClick={() => setEndState(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1E140E] bg-[#4E8C52] hover:bg-[#5FA063] text-[#FFFDF8] font-black text-xs sm:text-sm shadow-[3px_3px_0px_#1E140E] cursor-pointer"
                  >
                    Lanjut Main
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetMatch}
                  className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1E140E] bg-[#F4E4C8] hover:bg-[#EAD7B7] text-[#1E140E] font-black text-xs sm:text-sm shadow-[3px_3px_0px_#1E140E] cursor-pointer"
                >
                  Main Ulang
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onPlayAgainFate();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1E140E] bg-[#F5B841] hover:bg-[#F8CC58] text-[#1E140E] font-black text-xs sm:text-sm shadow-[3px_3px_0px_#1E140E] cursor-pointer"
                >
                  Kocok Takdir Baru
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
