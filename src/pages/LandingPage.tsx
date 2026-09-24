import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Calendar,
  Mic,
  Languages,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Users,
  Sprout,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { CircularScore } from '../components/CircularScore';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

interface LandingPageProps {
  onNavigate: (route: string) => void;
  onOpenVoice: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenVoice,
}) => {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-stone-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fef08a_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-700/80 border border-emerald-500/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>StartupX Hackathon Finalist • AI for Rural India</span>
          </div>

          {/* Main Headline & Subhead (from section 4) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            {t('heroHeadline', lang)}
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto font-normal leading-relaxed">
            {t('heroSubheadline', lang)}
          </p>

          {/* Central Product Idea Callout */}
          <div className="inline-block bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-5 py-3 text-sm font-semibold text-amber-200">
            "Don't just show the problem — tell the user what to do next."
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-base px-7 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{t('checkHealthBtn', lang)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/ai-helper')}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-base px-7 py-3.5 rounded-xl border border-emerald-500/50 shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t('talkToAiBtn', lang)}</span>
            </button>

            <button
              onClick={onOpenVoice}
              className="bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-stone-600 transition flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Voice Mode (बोलिए)</span>
            </button>
          </div>

          {/* Interactive Demo Presets */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-emerald-200">
            <span className="font-semibold text-stone-300">Quick Hackathon Demo:</span>
            <button
              onClick={() => {
                StorageService.loadDemoProfile('farmer');
                onNavigate('/dashboard');
              }}
              className="bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 px-3 py-1.5 rounded-lg border border-emerald-600 transition font-bold"
            >
              🌾 {t('loadDemoFarmer', lang)}
            </button>
            <button
              onClick={() => {
                StorageService.loadDemoProfile('shop');
                onNavigate('/dashboard');
              }}
              className="bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 px-3 py-1.5 rounded-lg border border-emerald-600 transition font-bold"
            >
              🏪 {t('loadDemoShop', lang)}
            </button>
          </div>
        </div>
      </section>

      {/* 6 Visual Feature Cards (Section 4 Requirements) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Built for Farmers, Livestock Owners & Rural Families
          </h2>
          <p className="text-stone-600 text-sm">
            Everything you need to navigate cash flow, seasonal peaks, debt management, and financial security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Financial Health Score */}
          <div
            onClick={() => onNavigate('/financial-health')}
            className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-700 group-hover:text-white transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">1. Financial Health Score</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Clear 1-100 indicator (e.g. 72/100) showing debt burden, savings readiness, and spending stability
                with zero confusing financial jargon.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>View Score Algorithm</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Income & Expenses */}
          <div
            onClick={() => onNavigate('/income')}
            className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg group-hover:bg-amber-600 group-hover:text-white transition">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">2. Income & Cash Flow Tracking</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Log milk cooperative payments, vegetable mandi receipts, daily wages, and diesel or fertilizer costs
                by voice or tap.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Track Transactions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: AI Guidance */}
          <div
            onClick={() => onNavigate('/ai-helper')}
            className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg group-hover:bg-purple-700 group-hover:text-white transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">3. Actionable AI Recommendations</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ask: "Can I afford to buy this?", "When is my next EMI?", or "How much should I keep for seeds?".
                AI tells you the exact next step.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Ask AI Helper</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Seasonal Planning */}
          <div
            onClick={() => onNavigate('/seasonal-income')}
            className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg group-hover:bg-blue-700 group-hover:text-white transition">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">4. Seasonal Income Planner</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Farmers earn mainly at harvest (e.g. November Rice harvest ₹80,000). Plan cash reserves across the 4
                lean growth months.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>Plan Kharif & Rabi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 5: Voice Support */}
          <div
            onClick={onOpenVoice}
            className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-lg group-hover:bg-rose-700 group-hover:text-white transition">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">5. Voice-First Interaction</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                No need to type difficult forms. Simply speak: "I earned 30,000 rupees this month" — AI extracts amount
                and confirms with one tap.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-rose-700">
              <span>Open Voice Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 6: Local Languages */}
          <div
            onClick={() => onNavigate('/settings')}
            className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg group-hover:bg-teal-700 group-hover:text-white transition">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">6. 6 Local Indian Languages</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Full multilingual support across Hindi, Telugu, Tamil, Kannada, Marathi, and English with offline
                caching support.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Choose Your Language</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (Flow from PPT & Section 4) */}
      <section className="bg-stone-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Architecture & Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              How RuralKarnaa AI Works
            </h2>
            <p className="text-xs text-stone-500 max-w-xl mx-auto">
              User → Enters/Speaks Information → AI Checks It → Gives Actionable Advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 text-center space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm mx-auto flex items-center justify-center">
                1
              </div>
              <h4 className="text-sm font-bold text-stone-900">Enter or Speak</h4>
              <p className="text-[11px] text-stone-600 leading-normal">
                User enters numbers or speaks: "Earned ₹30,000 from dairy".
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 text-center space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm mx-auto flex items-center justify-center">
                2
              </div>
              <h4 className="text-sm font-bold text-stone-900">AI Analyzes</h4>
              <p className="text-[11px] text-stone-600 leading-normal">
                Engine validates cash flow, debt burden, and seasonal cycles.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 text-center space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm mx-auto flex items-center justify-center">
                3
              </div>
              <h4 className="text-sm font-bold text-stone-900">Score Calculated</h4>
              <p className="text-[11px] text-stone-600 leading-normal">
                Financial Health Score (e.g. 72/100) generated with 6 pillars.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 text-center space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm mx-auto flex items-center justify-center">
                4
              </div>
              <h4 className="text-sm font-bold text-stone-900">Risks Identified</h4>
              <p className="text-[11px] text-stone-600 leading-normal">
                Detects low emergency savings or approaching high EMI dates.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl p-4 border border-emerald-300 bg-emerald-50/50 text-center space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-sm mx-auto flex items-center justify-center">
                5
              </div>
              <h4 className="text-sm font-bold text-emerald-950">Action Guidance</h4>
              <p className="text-[11px] text-emerald-900 leading-normal">
                Tells the user specifically what to do next to stay financially safe.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition inline-flex items-center gap-2"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
