import React, { useState } from 'react';
import { 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Percent, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

const FEATURES = [
  {
    name: "Simple Moving Average (SMA)",
    formula: "SMA_N = (1/N) * Σ Close_{t-i}",
    window: "20, 50, 200 days",
    category: "Trend Filter",
    why: "Smooths short-term market noise, identifying macro trend direction without intraday jitters.",
    example: "Close > SMA200 confirms secular bull market regime."
  },
  {
    name: "Exponential Moving Average (EMA)",
    formula: "EMA_t = α * Close_t + (1 - α) * EMA_{t-1}",
    window: "12, 26 days",
    category: "Momentum",
    why: "Applies exponentially declining weights to older prices, reacting faster to sudden trend shifts.",
    example: "Multiplier α = 2 / (N + 1)."
  },
  {
    name: "Daily Return (t, t-1, t-4)",
    formula: "r_t = (Close_t / Close_{t-1}) - 1",
    window: "1-day & 4-day lags",
    category: "Stationarity",
    why: "Transforms non-stationary price series into mean-reverting percentage returns suitable for regressors.",
    example: "Captures immediate momentum and weekly autoregression cycles."
  },
  {
    name: "20-Day Volatility",
    formula: "σ_20 = sqrt( (1/19) * Σ (r_i - r_mean)^2 )",
    window: "20 trading days",
    category: "Risk & Regime",
    why: "Measures dispersion of daily returns. Markets behave differently in calm vs panic regimes.",
    example: "Spikes heavily during market selloffs (e.g. March 2020)."
  },
  {
    name: "Relative Strength Index (RSI 14)",
    formula: "RSI = 100 - (100 / (1 + AvgGain / AvgLoss))",
    window: "14 periods",
    category: "Oscillator",
    why: "Bounded momentum oscillator (0 to 100). Identifies overbought (>70) and oversold (<30) extremes.",
    example: "RSI < 30 indicates exhaustion selling and mean-reversion potential."
  },
  {
    name: "MACD Normalized (MACD / Close)",
    formula: "MACD = EMA_12 - EMA_26; Normalized = MACD / Close",
    window: "12, 26, 9 signal",
    category: "Momentum",
    why: "Measures divergence between short and medium momentum, normalized by price so values are stationary across years.",
    example: "Eliminates scaling distortions between 2008 (Nifty 4k) and 2021 (Nifty 15k)."
  },
  {
    name: "Daily Range & Opening Gap",
    formula: "Range = (High - Low) / Close ; Gap = (Open / Close_{t-1}) - 1",
    window: "Intraday & Overnight",
    category: "Volatility & Sentiment",
    why: "Encodes overnight international sentiment (Gap) and intraday trading range dispersion.",
    example: "Large opening gaps often prompt intraday gap-fill behavior."
  }
];

export default function FeatureEngineering() {
  const [expandedIdx, setExpandedIdx] = useState(0);

  return (
    <section id="features" className="py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
            <Sliders size={14} />
            <span>Section 05 // Technical Indicators</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Feature Engineering & Problem Framing
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Transforming raw, non-stationary OHLCV price series into normalized mathematical signals 
            that capture trend, momentum, volatility, and overnight gap shocks.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {FEATURES.map((feat, idx) => {
            const isExpanded = expandedIdx === idx;
            return (
              <div 
                key={feat.name}
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                className={`glass-panel p-5 cursor-pointer transition-all duration-200 border ${
                  isExpanded 
                    ? 'border-[#00E5FF]/50 shadow-lg shadow-[#00E5FF]/10 ring-1 ring-[#00E5FF]/20' 
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#00E5FF] font-semibold border border-white/10">
                    {feat.category}
                  </span>
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                <h3 className="text-sm font-heading font-bold text-white mb-1.5">
                  {feat.name}
                </h3>

                <div className="bg-[#090D15] p-2 rounded-lg font-mono text-[11px] text-[#00E676] overflow-x-auto mb-3 border border-white/5">
                  <code>{feat.formula}</code>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {feat.why}
                </p>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">WINDOW:</span>
                      <span className="text-white">{feat.window}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">MECHANISM:</span>
                      <span className="text-[#F5C542]">{feat.example}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Framing Callout Box: Regression vs Classification */}
        <div className="glass-panel p-6 sm:p-8 border-l-4 border-l-[#F5C542] bg-gradient-to-r from-[#121826]/90 to-[#0B0F17]/90">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F5C542] uppercase tracking-wider mb-2">
                <Zap size={14} />
                <span>Methodology Focus // Problem Framing</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                Why Predict Next-Day Return Instead of Raw Price Level?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Stock indices exhibit strong secular drift: predicting raw price directly induces false accuracy 
                because tomorrow's price is nearly identical to today's (autocorrelation ≈ 0.99). 
                To ensure stationary inputs and prevent time-scale distortion, our models predict <strong className="text-white font-mono">Next-Day Return r_{'{t+1}'}</strong>, 
                which is then reconstituted into the dollar/rupee price:
              </p>
              
              <div className="inline-flex items-center gap-3 bg-[#090D15] px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-[#00E5FF]">
                <span>P(t+1) = P(t) × (1 + predicted_return)</span>
                <span className="text-slate-500">|</span>
                <span className="text-[#00E676]">Signal = UP if r_{'{t+1}'} &gt; 0, else DOWN</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 sm:w-72 shrink-0">
              <span className="text-white font-bold block mb-1">Key Insight:</span>
              Regression yields an exact target price for portfolio valuation. Classification predicts UP/DOWN direction for trade execution. Our architecture provides both!
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
