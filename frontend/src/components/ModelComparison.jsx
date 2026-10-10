import React, { useState } from 'react';
import { 
  BarChart, 
  Lock, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';

const METRIC_DEFINITIONS = {
  mae: "Mean Absolute Error — Average absolute difference between predicted and actual price in index points (₹).",
  rmse: "Root Mean Squared Error — Square root of average squared errors; penalizes large prediction mistakes heavily.",
  mape: "Mean Absolute Percentage Error — Average percentage error relative to actual stock price.",
  r2: "R² Coefficient of Determination — Proportion of price variance explained (1.0 = perfect fit).",
  direction: "Directional Accuracy — Percentage of trading days where the model correctly predicted whether price went UP or DOWN."
};

export default function ModelComparison({ summary }) {
  const [activeMetricView, setActiveMetricView] = useState('rmse');
  const [hoveredMetric, setHoveredMetric] = useState(null);

  const metrics = summary?.metrics || {
    naive: { name: "Naive Baseline (Tomorrow = Today)", mae: 106.14, rmse: 154.04, mape: 0.94, r2: 0.9905, direction_accuracy: null },
    linear_regression: { name: "Linear Regression", mae: 105.93, rmse: 156.20, mape: 0.95, r2: 0.9902, direction_accuracy: 54.4 },
    random_forest: { name: "Random Forest (300 trees)", mae: 105.84, rmse: 155.46, mape: 0.94, r2: 0.9903, direction_accuracy: 53.6 },
    lstm: { name: "LSTM (Advanced)", mae: null, rmse: null, mape: null, r2: null, direction_accuracy: null, status: "Future scope" }
  };

  const chartData = [
    { model: "Naive", rmse: 154.04, mae: 106.14, r2: 0.9905, dir: 0, color: "bg-slate-400" },
    { model: "LinReg", rmse: 156.20, mae: 105.93, r2: 0.9902, dir: 54.4, color: "bg-[#00E5FF]" },
    { model: "RandForest", rmse: 155.46, mae: 105.84, r2: 0.9903, dir: 53.6, color: "bg-[#F5C542]" }
  ];

  return (
    <section id="model-comparison" className="py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
            <BarChart size={14} />
            <span>Section 07 // Evaluation Metrics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Rigorous Model Benchmark (Test Set)
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Evaluating Linear Regression and Random Forest against the Naive Baseline benchmark (tomorrow = today) 
            across 660 unseen trading days (2018–2021).
          </p>
        </div>

        {/* Comparison Table */}
        <div className="glass-panel p-6 mb-8 overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead>
              <tr className="border-b border-white/10 text-xs text-slate-400">
                <th className="pb-3 pl-2">MODEL ARCHITECTURE</th>
                <th className="pb-3 text-right">
                  <span 
                    className="cursor-help inline-flex items-center gap-1 hover:text-white"
                    title={METRIC_DEFINITIONS.mae}
                  >
                    MAE (₹) <HelpCircle size={12} />
                  </span>
                </th>
                <th className="pb-3 text-right">
                  <span 
                    className="cursor-help inline-flex items-center gap-1 hover:text-white"
                    title={METRIC_DEFINITIONS.rmse}
                  >
                    RMSE (₹) <HelpCircle size={12} />
                  </span>
                </th>
                <th className="pb-3 text-right">
                  <span 
                    className="cursor-help inline-flex items-center gap-1 hover:text-white"
                    title={METRIC_DEFINITIONS.mape}
                  >
                    MAPE (%) <HelpCircle size={12} />
                  </span>
                </th>
                <th className="pb-3 text-right">
                  <span 
                    className="cursor-help inline-flex items-center gap-1 hover:text-white"
                    title={METRIC_DEFINITIONS.r2}
                  >
                    R² SCORE <HelpCircle size={12} />
                  </span>
                </th>
                <th className="pb-3 text-right pr-2">
                  <span 
                    className="cursor-help inline-flex items-center gap-1 hover:text-white"
                    title={METRIC_DEFINITIONS.direction}
                  >
                    DIRECTION <HelpCircle size={12} />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              
              {/* Naive Baseline */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 pl-2 font-semibold text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Naive Baseline (P_{'{t+1}'} = P_t)</span>
                </td>
                <td className="py-4 text-right text-slate-200">{metrics.naive.mae.toFixed(2)}</td>
                <td className="py-4 text-right text-slate-200 font-bold">{metrics.naive.rmse.toFixed(2)}</td>
                <td className="py-4 text-right text-slate-200">{metrics.naive.mape.toFixed(2)}%</td>
                <td className="py-4 text-right text-[#00E676] font-bold">{metrics.naive.r2.toFixed(4)}</td>
                <td className="py-4 text-right pr-2 text-slate-500">—</td>
              </tr>

              {/* Linear Regression */}
              <tr className="hover:bg-white/5 transition-colors bg-[#00E5FF]/5">
                <td className="py-4 pl-2 font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                  <span>Linear Regression</span>
                </td>
                <td className="py-4 text-right text-slate-200">{metrics.linear_regression.mae.toFixed(2)}</td>
                <td className="py-4 text-right text-slate-200">{metrics.linear_regression.rmse.toFixed(2)}</td>
                <td className="py-4 text-right text-slate-200">{metrics.linear_regression.mape.toFixed(2)}%</td>
                <td className="py-4 text-right text-[#00E5FF] font-bold">{metrics.linear_regression.r2.toFixed(4)}</td>
                <td className="py-4 text-right pr-2 text-[#00E5FF] font-bold">{metrics.linear_regression.direction_accuracy}%</td>
              </tr>

              {/* Random Forest */}
              <tr className="hover:bg-white/5 transition-colors bg-[#F5C542]/5">
                <td className="py-4 pl-2 font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F5C542]" />
                  <span className="flex items-center gap-1.5">
                    Random Forest (300 Trees)
                    <Award size={14} className="text-[#F5C542]" />
                  </span>
                </td>
                <td className="py-4 text-right text-[#F5C542] font-bold">{metrics.random_forest.mae.toFixed(2)}</td>
                <td className="py-4 text-right text-[#F5C542] font-bold">{metrics.random_forest.rmse.toFixed(2)}</td>
                <td className="py-4 text-right text-[#F5C542] font-bold">{metrics.random_forest.mape.toFixed(2)}%</td>
                <td className="py-4 text-right text-[#F5C542] font-bold">{metrics.random_forest.r2.toFixed(4)}</td>
                <td className="py-4 text-right pr-2 text-[#F5C542] font-bold">{metrics.random_forest.direction_accuracy}%</td>
              </tr>

              {/* LSTM - Locked Future Scope */}
              <tr className="text-slate-500 opacity-70 bg-black/20">
                <td className="py-4 pl-2 flex items-center gap-2 font-medium">
                  <Lock size={14} className="text-slate-400" />
                  <span>LSTM / GRU Neural Network</span>
                </td>
                <td colSpan={5} className="py-4 text-right pr-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 text-slate-300 border border-white/10">
                    <Lock size={12} />
                    <span>Future Scope — Explained in Workshop Report (Never fake numbers)</span>
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Grouped Comparative Bar Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* RMSE Bar */}
          <div className="glass-panel p-5">
            <span className="text-xs font-mono text-slate-400 block mb-1">RMSE ERROR (LOWER IS BETTER)</span>
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Naive Baseline</span>
                  <span className="text-white font-bold">154.04</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Random Forest</span>
                  <span className="text-[#F5C542] font-bold">155.46</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F5C542] rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Linear Regression</span>
                  <span className="text-[#00E5FF] font-bold">156.20</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00E5FF] rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Directional Accuracy Bar */}
          <div className="glass-panel p-5">
            <span className="text-xs font-mono text-slate-400 block mb-1">DIRECTION ACCURACY (50% = COIN FLIP)</span>
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Linear Regression</span>
                  <span className="text-[#00E5FF] font-bold">54.4%</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00E5FF] rounded-full" style={{ width: '54.4%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Random Forest</span>
                  <span className="text-[#F5C542] font-bold">53.6%</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F5C542] rounded-full" style={{ width: '53.6%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Random Guess Baseline</span>
                  <span className="text-slate-400">50.0%</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white/20 rounded-full" style={{ width: '50.0%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* R² Score Comparison */}
          <div className="glass-panel p-5">
            <span className="text-xs font-mono text-slate-400 block mb-1">PRICE R² FIT (SCALE: 0 TO 1.0)</span>
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Naive Baseline</span>
                  <span className="text-[#00E676] font-bold">0.9905</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00E676] rounded-full" style={{ width: '99.05%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Random Forest</span>
                  <span className="text-[#F5C542] font-bold">0.9903</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F5C542] rounded-full" style={{ width: '99.03%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Linear Regression</span>
                  <span className="text-[#00E5FF] font-bold">0.9902</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00E5FF] rounded-full" style={{ width: '99.02%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* HONEST INSIGHT CALLOUT (Rule Requirement) */}
        <div className="glass-panel p-6 sm:p-8 border-l-4 border-l-[#00E5FF] bg-gradient-to-r from-[#121826]/90 to-[#0B0F17]/90">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center shrink-0 text-[#00E5FF]">
              <AlertCircle size={22} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase font-bold tracking-wider mb-1">
                Core Workshop Takeaway // The Honesty Rule
              </div>
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                Why R² ≈ 0.99 Can Be Misleading in Financial Time Series
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                "An R² score of ~0.99 looks outstanding at first glance, but the trivial naive baseline 
                (tomorrow's price = today's price) achieves an identical R² of 0.9905 with even lower RMSE (154.04). 
                The directional accuracy of both models is only ~54% (slightly above random chance), 
                and both models trailed Buy & Hold after accounting for transaction costs. 
                In financial markets, high price correlation must never be mistaken for genuine predictive alpha."
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-mono text-slate-400">
                <span>Workshop Report Page 11</span>
                <span>•</span>
                <span className="text-[#00E676]">Zero Cherry-Picking</span>
                <span>•</span>
                <span className="text-[#F5C542]">Full Metric Transparency</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
