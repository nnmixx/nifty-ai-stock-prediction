import React, { useState, useEffect } from 'react';
import AmbientBackground from './components/AmbientBackground';
import TickerTape from './components/TickerTape';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarketOverview from './components/MarketOverview';
import DataPipeline from './components/DataPipeline';
import EDASection from './components/EDASection';
import FeatureEngineering from './components/FeatureEngineering';
import PredictionStudio from './components/PredictionStudio';
import ModelComparison from './components/ModelComparison';
import BacktestingLab from './components/BacktestingLab';
import InsightsLimitations from './components/InsightsLimitations';
import FutureScope from './components/FutureScope';
import Footer from './components/Footer';
import WorkshopModal from './components/WorkshopModal';
import { 
  checkBackendHealth, 
  fetchIndices, 
  fetchHistory, 
  fetchSummary 
} from './utils/dataLoader';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState('NSEI');
  const [indices, setIndices] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  // Apply reduced motion class to document
  useEffect(() => {
    if (isReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [isReducedMotion]);

  // Check prefers-reduced-motion media query on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
    }
  }, []);

  // Initial load
  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      const online = await checkBackendHealth();
      setIsApiOnline(online);

      try {
        const indicesList = await fetchIndices();
        setIndices(indicesList);

        const [hist, summ] = await Promise.all([
          fetchHistory('NSEI'),
          fetchSummary('NSEI')
        ]);
        setHistoryData(hist);
        setSummary(summ);
      } catch (err) {
        console.error("Error loading market data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // Reload data when active index changes
  const handleSelectIndex = async (symbol) => {
    setSelectedIndex(symbol);
    try {
      const [hist, summ] = await Promise.all([
        fetchHistory(symbol),
        fetchSummary(symbol)
      ]);
      setHistoryData(hist);
      setSummary(summ);
    } catch (err) {
      console.warn(`Could not load full data for ${symbol}, retaining base summary.`);
    }
  };

  const scrollToPrediction = () => {
    const el = document.getElementById('prediction-studio');
    if (el) el.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
  };

  const scrollToOverview = () => {
    const el = document.getElementById('market-overview');
    if (el) el.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      {/* 60fps Ambient Background Canvas */}
      <AmbientBackground isReducedMotion={isReducedMotion} isDark={isDark} />

      {/* Top Infinite Ticker Tape */}
      <TickerTape
        indices={indices}
        activeIndex={selectedIndex}
        onSelectIndex={handleSelectIndex}
      />

      {/* Sticky Glass Navbar */}
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        isReducedMotion={isReducedMotion}
        setIsReducedMotion={setIsReducedMotion}
        isApiOnline={isApiOnline}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Section 01: Hero */}
        <Hero
          summary={summary}
          onPredict={scrollToPrediction}
          onExplore={scrollToOverview}
          onOpenReport={() => setIsReportOpen(true)}
        />

        {/* Section 02: Market Overview */}
        <MarketOverview
          historyData={historyData}
          indices={indices}
          selectedIndex={selectedIndex}
          onSelectIndex={handleSelectIndex}
          isDark={isDark}
        />

        {/* Section 03: Data Pipeline */}
        <DataPipeline summary={summary} />

        {/* Section 04: Exploratory Data Analysis */}
        <EDASection
          historyData={historyData}
          correlationMatrix={summary?.correlation_matrix}
        />

        {/* Section 05: Feature Engineering */}
        <FeatureEngineering />

        {/* Section 06: AI Prediction Studio */}
        <PredictionStudio
          summary={summary}
          testPredictions={summary?.test_predictions || []}
          featureImportances={summary?.feature_importances || []}
        />

        {/* Section 07: Model Comparison */}
        <ModelComparison summary={summary} />

        {/* Section 08: Backtesting Lab */}
        <BacktestingLab summary={summary} />

        {/* Section 09: Academic Insights & Limitations */}
        <InsightsLimitations />

        {/* Section 10: Future Scope & Roadmap */}
        <FutureScope />
      </main>

      {/* Footer */}
      <Footer onOpenReport={() => setIsReportOpen(true)} />

      {/* Workshop Report Modal */}
      <WorkshopModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
