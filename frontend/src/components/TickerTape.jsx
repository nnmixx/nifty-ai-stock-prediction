import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TickerTape({ indices = [], activeIndex, onSelectIndex }) {
  if (!indices || indices.length === 0) return null;

  // Duplicate items for continuous infinite scroll
  const displayItems = [...indices, ...indices, ...indices];

  return (
    <div className="w-full bg-[#080B11]/90 backdrop-blur-md border-b border-white/5 py-2 px-4 overflow-hidden relative z-40 select-none">
      <div className="flex items-center">
        <div className="flex items-center gap-2 pr-4 text-xs font-mono font-semibold text-[#00E5FF] tracking-wider uppercase border-r border-white/10 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
          <span>LIVE FEEDS</span>
        </div>

        <div className="overflow-hidden flex-1 relative mask-fade-edges">
          <div className="animate-ticker flex items-center gap-8 pl-4">
            {displayItems.map((item, idx) => {
              const isSelected = activeIndex === item.symbol;
              const isPositive = item.pct_change >= 0;
              return (
                <div
                  key={`${item.symbol}-${idx}`}
                  onClick={() => onSelectIndex && onSelectIndex(item.symbol)}
                  className={`inline-flex items-center gap-2 text-xs font-mono cursor-pointer px-2.5 py-1 rounded-md transition-all duration-200 shrink-0 ${
                    isSelected
                      ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-white'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                  title={`Click to view ${item.name}`}
                >
                  <span className="font-bold tracking-tight text-white/90">
                    {item.symbol}
                  </span>
                  <span className="text-slate-400">
                    {item.last_close.toLocaleString()}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 font-semibold ${
                      isPositive ? 'text-[#00E676]' : 'text-[#FF4D6D]'
                    }`}
                  >
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPositive ? '+' : ''}{item.pct_change}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
