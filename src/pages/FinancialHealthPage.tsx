import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Calculator,
  HelpCircle,
  FileText
} from 'lucide-react';
import { CircularScore } from '../components/CircularScore';
import { StorageService } from '../services/storage';
import { calculateFinancialHealthScore } from '../services/scoring';
import { useLanguage } from '../context/LanguageContext';

interface FinancialHealthPageProps {
  onNavigate: (route: string) => void;
}

export const FinancialHealthPage: React.FC<FinancialHealthPageProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const [incomes, setIncomes] = useState(StorageService.getIncomes());
  const [expenses, setExpenses] = useState(StorageService.getExpenses());
  const [loans, setLoans] = useState(StorageService.getLoans());
  const [savings, setSavings] = useState(StorageService.getSavings());

  useEffect(() => {
    const unsub = StorageService.subscribe(() => {
      setIncomes(StorageService.getIncomes());
      setExpenses(StorageService.getExpenses());
      setLoans(StorageService.getLoans());
      setSavings(StorageService.getSavings());
    });
    return unsub;
  }, []);

  const health = calculateFinancialHealthScore(incomes, expenses, loans, savings);

  const pillars = [
    {
      name: 'Income Stability',
      score: health.incomeStability,
      weight: '15%',
      desc: 'Consistency and diversification of household earning channels (dairy, crops, daily wages).',
      benchmark: health.incomeStability >= 70 ? 'Stable' : 'Volatile',
    },
    {
      name: 'Expense Management',
      score: health.expenseManagement,
      weight: '25%',
      desc: 'Proportion of income spent on essential vs non-essential costs (target: <= 65%).',
      benchmark: health.expenseManagement >= 70 ? 'Controlled' : 'High Outflow',
    },
    {
      name: 'Savings & Buffer',
      score: health.savingsRatio,
      weight: '20%',
      desc: 'Months of living and farm expenses covered by liquid savings.',
      benchmark: health.savingsRatio >= 60 ? 'Adequate' : 'Low Buffer',
    },
    {
      name: 'Debt & Loan Burden',
      score: health.loanBurden,
      weight: '20%',
      desc: 'Ratio of monthly loan EMI obligations to monthly incoming cash (KCC, hire-purchase).',
      benchmark: health.loanBurden >= 65 ? 'Manageable' : 'Heavy Burden',
    },
    {
      name: 'Emergency Preparedness',
      score: health.emergencyReadiness,
      weight: '10%',
      desc: 'Progress towards the ₹20,000 emergency medical and crop contingency fund.',
      benchmark: health.emergencyReadiness >= 60 ? 'Prepared' : 'In Progress',
    },
    {
      name: 'Cash-Flow Balance',
      score: health.cashFlowBalance,
      weight: '10%',
      desc: 'Net positive surplus remaining at the end of every calendar month.',
      benchmark: health.cashFlowBalance >= 65 ? 'Positive' : 'Tight Margin',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-sm font-bold block text-amber-950">
            Educational Indicator Notice:
          </strong>
          <p>
            {t('educationalDisclaimer', lang)} This indicator does not report to credit bureaus (like CIBIL)
            and does not fabricate real bank records. It is designed to empower you with transparent, explainable
            feedback.
          </p>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Deterministic Explainable Model</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900">
            Your Financial Health Score: {health.overallScore} / 100
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Your score is in the <strong className="text-stone-900">"{health.status}"</strong> range. Your spending
            is generally within monthly income, but your liquid emergency reserves (₹6,500) need building up
            before the November paddy harvest.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/what-if')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Simulate "What-If" Changes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('/ai-helper')}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-300 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Ask AI: Why is my score {health.overallScore}?</span>
            </button>
          </div>
        </div>

        <div className="shrink-0 bg-stone-50 rounded-3xl p-4 border border-stone-200">
          <CircularScore
            score={health.overallScore}
            size={200}
            strokeWidth={16}
            statusText={health.status}
            subtext="Calculated from your entered transactions"
          />
        </div>
      </div>

      {/* 6 Explainable Score Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">
            How Your Score Was Calculated
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Transparent Algorithm Breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map(pillar => (
            <div
              key={pillar.name}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Weight: {pillar.weight}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    pillar.score >= 70
                      ? 'bg-emerald-100 text-emerald-800'
                      : pillar.score >= 55
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {pillar.benchmark}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900">{pillar.name}</h3>
                <p className="text-xs text-stone-500 mt-1">{pillar.desc}</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-stone-700">
                  <span>Pillar Score</span>
                  <span>{pillar.score}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      pillar.score >= 70
                        ? 'bg-emerald-600'
                        : pillar.score >= 55
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observations & Next Action Steps (Section 8) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <span>Key Observations & Action Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Observations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              AI Diagnostic Observations
            </h4>
            <div className="space-y-2">
              {health.observations.map((obs, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-800 flex items-start gap-2.5"
                >
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{obs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {t('whatYouCanDo', lang)}
            </h4>
            <div className="space-y-2">
              {health.actionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
