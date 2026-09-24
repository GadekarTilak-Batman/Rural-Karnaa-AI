import React from 'react';
import {
  Sprout,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1.5 rounded-full font-bold">
          <Sprout className="w-4 h-4" />
          <span>StartupX Hackathon Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          About RuralKarnaa AI
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          AI Financial Helper for Rural India — Empowering farmers, livestock owners, and rural families
          with crystal-clear financial understanding, seasonal crop cash-flow planning, and explainable AI advice.
        </p>
      </div>

      {/* The Rural Financial Problem */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
            The Rural Challenge in India
          </span>
          <h2 className="text-xl font-extrabold text-stone-900">
            Why Rural Families Face Financial Insecurity
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>1. Highly Irregular Seasonal Income</span>
            </h3>
            <p className="leading-relaxed text-stone-600">
              Farmers earn lump-sum income only once or twice a year at harvest time (e.g. November paddy sales).
              Managing money across the 4 lean growth months without running out of cash is a constant battle.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-rose-600" />
              <span>2. High-Interest Informal Debt</span>
            </h3>
            <p className="leading-relaxed text-stone-600">
              When emergency medical or farm input expenses arise before harvest, lack of liquid buffers pushes
              families to local moneylenders charging predatory 24% to 36% annual interest rates.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-purple-600" />
              <span>3. Financial Jargon & Complex Apps</span>
            </h3>
            <p className="leading-relaxed text-stone-600">
              Mainstream fintech apps are designed for salaried urban professionals with monthly salaries, credit
              cards, and English-only menus, leaving rural citizens excluded.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-red-600" />
              <span>4. Targeted Cyber Fraud & Scams</span>
            </h3>
            <p className="leading-relaxed text-stone-600">
              Rural smartphone users are disproportionately targeted by fake loan apps, phishing links, and OTP
              theft pretending to be official government PM-KISAN schemes.
            </p>
          </div>
        </div>
      </div>

      {/* The RuralKarnaa Solution */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Our Core Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            "Don't just show the problem — tell the user what to do next."
          </h2>
          <p className="text-xs text-emerald-200">
            We bridge the gap with simple visual meters, voice interaction, 6 Indian languages, and practical
            actionable guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-emerald-100">
          <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-2">
            <h3 className="font-bold text-white text-sm">Clear Health Score (1-100)</h3>
            <p className="leading-relaxed">
              Deterministic 6-pillar indicator showing savings buffer, loan sustainability, and cash flow without
              credit score confusion.
            </p>
          </div>
          <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-2">
            <h3 className="font-bold text-white text-sm">Grounded AI Guidance</h3>
            <p className="leading-relaxed">
              Powered by server-side Gemini Flash, evaluating whether you can afford purchases without wiping out
              emergency reserves.
            </p>
          </div>
          <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-2">
            <h3 className="font-bold text-white text-sm">Voice & Offline Support</h3>
            <p className="leading-relaxed">
              Speak in Hindi, Telugu, Tamil, Kannada, Marathi, or English. Operates with local caching when field
              internet is weak.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-6 py-3 rounded-xl shadow-lg transition inline-flex items-center gap-2 text-xs"
          >
            <span>Experience RuralKarnaa Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
