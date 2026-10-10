import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Activity, 
  HelpCircle, 
  Layers, 
  Calendar, 
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export default function EDASection({ historyData = [], correlationMatrix }) {
  const [activeTab, setActiveTab] = useState('price-volume');
  const [hoveredCell, setHoveredCell] = useState(null);

  // Downsampled history for fast rendering of EDA charts
  const downsampledHistory = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    // Downsample if over 1000 items to keep rendering snappy
    const step = Math.max(1, Math.floor(historyData.length / 300));
    return historyData.filter((_, idx) => idx % step === 0);
  }, [historyData]);

  // Last 120 days for High-Low range band
  const last120Days = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    return historyData.slice(-120);
  }, [historyData]);

  // Return distribution buckets (Histogram: -6% to +6%)
  const returnHistogram = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    const returns = historyData.map(d => d.ret).filter(r => r !== null && !isNaN(r));
    const bins = [
      { label: '< -4%', min: -Infinity, max: -4, count: 0 },
      { label: '-4% to -2%', min: -4, max: -2, count: 0 },
      { label: '-2% to -1%', min: -2, max: -1, count: 0 },
      { label: '-1% to 0%', min: -1, max: 0, count: 0 },
      { label: '0% to +1%', min: 0, max: 1, count: 0 },
      { label: '+1% to +2%', min: 1, max: 2, count: 0 },
      { label: '+2% to +4%', min: 2, max: 4, count: 0 },
      { label: '> +4%', min: 4, max: Infinity, count: 0 },
    ];

    returns.forEach(r => {
      const b = bins.find(bin => r >= bin.min && r < bin.max);
      if (b) b.count++;
    });

    const maxCount = Math.max(...bins.map(b => b.count), 1);
    return { bins, maxCount };
  }, [historyData]);

  // Default correlation matrix fallback if not provided
  const corr = correlationMatrix || {
    columns: ['Open', 'High', 'Low', 'Close', 'Volume', 'SMA20', 'RSI14', 'MACD', 'Ret'],
    values: [
      [1.000, 1.000, 1.000, 1.000, 0.800, 1.000, 0.100, 0.160, 0.000],
      [1.000, 1.000, 1.000, 1.000, 0.810, 1.000, 0.100, 0.160, 0.010],
      [1.000, 1.000, 1.000, 1.000, 0.800, 1.000, 0.100, 0.160, -0.010],
      [1.000, 1.000, 1.000, 1.000, 0.800, 1.000, 0.100, 0.160, 0.000],
      [0.800, 0.810, 0.800, 0.800, 1.000, 0.800, 0.100, 0.110, 0.000],
      [1.000, 1.000, 1.000, 1.000, 0.800, 1.000, 0.100, 0.180, 0.000],
      [0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 1.000, 0.640, 0.110],
      [0.160, 0.160, 0.160, 0.160, 0.110, 0.180, 0.640, 1.000, 0.040],
      [0.000, 0.010, -0.010, 0.000, 0.000, 0.000, 0.110, 0.040, 1.000]
    ]
  };

  const getCellColor = (val) => {
    if (val >= 0.8) return 'bg-[#00E5FF]/80 text-[#090A0F] font-bold';
    if (val >= 0.4) return 'bg-[#00E5FF]/40 text-white';
    if (val >= 0.1) return 'bg-[#00E5FF]/20 text-slate-200';
    if (val > -0.1) return 'bg-white/5 text-slate-400';
    if (val > -0.4) return 'bg-[#FF4D6D]/30 text-white';
    return 'bg-[#FF4D6D]/70 text-white font-bold';
  };

  return (
    <section id="eda" className="py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
              <BarChart2 size={14} />
              <span>Section 04 // Exploratory Data Analysis</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
              Understanding Price Dynamics & Correlations
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Analyzing long-term price trajectories, volatility spikes during market crashes (2008 & 2020), 
              and the fundamental statistical challenge of stock return prediction.
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('price-volume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'price-volume'
                  ? 'bg-[#00E5FF] text-[#090A0F] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Price & Returns
            </button>
            <button
              onClick={() => setActiveTab('correlation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'correlation'
                  ? 'bg-[#00E5FF] text-[#090A0F] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Correlation Heatmap
            </button>
            <button
              onClick={() => setActiveTab('range-band')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'range-band'
                  ? 'bg-[#00E5FF] text-[#090A0F] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              High-Low Range Band
            </button>
          </div>
        </div>

        {/* Tab 1: Price, Returns & Histogram */}
        {activeTab === 'price-volume' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Closing Price Area Chart (SVG) */}
              <div className="lg:col-span-2 glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-heading font-bold text-white">
                      Nifty 50 Closing Price (2007 → 2021)
                    </h3>
                    <span className="text-xs text-slate-400">Long-term uptrend interrupted by sharp macro shocks</span>
                  </div>
                  <span className="text-xs font-mono text-[#00E5FF] px-2.5 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                    NSEI 14-Year Span
                  </span>
                </div>

                {/* SVG Area Chart */}
                <div className="h-64 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Crash Annotations */}
                    <line x1="60" y1="20" x2="60" y2="180" stroke="#FF4D6D" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    <text x="65" y="45" fill="#FF4D6D" fontSize="9" fontFamily="monospace">2008 Lehman Crash (-60%)</text>

                    <line x1="500" y1="20" x2="500" y2="180" stroke="#FF4D6D" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    <text x="430" y="70" fill="#FF4D6D" fontSize="9" fontFamily="monospace">March 2020 COVID Crash</text>

                    {/* Render Area Path */}
                    {downsampledHistory.length > 2 && (
                      <>
                        <path
                          d={`M 0 190 ${downsampledHistory.map((d, i) => {
                            const x = (i / (downsampledHistory.length - 1)) * 600;
                            // Nifty range approx 2500 to 16000
                            const y = 190 - ((d.close - 2500) / (16000 - 2500)) * 170;
                            return `L ${x.toFixed(1)} ${Math.max(10, Math.min(190, y)).toFixed(1)}`;
                          }).join(' ')} L 600 190 Z`}
                          fill="url(#priceGrad)"
                        />
                        <path
                          d={`M 0 ${190 - ((downsampledHistory[0].close - 2500) / (16000 - 2500)) * 170} ${downsampledHistory.map((d, i) => {
                            const x = (i / (downsampledHistory.length - 1)) * 600;
                            const y = 190 - ((d.close - 2500) / (16000 - 2500)) * 170;
                            return `L ${x.toFixed(1)} ${Math.max(10, Math.min(190, y)).toFixed(1)}`;
                          }).join(' ')}`}
                          fill="none"
                          stroke="#00E5FF"
                          strokeWidth="2"
                        />
                      </>
                    )}
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 border-t border-white/5 pt-2">
                  <span>2007 (2,500)</span>
                  <span>2011</span>
                  <span>2015</span>
                  <span>2019</span>
                  <span>2021 (15,500+)</span>
                </div>
              </div>

              {/* Return Distribution Histogram */}
              <div className="glass-panel p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-heading font-bold text-white mb-1">
                    Daily Return Distribution
                  </h3>
                  <span className="text-xs text-slate-400 block mb-4">
                    High peak at 0%, but significant fat tails in crash periods
                  </span>

                  <div className="space-y-2 mt-4">
                    {returnHistogram.bins.map((bin) => {
                      const pctWidth = (bin.count / returnHistogram.maxCount) * 100;
                      return (
                        <div key={bin.label} className="text-xs font-mono">
                          <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                            <span>{bin.label}</span>
                            <span className="text-slate-300 font-semibold">{bin.count} days</span>
                          </div>
                          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                bin.label.includes('-') 
                                  ? 'bg-[#FF4D6D]/80' 
                                  : (bin.label.includes('0%') ? 'bg-[#00E5FF]' : 'bg-[#00E676]')
                              }`}
                              style={{ width: `${Math.max(3, pctWidth)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono">
                  <span className="text-[#F5C542] font-bold block mb-1">Statistical Note:</span>
                  Returns are non-normal with excess kurtosis (fat tails). Models assuming Gaussian errors will underestimate extreme tail events.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Interactive Correlation Heatmap */}
        {activeTab === 'correlation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Heatmap Grid */}
            <div className="lg:col-span-2 glass-panel p-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-heading font-bold text-white">
                    Feature Correlation Heatmap
                  </h3>
                  <span className="text-xs text-slate-400">Pearson correlation coefficient matrix</span>
                </div>
                {hoveredCell && (
                  <div className="text-xs font-mono px-3 py-1 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
                    {hoveredCell.row} × {hoveredCell.col}: <span className="font-bold">{hoveredCell.val}</span>
                  </div>
                )}
              </div>

              <div className="min-w-[500px]">
                {/* Header row */}
                <div className="grid grid-cols-10 gap-1 text-[11px] font-mono text-center text-slate-400 mb-1">
                  <div className="text-left pl-1">Feature</div>
                  {corr.columns.map(c => (
                    <div key={c} className="font-semibold truncate">{c}</div>
                  ))}
                </div>

                {/* Heatmap rows */}
                {corr.columns.map((rowLabel, rIdx) => (
                  <div key={rowLabel} className="grid grid-cols-10 gap-1 mb-1 items-center">
                    <div className="text-[11px] font-mono font-semibold text-slate-300 truncate pl-1">
                      {rowLabel}
                    </div>
                    {corr.values[rIdx].map((val, cIdx) => (
                      <div
                        key={cIdx}
                        onMouseEnter={() => setHoveredCell({ row: rowLabel, col: corr.columns[cIdx], val })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`h-9 flex items-center justify-center rounded text-[11px] font-mono cursor-pointer transition-transform hover:scale-105 hover:z-10 shadow-sm ${getCellColor(val)}`}
                      >
                        {val.toFixed(2)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Color scale legend */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-400">
                <span>Negative (-1.0)</span>
                <div className="flex gap-1 h-3 w-48 rounded overflow-hidden">
                  <div className="flex-1 bg-[#FF4D6D]" />
                  <div className="flex-1 bg-white/10" />
                  <div className="flex-1 bg-[#00E5FF]/40" />
                  <div className="flex-1 bg-[#00E5FF]" />
                </div>
                <span>Positive (+1.0)</span>
              </div>
            </div>

            {/* Plain English "How to Read It" Callout */}
            <div className="glass-panel p-6 flex flex-col justify-between border-l-4 border-l-[#00E5FF]">
              <div>
                <div className="flex items-center gap-2 text-white font-heading font-bold text-base mb-3">
                  <HelpCircle size={18} className="text-[#00E5FF]" />
                  <span>How to Read This Heatmap</span>
                </div>

                <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="font-bold text-white block mb-1">1. Price Multicollinearity (≈ 1.000)</span>
                    Open, High, Low, and Close have virtually identical values. Today's price level alone carries almost all variance, which falsely inflates raw-price R² scores.
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="font-bold text-[#F5C542] block mb-1">2. Daily Return Independence (≈ 0.000)</span>
                    Daily return exhibits virtually zero linear correlation with price levels. It is the true stationary signal, and predicting it is inherently difficult.
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="font-bold text-[#00E676] block mb-1">3. Why We Engineer Features</span>
                    Raw price levels are non-stationary. By transforming prices into normalized technical ratios (RSI, MACD/Close, Bollinger width), we extract stationary features that generalize across time.
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400">
                Source: Section 9, Workshop Report
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: High-Low Range Band */}
        {activeTab === 'range-band' && (
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  High vs Low Range Band (Last 120 Days)
                </h3>
                <span className="text-xs text-slate-400">The shaded envelope represents intraday market dispersion</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                120 Trading Sessions
              </span>
            </div>

            {/* High Low SVG Band */}
            <div className="h-64 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E676" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00E676" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {last120Days.length > 2 && (() => {
                  const minP = Math.min(...last120Days.map(d => d.low)) * 0.98;
                  const maxP = Math.max(...last120Days.map(d => d.high)) * 1.02;
                  
                  const highPoints = last120Days.map((d, i) => {
                    const x = (i / (last120Days.length - 1)) * 600;
                    const y = 190 - ((d.high - minP) / (maxP - minP)) * 170;
                    return { x, y };
                  });

                  const lowPoints = last120Days.map((d, i) => {
                    const x = (i / (last120Days.length - 1)) * 600;
                    const y = 190 - ((d.low - minP) / (maxP - minP)) * 170;
                    return { x, y };
                  });

                  const closePoints = last120Days.map((d, i) => {
                    const x = (i / (last120Days.length - 1)) * 600;
                    const y = 190 - ((d.close - minP) / (maxP - minP)) * 170;
                    return { x, y };
                  });

                  // Band polygon: High line left-to-right + Low line right-to-left
                  const bandPath = `M ${highPoints[0].x} ${highPoints[0].y} ` +
                    highPoints.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
                    ` ` + [...lowPoints].reverse().map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
                    ` Z`;

                  return (
                    <>
                      <path d={bandPath} fill="url(#bandGrad)" />
                      {/* High line */}
                      <path
                        d={`M ${highPoints[0].x} ${highPoints[0].y} ${highPoints.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}`}
                        fill="none"
                        stroke="#00E676"
                        strokeWidth="1"
                        opacity="0.6"
                      />
                      {/* Low line */}
                      <path
                        d={`M ${lowPoints[0].x} ${lowPoints[0].y} ${lowPoints.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}`}
                        fill="none"
                        stroke="#FF4D6D"
                        strokeWidth="1"
                        opacity="0.6"
                      />
                      {/* Close line */}
                      <path
                        d={`M ${closePoints[0].x} ${closePoints[0].y} ${closePoints.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}`}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-3 pt-2 border-t border-white/5">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-white inline-block" /> Close</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#00E676] inline-block" /> High</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#FF4D6D] inline-block" /> Low</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#00E676]/30 inline-block" /> Daily Range Envelope</span>
              </div>
              <span>Shaded spread expands during heightened volatility</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
