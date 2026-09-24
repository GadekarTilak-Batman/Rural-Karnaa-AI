import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sprout,
  TrendingUp,
  CreditCard,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { SeasonalPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const SeasonalPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [plans, setPlans] = useState<SeasonalPlan[]>(StorageService.getSeasonalPlans());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [crop, setCrop] = useState('Paddy (Rice)');
  const [sowingMonth, setSowingMonth] = useState('July');
  const [expectedHarvestMonth, setExpectedHarvestMonth] = useState('November');
  const [expectedIncome, setExpectedIncome] = useState('80000');
  const [otherIncome, setOtherIncome] = useState('15000');
  const [expectedMajorExpenses, setExpectedMajorExpenses] = useState('45000');
  const [notes, setNotes] = useState('Kharif main crop. Top dressing in October.');

  useEffect(() => {
    const unsub = StorageService.subscribe(() => {
      setPlans(StorageService.getSeasonalPlans());
    });
    return unsub;
  }, []);

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !expectedIncome) return;

    StorageService.addSeasonalPlan({
      userId: StorageService.getUser()?.id || 'guest',
      crop,
      sowingMonth,
      expectedHarvestMonth,
      expectedIncome: Number(expectedIncome),
      otherIncome: Number(otherIncome || 0),
      expectedMajorExpenses: Number(expectedMajorExpenses),
      notes,
    });

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this seasonal plan?')) {
      StorageService.deleteSeasonalPlan(id);
    }
  };

  const activePlan = plans[0] || {
    crop: 'Rice (Kharif)',
    sowingMonth: 'July',
    expectedHarvestMonth: 'November',
    expectedIncome: 80000,
    otherIncome: 15000,
    expectedMajorExpenses: 45000,
    notes: 'Kharif paddy with canal irrigation',
  };

  const totalInflow = Number(activePlan.expectedIncome) + Number(activePlan.otherIncome);
  const netSurplus = totalInflow - Number(activePlan.expectedMajorExpenses);

  // Month-by-month cash flow simulation for the crop cycle (July to Dec)
  const timelineMonths = [
    { name: 'July', stage: 'Sowing & Transplanting', outflow: 12000, inflow: 3000, status: 'Deficit (-₹9,000)' },
    { name: 'August', stage: 'Vegetative Growth & Weeding', outflow: 6000, inflow: 3000, status: 'Deficit (-₹3,000)' },
    { name: 'September', stage: 'Tillering & Pest Control', outflow: 7000, inflow: 3000, status: 'Deficit (-₹4,000)' },
    { name: 'October', stage: 'Panicle Initiation & Top Fertilizer', outflow: 8000, inflow: 3000, status: 'Deficit (-₹5,000)' },
    { name: 'November', stage: 'Harvesting & Mandi Payout', outflow: 12000, inflow: 83000, status: 'Surplus (+₹71,000)' },
    { name: 'December', stage: 'Post-Harvest & Rabi Prep', outflow: 5000, inflow: 4000, status: 'Balanced' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs px-3 py-1 rounded-full font-bold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Seasonal Agricultural Cash Flow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            {t('seasonalIncome', lang)} & Crop Cycles
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Plan for lump-sum harvest earnings (Kharif/Rabi) and maintain cash buffers across the 4 lean growth months.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Seasonal Plan</span>
        </button>
      </div>

      {/* Active Crop Overview Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase bg-amber-400 text-stone-950 px-3 py-1 rounded-full">
              Active Cycle: {activePlan.crop}
            </span>
            <h2 className="text-2xl font-extrabold mt-2">
              Sowing ({activePlan.sowingMonth}) → Harvest ({activePlan.expectedHarvestMonth})
            </h2>
            <p className="text-xs text-emerald-200">
              {activePlan.notes || 'Tracked agricultural season'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-300 block">Expected Harvest Income</span>
            <span className="text-3xl font-black text-amber-300">
              ₹{Number(activePlan.expectedIncome).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15">
            <span className="text-xs text-emerald-200 uppercase font-bold">
              Total Inflow (Harvest + Dairy)
            </span>
            <p className="text-2xl font-extrabold mt-1 text-white">
              ₹{totalInflow.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-300">Includes ₹{Number(activePlan.otherIncome).toLocaleString('en-IN')} interim milk/wages</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15">
            <span className="text-xs text-emerald-200 uppercase font-bold">
              Input Costs (Seeds, Fertilizer, Labor)
            </span>
            <p className="text-2xl font-extrabold mt-1 text-white">
              ₹{Number(activePlan.expectedMajorExpenses).toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-300">Spread over July - October growth phase</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15">
            <span className="text-xs text-amber-300 uppercase font-bold">
              Net Season Profit / Surplus
            </span>
            <p className="text-2xl font-extrabold mt-1 text-amber-300">
              ₹{netSurplus.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-200">Available for loan principal & household</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline of Cash Flow across Months */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <span>Crop Growth & Cash Outflow Timeline (Kharif 2026)</span>
          </h3>
          <span className="text-xs text-stone-500 font-semibold">
            July to December Cycle
          </span>
        </div>

        <p className="text-xs text-stone-600">
          Notice how the first 4 months require continuous spending (fertilizers, labor, tractor) before harvest
          revenue arrives in November. Keep a safety cash cushion so you don't need high-interest moneylender loans.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {timelineMonths.map((m, idx) => (
            <div
              key={m.name}
              className={`p-4 rounded-2xl border transition ${
                m.name === 'November'
                  ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/40'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-stone-900">{m.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.inflow > m.outflow
                      ? 'bg-emerald-200 text-emerald-950 font-extrabold'
                      : 'bg-amber-200 text-amber-950 font-bold'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <p className="text-xs font-semibold text-stone-700 mt-2">{m.stage}</p>

              <div className="mt-3 pt-2 border-t border-stone-200/80 flex justify-between text-xs text-stone-600">
                <span>In: +₹{m.inflow.toLocaleString('en-IN')}</span>
                <span className="text-rose-700 font-bold">Out: -₹{m.outflow.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Spending Guidance Banner (Section 13) */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-stone-950 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-amber-950">
            Safe Harvest Spending Guidance:
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
          "Do not spend all harvest income at once when the crop is sold in November. Reserve at least ₹25,000 for
          Rabi winter crop seeds, fertilizers, and upcoming KCC interest before buying non-essential items."
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white p-3 rounded-xl border border-amber-200 font-semibold text-stone-800">
            • 40% (₹32,000): Repay KCC loan interest & principal
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200 font-semibold text-stone-800">
            • 30% (₹24,000): Rabi season seeds, diesel & fertilizer
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200 font-semibold text-stone-800">
            • 30% (₹24,000): Family emergency savings & household
          </div>
        </div>
      </div>

      {/* Add Seasonal Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900">New Seasonal Plan</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlan} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Crop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cotton, Wheat, Sugarcane, Paddy"
                  value={crop}
                  onChange={e => setCrop(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Sowing Month</label>
                  <input
                    type="text"
                    value={sowingMonth}
                    onChange={e => setSowingMonth(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Harvest Month</label>
                  <input
                    type="text"
                    value={expectedHarvestMonth}
                    onChange={e => setExpectedHarvestMonth(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Harvest Income (₹)</label>
                  <input
                    type="number"
                    value={expectedIncome}
                    onChange={e => setExpectedIncome(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Interim Income (₹)</label>
                  <input
                    type="number"
                    value={otherIncome}
                    onChange={e => setOtherIncome(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Expected Input Costs (₹)</label>
                <input
                  type="number"
                  value={expectedMajorExpenses}
                  onChange={e => setExpectedMajorExpenses(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl"
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
                  className="flex-1 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
