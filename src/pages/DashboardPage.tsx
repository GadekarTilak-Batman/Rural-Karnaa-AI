import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  PiggyBank,
  AlertTriangle,
  Sparkles,
  Calendar,
  ShieldAlert,
  ArrowRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  CheckCircle2,
  Bell,
  Clock,
  Mic,
  FileText,
  ShieldCheck,
  Volume2,
  VolumeX,
  MinusCircle,
  PlusCircle,
  Coins
} from 'lucide-react';
import { CircularScore } from '../components/CircularScore';
import { StorageService } from '../services/storage';
import { calculateFinancialHealthScore, generateFinancialAlerts } from '../services/scoring';
import { useLanguage } from '../context/LanguageContext';
import { speakText, stopSpeaking } from '../utils/speechHelper';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
  onOpenVoice: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenVoice,
}) => {
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(StorageService.getUser());
  const [incomes, setIncomes] = useState(StorageService.getIncomes());
  const [expenses, setExpenses] = useState(StorageService.getExpenses());
  const [loans, setLoans] = useState(StorageService.getLoans());
  const [savings, setSavings] = useState(StorageService.getSavings());
  const [seasonalPlans, setSeasonalPlans] = useState(StorageService.getSeasonalPlans());
  const [speakingCard, setSpeakingCard] = useState<string | null>(null);

  useEffect(() => {
    const unsub = StorageService.subscribe(() => {
      setUser(StorageService.getUser());
      setIncomes(StorageService.getIncomes());
      setExpenses(StorageService.getExpenses());
      setLoans(StorageService.getLoans());
      setSavings(StorageService.getSavings());
      setSeasonalPlans(StorageService.getSeasonalPlans());
    });
    return () => {
      unsub();
      stopSpeaking();
    };
  }, []);

  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0) || 35000;
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0) || 21500;
  const totalSavings = savings.reduce((s, g) => s + Number(g.currentAmount || 0), 0) || 6500;
  const totalLoans = loans.reduce((s, l) => s + Number(l.remainingAmount || 0), 0) || 80000;
  const netCashFlow = totalIncome - totalExpenses;

  const healthScore = calculateFinancialHealthScore(incomes, expenses, loans, savings);
  const alerts = generateFinancialAlerts(incomes, expenses, loans, savings);

  const handleSpeak = (text: string, cardId: string) => {
    if (speakingCard === cardId) {
      stopSpeaking();
      setSpeakingCard(null);
    } else {
      setSpeakingCard(cardId);
      speakText(text, lang, () => {
        setSpeakingCard(null);
      });
    }
  };

  const handleSpeakOverall = () => {
    let summaryText = '';
    if (lang === 'hi') {
      summaryText = `नमस्ते ${user?.name || 'किसान साथी'}! इस महीने आपकी कुल कमाई पैंतीस हज़ार रुपये आई है, और इक्कीस हज़ार पाँच सौ रुपये खर्च हुए हैं। सब खर्चे काटकर आपकी जेब में तेरह हज़ार पाँच सौ रुपये बचे हैं। गुल्लक में छः हज़ार पाँच सौ रुपये सुरक्षित हैं, और अस्सी हज़ार रुपये का कर्ज़ बाकी है।`;
    } else if (lang === 'mr') {
      summaryText = `नमस्कार ${user?.name || 'शेतकरी मित्र'}! या महिन्यात तुम्हाला ₹35,000 कमाई झाली आणि ₹21,500 खर्च झाले. खर्च वजा जाता तुमच्या हातात ₹13,500 शिल्लक आहेत. गुल्लक मध्ये ₹6,500 बचत आहे आणि ₹80,000 कर्ज बाकी आहे.`;
    } else if (lang === 'te') {
      summaryText = `నమస్కారం ${user?.name || ''}! ఈ నెల మీకు ₹35,000 ఆదాయం వచ్చింది, ₹21,500 ఖర్చయింది. ఖర్చులు పోగా మీ చేతిలో ₹13,500 మిగిలి ఉంది. పొదుపు ₹6,500 ఉంది, అప్పు ₹80,000 ఉంది.`;
    } else if (lang === 'ta') {
      summaryText = `வணக்கம்! இந்த மாதம் ₹35,000 வருமானம் வந்தது, ₹21,500 செலவானது. செலவு போக கையில் ₹13,500 மீதம் உள்ளது.`;
    } else if (lang === 'kn') {
      summaryText = `ನಮಸ್ಕಾರ! ಈ ತಿಂಗಳು ನಿಮಗೆ ₹35,000 ಆದಾಯ ಬಂದಿದೆ, ₹21,500 ಖರ್ಚಾಗಿದೆ. ಖರ್ಚು ಕಳೆದು ಕೈಯಲ್ಲಿ ₹13,500 ಉಳಿದಿದೆ. ಉಳಿತಾಯ ₹6,500 ಇದೆ.`;
    } else {
      summaryText = `Hello ${user?.name || 'friend'}! This month you earned 35,000 rupees and spent 21,500 rupees. After all expenses, you have 13,500 rupees cash left in hand. You have 6,500 rupees in savings, and 80,000 rupees in loan dues.`;
    }
    handleSpeak(summaryText, 'all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Friendly Rural Trust Badge */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-2xs">
          <span>🌱</span>
          <span>{t('simpleVillageLedger', lang)}</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-emerald-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-amber-300 text-xs px-3 py-1 rounded-full font-bold">
            <span>{t('appName', lang)}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t('noBankDetailsNeeded', lang)}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('welcomeBack', lang)}, {user?.name || 'Ramesh Kumar'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl font-medium">
            {user?.userType === 'farmer' ? t('farmerSubtitle', lang) : t('shopSubtitle', lang)}
          </p>
        </div>

        {/* 3 High-Visibility Rural Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNavigate('/income')}
            className="flex-1 md:flex-initial bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-500/60 shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>{t('quickAddIncome', lang)}</span>
          </button>
          <button
            onClick={() => onNavigate('/expenses')}
            className="flex-1 md:flex-initial bg-rose-700/90 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-rose-500/60 shadow-xs transition"
          >
            <MinusCircle className="w-4 h-4 text-rose-200" />
            <span>{t('quickAddExpense', lang)}</span>
          </button>
          <button
            onClick={onOpenVoice}
            className="flex-1 md:flex-initial bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Mic className="w-4 h-4 text-stone-900" />
            <span>{t('speakVoiceRecord', lang)}</span>
          </button>
        </div>
      </div>

      {/* Primary Highlight: Cash Left in Hand / जेब में बचा नकद & Read Aloud Button */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-emerald-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
              {t('cashInPocket', lang)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              +₹{netCashFlow.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-300 font-bold">
              (कमाई ₹{totalIncome.toLocaleString('en-IN')} - खर्च ₹{totalExpenses.toLocaleString('en-IN')})
            </span>
          </div>
          <p className="text-xs text-emerald-100 font-medium">
            {t('cashInPocketSub', lang)}
          </p>
        </div>

        <button
          onClick={handleSpeakOverall}
          className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition w-full sm:w-auto ${
            speakingCard === 'all'
              ? 'bg-amber-300 text-stone-950 ring-4 ring-amber-300/40 animate-pulse'
              : 'bg-amber-400 hover:bg-amber-300 text-stone-950 cursor-pointer'
          }`}
        >
          {speakingCard === 'all' ? (
            <>
              <VolumeX className="w-4 h-4 text-stone-900" />
              <span>{t('stopAudio', lang)}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-stone-900" />
              <span>{t('listenAudio', lang)}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Health Score Circle & Core 4 Financial Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Financial Health Score Gauge */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700">
                {t('healthScore', lang)}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleSpeak(
                    lang === 'hi'
                      ? `आपका वित्तीय स्वास्थ्य स्कोर ${healthScore.overallScore} प्रतिशत है, जो बहुत अच्छी स्थिति दर्शाता है।`
                      : `Your financial health score is ${healthScore.overallScore} percent.`,
                    'score'
                  )
                }
                title="Listen to score"
                className="p-1 rounded-md text-stone-400 hover:text-emerald-700"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => onNavigate('/financial-health')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              <span>{t('details', lang)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-2">
            <CircularScore
              score={healthScore.overallScore}
              statusText={healthScore.status}
              subtext={t('scoreSubtext', lang)}
            />
          </div>

          <div className="w-full bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-stone-700 font-medium">
              <span>✅ {lang === 'hi' ? 'समय पर किश्त भुगतान' : 'Timely repayments'}:</span>
              <span className="font-black text-emerald-800">{healthScore.incomeStability}%</span>
            </div>
            <div className="flex justify-between items-center text-stone-700 font-medium">
              <span>✅ {lang === 'hi' ? 'कमाई से कम खर्च' : 'Controlled spending'}:</span>
              <span className="font-black text-emerald-800">{healthScore.expenseManagement}%</span>
            </div>
            <div className="flex justify-between items-center text-stone-700 font-medium">
              <span>🛡️ {lang === 'hi' ? 'आपातकालीन गुल्लक बचत' : 'Emergency reserve'}:</span>
              <span className="font-black text-emerald-800">{healthScore.emergencyReadiness}%</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 mt-3 italic">
            {t('scoreDisclaimer', lang)}
          </p>
        </div>

        {/* Right 2 Columns: 4 Key Financial Metrics (Income, Expenses, Savings, Loans) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Income (पैसे आए / कमाई) */}
          <div
            onClick={() => onNavigate('/income')}
            className="bg-emerald-50/50 rounded-2xl p-5 border-2 border-emerald-300 hover:border-emerald-600 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>{t('moneyCameIn', lang)}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(
                    lang === 'hi'
                      ? `कमाई: इस महीने दूध समिति और सब्ज़ी मंडी से कुल पैंतीस हज़ार रुपये आए हैं।`
                      : `Money In: You earned ₹${totalIncome.toLocaleString('en-IN')} this month.`,
                    'income'
                  );
                }}
                title="Listen to income"
                aria-label="Listen to income"
                className={`p-2 rounded-xl transition ${
                  speakingCard === 'income'
                    ? 'bg-emerald-700 text-white animate-bounce'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                  +₹{totalIncome.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-emerald-800 font-bold mt-1.5 flex items-center gap-1.5">
                <span>🌾</span>
                <span>{t('dairyAndMandi', lang)}</span>
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-900 group-hover:text-emerald-950">
              <span>{t('seeAllRecords', lang)}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Expenses (पैसे खर्च हुए / खर्चा) */}
          <div
            onClick={() => onNavigate('/expenses')}
            className="bg-amber-50/40 rounded-2xl p-5 border-2 border-amber-300 hover:border-amber-600 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-950 border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>{t('moneySpent', lang)}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(
                    lang === 'hi'
                      ? `खर्चा: खाद, बीज, डीज़ल और राशन पर इस महीने इक्कीस हज़ार पाँच सौ रुपये खर्च हुए हैं।`
                      : `Money Out: You spent ₹${totalExpenses.toLocaleString('en-IN')} on farming inputs and ration.`,
                    'expenses'
                  );
                }}
                title="Listen to expenses"
                aria-label="Listen to expenses"
                className={`p-2 rounded-xl transition ${
                  speakingCard === 'expenses'
                    ? 'bg-amber-700 text-white animate-bounce'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight">
                  -₹{totalExpenses.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-amber-900 font-bold mt-1.5 flex items-center gap-1.5">
                <span>🚜</span>
                <span>{t('farmInputsAndHome', lang)}</span>
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-amber-200/80 flex items-center justify-between text-xs font-bold text-amber-900 group-hover:text-amber-950">
              <span>{t('seeAllRecords', lang)}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Savings (गुल्लक में बचत / सुरक्षित पैसा) */}
          <div
            onClick={() => onNavigate('/savings')}
            className="bg-blue-50/40 rounded-2xl p-5 border-2 border-blue-300 hover:border-blue-600 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-950 border border-blue-300">
                <span>🏺</span>
                <span>{t('moneySaved', lang)}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(
                    lang === 'hi'
                      ? `बचत: गुल्लक में छः हज़ार पाँच सौ रुपये सुरक्षित जमा हैं। आपातकालीन लक्ष्य बीस हज़ार रुपये का है।`
                      : `Savings: You have ₹${totalSavings.toLocaleString('en-IN')} saved in gullak.`,
                    'savings'
                  );
                }}
                title="Listen to savings"
                aria-label="Listen to savings"
                className={`p-2 rounded-xl transition ${
                  speakingCard === 'savings'
                    ? 'bg-blue-700 text-white animate-bounce'
                    : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
                  ₹{totalSavings.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-blue-900 font-bold mt-1.5 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>{t('savedEmergencyFund', lang)}</span>
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-blue-200/80 flex items-center justify-between text-xs font-bold text-blue-900 group-hover:text-blue-950">
              <span>{t('manageGoals', lang)}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Loans (लौटाना बाकी है / कर्ज़) */}
          <div
            onClick={() => onNavigate('/loans')}
            className="bg-rose-50/40 rounded-2xl p-5 border-2 border-rose-300 hover:border-rose-600 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-950 border border-rose-300">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                <span>{t('moneyToPay', lang)}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(
                    lang === 'hi'
                      ? `कर्ज़: अस्सी हज़ार रुपये बकाया हैं। किसान क्रेडिट कार्ड की अगली किश्त अट्ठाईस सितंबर को देय है।`
                      : `Loans: ₹${totalLoans.toLocaleString('en-IN')} loan balance remaining. Next payment due on September 28.`,
                    'loans'
                  );
                }}
                title="Listen to loan dues"
                aria-label="Listen to loan dues"
                className={`p-2 rounded-xl transition ${
                  speakingCard === 'loans'
                    ? 'bg-rose-700 text-white animate-bounce'
                    : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-rose-950 tracking-tight">
                  ₹{totalLoans.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-rose-900 font-bold mt-1.5 flex items-center gap-1.5">
                <span>📋</span>
                <span>{t('repayCoopLoan', lang)}</span>
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-rose-200/80 flex items-center justify-between text-xs font-bold text-rose-900 group-hover:text-rose-950">
              <span>{t('viewEmiSchedule', lang)}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation & Action Plan */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-amber-50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                {t('aiSays', lang)}
              </h3>
              <p className="text-xs font-semibold text-stone-600">
                {t('aiSavingsLowInsight', lang)}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/ai-helper')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <span>{t('askAiAssistant', lang)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
            {t('whatYouCanDo', lang)}:
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-700">
            <li className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t('actionKeepReserve', lang)}</span>
            </li>
            <li className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t('actionReviewExpenses', lang)}</span>
            </li>
            <li className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t('actionPlanFarming', lang)}</span>
            </li>
            <li className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t('actionLoanPayment', lang)}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Two Column Section: Upcoming EMI / Important Expense & Financial Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upcoming EMI & Important Farm Expense */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{t('upcomingObligations', lang)}</span>
            </h3>
            <button
              onClick={() => onNavigate('/loans')}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              {t('loanManager', lang)}
            </button>
          </div>

          <div className="space-y-3">
            {/* Upcoming EMI item */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                  {t('upcomingEmiDue', lang)}
                </span>
                <h4 className="text-sm font-bold text-stone-900">
                  {t('kccLoanTitle', lang)}
                </h4>
                <p className="text-xs text-stone-500">
                  {t('dueDate', lang)}: <strong>28 Sep 2026</strong> • {t('lender', lang)}: Cooperative Society
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-rose-700">₹3,500</span>
                <span className="block text-[10px] text-stone-500">{t('quarterlyInterest', lang)}</span>
              </div>
            </div>

            {/* Upcoming Important Expense */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  {t('upcomingCriticalFarmCost', lang)}
                </span>
                <h4 className="text-sm font-bold text-stone-900">
                  {t('kharifPaddyTitle', lang)}
                </h4>
                <p className="text-xs text-stone-500">
                  {t('expectedWindow', lang)}: <strong>02 Oct 2026</strong> • Urea & Spray
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-amber-700">₹4,500</span>
                <span className="block text-[10px] text-stone-500">{t('agriculturalInput', lang)}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 flex items-center justify-between">
            <span>{t('netMonthlyCashFlow', lang)}:</span>
            <span className="font-extrabold text-emerald-700 text-sm">
              +₹{netCashFlow.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right: Financial Risk Warnings & Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
              <Bell className="w-4 h-4 text-rose-600" />
              <span>{t('financialRiskWarnings', lang)} ({alerts.length})</span>
            </h3>
            <span className="text-xs text-stone-400">{t('autoCalculated', lang)}</span>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  alert.severity === 'high'
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <AlertTriangle
                      className={`w-3.5 h-3.5 ${
                        alert.severity === 'high' ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    />
                    <span>{alert.title}</span>
                  </h4>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      alert.severity === 'high'
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {alert.severity} priority
                  </span>
                </div>

                <p className="text-stone-700 leading-normal">
                  <strong className="text-stone-900">Why it matters:</strong> {alert.whyItMatters}
                </p>

                <div className="p-2 bg-white rounded-xl border border-stone-200/80 text-stone-800">
                  <strong className="text-emerald-800">What you can do:</strong> {alert.whatYouCanDo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

