import React, { useState, useEffect } from 'react';
import {
  PiggyBank,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  X,
  Target,
  Coins
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { SavingsGoal } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const SavingsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [savings, setSavings] = useState<SavingsGoal[]>(StorageService.getSavings());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [category, setCategory] = useState<any>('emergency_fund');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  useEffect(() => {
    const unsub = StorageService.subscribe(() => {
      setSavings(StorageService.getSavings());
    });
    return unsub;
  }, []);

  const totalCurrentSavings = savings.reduce((s, g) => s + Number(g.currentAmount || 0), 0);
  const totalTarget = savings.reduce((s, g) => s + Number(g.targetAmount || 0), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCurrentSavings / totalTarget) * 100) : 0;

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    StorageService.addSavingsGoal({
      userId: StorageService.getUser()?.id || 'guest',
      name,
      category,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDate,
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setIsModalOpen(false);
  };

  const handleQuickAddMoney = (id: string, addAmount: number) => {
    const target = savings.find(s => s.id === id);
    if (target) {
      StorageService.updateSavingsGoal(id, Number(target.currentAmount) + addAmount);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this savings goal?')) {
      StorageService.deleteSavingsGoal(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 text-xs px-3 py-1 rounded-full font-bold">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>{t('moneySaved', lang)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            {t('moneySaved', lang)}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {lang === 'hi'
              ? 'मुसीबत के समय, बीमारी या फसल कटाई तक के लिए सुरक्षित रखी गई बचत का हिसाब।'
              : 'Build resilience against medical emergencies, dry seasons, and pre-harvest expenses.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'hi' ? '+ नया बचत लक्ष्य' : 'New Savings Target'}</span>
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5">
          <span className="text-xs font-black uppercase text-blue-900">
            {t('moneySaved', lang)} ({t('available', lang)})
          </span>
          <div className="text-3xl font-black text-blue-950 mt-1">
            ₹{totalCurrentSavings.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-blue-800 font-bold">
            {lang === 'hi' ? `लक्ष्य: ₹${totalTarget.toLocaleString('en-IN')} (${overallProgress}% पूरा)` : `Goal: ₹${totalTarget.toLocaleString('en-IN')} (${overallProgress}% funded)`}
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase text-emerald-900">
            Recommended Weekly Deposit
          </span>
          <div className="text-2xl font-extrabold text-emerald-950 mt-1">
            ₹500 / week
          </div>
          <span className="text-xs text-emerald-700">
            Reaches ₹20,000 target in ~27 weeks without straining grocery budget
          </span>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase text-stone-600">
            Pre-Harvest Reserve Rule
          </span>
          <div className="text-lg font-bold text-stone-900 mt-1">
            Keep 1.5 months of expenses
          </div>
          <span className="text-xs text-stone-500">
            Covers lean growth months (Aug - Oct) until paddy sales
          </span>
        </div>
      </div>

      {/* Savings Goals Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">
          Dedicated Savings Pots ({savings.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savings.map(goal => {
            const pct = Math.min(100, Math.round(((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100));

            return (
              <div
                key={goal.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                      {goal.category.replace('_', ' ')}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mt-1">{goal.name}</h3>
                    <p className="text-xs text-stone-500">
                      Target Date: {goal.targetDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    title="Delete goal"
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Amounts & Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-extrabold text-blue-900">
                      ₹{goal.currentAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      Target: ₹{goal.targetAmount.toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 75 ? 'bg-emerald-600' : pct >= 40 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-600">Quick Deposit:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleQuickAddMoney(goal.id, 500)}
                      className="text-xs bg-stone-100 hover:bg-emerald-100 text-stone-800 hover:text-emerald-900 font-bold px-2.5 py-1 rounded-lg border border-stone-200 transition"
                    >
                      +₹500
                    </button>
                    <button
                      onClick={() => handleQuickAddMoney(goal.id, 1000)}
                      className="text-xs bg-stone-100 hover:bg-emerald-100 text-stone-800 hover:text-emerald-900 font-bold px-2.5 py-1 rounded-lg border border-stone-200 transition"
                    >
                      +₹1,000
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Guidance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Rural Micro-Savings Strategy</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900">1. Pay Yourself First</h4>
            <p className="leading-relaxed">
              When receiving the bi-weekly dairy milk payment, immediately transfer ₹500 to a separate savings
              post-office or bank account before paying store bills.
            </p>
          </div>
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900">2. Keep Liquid Cash Safe</h4>
            <p className="leading-relaxed">
              Never keep more than ₹5,000 in cash at home due to theft or impulse spending. Use Jan Dhan accounts
              or post-office savings schemes (IPPB).
            </p>
          </div>
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900">3. Harvest Allocations</h4>
            <p className="leading-relaxed">
              Always set aside 30% of your harvest lump sum (approx ₹24,000 from rice) immediately to cover the 4
              months before the next crop.
            </p>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900">Create Savings Goal</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Goal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Borewell Pump Repair Emergency Fund"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Target (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="20000"
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Starting Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="2000"
                    value={currentAmount}
                    onChange={e => setCurrentAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-stone-300 rounded-xl text-stone-700 text-xs font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
