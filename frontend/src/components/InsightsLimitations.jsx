import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  HelpCircle, 
  Zap, 
  BookOpen, 
  CheckCircle,
  FileText
} from 'lucide-react';

const LIMITATIONS = [
  {
    title: "1. Data Leakage & Lookahead Bias",
    icon: ShieldAlert,
    badge: "Methodological Risk",
    desc: "Shuffling time-series data or fitting scalers on the entire dataset allows future volatility and price distributions to 'leak' into historical training samples.",
    fix: "Solution: Strictly chronological 80/20 split and fitting StandardScaler exclusively on the 2,636-day training partition."
  },
  {
    title: "2. Non-Stationarity & Regime Shifts",
    icon: Activity,
    badge: "Statistical Reality",
    desc: "Financial time series have time-varying mean, variance, and autocorrelation. A model trained in a low-interest-rate bull market fails when inflation or rate hikes occur.",
    fix: "Solution: Predict stationary percentage returns rather than non-stationary raw price levels."
  },
  {
    title: "3. Efficient Market Hypothesis (EMH)",
    icon: BookOpen,
    badge: "Fama (1970) Foundation",
    desc: "In semi-strong efficient markets, all publicly known historical price patterns are instantaneously priced in by market participants, leaving future price ticks as near-random walks.",
    fix: "Takeaway: Technical indicators alone cannot reliably generate sustainable excess alpha without non-public or multi-modal alternative data."
  },
  {
    title: "4. Black Swan Events & Macro Shocks",
    icon: AlertTriangle,
    badge: "Unforeseen Shocks",
    desc: "The 2008 Lehman Brothers collapse and March 2020 pandemic crash had zero precedent in recent price logs. Historical models cannot forecast sudden exogenous geopolitical or biological shocks.",
    fix: "Takeaway: Quantitative models require hard circuit breakers, stop-losses, and portfolio risk budgets."
  },
  {
    title: "5. High R² Illusion & Overfitting",
    icon: Zap,
    badge: "Evaluation Pitfall",
    desc: "Regressing today's price onto tomorrow's produces an R² > 0.99 simply because prices move continuously. This gives an illusion of genius while providing zero predictive advantage over doing nothing.",
    fix: "Solution: Always compare models against the Naive Baseline and evaluate directional accuracy and trading Sharpe ratio."
  }
];

export default function InsightsLimitations() {
  return (
    <section id="limitations" className="py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF4D6D] uppercase tracking-wider mb-2">
            <ShieldAlert size={14} />
            <span>Section 09 // Statistical Vulnerabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Academic Insights & Model Limitations
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Understanding why algorithmic trading models fail in live execution, 
            and how rigorous evaluation separates statistical illusions from real market alpha.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {LIMITATIONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="glass-panel p-6 flex flex-col justify-between hover:border-[#FF4D6D]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                      {item.badge}
                    </span>
                    <Icon size={18} className="text-slate-400" />
                  </div>

                  <h3 className="text-base font-heading font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-[#00E5FF]">
                  {item.fix}
                </div>
              </div>
            );
          })}

          {/* Applications Card */}
          <div className="glass-panel p-6 flex flex-col justify-between bg-gradient-to-br from-[#121826] to-[#0B0F17] border-[#00E5FF]/20">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold">
                  Valid Applications
                </span>
                <CheckCircle size={18} className="text-[#00E5FF]" />
              </div>

              <h3 className="text-base font-heading font-bold text-white mb-2">
                Where These Models DO Provide Value
              </h3>

              <ul className="text-xs text-slate-300 space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
                  <span>Academic research & econometric methodology study</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
                  <span>Feature importance ranking for risk factors</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
                  <span>Volatility regime classification & stress testing</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
                  <span>Algorithmic benchmark creation for quant teams</span>
                </li>
              </ul>
            </div>

            <div className="text-[11px] font-mono text-slate-400 border-t border-white/5 pt-2">
              Source: Section 19, Workshop Report
            </div>
          </div>
        </div>

        {/* Big Prominent Legal & Educational Disclaimer Banner */}
        <div className="glass-panel p-6 sm:p-8 border-2 border-red-500/40 bg-red-950/20 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400">
              <AlertTriangle size={32} />
            </div>

            <div>
              <h3 className="text-lg font-heading font-bold text-white mb-1">
                ACADEMIC NOTICE & FINANCIAL DISCLAIMER
              </h3>
              <p className="text-xs sm:text-sm text-red-200/90 leading-relaxed font-sans">
                This project was created strictly for educational purposes as part of the machine learning workshop report 
                by <strong>Gunjan Hembram</strong> (Roll No. 24102060018, Govt. Women's Polytechnic, Ranchi). 
                <strong> This is not financial advice.</strong> Trading stocks and derivative instruments carries substantial risk of financial loss. 
                Do not make real investments or trade securities based on machine learning predictions or demonstrations provided herein.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
