import React from 'react';
import { motion } from 'framer-motion';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  displayValue: string;
  colorScheme: 'gold' | 'emerald' | 'sky' | 'rose' | 'amber';
  sublabel?: string;
}

const colorMap = {
  gold: {
    bg: 'bg-amber-400',
    text: 'text-amber-400',
    barBg: 'bg-amber-950/40',
  },
  emerald: {
    bg: 'bg-emerald-400',
    text: 'text-emerald-400',
    barBg: 'bg-emerald-950/40',
  },
  sky: {
    bg: 'bg-sky-400',
    text: 'text-sky-400',
    barBg: 'bg-sky-950/40',
  },
  rose: {
    bg: 'bg-rose-400',
    text: 'text-rose-400',
    barBg: 'bg-rose-950/40',
  },
  amber: {
    bg: 'bg-orange-400',
    text: 'text-orange-400',
    barBg: 'bg-orange-950/40',
  },
};

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  max = 100,
  displayValue,
  colorScheme,
  sublabel,
}) => {
  const colors = colorMap[colorScheme];
  const percentage = Math.min(Math.max((value / max) * 100, 6), 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="uppercase tracking-wider font-extrabold text-xs">{label}</span>
          {sublabel && (
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">({sublabel})</span>
          )}
        </span>
        <span className={`font-black text-xs sm:text-sm tracking-wide ${colors.text}`}>
          {displayValue}
        </span>
      </div>

      <div className="relative h-3.5 sm:h-4 w-full rounded-md border-2 border-black bg-slate-950 shadow-[2px_2px_0px_#000] overflow-hidden p-0.5">
        <div className="absolute inset-0 flex justify-between px-2 pointer-events-none z-10 opacity-20">
          <div className="w-px h-full bg-white" />
          <div className="w-px h-full bg-white" />
          <div className="w-px h-full bg-white" />
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className={`h-full rounded-sm ${colors.bg} relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-25 comic-stripes" />
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/35" />
        </motion.div>
      </div>
    </div>
  );
};
