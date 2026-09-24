import {
  IncomeTransaction,
  ExpenseTransaction,
  LoanItem,
  SavingsGoal,
  FinancialHealthScoreBreakdown,
  FinancialAlert
} from '../types';

export function calculateFinancialHealthScore(
  incomes: IncomeTransaction[],
  expenses: ExpenseTransaction[],
  loans: LoanItem[],
  savingsGoals: SavingsGoal[]
): FinancialHealthScoreBreakdown {
  // Aggregate 30-day / recent figures
  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalCurrentSavings = savingsGoals.reduce((sum, g) => sum + Number(g.currentAmount || 0), 0);
  const totalLoansOutstanding = loans.reduce((sum, l) => sum + Number(l.remainingAmount || 0), 0);
  const monthlyEmiTotal = loans.reduce((sum, l) => sum + Number(l.emiAmount || 0), 0);

  // Baseline monthly assumption: if data is sparse, establish realistic scale
  const monthlyIncomeBaseline = totalIncome > 0 ? totalIncome : 35000;
  const monthlyExpenseBaseline = totalExpense > 0 ? totalExpense : 21500;

  // 1. Expense Management: (Income - Expenses) / Income ratio (Target: expenses <= 65% of income)
  const expenseRatio = monthlyExpenseBaseline > 0 ? monthlyExpenseBaseline / monthlyIncomeBaseline : 0.8;
  let expenseManagement = 75;
  if (expenseRatio <= 0.5) expenseManagement = 92;
  else if (expenseRatio <= 0.65) expenseManagement = 80;
  else if (expenseRatio <= 0.8) expenseManagement = 68;
  else if (expenseRatio <= 1.0) expenseManagement = 50;
  else expenseManagement = 30; // spending more than earning

  // 2. Savings Ratio: Total savings relative to monthly expense
  // Standard benchmark: 3-6 months is 100%, 1 month is ~55%, 0 months is ~25%
  const monthsOfRunway = monthlyExpenseBaseline > 0 ? totalCurrentSavings / monthlyExpenseBaseline : 0.2;
  let savingsRatio = 55;
  if (monthsOfRunway >= 3) savingsRatio = 90;
  else if (monthsOfRunway >= 1.5) savingsRatio = 75;
  else if (monthsOfRunway >= 0.75) savingsRatio = 60;
  else if (monthsOfRunway >= 0.3) savingsRatio = 50;
  else savingsRatio = 35;

  // 3. Debt / Loan Burden (Debt-to-income / EMI ratio)
  // Safe EMI ratio: EMI < 30% of income
  const emiRatio = monthlyIncomeBaseline > 0 ? monthlyEmiTotal / monthlyIncomeBaseline : 0.25;
  let loanBurden = 65;
  if (monthlyEmiTotal === 0 && totalLoansOutstanding === 0) loanBurden = 95;
  else if (emiRatio <= 0.2) loanBurden = 85;
  else if (emiRatio <= 0.35) loanBurden = 70;
  else if (emiRatio <= 0.5) loanBurden = 52;
  else loanBurden = 32;

  // 4. Income Stability: count of income sources & frequency
  const uniqueCategories = new Set(incomes.map(i => i.category)).size;
  let incomeStability = 70;
  if (uniqueCategories >= 3) incomeStability = 85;
  else if (uniqueCategories === 2) incomeStability = 75;
  else if (uniqueCategories === 1) incomeStability = 65;
  else incomeStability = 60;

  // 5. Emergency Preparedness: specific emergency fund goal progress
  const emergencyGoal = savingsGoals.find(g => g.category === 'emergency_fund') || savingsGoals[0];
  let emergencyReadiness = 60;
  if (emergencyGoal && emergencyGoal.targetAmount > 0) {
    const progress = emergencyGoal.currentAmount / emergencyGoal.targetAmount;
    emergencyReadiness = Math.min(95, Math.round(progress * 100));
  } else if (totalCurrentSavings >= 15000) {
    emergencyReadiness = 70;
  } else {
    emergencyReadiness = 45;
  }

  // 6. Cash Flow Balance (Net Positive margin)
  const netCashFlow = monthlyIncomeBaseline - (monthlyExpenseBaseline + monthlyEmiTotal);
  let cashFlowBalance = 70;
  if (netCashFlow > 10000) cashFlowBalance = 88;
  else if (netCashFlow > 4000) cashFlowBalance = 78;
  else if (netCashFlow >= 0) cashFlowBalance = 65;
  else cashFlowBalance = 40;

  // Weighted Overall Score (100 Max)
  // Weights: Expense (25%), Savings (20%), Debt (20%), Stability (15%), Emergency (10%), Cashflow (10%)
  const rawScore = Math.round(
    expenseManagement * 0.25 +
    savingsRatio * 0.20 +
    loanBurden * 0.20 +
    incomeStability * 0.15 +
    emergencyReadiness * 0.10 +
    cashFlowBalance * 0.10
  );

  const overallScore = Math.max(10, Math.min(98, rawScore));

  let status: FinancialHealthScoreBreakdown['status'] = 'Needs Attention';
  if (overallScore >= 80) status = 'Excellent';
  else if (overallScore >= 70) status = 'Good';
  else if (overallScore >= 55) status = 'Needs Attention';
  else if (overallScore >= 40) status = 'Moderate';
  else status = 'Needs Immediate Attention';

  const observations: string[] = [];
  const actionSteps: string[] = [];

  if (savingsRatio <= 60) {
    observations.push('Your savings cover less than 1 month of regular family & farming expenses.');
    actionSteps.push('Keep an emergency reserve aside: set aside ₹500 - ₹1,000 every week before discretionary spend.');
  }

  if (emiRatio > 0.3) {
    observations.push(`Loan EMIs take about ${(emiRatio * 100).toFixed(0)}% of your monthly earnings.`);
    actionSteps.push('Prioritize on-time EMI repayments to protect your agricultural credit standing.');
  }

  if (expenseRatio > 0.7) {
    observations.push('Recent spending is close to or higher than total income.');
    actionSteps.push('Review non-essential household expenses until the next harvest cycle.');
  }

  if (actionSteps.length === 0) {
    observations.push('Healthy balance between income, spending, and debt obligations.');
    actionSteps.push('Continue building your emergency reserve up to 3 months of farming & family needs.');
  }

  actionSteps.push('Plan upcoming farming inputs (fertilizer, seeds) well in advance of harvest.');

  return {
    overallScore,
    status,
    incomeStability,
    expenseManagement,
    savingsRatio,
    loanBurden,
    emergencyReadiness,
    cashFlowBalance,
    observations,
    actionSteps
  };
}

