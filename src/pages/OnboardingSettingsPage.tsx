import React, { useState } from 'react';
import {
  User,
  Globe,
  Sprout,
  Store,
  Briefcase,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { SUPPORTED_LANGUAGES, t } from '../locales/translations';
import { LanguageCode, UserProfile, UserType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OnboardingSettingsPageProps {
  onComplete: () => void;
}

export const OnboardingSettingsPage: React.FC<OnboardingSettingsPageProps> = ({ onComplete }) => {
  const { lang: currentLang, setLanguage } = useLanguage();
  const existingUser = StorageService.getUser();

  const [step, setStep] = useState<number>(1);
  const [lang, setLang] = useState<LanguageCode>(currentLang);
  const [name, setName] = useState(existingUser?.name || 'Ramesh Kumar');
  const [mobile, setMobile] = useState(existingUser?.mobile || '+91 98765 43210');
  const [location, setLocation] = useState(existingUser?.location || 'Mandya, Karnataka');
  const [userType, setUserType] = useState<UserType>(existingUser?.userType || 'farmer');
  const [primaryGoal, setPrimaryGoal] = useState<string>('emergency_fund');

  const userTypes: { type: UserType; title: string; desc: string; icon: any }[] = [
    { type: 'farmer', title: 'Farmer (किसान)', desc: 'Crops, paddy, wheat, sugarcane, pulses', icon: Sprout },
    { type: 'livestock_owner', title: 'Dairy & Livestock (पशुपालन)', desc: 'Milk cooperative sales, cattle, goat farming', icon: Users },
    { type: 'daily_wage_earner', title: 'Daily Wage Earner (मजदूर)', desc: 'Agricultural labor, MNREGA, construction work', icon: Briefcase },
    { type: 'small_business_owner', title: 'Rural Shopkeeper (दुकानदार)', desc: 'Kirana grocery, repair shop, rural trade', icon: Store },
    { type: 'family_head', title: 'Rural Household (परिवार)', desc: 'Family budget, children schooling, household savings', icon: Users },
  ];

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      id: existingUser?.id || 'user-' + Date.now(),
      name: name || 'Ramesh Kumar',
      mobile,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@ruralkarnaa.org`,
      preferredLanguage: lang,
      userType,
      location,
      onboardingCompleted: true,
      createdAt: existingUser?.createdAt || new Date().toISOString(),
    };

    StorageService.setUser(updatedUser);
    setLanguage(lang);
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Onboarding / Profile Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900">
            Welcome to RuralKarnaa
          </h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Step {step} of 2: Simple setup for your personal income & expense tracker
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'w-16 bg-emerald-700' : 'w-6 bg-stone-200'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'w-16 bg-emerald-700' : 'w-6 bg-stone-200'}`} />
        </div>

        {/* Reassurance Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-xs text-emerald-900 font-medium leading-relaxed">
            <strong>100% Private:</strong> We never ask for bank account numbers, ATM cards, or OTPs. All data stays under your control.
          </p>
        </div>

        {/* STEP 1: Language & Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                1. Select Language (भाषा चुनें):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUPPORTED_LANGUAGES.map(item => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLang(item.code)}
                    className={`p-3 rounded-xl border text-xs font-bold transition text-left flex items-center justify-between ${
                      lang === item.code
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span>{item.nativeName}</span>
                    <span className="text-[10px] text-stone-400 font-normal">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Your Name (आपका नाम)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Mobile (Optional)</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Village / Town (गांव / शहर)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Mandya, Karnataka"
                    className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Occupation & Priority Goal */}
        {step === 2 && (
          <form onSubmit={handleFinish} className="space-y-6 animate-in fade-in">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                2. What is your primary work? (आप क्या काम करते हैं?):
              </label>
              <div className="space-y-2">
                {userTypes.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setUserType(item.type)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                        userType === item.type
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${userType === item.type ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{item.title}</h4>
                        <p className="text-xs text-stone-500">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                What would you like to track?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'emergency_fund', label: '💵 Daily Income & Expense' },
                  { id: 'harvest_plan', label: '🌾 Sowing & Harvest Cash' },
                  { id: 'pay_kcc', label: '📅 Due Dates & Reminders' },
                  { id: 'education', label: '🐖 Family Savings Buffer' },
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setPrimaryGoal(g.id)}
                    className={`p-3 rounded-xl border text-left font-semibold transition flex items-center justify-between ${
                      primaryGoal === g.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{g.label}</span>
                    {primaryGoal === g.id && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 border border-stone-300 rounded-xl text-stone-700 text-xs font-bold hover:bg-stone-100"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Start Using App</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
