import {
  UserProfile,
  IncomeTransaction,
  ExpenseTransaction,
  LoanItem,
  SavingsGoal,
  SeasonalPlan,
  ChatMessage
} from '../types';

export const DEMO_USER_FARMER: UserProfile = {
  id: 'user-demo-farmer',
  name: 'Ramesh Kumar',
  mobile: '+91 98765 43210',
  email: 'ramesh.farmer@ruralkarnaa.org',
  userType: 'farmer',
  preferredLanguage: 'en',
  location: 'Mandya District, Karnataka',
  onboardingCompleted: true,
  createdAt: '2026-08-01T00:00:00.000Z',
};

export const DEMO_USER_SHOP: UserProfile = {
  id: 'user-demo-shop',
  name: 'Lakshmi Devi',
  mobile: '+91 98123 45678',
  email: 'lakshmi.grocer@ruralkarnaa.org',
  userType: 'shop_owner',
  preferredLanguage: 'en',
  location: 'Warangal, Telangana',
  onboardingCompleted: true,
  createdAt: '2026-08-10T00:00:00.000Z',
};

export const DEMO_INCOMES_FARMER: IncomeTransaction[] = [
  {
    id: 'inc-1',
    userId: 'user-demo-farmer',
    amount: 20000,
    category: 'livestock',
    date: '2026-09-02',
    source: 'Village Dairy Cooperative (Milk Sales)',
    notes: 'Twice-daily cow milk supply to cooperative',
    isDemo: true,
    createdAt: '2026-09-02T10:00:00.000Z',
  },
  {
    id: 'inc-2',
    userId: 'user-demo-farmer',
    amount: 9000,
    category: 'farming',
    date: '2026-09-08',
    source: 'Local Weekly Mandi (Vegetable harvest surplus)',
    notes: 'Tomatoes & green chillies sold at APMC yard',
    isDemo: true,
    createdAt: '2026-09-08T12:00:00.000Z',
  },
  {
    id: 'inc-3',
    userId: 'user-demo-farmer',
    amount: 4000,
    category: 'daily_wage',
    date: '2026-09-14',
    source: 'Tractor rental & land prep assistance to neighbor',
    notes: '2 days rotavator work',
    isDemo: true,
    createdAt: '2026-09-14T17:00:00.000Z',
  },
  {
    id: 'inc-4',
    userId: 'user-demo-farmer',
    amount: 2000,
    category: 'government_support',
    date: '2026-09-18',
    source: 'PM-KISAN Samman Nidhi Installment',
    notes: 'Direct Benefit Transfer into bank',
    isDemo: true,
    createdAt: '2026-09-18T09:00:00.000Z',
  },
];

export const DEMO_EXPENSES_FARMER: ExpenseTransaction[] = [
  {
    id: 'exp-1',
    userId: 'user-demo-farmer',
    amount: 7200,
    category: 'farming',
    date: '2026-09-04',
    notes: 'Kharif paddy fertilizer (Urea & DAP) and bio-pesticides',
    isDemo: true,
    createdAt: '2026-09-04T11:00:00.000Z',
  },
  {
    id: 'exp-2',
    userId: 'user-demo-farmer',
    amount: 5800,
    category: 'food',
    date: '2026-09-06',
    notes: 'Monthly family ration, cooking oil, spices & lentils',
    isDemo: true,
    createdAt: '2026-09-06T15:00:00.000Z',
  },
  {
    id: 'exp-3',
    userId: 'user-demo-farmer',
    amount: 3500,
    category: 'loan_emi',
    date: '2026-09-10',
    notes: 'Kisan Credit Card quarterly interest payment',
    isDemo: true,
    createdAt: '2026-09-10T14:00:00.000Z',
  },
  {
    id: 'exp-4',
    userId: 'user-demo-farmer',
    amount: 2500,
    category: 'utilities',
    date: '2026-09-12',
    notes: 'Farm pump electricity bill and LPG gas refill',
    isDemo: true,
    createdAt: '2026-09-12T16:00:00.000Z',
  },
  {
    id: 'exp-5',
    userId: 'user-demo-farmer',
    amount: 1500,
    category: 'healthcare',
    date: '2026-09-15',
    notes: 'Mother routine clinic checkup & monthly blood pressure tablets',
    isDemo: true,
    createdAt: '2026-09-15T18:00:00.000Z',
  },
  {
    id: 'exp-6',
    userId: 'user-demo-farmer',
    amount: 1000,
    category: 'transport',
    date: '2026-09-16',
    notes: 'Diesel for motorcycle and goods transport to taluk market',
    isDemo: true,
    createdAt: '2026-09-16T19:00:00.000Z',
  },
];

