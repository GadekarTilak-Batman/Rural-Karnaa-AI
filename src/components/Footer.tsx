import React from 'react';
import { Sprout, ShieldAlert, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16 pt-12 pb-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Important Educational & Scam Awareness Callout */}
        <div className="bg-stone-800/80 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t('scamSafety', lang)}</span>
                <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded-full border border-red-800">
                  Critical Safety Rule
                </span>
              </h4>
              <p className="text-xs text-amber-200/90 mt-0.5">
                {t('scamNotice', lang)} Never share OTPs, ATM PINs, UPI PINs, or install unverified APK files from SMS.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/help')}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-xl transition shrink-0"
          >
            Read Scam Awareness Guide
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white">RuralKarnaa AI</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Empowering farmers, livestock owners, and rural families across India with financial clarity,
              seasonal cash-flow planning, and localized AI guidance.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>StartupX Hackathon Prototype</span>
            </div>
          </div>

          {/* Quick Tracking Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Financial Tracking
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition">
                  {t('dashboard', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/financial-health')} className="hover:text-white transition">
                  {t('financialHealth', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/income')} className="hover:text-white transition">
                  {t('income', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/expenses')} className="hover:text-white transition">
                  {t('expenses', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/loans')} className="hover:text-white transition">
                  {t('loans', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/savings')} className="hover:text-white transition">
                  {t('savings', lang)}
                </button>
              </li>
            </ul>
          </div>

          {/* AI & Planning Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              AI Tools & Planning
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/seasonal-income')} className="hover:text-white transition">
                  {t('seasonalIncome', lang)} (Kharif/Rabi)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/ai-helper')} className="hover:text-white transition">
                  {t('aiHelper', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/what-if')} className="hover:text-white transition">
                  {t('whatIf', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/documents')} className="hover:text-white transition">
                  {t('documents', lang)} (OCR)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/reports')} className="hover:text-white transition">
                  {t('reports', lang)} (Print & PDF)
                </button>
              </li>
            </ul>
          </div>

          {/* About & Trust */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              About & Trust
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition">
                  {t('about', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/features')} className="hover:text-white transition">
                  {t('features', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/help')} className="hover:text-white transition">
                  {t('help', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/settings')} className="hover:text-white transition">
                  {t('settings', lang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/profile')} className="hover:text-white transition">
                  {t('profile', lang)}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Educational Disclaimer */}
        <div className="pt-6 border-t border-stone-800 text-[11px] text-stone-500 space-y-2">
          <p>
            <strong className="text-stone-400">Educational Notice:</strong>{' '}
            {t('educationalDisclaimer', lang)} RuralKarnaa AI provides calculations and educational pointers based
            solely on user-entered values and does not fabricate bank transactions or promise guaranteed financial
            returns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <span>© 2026 RuralKarnaa AI • StartupX Hackathon Initiative. All rights reserved.</span>
            <span className="text-stone-400">Crafted with ❤️ for Rural India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
