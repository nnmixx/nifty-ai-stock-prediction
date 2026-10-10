import React from 'react';
import { 
  GitBranch, 
  Cpu, 
  MessageSquare, 
  Radio, 
  Cloud, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import GithubIcon from './GithubIcon';

const ROADMAP = [
  {
    phase: "Phase 01 // Deep Sequential Modeling",
    title: "LSTM, GRU & Temporal Fusion Transformers",
    desc: "Implementing multi-layer Bidirectional LSTM networks with 60-day lookback windows and attention mechanisms to capture multi-horizon dependencies.",
    tags: ["PyTorch", "LSTM 64-units", "Attention"],
    icon: Cpu
  },
  {
    phase: "Phase 02 // Alternative NLP Signals",
    title: "FinBERT Sentiment & Earnings Call Analysis",
    desc: "Ingesting financial news headlines, RBI announcements, and social sentiment using domain-specific FinBERT embeddings to augment quantitative price signals.",
    tags: ["HuggingFace", "FinBERT", "News NLP"],
    icon: MessageSquare
  },
  {
    phase: "Phase 03 // Real-Time Market Feed",
    title: "Low-Latency WebSocket Streaming Ingestion",
    desc: "Connecting live tick-by-tick websocket feeds (Zerodha Kite / Angel One APIs) with real-time sliding feature extractors for live market monitoring.",
    tags: ["WebSockets", "Streaming ML", "Sub-second"],
    icon: Radio
  },
  {
    phase: "Phase 04 // Directional Classification",
    title: "UP/DOWN Classification with TimeSeriesSplit",
    desc: "Framing the target as binary probability classification (XGBoost + LightGBM) evaluated with expanding-window TimeSeriesSplit to avoid data leakage.",
    tags: ["TimeSeriesSplit", "ROC-AUC", "Kelly Criterion"],
    icon: GitBranch
  },
  {
    phase: "Phase 05 // Cloud MLOps & Auto-Retrain",
    title: "Automated Continuous Training Pipelines",
    desc: "Dockerized container deployment with GitHub Actions CI/CD, tracking drift detection and scheduling monthly retraining with automated backtest verification.",
    tags: ["FastAPI", "Docker", "Vercel / AWS", "MLflow"],
    icon: Cloud
  }
];

export default function FutureScope() {
  return (
    <section id="roadmap" className="py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
            <GitBranch size={14} />
            <span>Section 10 // Future Scope & Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Research Roadmap & Next Horizons
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Architectural directions for advancing beyond classical tabular machine learning 
            into sequence deep learning, multi-modal sentiment, and real-time streaming quant engines.
          </p>
        </div>

        {/* Roadmap Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {ROADMAP.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="glass-panel p-6 flex flex-col justify-between hover:border-[#00E5FF]/40 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-[#00E5FF] font-semibold">
                      {item.phase}
                    </span>
                    <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-[#00E5FF] transition-colors">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="text-base font-heading font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                  {item.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* GitHub Repository Connect Card */}
          <div className="glass-panel p-6 flex flex-col justify-between bg-gradient-to-br from-[#121826] to-[#0A101D] border-2 border-[#00E5FF]/30">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#00E676] font-bold uppercase">
                  Open Source Codebase
                </span>
                <GithubIcon size={20} className="text-white" />
              </div>

              <h3 className="text-lg font-heading font-bold text-white mb-2">
                Explore the Source on GitHub
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Full repository including training scripts (<code className="text-[#00E5FF]">backend/train.py</code>), 
                FastAPI endpoints, interactive UI components, and precomputed dataset JSONs.
              </p>
            </div>

            <a
              href="https://github.com/nnmixx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl font-heading font-bold text-xs bg-white text-[#090A0F] hover:bg-[#00E5FF] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/10"
            >
              <GithubIcon size={16} />
              <span>github.com/nnmixx</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
