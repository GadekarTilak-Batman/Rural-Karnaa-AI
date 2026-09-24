export type UserType =
  | 'farmer'
  | 'rural_family'
  | 'shop_owner'
  | 'agricultural_worker'
  | 'daily_wage_earner'
  | 'livestock_owner'
  | 'small_business'
  | 'small_business_owner'
  | 'family_head'
  | 'shg_member'
  | 'other';

export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'mr';

export type IncomeFrequency = 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'irregular';

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  email: string;
  userType: UserType;
  preferredLanguage: LanguageCode;
  location: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export type IncomeCategory =
  | 'farming'
  | 'livestock'
  | 'dairy_milk'
  | 'salary'
  | 'shop'
  | 'daily_wage'
  | 'labor_wage'
  | 'small_business'
  | 'government_support'
  | 'government_scheme'
  | 'other';

export interface IncomeTransaction {
  id: string;
  userId: string;
  amount: number;
  category: IncomeCategory;
  date: string;
  source: string;
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type IncomeEntry = IncomeTransaction;

export type ExpenseCategory =
  | 'food'
  | 'education'
  | 'healthcare'
  | 'farming'
  | 'transport'
  | 'utilities'
  | 'loan_emi'
  | 'livestock_feed'
  | 'social_festivals'
  | 'business'
  | 'household'
  | 'other';

export interface ExpenseTransaction {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type ExpenseEntry = ExpenseTransaction;

export type LoanType =
  | 'agricultural_loan'
  | 'personal_loan'
  | 'business_loan'
  | 'vehicle_loan'
  | 'equipment_loan'
  | 'shg_loan'
  | 'microfinance_shg'
  | 'gold_loan'
  | 'informal_loan'
  | 'other';

export interface LoanItem {
  id: string;
  userId: string;
  loanName: string;
  loanType: LoanType;
  principal: number;
  remainingAmount: number;
  interestRate: number;
  emiAmount: number;
  dueDate: string;
  lender?: string;
  isDemo?: boolean;
  createdAt: string;
}

export type LoanEntry = LoanItem;

export type SavingsGoalCategory =
  | 'emergency_fund'
  | 'education'
  | 'farming_expenses'
  | 'business'
  | 'healthcare'
  | 'other';

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  category: SavingsGoalCategory;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface SeasonalPlan {
  id: string;
  userId: string;
  crop: string;
  sowingMonth: string;
  expectedHarvestMonth: string;
  expectedIncome: number;
  otherIncome: number;
  expectedMajorExpenses: number;
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface FinancialHealthScoreBreakdown {
  overallScore: number;
  status: 'Needs Immediate Attention' | 'Needs Attention' | 'Moderate' | 'Good' | 'Excellent';
  incomeStability: number;
  expenseManagement: number;
  savingsRatio: number;
  loanBurden: number;
  emergencyReadiness: number;
  cashFlowBalance: number;
  observations: string[];
  actionSteps: string[];
}

export interface FinancialAlert {
  id: string;
  type: 'LOW_SAVINGS' | 'HIGH_EXPENSES' | 'UPCOMING_EMI' | 'SEASONAL_RISK' | 'UNTRACKED_EXPENSES' | 'SCAM_WARNING';
  severity: 'high' | 'medium' | 'low';
  title: string;
  problem: string;
  whyItMatters: string;
  whatYouCanDo: string;
  date?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  dataRef?: string;
}

export interface WhatIfScenarioInput {
  expenseChange: number;
  incomePercentChange: number;
  monthlySavingsChange: number;
  newLoanEmi: number;
}

export interface WhatIfComparisonResult {
  current: {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
    monthlyEmi: number;
    netCashFlow: number;
    healthScore: number;
  };
  scenario: {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
    monthlyEmi: number;
    netCashFlow: number;
    healthScore: number;
  };
  differences: {
    cashFlowDiff: number;
    scoreDiff: number;
    savingsMonthsSurvival: number;
  };
  recommendation: string;
}

export interface DocumentAnalysisResult {
  documentType: 'loan_agreement' | 'electricity_or_utility_bill' | 'fertilizer_seed_receipt' | 'bank_challan' | 'other';
  confidence: number;
  extractedFields: {
    amount?: number;
    date?: string;
    merchantOrLender?: string;
    dueDate?: string;
    loanAmount?: number;
    emi?: number;
    category?: ExpenseCategory | LoanType;
    details?: string;
  };
  rawSummary: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'ADD_INCOME' | 'ADD_EXPENSE' | 'ADD_LOAN' | 'ADD_SAVINGS' | 'ADD_SEASONAL';
  payload: any;
  timestamp: number;
}
