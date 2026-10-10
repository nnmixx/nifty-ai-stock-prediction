import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp,
  Award
} from 'lucide-react';

const TYPEWRITER_PHRASES = [
  "Predict. Analyze. Backtest.",
  "Linear Regression vs Random Forest.",
  "Honest ML for Real Markets."
];

export default function Hero({ summary, onExplore, onPredict, onOpenReport }) {
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  // Typewriter effect loop
  useEffect(() => {
    const fullText = TYPEWRITER_PHRASES[currentPhraseIdx];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIdx < fullText.length) {
          setDisplayText(fullText.slice(0, charIdx + 1));
          setCharIdx(charIdx + 1);
        } else {
          // Pause at end of text before deleting
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (charIdx > 0) {
          setDisplayText(fullText.slice(0, charIdx - 1));
          setCharIdx(charIdx - 1);
        } else {
          setIsDeleting(false);
          setCurrentPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, currentPhraseIdx]);

  return (
    <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Academic Origin Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-6 backdrop-blur-md hover:border-[#00E5FF]/40 transition-colors">
          <Award className="w-3.5 h-3.5 text-[#F5C542]" />
          <span>Workshop Project Report</span>
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          <span className="text-[#00E5FF] font-medium">Govt. Women's Polytechnic, Ranchi</span>
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          <button 
            onClick={onOpenReport}
            className="text-white hover:text-[#00E676] font-semibold underline underline-offset-2 ml-1 cursor-pointer"
          >
            View Details
          </button>
        </div>

        {/* Hero Title with Neon Shimmer */}
        <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6">
          <span className="inline-block bg-gradient-to-r from-white via-slate-100 to-[#00E5FF] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            NIFTY
          </span>{' '}
          <span className="inline-block bg-gradient-to-r from-[#00E5FF] via-[#00E676] to-[#F5C542] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,229,255,0.4)]">
            AI
          </span>
        </h1>

        {/* Subtitle with Typewriter cycling */}
        <div className="h-10 sm:h-12 flex items-center justify-center mb-8">
          <p className="font-heading text-lg sm:text-2xl md:text-3xl text-slate-300 font-medium">
            <span className="text-white">{displayText}</span>
            <span className="inline-block w-0.5 h-6 bg-[#00E5FF] ml-1 animate-pulse align-middle" />
          </p>
        </div>

        {/* Narrative Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 mb-10 leading-relaxed font-normal">
          An end-to-end, leakage-free machine learning pipeline benchmarking Linear Regression and 
          Random Forest against the Naive Baseline on 14 years of Nifty 50 historical data (2007–2021). 
          Evaluated with both statistical rigor (<span className="text-slate-200 font-mono">MAE, RMSE, R²</span>) 
          and real-world financial backtesting (<span className="text-slate-200 font-mono">Sharpe, Drawdown</span>).
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={onPredict}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-[#090A0F] shadow-lg shadow-[#00E5FF]/25 hover:shadow-[#00E5FF]/45 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-heading"
          >
            <Sparkles className="w-4 h-4 text-[#090A0F]" />
            <span>Launch Prediction Studio</span>
            <ArrowRight className="w-4 h-4 text-[#090A0F]" />
          </button>

          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-heading backdrop-blur-md"
          >
            <BarChart3 className="w-4 h-4 text-[#00E676]" />
            <span>Explore Interactive Charts</span>
          </button>
        </div>

        {/* KPI Chips Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          
          <div className="glass-panel p-4 text-left border-l-2 border-l-[#00E5FF]">
            <span className="text-xs font-mono text-slate-400 block mb-1">TOTAL RECORDS</span>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              3,381 <span className="text-xs text-slate-400 font-normal">raw</span>
            </div>
            <span className="text-[11px] text-[#00E5FF] font-mono mt-0.5 block">
              3,296 post-features
            </span>
          </div>

          <div className="glass-panel p-4 text-left border-l-2 border-l-[#00E676]">
            <span className="text-xs font-mono text-slate-400 block mb-1">DATE RANGE</span>
            <div className="text-base sm:text-lg font-bold font-mono text-white tracking-tight">
              2007 → 2021
            </div>
            <span className="text-[11px] text-[#00E676] font-mono mt-0.5 block">
              80/20 Time Split
            </span>
          </div>

          <div className="glass-panel p-4 text-left border-l-2 border-l-[#F5C542]">
            <span className="text-xs font-mono text-slate-400 block mb-1">TOP ML MODEL</span>
            <div className="text-lg font-bold font-mono text-white tracking-tight">
              Random Forest
            </div>
            <span className="text-[11px] text-[#F5C542] font-mono mt-0.5 block">
              300 Trees (Depth 6)
            </span>
          </div>

          <div className="glass-panel p-4 text-left border-l-2 border-l-[#00E5FF]">
            <span className="text-xs font-mono text-slate-400 block mb-1">PRICE R² SCORE</span>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              0.9903
            </div>
            <span className="text-[11px] text-amber-400 font-mono mt-0.5 block">
              Naive Baseline: 0.9905
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
