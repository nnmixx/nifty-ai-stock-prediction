import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  BarChart, 
  GitMerge, 
  Sliders, 
  Cpu, 
  Target, 
  CheckCircle, 
  DollarSign, 
  TrendingUp,
  Info
} from 'lucide-react';

const STAGES = [
  {
    id: 1,
    title: "1. Data Collection",
    short: "Collection",
    desc: "Historical OHLCV data from Market.csv (Yahoo Finance format, 2007-09-17 to 2021-05-31).",
    detail: "Harvests daily Open, High, Low, Close, Adj Close, and Volume for Nifty 50 (symbol NSEI).",
    icon: Database
  },
  {
    id: 2,
    title: "2. Data Cleaning",
    short: "Cleaning",
    desc: "Drop rows with missing prices (210 cells), remove duplicates (0 found), sort oldest → newest.",
    detail: "Raw 3,381 rows → 3,346 cleaned rows. Strictly chronological order to eliminate past lookahead.",
    icon: Sparkles
  },
  {
    id: 3,
    title: "3. Exploratory Data Analysis",
    short: "EDA",
    desc: "Plot price levels, volume, returns, and correlation heatmap across indicators.",
    detail: "Reveals high inter-price correlation (~1.0) and near-zero correlation in raw returns.",
    icon: BarChart
  },
  {
    id: 4,
    title: "4. Feature Engineering",
    short: "Features",
    desc: "Generate returns (t, t-1, t-4), 20d volatility, RSI(14), Close/SMA, MACD/Close, range, gap.",
    detail: "Drops first 50 days (SMA50 warm-up) leaving exactly 3,296 engineered samples.",
    icon: Sliders
  },
  {
    id: 5,
    title: "5. Train/Test Split",
    short: "Split 80/20",
    desc: "Strict chronological split: 2,636 train days (80%) and 660 test days (20%). Never shuffle.",
    detail: "Train: 2007-11-27 to 2018-09-12. Test: 2018-09-14 to 2021-05-28. Standard scaler fit on train only.",
    icon: GitMerge
  },
  {
    id: 6,
    title: "6. Model Training",
    short: "Training",
    desc: "Fit Linear Regression and Random Forest (300 trees, depth 6, min leaf 20, random_state 42).",
    detail: "Models predict next-day return, converted to next-day price via P(t+1) = P(t) * (1 + predicted return).",
    icon: Cpu
  },
  {
    id: 7,
    title: "7. Prediction",
    short: "Prediction",
    desc: "Infer next-day close on unseen test data and forecast upcoming trading day.",
    detail: "Generates point forecasts and directional signals (UP if return > 0, else DOWN).",
    icon: Target
  },
  {
    id: 8,
    title: "8. Evaluation",
    short: "Evaluation",
    desc: "Calculate MAE, RMSE, MAPE, R², and Directional Accuracy against Naive benchmark.",
    detail: "Naive baseline achieves R² = 0.9905, proving high R² alone does not signify superior alpha.",
    icon: CheckCircle
  },
  {
    id: 9,
    title: "9. Backtesting",
    short: "Backtest",
    desc: "Simulate real-world trading strategy with 0.1% transaction fee per execution.",
    detail: "Calculates Cumulative Return, Sharpe Ratio (252-day), Max Drawdown, and Active Win Rate.",
    icon: DollarSign
  },
  {
    id: 10,
    title: "10. Visualization",
    short: "Visualization",
    desc: "Interactive TradingView candles, performance comparison bars, and equity drawdown curves.",
    detail: "Delivers an accessible, honest dashboard highlighting model limitations and market realities.",
    icon: TrendingUp
  }
];

export default function DataPipeline({ summary }) {
  const [activeStage, setActiveStage] = useState(STAGES[0]);

  return (
    <section id="pipeline" className="py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
            <GitMerge size={14} />
            <span>Section 03 // Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            10-Stage Leakage-Free Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every step preserves chronological integrity: scalers fit on training data only, 
            zero future lookahead, and verifiable data counts matching the Workshop Report.
          </p>
        </div>

        {/* Live Data Counts Counters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          <div className="glass-panel p-4 text-center">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">RAW SAMPLES</span>
            <span className="text-2xl font-bold font-mono text-white">3,381</span>
            <span className="text-[10px] text-slate-500 block mt-1">Market.csv (NSEI)</span>
          </div>

          <div className="glass-panel p-4 text-center">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">MISSING CELLS</span>
            <span className="text-2xl font-bold font-mono text-amber-400">210</span>
            <span className="text-[10px] text-slate-500 block mt-1">35 rows dropped</span>
          </div>

          <div className="glass-panel p-4 text-center">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">CLEANED DATA</span>
            <span className="text-2xl font-bold font-mono text-[#00E676]">3,346</span>
            <span className="text-[10px] text-slate-500 block mt-1">0 Duplicates</span>
          </div>

          <div className="glass-panel p-4 text-center">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">AFTER FEATURES</span>
            <span className="text-2xl font-bold font-mono text-[#00E5FF]">3,296</span>
            <span className="text-[10px] text-slate-500 block mt-1">50-day SMA offset</span>
          </div>

          <div className="glass-panel p-4 text-center col-span-2 md:col-span-1">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">TRAIN / TEST SPLIT</span>
            <span className="text-lg font-bold font-mono text-white">2,636 / 660</span>
            <span className="text-[10px] text-[#00E5FF] block mt-1">80% / 20% by Time</span>
          </div>
        </div>

        {/* 10-Stage Horizontal Flow Tracker */}
        <div className="glass-panel p-6 mb-8 overflow-x-auto">
          <div className="flex items-center min-w-[900px] justify-between relative py-4">
            
            {/* Background glowing connector line */}
            <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gradient-to-r from-[#00E5FF]/20 via-[#00E676]/20 to-[#F5C542]/20 -translate-y-1/2 z-0" />

            {STAGES.map((stage) => {
              const Icon = stage.icon;
              const isSelected = activeStage.id === stage.id;
              return (
                <div 
                  key={stage.id} 
                  onClick={() => setActiveStage(stage)}
                  className="relative z-10 flex flex-col items-center cursor-pointer group px-2"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-[#00E5FF] to-[#00E676] text-[#090A0F] scale-110 shadow-lg shadow-[#00E5FF]/40 ring-4 ring-[#00E5FF]/20'
                      : 'bg-[#121826] border border-white/10 text-slate-400 hover:text-white hover:border-[#00E5FF]/40 hover:scale-105'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[11px] font-mono mt-2 transition-colors text-center ${
                    isSelected ? 'text-[#00E5FF] font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {stage.short}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Card */}
        <div className="glass-panel p-6 border-l-4 border-l-[#00E5FF] flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold">
                STAGE 0{activeStage.id}
              </span>
              <h3 className="text-lg font-heading font-bold text-white">
                {activeStage.title}
              </h3>
            </div>
            <p className="text-sm text-slate-300 font-medium mb-1">
              {activeStage.desc}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeStage.detail}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:w-64 shrink-0 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5 text-[#00E676] font-semibold mb-1">
              <Info size={14} />
              <span>Leakage Guard</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Strictly forward chronological direction. No K-Fold cross validation on temporal series.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
