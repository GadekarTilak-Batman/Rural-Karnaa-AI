import React, { useState } from 'react';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  User,
  Phone,
  Briefcase,
  ArrowRight,
  Sprout,
  Store,
  Hammer,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';
import { speakText, stopSpeaking } from '../utils/speechHelper';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { lang, setLanguage, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMobile, setCustomMobile] = useState('');
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'shop_owner' | 'artisan'>('farmer');
  const [tab, setTab] = useState<'quick' | 'custom'>('quick');

  const currentUser = StorageService.getUser();
  const alreadyLoggedIn = StorageService.isLoggedIn();

  const handleLanguageChange = (newLang: LanguageCode) => {
    stopSpeaking();
    setIsSpeaking(false);
    setLanguage(newLang);
    StorageService.setLanguage(newLang);
  };

  const handleSpeakWelcome = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    let message = '';
    if (lang === 'hi') {
      message = 'रूरलकरणा में आपका स्वागत है। यह आपका अपना सरल ग्रामीण बहीखाता है। किसी बैंक खाते या पासवर्ड की ज़रूरत नहीं है। अपनी भाषा चुनें और नीचे दिए गए विकल्पों में से अपना खाता चुनें या अपना नाम लिखकर शुरू करें।';
    } else if (lang === 'mr') {
      message = 'रूरलकरणा मध्ये आपले स्वागत आहे! हे आपले स्वतःचे गावचे सोपे जमा-खर्च खाते आहे. बँक तपशील किंवा पासवर्डची गरज नाही. खालील पर्यायांमधून आपले खाते निवडा किंवा नाव लिहून सुरुवात करा.';
    } else if (lang === 'te') {
      message = 'రూరల్కర్ణాకు స్వాగతం! ఇది మీ స్వంత సులభమైన గ్రామీణ లెక్కల పుస్తకం. బ్యాంక్ వివరాలు లేదా పాస్‌వర్డ్ అవసరం లేదు. మీ ఖాతాను ఎంచుకోండి.';
    } else if (lang === 'ta') {
      message = 'ரூரல்கர்ணாவிற்கு நல்வரவு! இது உங்கள் எளிய கிராமத்து கணக்கு புத்தகம். வங்கி விவரங்கள் தேவையில்லை. உங்கள் கணக்கைத் தேர்ந்தெடுத்து தொடங்கவும்.';
    } else if (lang === 'kn') {
      message = 'ರೂರಲ್ಕರ್ಣಾಗೆ ಸುಸ್ವಾಗತ! ಇದು ನಿಮ್ಮದೇ ಸರಳ ಗ್ರಾಮೀಣ ಲೆಕ್ಕದ ಪುಸ್ತಕ. ಬ್ಯಾಂಕ್ ವಿವರಗಳ ಅಗತ್ಯವಿಲ್ಲ. ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.';
    } else {
      message = 'Welcome to RuralKarnaa! This is your simple, private village money ledger. No bank account, PIN, or password required. Choose a profile or enter your name to start.';
    }

    speakText(message, lang, () => setIsSpeaking(false));
  };

  const handleQuickLogin = (type: 'farmer' | 'shop' | 'artisan') => {
    stopSpeaking();
    StorageService.loadDemoProfile(type);
    onLoginSuccess();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stopSpeaking();
    const finalName = customName.trim() || (selectedRole === 'farmer' ? 'किसान साथी' : 'दुकानदार साथी');
    StorageService.createCustomUser(finalName, selectedRole, customMobile.trim());
    onLoginSuccess();
  };

  const languageOptions: { code: LanguageCode; label: string; native: string; flag: string }[] = [
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ];

  return (
    <div className="min-h-screen bg-stone-100/70 py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Top Language Bar - High Visibility for Rural Users */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-emerald-300 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌐</span>
              <span className="text-xs sm:text-sm font-black text-stone-800 uppercase tracking-wide">
                {t('chooseLanguageFirst', lang)}
              </span>
            </div>
            
            <button
              type="button"
              onClick={handleSpeakWelcome}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition ${
                isSpeaking
                  ? 'bg-amber-400 text-stone-950 animate-pulse ring-2 ring-amber-400'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-900" />
                  <span>{t('stopAudio', lang)}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-800" />
                  <span>{t('listenAudio', lang)}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {languageOptions.map(opt => {
              const isSelected = lang === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleLanguageChange(opt.code)}
                  className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition border-2 text-center cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm scale-[1.02]'
                      : 'bg-stone-50 hover:bg-emerald-50/60 text-stone-800 border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-base">{opt.flag}</span>
                  <span className="font-extrabold text-xs mt-0.5">{opt.native}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Card: Welcome & Selection */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-700/70 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
              <Sprout className="w-3.5 h-3.5" />
              <span>{t('appName', lang)}</span>
              <span>•</span>
              <span>{t('simpleVillageLedger', lang).split('•')[0]}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {t('loginDashboardTitle', lang)}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto font-medium">
              {t('loginDashboardSub', lang)}
            </p>

            {/* If currently logged in, give 1-click continue */}
            {alreadyLoggedIn && currentUser && (
              <div className="pt-2">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-2 rounded-2xl text-xs">
                  <span className="text-emerald-200">
                    {lang === 'hi' ? 'सक्रिय खाता:' : 'Currently Active:'} <strong className="text-white">{currentUser.name}</strong>
                  </span>
                  <button
                    onClick={onLoginSuccess}
                    className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-3 py-1 rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <span>{lang === 'hi' ? 'सीधे अंदर जाएं' : 'Continue to Ledger'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mode Switcher Tabs (One-Tap vs Custom Name) */}
          <div className="border-b border-stone-200 bg-stone-50 p-2 flex gap-2">
            <button
              onClick={() => setTab('quick')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                tab === 'quick'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>⚡</span>
              <span>{t('quickOneTapLogin', lang)}</span>
            </button>
            <button
              onClick={() => setTab('custom')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                tab === 'custom'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>✍️</span>
              <span>{t('customLoginTitle', lang)}</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {tab === 'quick' ? (
              /* Option 1: One-Tap Profiles */
              <div className="space-y-4">
                <div className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    {lang === 'hi'
                      ? 'अपना व्यवसाय चुनें और तुरंत बहीखाता में प्रवेश करें:'
                      : 'Choose a role to enter with ready sample accounts:'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Profile 1: Farmer Ramesh */}
                  <div
                    onClick={() => handleQuickLogin('farmer')}
                    className="p-5 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border-2 border-emerald-300 hover:border-emerald-600 transition cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-200/80 text-emerald-900 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                        🌾
                      </div>
                      <h3 className="text-base font-black text-emerald-950">
                        {lang === 'hi' ? 'रमेश कुमार (किसान)' : 'Ramesh Kumar (Farmer)'}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        {t('farmerProfileDesc', lang)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1 text-[11px] font-bold">
                        <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                          🌾 धान व सब्जियां
                        </span>
                        <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                          🥛 दूध समिति
                        </span>
                        <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                          📋 KCC ऋण
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full bg-emerald-700 group-hover:bg-emerald-800 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <span>{lang === 'hi' ? 'रमेश के रूप में प्रवेश करें' : 'Login as Farmer'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Profile 2: Shopkeeper Lakshmi */}
                  <div
                    onClick={() => handleQuickLogin('shop')}
                    className="p-5 rounded-2xl bg-blue-50/40 hover:bg-blue-50 border-2 border-blue-300 hover:border-blue-600 transition cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-200/80 text-blue-900 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                        🏪
                      </div>
                      <h3 className="text-base font-black text-blue-950">
                        {lang === 'hi' ? 'लक्ष्मी देवी (किराना दुकान)' : 'Lakshmi Devi (Kirana Store)'}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        {t('shopProfileDesc', lang)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1 text-[11px] font-bold">
                        <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md">
                          🛒 किराना सामान
                        </span>
                        <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md">
                          💵 दैनिक नकद
                        </span>
                        <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md">
                          🏦 मुद्रा ऋण
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full bg-blue-700 group-hover:bg-blue-800 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <span>{lang === 'hi' ? 'लक्ष्मी के रूप में प्रवेश करें' : 'Login as Shopkeeper'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Profile 3: Artisan Kishore */}
                  <div
                    onClick={() => handleQuickLogin('artisan')}
                    className="p-5 rounded-2xl bg-amber-50/40 hover:bg-amber-50 border-2 border-amber-300 hover:border-amber-600 transition cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                        🔨
                      </div>
                      <h3 className="text-base font-black text-amber-950">
                        {lang === 'hi' ? 'किशोर कुमार (कारीगर / मजदूर)' : 'Kishore Kumar (Artisan)'}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        {t('artisanProfileDesc', lang)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1 text-[11px] font-bold">
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                          🧵 हथकरघा / कारीगरी
                        </span>
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                          🐐 बकरी पालन
                        </span>
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                          🤝 SHG समूह
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full bg-amber-600 group-hover:bg-amber-700 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <span>{lang === 'hi' ? 'किशोर के रूप में प्रवेश करें' : 'Login as Artisan'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Option 2: Custom Simple Entry */
              <form onSubmit={handleCustomSubmit} className="space-y-5 max-w-xl mx-auto">
                <div>
                  <label className="block text-xs font-black text-stone-800 uppercase tracking-wide mb-1.5">
                    {lang === 'hi' ? 'आपका नाम (Your Name) *' : 'Your Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3.5 top-3 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      placeholder={lang === 'hi' ? 'उदा. रामेश्वर सिंह, कमला बाई' : 'e.g. Ramesh Kumar, Sunita Devi'}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-sm font-bold text-stone-900 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-800 uppercase tracking-wide mb-1.5">
                    {lang === 'hi' ? 'मोबाइल नंबर (वैकल्पिक / Optional)' : 'Mobile Number (Optional)'}
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3.5 top-3 text-stone-400" />
                    <input
                      type="tel"
                      value={customMobile}
                      onChange={e => setCustomMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-sm font-bold text-stone-900 outline-none transition"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {lang === 'hi'
                      ? 'सिर्फ खाते की पहचान के लिए। कोई OTP या कॉल नहीं आएगा।'
                      : 'Only used locally on this phone for reference. No OTP required.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-800 uppercase tracking-wide mb-2">
                    {lang === 'hi' ? 'मुख्य काम चुनें (Your Work)' : 'Select Your Main Occupation'}
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('farmer')}
                      className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                        selectedRole === 'farmer'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black'
                          : 'border-stone-200 bg-stone-50 text-stone-700 font-semibold'
                      }`}
                    >
                      <span className="text-2xl block mb-1">🌾</span>
                      <span className="text-xs block">{lang === 'hi' ? 'किसान (Farmer)' : 'Farmer'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('shop_owner')}
                      className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                        selectedRole === 'shop_owner'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black'
                          : 'border-stone-200 bg-stone-50 text-stone-700 font-semibold'
                      }`}
                    >
                      <span className="text-2xl block mb-1">🏪</span>
                      <span className="text-xs block">{lang === 'hi' ? 'दुकानदार (Shop)' : 'Shop Owner'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('artisan')}
                      className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                        selectedRole === 'artisan'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black'
                          : 'border-stone-200 bg-stone-50 text-stone-700 font-semibold'
                      }`}
                    >
                      <span className="text-2xl block mb-1">🔨</span>
                      <span className="text-xs block">{lang === 'hi' ? 'कारीगर / मजदूर' : 'Artisan / Wage'}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <span>{t('loginEnterBtn', lang)}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* Rural Trust Guarantee Reassurance Box */}
            <div className="mt-8 bg-amber-50/70 border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 text-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-950">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  {t('safeGuaranteeTitle', lang)}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold pt-1">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                  <span className="text-base shrink-0">❌</span>
                  <span className="text-stone-700">{t('safePoint1', lang)}</span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                  <span className="text-base shrink-0">❌</span>
                  <span className="text-stone-700">{t('safePoint2', lang)}</span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                  <span className="text-base shrink-0">✅</span>
                  <span className="text-emerald-900 font-bold">{t('safePoint3', lang)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
