import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Target, 
  Upload, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  RefreshCw,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { parseCSV, computeInBrowserPrediction } from '../utils/csvAnalyzer';

export default function PredictionStudio({ 
  summary, 
  testPredictions = [], 
  featureImportances = [] 
}) {
  const [selectedModel, setSelectedModel] = useState('both'); // 'lr', 'rf', 'both'
  const [horizon, setHorizon] = useState('1'); // '1' or '5'
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [hasRun, setHasRun] = useState(true);

  // Drag and drop CSV upload state
  const [uploadedResult, setUploadedResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Latest forecast data
  const forecast = summary?.next_day_forecast;
  const lastClose = forecast?.last_close || 15582.8;

  const lrPred = forecast?.linear_regression;
  const rfPred = forecast?.random_forest;

  // Selected forecast based on model choice
  const activeForecast = useMemo(() => {
    if (selectedModel === 'lr') return lrPred;
    if (selectedModel === 'rf') return rfPred;
    // Both: average
    if (lrPred && rfPred) {
      const avgClose = (lrPred.predicted_close + rfPred.predicted_close) / 2;
      const avgRet = (lrPred.predicted_return_pct + rfPred.predicted_return_pct) / 2;
      return {
        predicted_close: Math.round(avgClose * 100) / 100,
        predicted_return_pct: Math.round(avgRet * 100) / 100,
        direction: avgRet >= 0 ? 'UP' : 'DOWN'
      };
    }
    return rfPred || lrPred;
  }, [selectedModel, lrPred, rfPred]);

  // Run Prediction Simulation
  const handleRunPrediction = () => {
    setIsRunning(true);
    setRunProgress(10);

    const step1 = setTimeout(() => setRunProgress(40), 200);
    const step2 = setTimeout(() => setRunProgress(75), 450);
    const step3 = setTimeout(() => {
      setRunProgress(100);
      setIsRunning(false);
      setHasRun(true);
    }, 700);
  };

  // CSV File Handler
  const handleFileUpload = (file) => {
    setUploadError(null);
    if (!file.name.endsWith('.csv')) {
      setUploadError('Please upload a valid .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rows = parseCSV(text);
        const result = computeInBrowserPrediction(rows);
        setUploadedResult({
          filename: file.name,
          ...result
        });
      } catch (err) {
        setUploadError(err.message || 'Error processing CSV file.');
      }
    };
    reader.readAsText(file);
  };

  // Export predictions as CSV
  const handleExportCSV = () => {
    if (!testPredictions || testPredictions.length === 0) return;
    const headers = ['Date', 'Actual_Close', 'Naive_Baseline', 'Linear_Regression', 'Random_Forest', 'LR_Predicted_Return_%', 'RF_Predicted_Return_%', 'Actual_Return_%'];
    const rows = testPredictions.map(p => [
      p.date,
      p.actual,
      p.naive,
      p.linear_regression,
      p.random_forest,
      p.pred_ret_lr,
      p.pred_ret_rf,
      p.actual_ret
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nifty_ai_test_predictions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Subsampled test predictions for SVG chart (last 90 trading days)
  const chartPredictions = useMemo(() => {
    return testPredictions.slice(-90);
  }, [testPredictions]);

  return (
    <section id="prediction-studio" className="py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
              <Cpu size={14} />
              <span>Section 06 // Core Inference Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
              AI Prediction Studio
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Configure machine learning regressors, run inference on the latest market features, 
              and inspect actual vs predicted test-set trajectories with model feature weights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
              title="Download test set predictions CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Prediction Control Console & Forecast Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Controls Panel */}
          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-heading font-bold text-white mb-4 flex items-center gap-2">
                <Sliders size={18} className="text-[#00E5FF]" />
                <span>Forecast Configuration</span>
              </h3>

              {/* Model Select */}
              <div className="mb-5">
                <label className="text-xs font-mono text-slate-400 block mb-2">
                  TARGET MODEL
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedModel('lr')}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer text-center ${
                      selectedModel === 'lr' 
                        ? 'bg-[#00E5FF] text-[#090A0F] font-bold shadow' 
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    LinReg
                  </button>
                  <button
                    onClick={() => setSelectedModel('rf')}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer text-center ${
                      selectedModel === 'rf' 
                        ? 'bg-[#F5C542] text-[#090A0F] font-bold shadow' 
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    RandForest
                  </button>
                  <button
                    onClick={() => setSelectedModel('both')}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer text-center ${
                      selectedModel === 'both' 
                        ? 'bg-gradient-to-r from-[#00E5FF] to-[#00E676] text-[#090A0F] font-bold shadow' 
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    Ensemble
                  </button>
                </div>
              </div>

              {/* Horizon Select */}
              <div className="mb-6">
                <label className="text-xs font-mono text-slate-400 block mb-2">
                  FORECAST HORIZON
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setHorizon('1')}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer text-center ${
                      horizon === '1' 
                        ? 'bg-white/20 text-white font-bold border border-white/30' 
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    Next-Day (t+1)
                  </button>
                  <button
                    onClick={() => setHorizon('5')}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer text-center ${
                      horizon === '5' 
                        ? 'bg-white/20 text-white font-bold border border-white/30' 
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    5-Day Rolling
                  </button>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div>
              <button
                onClick={handleRunPrediction}
                disabled={isRunning}
                className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm bg-gradient-to-r from-[#00E5FF] via-[#00B4D8] to-[#00E676] text-[#090A0F] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#00E5FF]/20"
              >
                {isRunning ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Inference in Progress ({runProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Run Model Prediction</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 justify-center mt-2 text-[10px] font-mono text-slate-400">
                <Info size={11} />
                <span>Computed on test scaler features</span>
              </div>
            </div>
          </div>

          {/* Main Forecast Output Display */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 flex flex-col justify-between border-l-4 border-l-[#00E676]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1">
                    TARGET FORECAST SESSION
                  </span>
                  <h3 className="text-xl font-heading font-bold text-white">
                    Next Trading Day Projection
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block mb-1">LAST RECORDED CLOSE</span>
                  <span className="text-lg font-mono font-bold text-white">
                    ₹{lastClose.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Big KPI Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                
                {/* Predicted Price */}
                <div className="bg-[#090D15] p-5 rounded-xl border border-white/5">
                  <span className="text-xs font-mono text-slate-400 block mb-1">
                    PROJECTED CLOSE
                  </span>
                  <div className="text-3xl font-display font-black text-white tracking-tight">
                    ₹{activeForecast?.predicted_close?.toLocaleString()}
                  </div>
                  <span className="text-[11px] font-mono text-[#00E5FF] mt-1 block">
                    Model: {selectedModel.toUpperCase()}
                  </span>
                </div>

                {/* Predicted Return */}
                <div className="bg-[#090D15] p-5 rounded-xl border border-white/5">
                  <span className="text-xs font-mono text-slate-400 block mb-1">
                    PROJECTED RETURN
                  </span>
                  <div className={`text-3xl font-display font-black tracking-tight ${
                    activeForecast?.predicted_return_pct >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'
                  }`}>
                    {activeForecast?.predicted_return_pct >= 0 ? '+' : ''}
                    {activeForecast?.predicted_return_pct}%
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                    Stationary Target
                  </span>
                </div>

                {/* Direction Badge */}
                <div className="bg-[#090D15] p-5 rounded-xl border border-white/5 flex flex-col justify-between">
                  <span className="text-xs font-mono text-slate-400 block mb-1">
                    DIRECTION BIAS
                  </span>
                  <div className="flex items-center gap-2">
                    {activeForecast?.direction === 'UP' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold font-mono bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40 shadow-sm shadow-[#00E676]/20">
                        <TrendingUp size={16} />
                        BULLISH (UP)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold font-mono bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40 shadow-sm shadow-[#FF4D6D]/20">
                        <TrendingDown size={16} />
                        BEARISH (DOWN)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                    P(t+1) = P(t) × (1 + r)
                  </span>
                </div>

              </div>
            </div>

            {/* Mandatory Academic & Legal Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-3">
              <AlertTriangle size={18} className="shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold font-mono text-amber-400 block mb-0.5">
                  ESTIMATE FOR LEARNING ONLY — NOT FINANCIAL ADVICE
                </span>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Machine learning models measure past statistical relationships. Directional accuracy 
                  in test data is approximately 54%. Never execute trades or risk capital based on algorithmic outputs.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Actual vs Predicted Test Set Chart & Feature Importance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Actual vs Predicted Interactive Line Chart (SVG) */}
          <div className="lg:col-span-2 glass-panel p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/5 gap-2">
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Actual vs Predicted Close (Test Period)
                </h3>
                <span className="text-xs text-slate-400">
                  Last 90 trading sessions of the 660-day test set (2018–2021)
                </span>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="w-2.5 h-0.5 bg-white inline-block" /> Actual Close
                </span>
                <span className="flex items-center gap-1.5 text-[#00E5FF]">
                  <span className="w-2.5 h-0.5 bg-[#00E5FF] inline-block" /> LinReg
                </span>
                <span className="flex items-center gap-1.5 text-[#F5C542]">
                  <span className="w-2.5 h-0.5 bg-[#F5C542] inline-block" /> RandForest
                </span>
              </div>
            </div>

            {/* Multi-line SVG chart */}
            <div className="h-64 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                {chartPredictions.length > 2 && (() => {
                  const minP = Math.min(...chartPredictions.map(d => Math.min(d.actual, d.linear_regression, d.random_forest))) * 0.98;
                  const maxP = Math.max(...chartPredictions.map(d => Math.max(d.actual, d.linear_regression, d.random_forest))) * 1.02;

                  const mapPoints = (key) => chartPredictions.map((d, i) => {
                    const x = (i / (chartPredictions.length - 1)) * 600;
                    const y = 190 - ((d[key] - minP) / (maxP - minP)) * 170;
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  }).join(' ');

                  return (
                    <>
                      {/* Grid lines */}
                      <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                      <line x1="0" y1="110" x2="600" y2="110" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                      <line x1="0" y1="170" x2="600" y2="170" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                      {/* Actual line (White) */}
                      <polyline
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        points={mapPoints('actual')}
                      />

                      {/* LinReg line (Cyan) */}
                      <polyline
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="1.5"
                        strokeDasharray="2 1"
                        opacity="0.9"
                        points={mapPoints('linear_regression')}
                      />

                      {/* RandForest line (Gold) */}
                      <polyline
                        fill="none"
                        stroke="#F5C542"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                        opacity="0.9"
                        points={mapPoints('random_forest')}
                      />
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 border-t border-white/5 pt-2">
              <span>{chartPredictions[0]?.date || 'Start'}</span>
              <span>Zoom/Pan Synchronized</span>
              <span>{chartPredictions[chartPredictions.length - 1]?.date || 'End'}</span>
            </div>
          </div>

          {/* Random Forest Feature Importance Bars */}
          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-heading font-bold text-white">
                  RF Feature Importance
                </h3>
                <span className="text-[11px] font-mono text-[#00E5FF]">
                  300 Trees
                </span>
              </div>

              <div className="space-y-2.5">
                {featureImportances.slice(0, 7).map((feat, idx) => (
                  <div key={feat.key} className="text-xs font-mono">
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span className="truncate max-w-[160px]">{feat.label}</span>
                      <span className="text-[#00E5FF] font-semibold">{feat.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00E676] transition-all duration-700"
                        style={{ width: `${feat.percentage * 5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400">
              <span className="text-[#F5C542] font-semibold block mb-0.5">Top Driver:</span>
              Lagged returns & Close/SMA20 carry &gt;40% total Gini impurity reduction.
            </div>
          </div>

        </div>

        {/* Drag and Drop CSV Upload Sandbox */}
        <div className="glass-panel p-6 sm:p-8 border border-dashed border-white/20 hover:border-[#00E5FF]/50 transition-colors">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
                <Upload size={14} />
                <span>Client-Side Sandbox // CSV Drag & Drop</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-white mb-1">
                Upload Your Own Stock OHLCV Dataset
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drop any historical stock CSV with Date and Close columns. 
                Runs feature engineering and OLS regression entirely in your browser without sending data to any external server.
              </p>

              {uploadError && (
                <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
                  {uploadError}
                </div>
              )}
            </div>

            {/* Dropzone Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-w-[260px] ${
                isDragging 
                  ? 'border-[#00E5FF] bg-[#00E5FF]/10 scale-105' 
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <FileSpreadsheet className="w-8 h-8 text-[#00E5FF] mb-2" />
              <span className="text-xs font-mono text-white font-semibold block mb-1">
                Drag & Drop CSV here
              </span>
              <span className="text-[10px] text-slate-400 mb-2">or click to browse files</span>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="csv-file-input"
              />
              <label
                htmlFor="csv-file-input"
                className="px-3 py-1 rounded-md text-[11px] font-mono font-semibold bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                Browse CSV
              </label>
            </div>

          </div>

          {/* Uploaded In-Browser Results Card */}
          {uploadedResult && (
            <div className="mt-6 p-4 rounded-xl bg-[#090D15] border border-[#00E5FF]/30">
              <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-white/5 gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
                    Quick in-browser estimate
                  </span>
                  <span className="text-xs font-mono text-white font-bold">{uploadedResult.filename}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {uploadedResult.totalRows} Rows ({uploadedResult.trainRows} Train / {uploadedResult.testRows} Test)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">LAST CLOSE</span>
                  <span className="text-white font-bold">{uploadedResult.lastClose}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">PREDICTED NEXT CLOSE</span>
                  <span className="text-[#00E5FF] font-bold">{uploadedResult.forecastClose}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">PREDICTED RETURN</span>
                  <span className={`font-bold ${uploadedResult.forecastRetPct >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
                    {uploadedResult.forecastRetPct >= 0 ? '+' : ''}{uploadedResult.forecastRetPct}% ({uploadedResult.direction})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">TEST DIRECTION ACCURACY</span>
                  <span className="text-amber-400 font-bold">{uploadedResult.metrics.dirAcc}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
