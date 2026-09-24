import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  Mic,
  Tag,
  ArrowUpRight,
  Filter,
  Check,
  X,
  FileText
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { IncomeEntry, IncomeCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface IncomePageProps {
  onOpenVoice: () => void;
}

export const IncomePage: React.FC<IncomePageProps> = ({ onOpenVoice }) => {
  const { lang, t } = useLanguage();
  const [incomes, setIncomes] = useState<IncomeEntry[]>(StorageService.getIncomes());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('dairy_milk');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const unsub = StorageService.subscribe(() => {
      setIncomes(StorageService.getIncomes());
    });
    return unsub;
  }, []);

  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);

  const filteredIncomes =
    selectedCategory === 'all'
      ? incomes
      : incomes.filter(i => i.category === selectedCategory);

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    StorageService.addIncome({
      userId: StorageService.getUser()?.id || 'guest',
      amount: Number(amount),
      category,
      source: source || 'General Income',
      date: date || new Date().toISOString().slice(0, 10),
      notes,
    });

    setAmount('');
    setSource('');
    setNotes('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this income record?')) {
      StorageService.deleteIncome(id);
    }
  };

  const categoryLabels: Record<IncomeCategory, string> = {
    farming: 'Farming / Crop Sale (फसल)',
    dairy_milk: 'Dairy / Milk Cooperative (दूध)',
    labor_wage: 'Labor / Daily Wage (मजदूरी)',
    daily_wage: 'Agricultural Daily Wage (दैनिक मजदूरी)',
    government_scheme: 'Govt Support (PM-KISAN / डीबीटी)',
    government_support: 'Government Subsidy / Support (अनुदान)',
    small_business: 'Small Business / Shop (व्यापार)',
    shop: 'Village Grocery / Kirana Shop (दुकान)',
    salary: 'Monthly Rural Wage / Salary (वेतन)',
    livestock: 'Livestock / Cattle Sale (पशु)',
    other: 'Other Sources (अन्य)',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs px-3 py-1 rounded-full font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('moneyCameIn', lang)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            {t('moneyCameIn', lang)}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {lang === 'hi'
              ? 'दूध समिति, मंडी बिक्री, दैनिक मजदूरी या दुकान की कमाई। कोई बैंक विवरण नहीं चाहिए।'
              : 'Log sales from milk, vegetables, crops or daily wages. No bank details needed.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenVoice}
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition"
          >
            <Mic className="w-4 h-4" />
            <span>{t('speakVoiceRecord', lang)}</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('quickAddIncome', lang)}</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5">
          <span className="text-xs font-black uppercase text-emerald-900">
            {t('moneyCameIn', lang)} ({t('thisMonth', lang)})
          </span>
          <div className="text-3xl font-black text-emerald-950 mt-1">
            +₹{totalIncome.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-emerald-800 font-bold">
            {incomes.length} {lang === 'hi' ? 'जमा प्रविष्टियां' : 'recorded entries'}
          </span>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase text-stone-600">
            Primary Inflow Source
          </span>
          <div className="text-xl font-bold text-stone-900 mt-1">
            Dairy Cooperative Payouts
          </div>
          <span className="text-xs text-stone-500">
            Bi-weekly milk center payments provide steady cash
          </span>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase text-stone-600">
            Upcoming Lump Sum
          </span>
          <div className="text-xl font-bold text-stone-900 mt-1">
            ₹80,000 (November)
          </div>
          <span className="text-xs text-stone-500">
            Expected Paddy Harvest market sale
          </span>
        </div>
      </div>

      {/* Filter and Income Records List */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <h2 className="text-lg font-bold text-stone-900">
            Recorded Income Transactions ({filteredIncomes.length})
          </h2>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-500 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedCategory === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('dairy_milk')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedCategory === 'dairy_milk'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Dairy / Milk
            </button>
            <button
              onClick={() => setSelectedCategory('government_scheme')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedCategory === 'government_scheme'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Govt Support
            </button>
            <button
              onClick={() => setSelectedCategory('farming')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedCategory === 'farming'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Farming
            </button>
          </div>
        </div>

        {/* Transactions Table / List */}
        <div className="space-y-2">
          {filteredIncomes.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200/70 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-stone-900">{item.source}</h4>
                    {item.isDemo && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                        Sample
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{item.category.replace('_', ' ')}</span>
                    {item.notes && (
                      <>
                        <span>•</span>
                        <span className="italic">{item.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-extrabold text-emerald-800">
                  +₹{Number(item.amount).toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete record"
                  className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Income Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900">Add Income Record</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddIncome} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Amount in Rupees (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-base font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as IncomeCategory)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Source / Payer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandya Milk Cooperative Center"
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Optional details (e.g. 450 liters payout)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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
                  Save Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
