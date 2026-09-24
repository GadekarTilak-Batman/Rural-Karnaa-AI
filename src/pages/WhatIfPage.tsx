import React, { useState } from 'react';
import {
  Calculator,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { CircularScore } from '../components/CircularScore';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

export const WhatIfPage: React.FC = () => {
  const { lang, t } = useLanguage();

  // State sliders
  const [expenseChange, setExpenseChange] = useState<number>(0);
  const [incomePercentChange, setIncomePercentChange] = useState<number>(0);
  const [monthlySavingsChange, setMonthlySavingsChange] = useState<number>(0);
  const [newLoanEmi, setNewLoanEmi] = useState<number>(0);

  // Baseline figures
  const baseIncome = 35000;
  const baseExpenses = 21500;
  const baseSavings = 6500;
  const baseEmi = 3500;
  const baseScore = 72;

  // Calculated scenario
  const scenarioIncome = Math.round(baseIncome * (1 + incomePercentChange / 100));
  const scenarioExpenses = baseExpenses + expenseChange;
  const scenarioEmi = baseEmi + newLoanEmi;
  const scenarioSavings = Math.max(0, baseSavings + monthlySavingsChange * 6 - (expenseChange > 0 ? expenseChange * 0.2 : 0));

  const baseCashFlow = baseIncome - (baseExpenses + baseEmi);
  const scenarioCashFlow = scenarioIncome - (scenarioExpenses + scenarioEmi);
  const cashFlowDiff = scenarioCashFlow - baseCashFlow;

  // Score impact
  const scoreDiff = Math.round(
    (cashFlowDiff / 1000) * 1.5 -
    (newLoanEmi > 0 ? 6 : 0) +
    (monthlySavingsChange > 0 ? 4 : 0)
  );
  const scenarioScore = Math.max(25, Math.min(96, baseScore + scoreDiff));

  const monthsSurvival = scenarioExpenses > 0 ? (scenarioSavings / scenarioExpenses).toFixed(1) : '0';

  let riskCategory: 'Safe' | 'Caution' | 'High Risk' = 'Safe';
  let badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  let recommendation = 'Your proposed change keeps your household cash flow manageable.';

  if (scenarioCashFlow < 0) {
    riskCategory = 'High Risk';
    badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';
    recommendation = `Dangerous deficit: Your total monthly expenses and EMIs exceed your income by ₹${Math.abs(scenarioCashFlow).toLocaleString('en-IN')}. Do not take this extra commitment until harvest!`;
  } else if (scenarioCashFlow < 3000 || scoreDiff < -3) {
    riskCategory = 'Caution';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
    recommendation = `Tight margin: Leaves only ₹${scenarioCashFlow.toLocaleString('en-IN')} cash buffer at month end. Any crop pest or sudden clinic visit would force borrowing.`;
  } else if (monthlySavingsChange > 0 || incomePercentChange > 0) {
    recommendation = `Strong positive move! Saving extra or improving yield builds high protection for your family.`;
  }

  const handleReset = () => {
    setExpenseChange(0);
    setIncomePercentChange(0);
    setMonthlySavingsChange(0);
    setNewLoanEmi(0);
  };

  const applyPreset = (preset: { exp?: number; inc?: number; sav?: number; emi?: number }) => {
    setExpenseChange(preset.exp ?? 0);
    setIncomePercentChange(preset.inc ?? 0);
    setMonthlySavingsChange(preset.sav ?? 0);
    setNewLoanEmi(preset.emi ?? 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs px-3 py-1 rounded-full font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Scenario Planning Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            "What-If" Financial Decision Simulator
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Test a financial decision before taking out a loan or buying equipment to see if it protects your family.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition border border-stone-300"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Preset Quick Buttons (Section 15 Requirements) */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          Quick Decision Presets (योजना परिदृश्य):
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPreset({ exp: 5000 })}
            className="text-xs bg-white hover:bg-stone-100 font-semibold text-stone-800 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition"
          >
            "What if farming expenses increase by ₹5,000?"
          </button>
          <button
            onClick={() => applyPreset({ emi: 2000 })}
            className="text-xs bg-white hover:bg-stone-100 font-semibold text-stone-800 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition"
          >
            "What if I take a new loan with ₹2,000 monthly EMI?"
          </button>
          <button
            onClick={() => applyPreset({ inc: -20 })}
            className="text-xs bg-white hover:bg-stone-100 font-semibold text-stone-800 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition"
          >
            "What if crop yield drops by 20% due to rain?"
          </button>
          <button
            onClick={() => applyPreset({ sav: 500 })}
            className="text-xs bg-white hover:bg-stone-100 font-semibold text-stone-800 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition"
          >
            "What if I save ₹500 extra every month?"
          </button>
        </div>
      </div>

      {/* Main Grid: Controls & Scenario Impact Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-700" />
            <span>Adjust Proposed Decision Factors</span>
          </h2>

          {/* Slider 1: Expense Change */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700">
                1. Monthly Expense Change (Fertilizer, Diesel, Family)
              </label>
              <span className={`text-sm font-extrabold ${expenseChange > 0 ? 'text-rose-700' : 'text-stone-800'}`}>
                {expenseChange >= 0 ? `+₹${expenseChange.toLocaleString('en-IN')}` : `-₹${Math.abs(expenseChange).toLocaleString('en-IN')}`}
              </span>
            </div>
            <input
              type="range"
              min="-5000"
              max="15000"
              step="500"
              value={expenseChange}
              onChange={e => setExpenseChange(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-medium">
              <span>Save ₹5,000</span>
              <span>No change (₹0)</span>
              <span>Spend ₹15,000 more</span>
            </div>
          </div>

          {/* Slider 2: New Loan Monthly EMI */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700">
                2. New Loan Monthly EMI Commitment
              </label>
              <span className={`text-sm font-extrabold ${newLoanEmi > 0 ? 'text-rose-700' : 'text-stone-800'}`}>
                +₹{newLoanEmi.toLocaleString('en-IN')} / month
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={newLoanEmi}
              onChange={e => setNewLoanEmi(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-medium">
              <span>No new loan (₹0)</span>
              <span>₹5,000/mo</span>
              <span>₹10,000/mo</span>
            </div>
          </div>

          {/* Slider 3: Crop / Household Income Change */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700">
                3. Crop / Monthly Income Fluctuation (%)
              </label>
              <span className={`text-sm font-extrabold ${incomePercentChange < 0 ? 'text-rose-700' : incomePercentChange > 0 ? 'text-emerald-700' : 'text-stone-800'}`}>
                {incomePercentChange >= 0 ? `+${incomePercentChange}%` : `${incomePercentChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="5"
              value={incomePercentChange}
              onChange={e => setIncomePercentChange(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-medium">
              <span>-40% (Severe Drought/Pest)</span>
              <span>0% (Expected)</span>
              <span>+40% (Bumper Harvest)</span>
            </div>
          </div>

          {/* Slider 4: Monthly Extra Savings */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700">
                4. Extra Monthly Savings Set Aside
              </label>
              <span className="text-sm font-extrabold text-emerald-800">
                +₹{monthlySavingsChange.toLocaleString('en-IN')} / month
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="250"
              value={monthlySavingsChange}
              onChange={e => setMonthlySavingsChange(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-medium">
              <span>₹0</span>
              <span>₹2,500/mo</span>
              <span>₹5,000/mo</span>
            </div>
          </div>
        </div>

        {/* Right: Projected Impact Cards & Gauge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Health Score Projected Change */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col items-center justify-center text-center relative">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Projected Health Score
            </span>
            <div className="py-2">
              <CircularScore
                score={scenarioScore}
                size={160}
                statusText={riskCategory}
                subtext={`Baseline was ${baseScore} (${scoreDiff >= 0 ? '+' : ''}${scoreDiff} pts)`}
              />
            </div>
          </div>

          {/* Cash Flow Impact Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Monthly Cash Flow Impact
            </span>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-stone-600">Projected Net Balance:</span>
              <span
                className={`text-2xl font-black ${
                  scenarioCashFlow < 0 ? 'text-rose-700' : 'text-emerald-800'
                }`}
              >
                {scenarioCashFlow >= 0 ? `+₹${scenarioCashFlow.toLocaleString('en-IN')}` : `-₹${Math.abs(scenarioCashFlow).toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Monthly Inflow:</span>
                <span className="font-bold text-stone-900">₹{scenarioIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Household & Farm Outflow:</span>
                <span className="font-bold text-stone-900">₹{scenarioExpenses.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Monthly EMIs:</span>
                <span className="font-bold text-stone-900">₹{scenarioEmi.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-100">
                <span>Emergency Buffer Endurance:</span>
                <span className="font-extrabold text-stone-900">{monthsSurvival} months</span>
              </div>
            </div>
          </div>

          {/* AI Decision Advice */}
          <div className="bg-stone-900 text-white rounded-3xl p-5 space-y-2 border border-stone-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Simulation Recommendation</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                {riskCategory}
              </span>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
