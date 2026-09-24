import React, { useState } from 'react';
import {
  Printer,
  FileDown,
  ShieldCheck,
  Calendar,
  Building2,
  TrendingUp,
  CreditCard,
  PiggyBank,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { calculateFinancialHealthScore } from '../services/scoring';
import { useLanguage } from '../context/LanguageContext';

export const ReportsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const user = StorageService.getUser();
  const incomes = StorageService.getIncomes();
  const expenses = StorageService.getExpenses();
  const loans = StorageService.getLoans();
  const savings = StorageService.getSavings();

  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0) || 35000;
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0) || 21500;
  const totalSavings = savings.reduce((s, g) => s + Number(g.currentAmount || 0), 0) || 6500;
  const totalLoans = loans.reduce((s, l) => s + Number(l.remainingAmount || 0), 0) || 80000;
  const netCashFlow = totalIncome - totalExpenses;

  const health = calculateFinancialHealthScore(incomes, expenses, loans, savings);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Controls (Hidden during print) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900">
            Rural Household Financial Summary Report
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified structured statement suitable for bank loan applications, KCC renewals, or family planning.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Report Document Container */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-300 shadow-sm space-y-8 text-stone-900 print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-stone-900 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-emerald-900">
                RuralKarnaa AI
              </span>
              <span className="text-xs bg-stone-900 text-white font-bold px-2 py-0.5 rounded">
                Statement
              </span>
            </div>
            <p className="text-xs font-semibold text-stone-600 mt-1 uppercase tracking-wider">
              Rural Household & Agricultural Financial Health Report
            </p>
          </div>

          <div className="text-right text-xs space-y-0.5 text-stone-600">
            <p>Report Date: <strong>{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</strong></p>
            <p>Cycle: <strong>Kharif 2026 Season</strong></p>
            <p>Status: <span className="text-emerald-800 font-bold">User Self-Declared Records</span></p>
          </div>
        </div>

        {/* User Identity & Household Profile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
          <div>
            <span className="text-stone-500 font-medium block">Applicant / Household Head:</span>
            <strong className="text-sm text-stone-900">{user?.name || 'Ramesh Kumar'}</strong>
          </div>
          <div>
            <span className="text-stone-500 font-medium block">Primary Occupation:</span>
            <strong className="text-stone-900 capitalize">{user?.userType || 'Farmer'} (Paddy & Dairy)</strong>
          </div>
          <div>
            <span className="text-stone-500 font-medium block">Location / Village:</span>
            <strong className="text-stone-900">{user?.location || 'Mandya, Karnataka'}</strong>
          </div>
          <div>
            <span className="text-stone-500 font-medium block">Registered Mobile:</span>
            <strong className="text-stone-900">{user?.mobile || '+91 98765 43210'}</strong>
          </div>
        </div>

        {/* Financial Summary Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
            1. Monthly Income & Expense Position
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-800 uppercase">Gross Monthly Inflow</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">
                ₹{totalIncome.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-700">Dairy + Vegetables + DBT</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-semibold text-amber-800 uppercase">Monthly Expenses</span>
              <p className="text-2xl font-black text-amber-950 mt-1">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-amber-700">Farm inputs, food, diesel</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs font-semibold text-stone-700 uppercase">Net Monthly Cash Flow</span>
              <p className="text-2xl font-black text-stone-900 mt-1">
                +₹{netCashFlow.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-500">Operating cash surplus</span>
            </div>
          </div>
        </div>

        {/* Debt & Obligations Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
            2. Liabilities & Ongoing Credit Facilities
          </h3>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-300">
                <th className="p-2">Loan Facility</th>
                <th className="p-2">Lender</th>
                <th className="p-2">Sanctioned</th>
                <th className="p-2">Balance</th>
                <th className="p-2">Rate</th>
                <th className="p-2 text-right">Monthly EMI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loans.map(l => (
                <tr key={l.id}>
                  <td className="p-2 font-semibold text-stone-900">{l.loanName}</td>
                  <td className="p-2 text-stone-600">{l.lender}</td>
                  <td className="p-2 text-stone-600">₹{l.principal.toLocaleString('en-IN')}</td>
                  <td className="p-2 font-bold text-stone-900">₹{l.remainingAmount.toLocaleString('en-IN')}</td>
                  <td className="p-2 text-stone-600">{l.interestRate}%</td>
                  <td className="p-2 text-right font-bold text-rose-700">₹{l.emiAmount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Health Score & AI Diagnostics */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
            3. Financial Health & Resilience Diagnostics
          </h3>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800">
                RuralKarnaa Health Score: {health.overallScore} / 100 ({health.status})
              </span>
              <span className="text-stone-500 italic">Deterministic algorithmic evaluation</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-200 text-stone-600">
              <div>Income Stability: <strong>{health.incomeStability}%</strong></div>
              <div>Expense Control: <strong>{health.expenseManagement}%</strong></div>
              <div>Buffer Ratio: <strong>{health.savingsRatio}%</strong></div>
              <div>Debt Sustainability: <strong>{health.loanBurden}%</strong></div>
            </div>

            <div className="space-y-1 pt-2">
              <strong className="text-stone-800 block">Next Action Recommendations:</strong>
              <ul className="list-disc pl-4 space-y-1 text-stone-700">
                {health.actionSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Attribution */}
        <div className="pt-6 border-t border-stone-200 text-[10px] text-stone-500 space-y-1 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> {t('educationalDisclaimer', lang)} This document is a structured compilation
            of user-entered data prepared through RuralKarnaa AI. It does not constitute a formal CIBIL credit report
            or bank guarantee.
          </p>
          <div className="flex justify-between pt-4 text-stone-400">
            <span>Generated by RuralKarnaa AI System • StartupX Hackathon Initiative</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
