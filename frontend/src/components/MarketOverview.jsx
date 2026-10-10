import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { 
  BarChart2, 
  Layers, 
  Eye, 
  EyeOff, 
  Calendar, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle,
  Download
} from 'lucide-react';

export default function MarketOverview({ 
  historyData = [], 
  indices = [], 
  selectedIndex = 'NSEI', 
  onSelectIndex,
  isDark = true 
}) {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const sma20SeriesRef = useRef(null);
  const sma50SeriesRef = useRef(null);
  const sma200SeriesRef = useRef(null);
  const ema20SeriesRef = useRef(null);
  const bbUpperSeriesRef = useRef(null);
  const bbLowerSeriesRef = useRef(null);

  // Overlay state toggles
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showSMA200, setShowSMA200] = useState(false);
  const [showEMA20, setShowEMA20] = useState(false);
  const [showBB, setShowBB] = useState(false);
  const [selectedRange, setSelectedRange] = useState('MAX');
  const [hoveredCandle, setHoveredCandle] = useState(null);

  // Filter history based on selected time range
  const filteredData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    if (selectedRange === 'MAX') return historyData;

    const lastDate = new Date(historyData[historyData.length - 1].time);
    const filterDate = new Date(lastDate);

    if (selectedRange === '1M') filterDate.setMonth(filterDate.getMonth() - 1);
    else if (selectedRange === '6M') filterDate.setMonth(filterDate.getMonth() - 6);
    else if (selectedRange === '1Y') filterDate.setFullYear(filterDate.getFullYear() - 1);
    else if (selectedRange === '5Y') filterDate.setFullYear(filterDate.getFullYear() - 5);

    const filterStr = filterDate.toISOString().slice(0, 10);
    return historyData.filter(d => d.time >= filterStr);
  }, [historyData, selectedRange]);

  // Current stats (last candle or hovered)
  const currentStats = useMemo(() => {
    if (hoveredCandle) return hoveredCandle;
    if (filteredData.length > 0) return filteredData[filteredData.length - 1];
    return null;
  }, [hoveredCandle, filteredData]);

  // Initialize and update Lightweight Charts
  useEffect(() => {
    if (!chartContainerRef.current || filteredData.length === 0) return;

    // Cleanup previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#94A3B8' : '#475569',
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.05)' },
        horzLines: { color: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.05)' },
      },
      crosshair: {
        vertLine: { color: '#00E5FF', width: 1, style: 2 },
        horzLine: { color: '#00E5FF', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)',
      },
      timeScale: {
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)',
        timeVisible: true,
      },
      height: 480,
    });

    chartInstanceRef.current = chart;

    // 1. Candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#00E676',
      downColor: '#FF4D6D',
      borderVisible: false,
      wickUpColor: '#00E676',
      wickDownColor: '#FF4D6D',
    });
    candleSeriesRef.current = candleSeries;

    const candleData = filteredData.map(d => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    candleSeries.setData(candleData);

    // 2. Volume series (bottom histogram)
    const volumeSeries = chart.addHistogramSeries({
      color: 'rgba(0, 229, 255, 0.25)',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // Overlay on same chart
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeriesRef.current = volumeSeries;

    const volumeData = filteredData.map(d => ({
      time: d.time,
      value: d.volume || 1000,
      color: d.close >= d.open ? 'rgba(0, 230, 118, 0.25)' : 'rgba(255, 77, 109, 0.25)',
    }));
    volumeSeries.setData(volumeData);

    // 3. Technical Indicator Lines
    if (showSMA20) {
      const sma20 = chart.addLineSeries({ color: '#00E5FF', lineWidth: 2, title: 'SMA 20' });
      sma20.setData(filteredData.filter(d => d.sma20).map(d => ({ time: d.time, value: d.sma20 })));
      sma20SeriesRef.current = sma20;
    }

    if (showSMA50) {
      const sma50 = chart.addLineSeries({ color: '#F5C542', lineWidth: 2, title: 'SMA 50' });
      sma50.setData(filteredData.filter(d => d.sma50).map(d => ({ time: d.time, value: d.sma50 })));
      sma50SeriesRef.current = sma50;
    }

    if (showSMA200) {
      const sma200 = chart.addLineSeries({ color: '#C084FC', lineWidth: 2, title: 'SMA 200' });
      sma200.setData(filteredData.filter(d => d.sma200).map(d => ({ time: d.time, value: d.sma200 })));
      sma200SeriesRef.current = sma200;
    }

    if (showEMA20) {
      const ema20 = chart.addLineSeries({ color: '#FB923C', lineWidth: 2, title: 'EMA 20' });
      ema20.setData(filteredData.filter(d => d.ema20).map(d => ({ time: d.time, value: d.ema20 })));
      ema20SeriesRef.current = ema20;
    }

    if (showBB) {
      const bbUpper = chart.addLineSeries({ color: 'rgba(0, 229, 255, 0.5)', lineWidth: 1, lineStyle: 2, title: 'BB Upper' });
      bbUpper.setData(filteredData.filter(d => d.bb_upper).map(d => ({ time: d.time, value: d.bb_upper })));
      bbUpperSeriesRef.current = bbUpper;

      const bbLower = chart.addLineSeries({ color: 'rgba(0, 229, 255, 0.5)', lineWidth: 1, lineStyle: 2, title: 'BB Lower' });
      bbLower.setData(filteredData.filter(d => d.bb_lower).map(d => ({ time: d.time, value: d.bb_lower })));
      bbLowerSeriesRef.current = bbLower;
    }

    // Crosshair move subscription for live tooltip update
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData.get(candleSeries)) {
        setHoveredCandle(null);
      } else {
        const c = param.seriesData.get(candleSeries);
        const match = filteredData.find(d => d.time === param.time);
        if (match) {
          setHoveredCandle(match);
        } else if (c) {
          setHoveredCandle({
            time: param.time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            volume: 0
          });
        }
      }
    });

    chart.timeScale().fitContent();

    // Auto-resize on window change
    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [filteredData, showSMA20, showSMA50, showSMA200, showEMA20, showBB, isDark]);

  const ranges = ['1M', '6M', '1Y', '5Y', 'MAX'];

  return (
    <section id="market-overview" className="py-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
              <Activity size={14} />
              <span>Section 02 // Market Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Market Overview & Technical Chart
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Interactive TradingView candlesticks with volume and dynamic technical indicators overlay.
            </p>
          </div>

          {/* Index Selector Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-slate-400">SELECT INDEX:</label>
            <select
              value={selectedIndex}
              onChange={(e) => onSelectIndex(e.target.value)}
              className="bg-[#121826] border border-white/10 rounded-xl px-4 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00E5FF] cursor-pointer"
            >
              {indices.map((idx) => (
                <option key={idx.symbol} value={idx.symbol} className="bg-[#0B0F17] text-white">
                  {idx.symbol} — {idx.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart Card */}
        <div className="glass-panel p-5 sm:p-6 mb-4">
          
          {/* Top Bar: Live Price Stats & Range Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/5">
            {currentStats && (
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">DATE</span>
                  <span className="text-white font-semibold">{currentStats.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">OPEN</span>
                  <span className="text-white">{currentStats.open?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">HIGH</span>
                  <span className="text-[#00E676]">{currentStats.high?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">LOW</span>
                  <span className="text-[#FF4D6D]">{currentStats.low?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CLOSE</span>
                  <span className="text-[#00E5FF] font-bold text-sm">{currentStats.close?.toLocaleString()}</span>
                </div>
                {currentStats.volume > 0 && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">VOLUME</span>
                    <span className="text-slate-300">{currentStats.volume.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Range Buttons */}
            <div className="inline-flex rounded-lg bg-white/5 p-1 border border-white/10">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRange(r)}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                    selectedRange === r
                      ? 'bg-[#00E5FF] text-[#090A0F] font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Overlay Toggles Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-xs">
            <span className="text-slate-400 text-[11px] mr-1">OVERLAYS:</span>
            
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showSMA20 
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
              <span>SMA 20</span>
            </button>

            <button
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showSMA50 
                  ? 'bg-[#F5C542]/20 text-[#F5C542] border-[#F5C542]/50' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#F5C542]" />
              <span>SMA 50</span>
            </button>

            <button
              onClick={() => setShowSMA200(!showSMA200)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showSMA200 
                  ? 'bg-[#C084FC]/20 text-[#C084FC] border-[#C084FC]/50' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
              <span>SMA 200</span>
            </button>

            <button
              onClick={() => setShowEMA20(!showEMA20)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showEMA20 
                  ? 'bg-[#FB923C]/20 text-[#FB923C] border-[#FB923C]/50' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FB923C]" />
              <span>EMA 20</span>
            </button>

            <button
              onClick={() => setShowBB(!showBB)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showBB 
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] opacity-60" />
              <span>Bollinger Bands</span>
            </button>
          </div>

          {/* Lightweight Charts Canvas Container */}
          <div 
            ref={chartContainerRef} 
            className="w-full h-[480px] rounded-lg overflow-hidden relative"
          />

          {/* Quick Caption */}
          <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-slate-400">
            <span>TradingView Lightweight Candlestick Engine</span>
            <span>Scroll to zoom · Drag to pan</span>
          </div>

        </div>

      </div>
    </section>
  );
}
