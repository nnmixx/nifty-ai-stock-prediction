import React from 'react';
import { 
  X, 
  FileText, 
  Award, 
  User, 
  GraduationCap, 
  Building, 
  CheckCircle2, 
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function WorkshopModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#F5C542]/20 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542]">
            <Award size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5C542] font-semibold">
              Academic Documentation
            </span>
            <h2 className="text-xl font-heading font-bold text-white">
              Workshop Project Report
            </h2>
            <p className="text-xs text-slate-400">
              Stock Price Prediction Using Machine Learning
            </p>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#090D15] border border-white/5">
            <span className="text-slate-400 block text-[10px] mb-0.5">CANDIDATE NAME</span>
            <span className="text-white font-bold text-sm">Gunjan Hembram</span>
          </div>

          <div className="p-3 rounded-lg bg-[#090D15] border border-white/5">
            <span className="text-slate-400 block text-[10px] mb-0.5">ROLL NUMBER</span>
            <span className="text-[#00E5FF] font-bold text-sm">24102060018</span>
          </div>

          <div className="p-3 rounded-lg bg-[#090D15] border border-white/5">
            <span className="text-slate-400 block text-[10px] mb-0.5">ACADEMIC BRANCH & SEMESTER</span>
            <span className="text-white">Diploma in CSE — 5th Semester</span>
          </div>

          <div className="p-3 rounded-lg bg-[#090D15] border border-white/5">
            <span className="text-slate-400 block text-[10px] mb-0.5">INSTITUTION</span>
            <span className="text-white">Govt. Women's Polytechnic, Ranchi</span>
          </div>

          <div className="p-3 rounded-lg bg-[#090D15] border border-white/5">
            <span className="text-slate-400 block text-[10px] mb-0.5">WORKSHOP ORGANIZER</span>
            <span className="text-[#00E676]">Anudip Foundation</span>
          </div>

          <div className="p-3 rounded-lg bg-[#090D15] border border-white/5">
            <span className="text-slate-400 block text-[10px] mb-0.5">WORKSHOP TRAINER</span>
            <span className="text-white">Md Rashid</span>
          </div>
        </div>

        {/* Certifications Earned */}
        <div className="mb-6">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            IBM SkillsBuild Credentials Earned
          </h3>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 size={16} className="text-[#00E676]" />
                <span className="font-semibold">Machine Learning for Data Science Projects</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">20 Learning Hours</span>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 size={16} className="text-[#00E676]" />
                <span className="font-semibold">Getting Started with Generative AI</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Digital Credential</span>
            </div>
          </div>
        </div>

        {/* Abstract & Acknowledgement */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed mb-6">
          <p className="mb-2">
            <strong>Project Abstract:</strong> Demonstrates the complete ML pipeline on 14 years of daily OHLCV Nifty 50 data (2007–2021). 
            Proves an honest lesson: an R² ≈ 0.99 on price levels can be misleading, as naive baseline performs identically 
            and beating the market after friction costs is exceptionally hard.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
