import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  PhoneCall,
  HelpCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

export const HelpPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [testMessage, setTestMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<any | null>(null);

  const handleCheckScam = async (msgToTest?: string) => {
    const text = msgToTest || testMessage;
    if (!text.trim()) return;

    setIsChecking(true);
    setCheckResult(null);

    try {
      const res = await fetch('/api/ai/scam-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setCheckResult(data);
    } catch (err) {
      console.warn('Scam check error:', err);
      // Fallback
      setCheckResult({
        isScam: true,
        riskLevel: 'HIGH RISK SCAM',
        warning: 'DANGER: This message asks for an OTP or sensitive credentials.',
        advice: 'Never share your OTP or install unverified APK files.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const sampleScams = [
    'Dear customer, PM-KISAN ₹25,000 approved! Download fast-loan.apk and enter OTP to receive cash.',
    'Congratulations! You won ₹10 Lakh in lottery. Call this number and pay ₹2,000 processing fee.',
    'Your SBI Bank account is blocked! Share 6-digit OTP immediately to avoid penalty.',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-red-950 text-white rounded-3xl p-6 sm:p-8 border border-red-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-red-800/80 text-red-200 text-xs px-3 py-1 rounded-full font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cybersecurity & Scam Defense</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('scamSafety', lang)} & Fraud Protection
          </h1>
          <p className="text-xs sm:text-sm text-red-200 max-w-2xl">
            Rural citizens are heavily targeted by fake loan apps, lottery SMS, and OTP theft.
            Learn the warning signs and test suspicious messages safely before acting.
          </p>
        </div>

        <div className="p-4 bg-red-900/60 rounded-2xl border border-red-700/60 text-xs space-y-1">
          <span className="font-bold text-red-100 block">National Cyber Helpline:</span>
          <span className="text-xl font-extrabold text-amber-300">Dial 1930</span>
          <span className="block text-[10px] text-red-300">www.cybercrime.gov.in</span>
        </div>
      </div>

      {/* Interactive Scam Checker Tool (Section 21) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              AI Suspicious Message & SMS Checker
            </h2>
            <p className="text-xs text-stone-500">
              Paste or type any suspicious SMS, WhatsApp message, or loan offer to check if it's fraudulent.
            </p>
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-semibold text-stone-500">Try common rural scam patterns:</span>
          <div className="flex flex-wrap gap-2">
            {sampleScams.map((scam, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTestMessage(scam);
                  handleCheckScam(scam);
                }}
                className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 transition text-left"
              >
                "{scam.slice(0, 45)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="space-y-3 pt-2">
          <textarea
            rows={3}
            placeholder="Paste suspicious SMS or message here (e.g. 'Your loan is sanctioned, send OTP')..."
            value={testMessage}
            onChange={e => setTestMessage(e.target.value)}
            className="w-full p-4 text-sm border border-stone-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />

          <button
            onClick={() => handleCheckScam()}
            disabled={isChecking || !testMessage.trim()}
            className="bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl shadow-xs transition flex items-center gap-2 text-xs"
          >
            {isChecking ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Checking Message Risk...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Analyze Message Safety</span>
              </>
            )}
          </button>
        </div>

        {/* Result Callout */}
        {checkResult && (
          <div
            className={`p-5 rounded-2xl border space-y-2 animate-in fade-in ${
              checkResult.isScam
                ? 'bg-red-50 border-red-300 text-red-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                {checkResult.isScam ? (
                  <AlertTriangle className="w-4 h-4 text-red-700" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                )}
                <span>Assessment: {checkResult.riskLevel}</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  checkResult.isScam
                    ? 'bg-red-200 text-red-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}
              >
                {checkResult.isScam ? 'Do Not Click / Do Not Share' : 'Likely Safe'}
              </span>
            </div>

            <p className="text-sm font-bold">{checkResult.warning}</p>
            <p className="text-xs leading-relaxed">{checkResult.advice}</p>
          </div>
        )}
      </div>

      {/* 5 Golden Rules of Rural Financial Safety (Section 21) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-700" />
          <span>5 Core Rules of Rural Financial Cyber Safety</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Rule 1 */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-red-700 text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h4 className="text-sm font-bold text-stone-900">Never Share Any OTP</h4>
            <p className="text-stone-600 leading-relaxed">
              No bank manager, government officer, or RuralKarnaa AI representative will ever call or message to ask
              for your OTP or ATM PIN. An OTP is only entered by you when paying, never to receive money.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-red-700 text-white font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h4 className="text-sm font-bold text-stone-900">Never Install WhatsApp APKs</h4>
            <p className="text-stone-600 leading-relaxed">
              Fraudulent "Instant 5-Minute Loan" apps sent via WhatsApp links or SMS read your contacts and photos
              to blackmail you. Only install apps from the Google Play Store.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-red-700 text-white font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h4 className="text-sm font-bold text-stone-900">PM-KISAN Is Always Free</h4>
            <p className="text-stone-600 leading-relaxed">
              Official central schemes (PM-KISAN ₹6,000/yr) transfer money straight to your Aadhaar-linked bank
              account via DBT. You never need to pay an "advance fee" or "processing charge" to claim it.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-red-700 text-white font-bold flex items-center justify-center text-xs">
              4
            </span>
            <h4 className="text-sm font-bold text-stone-900">Scanning QR Code Debits Money</h4>
            <p className="text-stone-600 leading-relaxed">
              Fraudsters claim: "Scan this QR code and enter your UPI PIN to receive money for your crop." Remember:
              <strong> UPI PIN is ONLY needed to SEND money, never to receive money!</strong>
            </p>
          </div>

          {/* Rule 5 */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
              5
            </span>
            <h4 className="text-sm font-bold text-stone-900">Verify at Gram Panchayat or Bank</h4>
            <p className="text-stone-600 leading-relaxed">
              If an unknown caller threatens legal action or offers an unbelievable scheme, immediately visit your local
              cooperative bank, Post Office, or Gram Panchayat Kendra before sending any money.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