export const DEMO_LOANS_FARMER: LoanItem[] = [
  {
    id: 'loan-1',
    userId: 'user-demo-farmer',
    loanName: 'State Bank Kisan Credit Card (Crop Loan)',
    loanType: 'agricultural_loan',
    principal: 75000,
    remainingAmount: 60000,
    interestRate: 7, // 4% with prompt repayment subvention
    emiAmount: 3500,
    dueDate: '2026-09-28',
    lender: 'State Bank of India (Rural Branch)',
    isDemo: true,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'loan-2',
    userId: 'user-demo-farmer',
    loanName: 'Tractor Attachment Hire-Purchase',
    loanType: 'vehicle_loan',
    principal: 30000,
    remainingAmount: 20000,
    interestRate: 11.5,
    emiAmount: 2200,
    dueDate: '2026-10-05',
    lender: 'Gramin Vikas Finance',
    isDemo: true,
    createdAt: '2026-03-20T00:00:00.000Z',
  },
];

export const DEMO_SAVINGS_FARMER: SavingsGoal[] = [
  {
    id: 'sav-1',
    userId: 'user-demo-farmer',
    name: 'Family Emergency Fund',
    category: 'emergency_fund',
    targetAmount: 20000,
    currentAmount: 6500,
    targetDate: '2026-12-31',
    isDemo: true,
    createdAt: '2026-07-01T00:00:00.000Z',
  },
  {
    id: 'sav-2',
    userId: 'user-demo-farmer',
    name: 'Children School Annual Fees',
    category: 'education',
    targetAmount: 15000,
    currentAmount: 5000,
    targetDate: '2027-05-15',
    isDemo: true,
    createdAt: '2026-07-01T00:00:00.000Z',
  },
];

export const DEMO_SEASONAL_FARMER: SeasonalPlan[] = [
  {
    id: 'seas-1',
    userId: 'user-demo-farmer',
    crop: 'Rice (Kharif Paddy - Sona Masoori)',
    sowingMonth: 'July',
    expectedHarvestMonth: 'November',
    expectedIncome: 80000,
    otherIncome: 15000,
    expectedMajorExpenses: 45000,
    notes: '2.5 acres transplanted paddy. Harvest expected mid-November with APMC minimum support price.',
    isDemo: true,
    createdAt: '2026-07-15T00:00:00.000Z',
  },
];

export const INITIAL_AI_CHAT: ChatMessage[] = [
  {
    id: 'chat-welcome',
    role: 'assistant',
    content: `Namaste Ramesh ji! I am **RuralKarnaa AI Assistant**, your financial companion.

I have reviewed your current numbers:
• **Monthly Income:** ₹35,000 (Dairy milk & vegetable mandi)
• **Monthly Expenses:** ₹21,500
• **Current Savings:** ₹6,500 (Emergency target: ₹20,000)
• **Remaining Loans:** ₹80,000 (KCC Crop loan & Tractor hire)
• **Upcoming Harvest:** Rice in November (Expected ~₹80,000)

Your **Financial Health Score is 72 / 100** ("Needs Attention").

Ask me anything in your preferred language or tap the microphone to speak!`,
    timestamp: '2026-09-19T09:00:00.000Z',
    suggestedActions: [
      'Can I afford to buy a ₹20,000 smartphone?',
      'Why is my financial score 72?',
      'When is my next EMI due?',
      'How much should I keep aside for November harvest?',
      'Where did I spend the most this month?'
    ],
  },
];
