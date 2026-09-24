import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Mic,
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  Menu,
  X,
  User,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Calendar,
  Sparkles,
  Calculator,
  FileText,
  BarChart3,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { SUPPORTED_LANGUAGES } from '../locales/translations';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenVoice,
}) => {
  const { lang, setLanguage, t } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(StorageService.isOnline());
  const [syncQueueCount, setSyncQueueCount] = useState<number>(StorageService.getSyncQueue().length);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState<boolean>(false);
  const [user, setUser] = useState(StorageService.getUser());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = StorageService.subscribe(() => {
      setSyncQueueCount(StorageService.getSyncQueue().length);
      setUser(StorageService.getUser());
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    await StorageService.processSyncQueue();
    setIsSyncing(false);
  };

  const primaryNavLinks = [
    { route: '/dashboard', label: t('dashboard', lang), icon: TrendingUp },
    { route: '/income', label: t('income', lang), icon: TrendingUp },
    { route: '/expenses', label: t('expenses', lang), icon: CreditCard },
    { route: '/loans', label: t('loans', lang), icon: CreditCard },
    { route: '/savings', label: t('savings', lang), icon: PiggyBank },
  ];

  const secondaryNavLinks = [
    { route: '/ai-helper', label: t('aiHelper', lang), icon: Sparkles, desc: 'Ask voice & money questions' },
    { route: '/financial-health', label: t('financialHealth', lang), icon: ShieldCheck, desc: 'Score & health breakdown' },
    { route: '/seasonal-income', label: t('seasonalIncome', lang), icon: Calendar, desc: 'Sowing & harvest cash calendar' },
    { route: '/what-if', label: t('whatIf', lang), icon: Calculator, desc: 'Estimate future decisions' },
    { route: '/documents', label: t('documents', lang), icon: FileText, desc: 'Receipts & bill notes' },
    { route: '/reports', label: t('reports', lang), icon: BarChart3, desc: 'Download printable summary' },
    { route: '/help', label: t('scamSafety', lang), icon: HelpCircle, desc: 'Protect yourself from fraud' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Top Reassurance & Connectivity Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          {isOnline ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] sm:text-xs">
              <Wifi className="w-3.5 h-3.5" />
              <span>{t('online', lang)}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold animate-pulse text-[11px] sm:text-xs">
              <WifiOff className="w-3.5 h-3.5" />
              <span>{t('offline', lang)}</span>
            </span>
          )}

          {syncQueueCount > 0 && (
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-2 py-0.5 rounded text-[11px] transition"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              {syncQueueCount} • {t('syncNow', lang)}
            </button>
          )}

          <span className="hidden sm:inline text-stone-500">•</span>
          {/* Reassurance Badge: No Bank Details Needed */}
          <span className="inline-flex items-center gap-1 text-emerald-400/90 text-[11px] sm:text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t('noBankDetailsNeeded', lang)}</span>
          </span>
        </div>

        {/* Quick Demo Profile Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
            className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-2.5 py-0.5 rounded-lg text-xs font-medium border border-stone-700 transition"
          >
            <span className="truncate max-w-[150px] sm:max-w-none">{user?.name || 'Ramesh Kumar'}</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {isDemoDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white text-stone-800 rounded-xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 py-1">
                Sample Profiles
              </div>
              <button
                onClick={() => {
                  StorageService.loadDemoProfile('farmer');
                  setIsDemoDropdownOpen(false);
                  onNavigate('/dashboard');
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 text-xs font-semibold flex items-center justify-between text-stone-800 transition"
              >
                <span>🌾 Farmer Ramesh</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Rice & Dairy</span>
              </button>
              <button
                onClick={() => {
                  StorageService.loadDemoProfile('shop');
                  setIsDemoDropdownOpen(false);
                  onNavigate('/dashboard');
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 text-xs font-semibold flex items-center justify-between text-stone-800 transition"
              >
                <span>🏪 Shopkeeper Lakshmi</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Kirana Store</span>
              </button>
              <button
                onClick={() => {
                  StorageService.loadDemoProfile('artisan');
                  setIsDemoDropdownOpen(false);
                  onNavigate('/dashboard');
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-amber-50 text-xs font-semibold flex items-center justify-between text-stone-800 transition"
              >
                <span>🔨 Artisan Kishore</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Weaving & SHG</span>
              </button>
              <div className="border-t border-stone-100 my-1"></div>
              <button
                onClick={() => {
                  setIsDemoDropdownOpen(false);
                  onNavigate('/login');
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 text-xs text-emerald-900 font-bold flex items-center gap-2 transition"
              >
                <span>🚪</span>
                <span>{t('switchUserBtn', lang)}</span>
              </button>
              <button
                onClick={() => {
                  StorageService.resetToBlank();
                  setIsDemoDropdownOpen(false);
                  onNavigate('/login');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-100 text-xs text-stone-600 font-medium transition"
              >
                Clear to Empty Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition">
              <Sprout className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900">
                  RuralKarnaa
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                  AI
                </span>
              </div>
              <p className="text-[10px] font-medium text-stone-500 hidden sm:block">
                {t('tagline', lang)}
              </p>
            </div>
          </div>

          {/* Clean Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {primaryNavLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-100/70 text-emerald-900'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* AI Assistant Direct Shortcut */}
            <button
              onClick={() => onNavigate('/ai-helper')}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
                currentRoute === '/ai-helper'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t('aiHelper', lang)}</span>
            </button>

            {/* More Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`px-2.5 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 ${
                  isMoreMenuOpen ? 'bg-stone-100 text-stone-900' : ''
                }`}
              >
                <span>{t('moreTools', lang)}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1.5">
                    {t('moreTools', lang)}
                  </div>
                  {secondaryNavLinks.map(tool => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.route}
                        onClick={() => {
                          onNavigate(tool.route);
                          setIsMoreMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 ${
                          currentRoute === tool.route
                            ? 'bg-emerald-50 text-emerald-950 font-bold'
                            : 'hover:bg-stone-50 text-stone-800'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-stone-100 text-emerald-800 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">{tool.label}</div>
                          <div className="text-[11px] text-stone-500 leading-tight mt-0.5">{tool.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls: Voice Button + Language Selector + Settings */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Big Voice Button */}
            <button
              onClick={onOpenVoice}
              title="Speak to add or ask (बोलें)"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold px-3 py-2 rounded-xl shadow-xs transition active:scale-95"
            >
              <Mic className="w-4 h-4 text-stone-950" />
              <span className="text-xs">{t('voiceInputBtn', lang)}</span>
            </button>

            {/* Language Selector */}
            <div className="relative inline-flex items-center">
              <Globe className="w-3.5 h-3.5 text-emerald-700 absolute left-2.5 pointer-events-none" />
              <select
                aria-label="Select Language"
                value={lang}
                onChange={e => handleLanguageChange(e.target.value as LanguageCode)}
                className="pl-7 pr-4 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-950 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              >
                {SUPPORTED_LANGUAGES.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Settings Profile Button */}
            <button
              onClick={() => onNavigate('/settings')}
              title="Profile & Settings"
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Quick Switch / Login Dashboard Button */}
            <button
              onClick={() => onNavigate('/login')}
              title="Login Dashboard / Switch Profile"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-950 border border-stone-200 hover:border-emerald-300 transition cursor-pointer"
            >
              <span>👤</span>
              <span>{t('login', lang)} / {t('switchUserBtn', lang).split('/')[0].trim()}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-5 space-y-3 animate-in slide-in-from-top-3">
          {/* Mobile Language Switcher */}
          <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Language / भाषा चुनें:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {SUPPORTED_LANGUAGES.map(item => (
                <button
                  key={item.code}
                  onClick={() => {
                    handleLanguageChange(item.code);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition text-center ${
                    lang === item.code
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.nativeName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {primaryNavLinks.map(link => {
              const Icon = link.icon;
              return (
                <button
                  key={link.route}
                  onClick={() => {
                    onNavigate(link.route);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition text-left ${
                    currentRoute === link.route
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-50 text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-100 space-y-1">
            <div className="text-[10px] font-bold uppercase text-stone-400 px-1">
              {t('moreTools', lang)}
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => {
                  onNavigate('/ai-helper');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-2.5 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-bold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('aiHelper', lang)}</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('/financial-health');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-2.5 py-2 rounded-lg bg-stone-50 text-stone-700 font-medium hover:bg-stone-100"
              >
                {t('financialHealth', lang)}
              </button>
              <button
                onClick={() => {
                  onNavigate('/seasonal-income');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-2.5 py-2 rounded-lg bg-stone-50 text-stone-700 font-medium hover:bg-stone-100"
              >
                {t('seasonalIncome', lang)}
              </button>
              <button
                onClick={() => {
                  onNavigate('/help');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-2.5 py-2 rounded-lg bg-stone-50 text-stone-700 font-medium hover:bg-stone-100"
              >
                {t('scamSafety', lang)}
              </button>
              <button
                onClick={() => {
                  onNavigate('/reports');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-2.5 py-2 rounded-lg bg-stone-50 text-stone-700 font-medium hover:bg-stone-100"
              >
                {t('reports', lang)}
              </button>
              <button
                onClick={() => {
                  onNavigate('/settings');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-2.5 py-2 rounded-lg bg-stone-50 text-stone-700 font-medium hover:bg-stone-100"
              >
                {t('settings', lang)}
              </button>
            </div>

            <button
              onClick={() => {
                onNavigate('/login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-black text-xs flex items-center justify-center gap-2 transition"
            >
              <span>👤</span>
              <span>{t('switchUserBtn', lang)} / {t('loginDashboardTitle', lang)}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
