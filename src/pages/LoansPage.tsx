import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info,
  X,
  Building2,
  Users2
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { LoanEntry, LoanType } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const LoansPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [loans, setLoans] = useState<LoanEntry[]>(StorageService.getLoans());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [loanName, setLoanName] = useState('');
  const [loanType, setLoanType] = useState<LoanType>('agricultural_loan');
  const [principal, setPrincipal] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');
  const [interestRate, setInterestRate] = useState('7');
  const [emiAmount, setEmiAmount] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-01');
  const [lender, setLender] = useState('');

  useEffect(() => {
    const unsub = StorageService.subscribe(() => {
      setLoans(StorageService.getLoans());
    });
    return unsub;
  }, []);

  const totalOutstanding = loans.reduce((s, l) => s + Number(l.remainingAmount || 0), 0);
  const totalMonthlyEmi = loans.reduce((s, l) => s + Number(l.emiAmount || 0), 0);

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanName || !principal) return;

    StorageService.addLoan({
      userId: StorageService.getUser()?.id || 'guest',
      loanName,
      loanType,
      principal: Number(principal),
      remainingAmount: Number(remainingAmount || principal),
      interestRate: Number(interestRate || 7),
      emiAmount: Number(emiAmount || 2000),
      dueDate,
      lender: lender || 'Agricultural Cooperative',
    });

    setLoanName('');
    setPrincipal('');
    setRemainingAmount('');
    setEmiAmount('');
    setLender('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this loan entry?')) {
      StorageService.deleteLoan(id);
    }
  };

  const loanTypeLabels: Record<LoanType, string> = {
    agricultural_loan: 'Crop / Kisan Credit Loan',
    equipment_loan: 'Equipment / Tractor Finance',
    microfinance_shg: 'Self-Help Group (SHG) Loan',
    shg_loan: 'Community SHG Loan',
    gold_loan: 'Gold Loan',
    informal_loan: 'Local Trader / Relative Loan',
    personal_loan: 'Personal Due',
    business_loan: 'Rural Business Loan',
    vehicle_loan: 'Vehicle / Tractor Loan',
    other: 'Other Due / Loan',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Privacy Guarantee Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <strong>100% Private & Safe:</strong> RuralKarnaa never asks for your bank account numbers, IFSC codes, debit cards, or OTPs. All loan and EMI records here are strictly for your personal offline reminder tracking.
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-950 text-xs px-3 py-1 rounded-full font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t('moneyToPay', lang)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            {t('moneyToPay', lang)}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {lang === 'hi'
              ? 'फसली ऋण (KCC), ट्रैक्टर, या साहूकार की किश्त का हिसाब। समय पर भुगतान से ब्याज बचता है।'
              : 'Keep track of crop loans (KCC), tractor installments, and dues safely without any bank passwords.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'hi' ? '+ नया कर्ज़ या किश्त जोड़ें' : 'Add Loan / Due Record'}</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5">
          <span className="text-xs font-black uppercase text-rose-900">
            {t('moneyToPay', lang)} ({t('outstanding', lang)})
          </span>
          <div className="text-3xl font-black text-rose-950 mt-1">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-rose-800 font-bold">
            {loans.length} {lang === 'hi' ? 'सक्रिय खाते / किश्तें' : 'active loan records'}
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase text-amber-900">
            Monthly EMI Outflow
          </span>
          <div className="text-3xl font-extrabold text-amber-950 mt-1">
            ₹{totalMonthlyEmi.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-amber-700 font-medium">
            Due across upcoming calendar cycles
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase text-emerald-900">
            Interest Subvention Alert
          </span>
          <div className="text-xl font-bold text-emerald-950 mt-1">
            Save 3% with Prompt Repayment
          </div>
          <span className="text-xs text-emerald-700">
            KCC interest reduces from 7% to 4% if paid on time
          </span>
        </div>
      </div>

      {/* Active Loans List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">
          Active Loan Facilities & Schedules ({loans.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loans.map(loan => {
            const repaid = Math.max(0, loan.principal - loan.remainingAmount);
            const progressPct = Math.min(100, Math.round((repaid / (loan.principal || 1)) * 100));

            return (
              <div
                key={loan.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 relative"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                      {loanTypeLabels[loan.loanType] || loan.loanType}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900">{loan.loanName}</h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Lender: {loan.lender}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(loan.id)}
                    title="Delete loan"
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Balances */}
                <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500">Remaining</span>
                    <p className="text-sm font-extrabold text-stone-900">
                      ₹{loan.remainingAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500">Interest</span>
                    <p className="text-sm font-extrabold text-stone-900">{loan.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500">Monthly EMI</span>
                    <p className="text-sm font-extrabold text-rose-700">
                      ₹{loan.emiAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-stone-600">
                    <span>Repaid: ₹{repaid.toLocaleString('en-IN')} ({progressPct}%)</span>
                    <span>Total: ₹{loan.principal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Due Date Indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Next Due Date: <strong>{loan.dueDate}</strong></span>
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Standard Status
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Guidance on Loans (Section 11) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Rural Borrowing Safety & Comparison Guide</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Priority: Formal Institutional Loans (KCC & Banks)</span>
            </h4>
            <p className="text-emerald-900 leading-relaxed">
              Kisan Credit Card (KCC) loans charge 7% nominal interest, reduced to <strong>4%</strong> when repaid
              on time due to government interest subvention. Always prioritize repaying formal bank debt on time.
            </p>
          </div>

          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-2">
            <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <span>Caution: Local Moneylenders & High-Interest Apps</span>
            </h4>
            <p className="text-rose-900 leading-relaxed">
              Informal local moneylenders charge 2% to 3% per month (equal to <strong>24% to 36% per year</strong>).
              Avoid taking informal high-interest loans for crop inputs when bank KCC limits are available.
            </p>
          </div>
        </div>
      </div>

      {/* Add Loan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Add Loan / Due Record</h3>
                <p className="text-[11px] text-stone-500">For your personal schedule & reminder tracking only</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-950 font-medium flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span><strong>Privacy Notice:</strong> Never enter bank account numbers, ATM PINs, or passwords. Simply write a short name to remember your repayments.</span>
            </div>

            <form onSubmit={handleAddLoan} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Loan / Due Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sowing crop loan or Tractor finance"
                  value={loanName}
                  onChange={e => setLoanName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Loan Type *</label>
                <select
                  value={loanType}
                  onChange={e => setLoanType(e.target.value as LoanType)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                >
                  {Object.entries(loanTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Original Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="75000"
                    value={principal}
                    onChange={e => setPrincipal(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Remaining (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="60000"
                    value={remainingAmount}
                    onChange={e => setRemainingAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    placeholder="7"
                    value={interestRate}
                    onChange={e => setInterestRate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Monthly Payment / EMI (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="3500"
                    value={emiAmount}
                    onChange={e => setEmiAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Who gave this loan?</label>
                  <input
                    type="text"
                    placeholder="e.g. Village Society, Relative, SHG"
                    value={lender}
                    onChange={e => setLender(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
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
                  className="flex-1 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