export function generateFinancialAlerts(
  incomes: IncomeTransaction[],
  expenses: ExpenseTransaction[],
  loans: LoanItem[],
  savingsGoals: SavingsGoal[]
): FinancialAlert[] {
  const alerts: FinancialAlert[] = [];
  const totalSavings = savingsGoals.reduce((sum, g) => sum + Number(g.currentAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  // 1. Low Savings
  if (totalSavings < 10000) {
    alerts.push({
      id: 'alert-low-savings',
      type: 'LOW_SAVINGS',
      severity: 'high',
      title: 'Low Emergency Savings',
      problem: 'Your current savings are limited compared with your recent essential expenses.',
      whyItMatters: 'If sudden tractor repair or medical need happens, you may have to borrow at high private interest.',
      whatYouCanDo: 'Review non-urgent expenses and deposit a small weekly cushion into your emergency fund.'
    });
  }

  // 2. High Expenses
  if (totalExpenses > totalIncome && totalIncome > 0) {
    alerts.push({
      id: 'alert-high-expenses',
      type: 'HIGH_EXPENSES',
      severity: 'high',
      title: 'Expenses Exceeding Income',
      problem: 'Your recorded expenses for this period are higher than your recorded income.',
      whyItMatters: 'Spending more than cash incoming will quickly deplete your reserves and create debt stress.',
      whatYouCanDo: 'Check your largest expense categories and postpone non-critical purchases until harvest.'
    });
  }

  // 3. Upcoming EMI
  if (loans.length > 0) {
    const upcoming = loans[0];
    alerts.push({
      id: 'alert-upcoming-emi',
      type: 'UPCOMING_EMI',
      severity: 'medium',
      title: `Upcoming EMI: ${upcoming.loanName} (₹${upcoming.emiAmount.toLocaleString('en-IN')})`,
      problem: `Your monthly installment of ₹${upcoming.emiAmount.toLocaleString('en-IN')} is scheduled soon.`,
      whyItMatters: 'Missing an installment adds penal interest and damages your Kisan credit score.',
      whatYouCanDo: 'Keep this amount reserved in your bank account at least 3 days before the due date.'
    });
  }

  // 4. Seasonal cash-flow risk
  alerts.push({
    id: 'alert-seasonal-risk',
    type: 'SEASONAL_RISK',
    severity: 'medium',
    title: 'Seasonal Cash-Flow Transition',
    problem: 'Income dips during mid-season growth months before the harvest payout.',
    whyItMatters: 'Daily family food, fodder, and utility bills continue even when crops are still in the field.',
    whatYouCanDo: 'Utilize secondary income from dairy/livestock or shop revenue to bridge the pre-harvest gap.'
  });

  return alerts;
}
