import React from 'react';
import { Activity, Heart, Shield, Award } from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Footer({ onOpenReport }) {
  return (
    <footer className="w-full bg-[#080B11] border-t border-white/5 py-12 text-slate-400 text-xs font-mono relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
              <Activity size={18} />
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">
                NIFTY AI
              </span>
              <span className="block text-[11px] text-slate-500">
                Stock Price Prediction Using Machine Learning
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <button
              onClick={onOpenReport}
              className="hover:text-[#F5C542] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Award size={14} />
              <span>Workshop Report</span>
            </button>
            <a
              href="https://github.com/nnmixx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <GithubIcon size={14} />
              <span>GitHub (nnmixx)</span>
            </a>
            <a href="#pipeline" className="hover:text-white transition-colors">
              10-Stage Pipeline
            </a>
            <a href="#limitations" className="hover:text-white transition-colors">
              Academic Limitations
            </a>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-slate-500">
          <p>
            Report by <strong>Gunjan Hembram</strong> · Govt. Women's Polytechnic, Ranchi · Trainer: Md Rashid
          </p>
          <p className="text-center sm:text-right">
            For learning only. Not financial advice. Zero lookahead leakage.
          </p>
        </div>

      </div>
    </footer>
  );
}
