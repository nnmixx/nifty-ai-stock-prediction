import React from 'react';
import { 
  Activity, 
  BarChart2, 
  Cpu, 
  ShieldAlert, 
  GitBranch, 
  Moon, 
  Sun, 
  EyeOff, 
  FileText,
  Layers,
  ChevronRight
} from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Navbar({ 
  isDark, 
  setIsDark, 
  isReducedMotion, 
  setIsReducedMotion,
  isApiOnline,
  onOpenReport
}) {
  const navLinks = [
    { label: 'Overview', href: '#market-overview' },
    { label: 'Pipeline', href: '#pipeline' },
    { label: 'EDA', href: '#eda' },
    { label: 'Features', href: '#features' },
    { label: 'AI Studio', href: '#prediction-studio' },
    { label: 'Comparison', href: '#model-comparison' },
    { label: 'Backtest', href: '#backtesting' },
    { label: 'Limitations', href: '#limitations' },
    { label: 'Roadmap', href: '#roadmap' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#0B0F17]/80 border-b border-white/8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] via-[#00B4D8] to-[#00E676] p-0.5 shadow-lg shadow-[#00E5FF]/20 group-hover:shadow-[#00E5FF]/40 transition-shadow">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black tracking-wider text-lg bg-gradient-to-r from-white via-slate-100 to-[#00E5FF] bg-clip-text text-transparent">
                  NIFTY AI
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                ML Forecasting Suite
              </p>
            </div>
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-slate-300 hover:text-[#00E5FF] px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Connection Status Pill */}
          <div 
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 border border-white/10"
            title={isApiOnline ? "Connected to live FastAPI backend" : "Running on precomputed static JSON data"}
          >
            <span className={`w-2 h-2 rounded-full ${isApiOnline ? 'bg-[#00E676] shadow-[0_0_8px_#00E676]' : 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]'}`} />
            <span className="text-slate-300 font-medium">
              {isApiOnline ? 'API Mode' : 'Static Mode'}
            </span>
          </div>

          {/* Workshop Report Button */}
          <button
            onClick={onOpenReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F5C542]/10 hover:bg-[#F5C542]/20 text-[#F5C542] border border-[#F5C542]/30 transition-all cursor-pointer shadow-sm shadow-[#F5C542]/10"
            title="Read Workshop Report & Methodology"
          >
            <FileText size={14} />
            <span className="hidden md:inline">Workshop Report</span>
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => setIsReducedMotion(!isReducedMotion)}
            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              isReducedMotion 
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40' 
                : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
            }`}
            title={isReducedMotion ? "Enable animations" : "Reduce motion for accessibility"}
          >
            <EyeOff size={15} />
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* GitHub Profile */}
          <a
            href="https://github.com/nnmixx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="GitHub: nnmixx"
          >
            <GithubIcon size={16} />
            <span className="text-xs font-mono hidden md:inline">nnmixx</span>
          </a>

        </div>

      </div>
    </header>
  );
}
