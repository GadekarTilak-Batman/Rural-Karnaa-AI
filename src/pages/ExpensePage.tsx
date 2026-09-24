import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  Mic,
  AlertTriangle,
  ArrowDownRight,
  Filter,
  X,
  PieChart as PieIcon,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Volume2,
  VolumeX,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';
import { StorageService } from '../services/storage';
import { ExpenseEntry, ExpenseCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { speakText, stopSpeaking } from '../utils/speechHelper';

interface ExpensePageProps {
  onOpenVoice: () => void;
}

export const ExpensePage: React.FC<ExpensePageProps> = ({ onOpenVoice }) => {
  const { lang, t } = useLanguage();
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(StorageService.getExpenses());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [chartView, setChartView] = useState<'monthly' | 'categories' | 'area'>('monthly');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('farming');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const unsub = StorageService.subscribe(() => {
      setExpenses(StorageService.getExpenses());
    });
    return () => {
      unsub();
      stopSpeaking();
    };
  }, []);

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  const filteredExpenses =
    selectedCategory === 'all'
      ? expenses
      : expenses.filter(e => e.category === selectedCategory);

  const categoryLabels: Record<ExpenseCategory, string> = {
    farming: 'Farming (Seeds, Fertilizer, Tractor)',
    food: 'Household Food & Rations (राशन)',
    healthcare: 'Medical / Healthcare (दवा)',
    education: 'Education / School Fees (शिक्षा)',
    loan_emi: 'Loan Repayment / EMI (ऋण किस्त)',
    utilities: 'Electricity / Diesel / Water (बिजली/डीजल)',
    livestock_feed: 'Cattle Feed / Veterinary (चारा)',
    social_festivals: 'Social / Family Events (त्योहार)',
    business: 'Business / Shop Goods (व्यापार)',
    household: 'Household Essentials (घरेलू खर्च)',
    transport: 'Transport & Travel (यात्रा/वाहन)',
    other: 'Other Household Expenses (अन्य)',
  };

  // Category totals
  const categoryTotals: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return map;
  }, [expenses]);

  // Monthly Spending Trends Data for Recharts
  const monthlyTrendData = useMemo(() => {
    const isHindi = lang === 'hi';
    const isMr = lang === 'mr';
    const isTe = lang === 'te';
    const isTa = lang === 'ta';
    const isKn = lang === 'kn';

    return [
      {
        month: isHindi ? 'मई' : isMr ? 'मे' : isTe ? 'మే' : isTa ? 'மே' : isKn ? 'ಮೇ' : 'May',
        monthLabel: 'May 2026',
        total: 14200,
        farming: 8200,
        household: 4500,
        loansAndOther: 1500,
        note: isHindi ? 'खेत जुताई व बीज खरीद' : 'Field prep & seeds',
      },
      {
        month: isHindi ? 'जून' : isMr ? 'जून' : isTe ? 'జూన్' : isTa ? 'ஜூன்' : isKn ? 'ಜೂನ್' : 'Jun',
        monthLabel: 'June 2026',
        total: 19800,
        farming: 12500,
        household: 5100,
        loansAndOther: 2200,
        note: isHindi ? 'मानसून बुवाई व डीजल' : 'Monsoon sowing & diesel',
      },
      {
        month: isHindi ? 'जुलाई' : isMr ? 'जुलै' : isTe ? 'జూలై' : isTa ? 'ஜூலை' : isKn ? 'ಜುಲೈ' : 'Jul',
        monthLabel: 'July 2026 (Peak)',
        total: 22400,
        farming: 14800,
        household: 5300,
        loansAndOther: 2300,
        note: isHindi ? 'खाद (DAP) व खरपतवार' : 'Fertilizers & weeding',
        isPeak: true,
      },
      {
        month: isHindi ? 'अगस्त' : isMr ? 'ऑगस्ट' : isTe ? 'ఆగస్టు' : isTa ? 'ஆகஸ்ட்' : isKn ? 'ಆಗಸ್ಟ್' : 'Aug',
        monthLabel: 'August 2026',
        total: 18600,
        farming: 10400,
        household: 5800,
        loansAndOther: 2400,
        note: isHindi ? 'कीटनाशक व घरेलू राशन' : 'Pesticides & groceries',
      },
      {
        month: isHindi ? 'सितंबर (चालू)' : isMr ? 'सप्टेंबर (सध्या)' : isTe ? 'సెప్టెంబర్ (ప్రస్తుతం)' : isTa ? 'செப்டம்பர்' : isKn ? 'ಸೆಪ್ಟೆಂಬರ್' : 'Sep (Current)',
        monthLabel: 'September 2026 (Current)',
        total: totalExpenses > 0 ? totalExpenses : 21500,
        farming: categoryTotals['farming'] || 7200,
        household: (categoryTotals['food'] || 0) + (categoryTotals['utilities'] || 0) || 8300,
        loansAndOther: (categoryTotals['loan_emi'] || 0) + (categoryTotals['healthcare'] || 0) + (categoryTotals['transport'] || 0) || 6000,
        note: isHindi ? 'वर्तमान महीना' : 'Current active records',
        isCurrent: true,
      },
      {
        month: isHindi ? 'अक्टूबर (अनुमान)' : isMr ? 'ऑक्टोबर (अंदाज)' : isTe ? 'అక్టోబర్ (అంచనా)' : isTa ? 'அக்டோபர்' : isKn ? 'ಅಕ್ಟೋಬರ್' : 'Oct (Est)',
        monthLabel: 'October 2026 (Projected)',
        total: 16500,
        farming: 8500,
        household: 5000,
        loansAndOther: 3000,
        note: isHindi ? 'कटाई मजदूरी व ढुलाई' : 'Harvest labor & transport',
        isProjected: true,
      },
    ];
  }, [lang, totalExpenses, categoryTotals]);

  // Category Pie Data
  const categoryPieData = useMemo(() => {
    const colors = ['#059669', '#d97706', '#dc2626', '#2563eb', '#7c3aed', '#0891b2', '#ea580c'];
    return Object.entries(categoryTotals).map(([cat, sum], idx) => ({
      name: categoryLabels[cat as ExpenseCategory] ? categoryLabels[cat as ExpenseCategory].split('(')[0].trim() : cat,
      value: sum,
      color: colors[idx % colors.length],
    }));
  }, [categoryTotals]);

  const handleSpeakChartOverview = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    let message = '';
    const currentSpent = totalExpenses > 0 ? totalExpenses : 21500;

    if (lang === 'hi') {
      message = `महीनेवार खर्च का चार्ट: सबसे अधिक खर्च जुलाई में हुआ था, लगभग बाइस हज़ार चार सौ रुपये, जब बुवाई और खाद की आवश्यकता थी। इस चालू महीने सितंबर में आपका कुल खर्च ₹${currentSpent.toLocaleString('en-IN')} है। आने वाले अक्टूबर में कटाई के लिए लगभग सोलह हज़ार रुपये की आवश्यकता होगी।`;
    } else if (lang === 'mr') {
      message = `महिनेवार खर्चाचा आलेख: सर्वात जास्त खर्च जुलैमध्ये झाला होता, जवळपास बावीस हजार चारशे रुपये. या चालू सप्टेंबर महिन्यात तुमचा एकूण खर्च ₹${currentSpent.toLocaleString('en-IN')} आहे.`;
    } else if (lang === 'te') {
      message = `నెలవారీ ఖర్చుల చార్ట్: జూలై నెలలో విత్తనాలు, ఎరువుల కోసం అత్యధికంగా ₹22,400 ఖర్చయింది. ప్రస్తుత సెప్టెంబర్ నెలలో మీ మొత్తం ఖర్చు ₹${currentSpent.toLocaleString('en-IN')}.`;
    } else if (lang === 'ta') {
      message = `மாதாந்திர செலவு வரைபடம்: ஜூலை மாதத்தில் விதை மற்றும் உரத்திற்காக அதிகபட்சமாக ₹22,400 செலவானது. இந்த செப்டம்பர் மாதத்தில் உங்கள் மொத்த செலவு ₹${currentSpent.toLocaleString('en-IN')}.`;
    } else if (lang === 'kn') {
      message = `ಮಾಸಿಕ ವೆಚ್ಚಗಳ ಚಾರ್ಟ್: ಜುಲೈ ತಿಂಗಳಲ್ಲಿ ಬಿತ್ತನೆ ಮತ್ತು ಗೊಬ್ಬರಕ್ಕಾಗಿ ಗರಿಷ್ಠ ₹22,400 ಖರ್ಚಾಗಿತ್ತು. ಈ ಸೆಪ್ಟೆಂಬರ್ ತಿಂಗಳಲ್ಲಿ ನಿಮ್ಮ ಒಟ್ಟು ವೆಚ್ಚ ₹${currentSpent.toLocaleString('en-IN')}.`;
    } else {
      message = `Monthly spending trend chart: Peak spending occurred in July at ₹22,400 due to sowing and fertilizer inputs. In current month September, total expenses stand at ₹${currentSpent.toLocaleString('en-IN')}. In October, projected harvest labor will need about ₹16,500.`;
    }

    speakText(message, lang, () => setIsSpeaking(false));
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    StorageService.addExpense({
      userId: StorageService.getUser()?.id || 'guest',
      amount: Number(amount),
      category,
      date: date || new Date().toISOString().slice(0, 10),
      notes,
    });

    setAmount('');
    setNotes('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this expense entry?')) {
      StorageService.deleteExpense(id);
    }
  };

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 text-white p-3.5 rounded-2xl shadow-xl border border-stone-700 text-xs space-y-1 z-50">
          <p className="font-extrabold text-amber-300 text-sm border-b border-stone-700 pb-1">
            {data.monthLabel || label}
          </p>
          <p className="text-white font-bold text-base">
            ₹{Number(data.total).toLocaleString('en-IN')}
          </p>
          {data.farming !== undefined && (
            <div className="text-[11px] text-stone-300 pt-1 space-y-0.5">
              <p>🌾 {lang === 'hi' ? 'खेती' : 'Farming'}: ₹{Number(data.farming).toLocaleString('en-IN')}</p>
              <p>🍚 {lang === 'hi' ? 'घर/राशन' : 'Household'}: ₹{Number(data.household).toLocaleString('en-IN')}</p>
              <p>📋 {lang === 'hi' ? 'किश्त व अन्य' : 'Loan & Other'}: ₹{Number(data.loansAndOther).toLocaleString('en-IN')}</p>
            </div>
          )}
          {data.note && (
            <p className="text-[11px] text-emerald-300 italic pt-1 border-t border-stone-800">
              ℹ️ {data.note}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 text-xs px-3 py-1 rounded-full font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t('moneySpent', lang)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            {t('moneySpent', lang)}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {lang === 'hi'
              ? 'खाद, बीज, डीजल, राशन, दवा और घरेलू खर्चों का आसान बहीखाता और मासिक विश्लेषण।'
              : 'Keep track of farming inputs, diesel, groceries, medical, and loan installments with visual monthly trends.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenVoice}
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>{t('speakVoiceRecord', lang)}</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('quickAddExpense', lang)}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5">
          <span className="text-xs font-black uppercase text-amber-900">
            {t('moneySpent', lang)} ({t('thisMonth', lang)})
          </span>
          <div className="text-3xl font-black text-amber-950 mt-1">
            -₹{totalExpenses.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-amber-800 font-bold">
            {expenses.length} {lang === 'hi' ? 'खर्च प्रविष्टियां' : 'tracked items'}
          </span>
        </div>

        <div className="bg-stone-50 border-2 border-stone-200 rounded-3xl p-5">
          <span className="text-xs font-bold uppercase text-stone-600">
            {t('peakSpendingMonth', lang)}
          </span>
          <div className="text-2xl font-black text-rose-900 mt-1">
            ₹22,400 <span className="text-xs font-bold text-stone-500">({lang === 'hi' ? 'जुलाई' : 'July'})</span>
          </div>
          <span className="text-xs text-stone-600 font-medium">
            {lang === 'hi' ? 'खरीफ बुवाई, खाद (DAP) व निराई मजदूरी' : 'Kharif sowing & fertilizer top dressing'}
          </span>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5">
          <span className="text-xs font-bold uppercase text-emerald-900">
            {t('averageMonthlySpending', lang)}
          </span>
          <div className="text-2xl font-black text-emerald-950 mt-1">
            ₹18,800
          </div>
          <span className="text-xs text-emerald-800 font-bold">
            {lang === 'hi' ? 'सितंबर का खर्च नियंत्रण में है' : 'Spending is well-controlled this month'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RECHARTS SECTION: Visual Monthly Spending Trends for Easier Financial Oversight */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-sm space-y-6">
        
        {/* Chart Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900">
                {t('spendingTrendTitle', lang)}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t('spendingTrendSub', lang)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Audio Explanation Button */}
            <button
              onClick={handleSpeakChartOverview}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-400 text-stone-950 animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{t('stopAudio', lang)}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t('listenAudio', lang)}</span>
                </>
              )}
            </button>

            {/* View Toggles */}
            <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setChartView('monthly')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  chartView === 'monthly'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📊 {t('showMonthlyTrend', lang)}
              </button>
              <button
                onClick={() => setChartView('categories')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  chartView === 'categories'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🌾 {t('showCategoryShare', lang)}
              </button>
              <button
                onClick={() => setChartView('area')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  chartView === 'area'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📈 {lang === 'hi' ? 'प्रवाह चार्ट' : 'Flow'}
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Render Container */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'monthly' ? (
              /* View 1: Monthly Total Spending Bar Chart */
              <BarChart
                data={monthlyTrendData}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece1" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e7e5e4' }}
                  tick={{ fill: '#44403c', fontSize: 12, fontWeight: 700 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={val => `₹${val / 1000}k`}
                  tick={{ fill: '#78716c', fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="total"
                  name={lang === 'hi' ? 'कुल मासिक खर्च (₹)' : 'Total Monthly Outflow (₹)'}
                  radius={[10, 10, 0, 0]}
                >
                  {monthlyTrendData.map((entry, index) => {
                    let fill = '#059669'; // default emerald
                    if (entry.isPeak) fill = '#dc2626'; // Red for peak sowing month
                    if (entry.isCurrent) fill = '#d97706'; // Amber for current month
                    if (entry.isProjected) fill = '#a8a29e'; // Gray-stone for projected
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            ) : chartView === 'categories' ? (
              /* View 2: Stacked Category Breakdown across months */
              <BarChart
                data={monthlyTrendData}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece1" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e7e5e4' }}
                  tick={{ fill: '#44403c', fontSize: 12, fontWeight: 700 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={val => `₹${val / 1000}k`}
                  tick={{ fill: '#78716c', fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 12, fontWeight: 600 }}
                />
                <Bar
                  dataKey="farming"
                  name={lang === 'hi' ? '🌾 खेती (खाद/बीज/डीजल)' : '🌾 Farming Inputs'}
                  stackId="a"
                  fill="#059669"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="household"
                  name={lang === 'hi' ? '🍚 घर व राशन' : '🍚 Household & Food'}
                  stackId="a"
                  fill="#d97706"
                />
                <Bar
                  dataKey="loansAndOther"
                  name={lang === 'hi' ? '📋 ऋण किश्त व अन्य' : '📋 Loans & Healthcare'}
                  stackId="a"
                  fill="#dc2626"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            ) : (
              /* View 3: Smooth Area Flow Chart */
              <AreaChart
                data={monthlyTrendData}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece1" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e7e5e4' }}
                  tick={{ fill: '#44403c', fontSize: 12, fontWeight: 700 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={val => `₹${val / 1000}k`}
                  tick={{ fill: '#78716c', fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend Indicator & Explanation Bar for Rural Users */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span className="text-stone-700">{lang === 'hi' ? 'सामान्य महीने' : 'Normal Months'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600"></span>
              <span className="text-stone-700">{lang === 'hi' ? 'शिखर बुवाई खर्च (जुलाई)' : 'Peak Sowing (July)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600"></span>
              <span className="text-stone-700">{lang === 'hi' ? 'चालू माह (सितंबर)' : 'Current Month (September)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-stone-400"></span>
              <span className="text-stone-700">{lang === 'hi' ? 'अनुमानित (अक्टूबर)' : 'Projected (October)'}</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {lang === 'hi'
                ? 'नया खर्च जोड़ने पर यह ग्राफ़ तुरंत अपडेट होता है।'
                : 'Graph updates automatically when you add new expense entries.'}
            </span>
          </div>
        </div>

      </div>

      {/* Visual Category Breakdown Bars */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'hi' ? 'इस महीने का खर्च बंटवारा' : 'This Month Expense Distribution'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {Object.entries(categoryTotals).map(([catKey, sum]) => {
            const pct = Math.round((sum / (totalExpenses || 1)) * 100);
            return (
              <div key={catKey} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-stone-800">
                  <span className="capitalize">{categoryLabels[catKey as ExpenseCategory]?.split('(')[0] || catKey}</span>
                  <span className="text-amber-800">{pct}%</span>
                </div>
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs font-black text-stone-900">
                  ₹{sum.toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Table & Filter */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <h2 className="text-lg font-bold text-stone-900">
            {lang === 'hi' ? 'दर्ज किए गए खर्च' : 'Recorded Expenses'} ({filteredExpenses.length})
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-500 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('farming')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedCategory === 'farming'
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Farming
            </button>
            <button
              onClick={() => setSelectedCategory('food')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedCategory === 'food'
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Food / Ration
            </button>
            <button
              onClick={() => setSelectedCategory('healthcare')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedCategory === 'healthcare'
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Healthcare
            </button>
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-2">
          {filteredExpenses.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200/70 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-stone-900">
                      {categoryLabels[item.category] || item.category}
                    </h4>
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
                <span className="text-lg font-extrabold text-amber-800">
                  -₹{Number(item.amount).toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete record"
                  className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900">
                {lang === 'hi' ? 'खर्च जोड़ें' : 'Add Expense Record'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {lang === 'hi' ? 'रुपये में राशि (₹) *' : 'Amount in Rupees (₹) *'}
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 4500"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-base font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {lang === 'hi' ? 'वर्ग / मद *' : 'Category *'}
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
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
                  {lang === 'hi' ? 'तारीख *' : 'Date *'}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {lang === 'hi' ? 'विवरण / नोट' : 'Description / Notes'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'उदा. खाद के 2 बोरे, राशन की दुकान' : 'e.g. Urea fertilizer 2 bags from Agro center'}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-stone-300 rounded-xl text-stone-700 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  {lang === 'hi' ? 'खर्च सुरक्षित करें' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
