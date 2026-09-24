import {
  UserProfile,
  UserType,
  IncomeTransaction,
  ExpenseTransaction,
  LoanItem,
  SavingsGoal,
  SeasonalPlan,
  SyncQueueItem,
  LanguageCode
} from '../types';
import {
  DEMO_USER_FARMER,
  DEMO_USER_SHOP,
  DEMO_INCOMES_FARMER,
  DEMO_EXPENSES_FARMER,
  DEMO_LOANS_FARMER,
  DEMO_SAVINGS_FARMER,
  DEMO_SEASONAL_FARMER
} from '../data/demoData';

const STORAGE_KEYS = {
  USER: 'ruralkarnaa_user',
  INCOMES: 'ruralkarnaa_incomes',
  EXPENSES: 'ruralkarnaa_expenses',
  LOANS: 'ruralkarnaa_loans',
  SAVINGS: 'ruralkarnaa_savings',
  SEASONAL: 'ruralkarnaa_seasonal',
  SYNC_QUEUE: 'ruralkarnaa_sync_queue',
  LANG: 'ruralkarnaa_language',
  AUTH_TOKEN: 'ruralkarnaa_auth_token',
  LOGGED_IN: 'ruralkarnaa_logged_in',
};

type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

function notify() {
  listeners.forEach(fn => fn());
}

export const StorageService = {
  init() {
    this.getUser();
    this.getLanguage();
    this.getIncomes();
    this.getExpenses();
    this.getLoans();
    this.getSavings();
    this.getSeasonalPlans();
  },

  subscribe(fn: StorageListener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  getLanguage(): LanguageCode {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as LanguageCode) || 'en';
  },

  setLanguage(lang: LanguageCode) {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    const user = this.getUser();
    if (user) {
      user.preferredLanguage = lang;
      this.setUser(user);
    }
    notify();
  },

  getUser(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) {
      // Default to DEMO_USER_FARMER on first load so user immediately sees working prototype
      this.setUser(DEMO_USER_FARMER);
      return DEMO_USER_FARMER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'session_' + user.id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    notify();
  },

  isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
  },

  setLoggedIn(status: boolean) {
    if (status) {
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
    }
    notify();
  },

  logout() {
    this.setLoggedIn(false);
  },

  createCustomUser(name: string, userType: 'farmer' | 'shop_owner' | 'artisan' | 'daily_wage' = 'farmer', mobile?: string): UserProfile {
    const currentLang = this.getLanguage();
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      name: name.trim() || (userType === 'farmer' ? 'Ramesh Kumar' : 'Sunita Devi'),
      mobile: mobile || '',
      email: '',
      userType: (userType === 'artisan' ? 'daily_wage_earner' : userType) as UserType,
      preferredLanguage: currentLang,
      location: 'Rural India',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    this.setUser(newUser);
    this.setLoggedIn(true);
    return newUser;
  },

  getIncomes(): IncomeTransaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.INCOMES);
    if (!data) {
      this.setIncomes(DEMO_INCOMES_FARMER);
      return DEMO_INCOMES_FARMER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setIncomes(items: IncomeTransaction[]) {
    localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(items));
    notify();
  },

  addIncome(item: Omit<IncomeTransaction, 'id' | 'createdAt'>): IncomeTransaction {
    const newItem: IncomeTransaction = {
      ...item,
      id: 'inc-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const items = [newItem, ...this.getIncomes()];
    this.setIncomes(items);

    if (!this.isOnline()) {
      this.addToSyncQueue({
        id: 'sync-' + Date.now(),
        type: 'ADD_INCOME',
        payload: newItem,
        timestamp: Date.now(),
      });
    }
    return newItem;
  },

  deleteIncome(id: string) {
    const items = this.getIncomes().filter(i => i.id !== id);
    this.setIncomes(items);
  },

  getExpenses(): ExpenseTransaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!data) {
      this.setExpenses(DEMO_EXPENSES_FARMER);
      return DEMO_EXPENSES_FARMER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setExpenses(items: ExpenseTransaction[]) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(items));
    notify();
  },

  addExpense(item: Omit<ExpenseTransaction, 'id' | 'createdAt'>): ExpenseTransaction {
    const newItem: ExpenseTransaction = {
      ...item,
      id: 'exp-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const items = [newItem, ...this.getExpenses()];
    this.setExpenses(items);

    if (!this.isOnline()) {
      this.addToSyncQueue({
        id: 'sync-' + Date.now(),
        type: 'ADD_EXPENSE',
        payload: newItem,
        timestamp: Date.now(),
      });
    }
    return newItem;
  },

  deleteExpense(id: string) {
    const items = this.getExpenses().filter(e => e.id !== id);
    this.setExpenses(items);
  },

  getLoans(): LoanItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOANS);
    if (!data) {
      this.setLoans(DEMO_LOANS_FARMER);
      return DEMO_LOANS_FARMER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setLoans(items: LoanItem[]) {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(items));
    notify();
  },

  addLoan(item: Omit<LoanItem, 'id' | 'createdAt'>): LoanItem {
    const newItem: LoanItem = {
      ...item,
      id: 'loan-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const items = [newItem, ...this.getLoans()];
    this.setLoans(items);
    return newItem;
  },

  deleteLoan(id: string) {
    const items = this.getLoans().filter(l => l.id !== id);
    this.setLoans(items);
  },

  getSavings(): SavingsGoal[] {
    const data = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    if (!data) {
      this.setSavings(DEMO_SAVINGS_FARMER);
      return DEMO_SAVINGS_FARMER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setSavings(items: SavingsGoal[]) {
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(items));
    notify();
  },

  addSavings(item: Omit<SavingsGoal, 'id' | 'createdAt'>): SavingsGoal {
    const newItem: SavingsGoal = {
      ...item,
      id: 'sav-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const items = [newItem, ...this.getSavings()];
    this.setSavings(items);
    return newItem;
  },

  updateSavings(id: string, currentAmount: number) {
    const items = this.getSavings().map(s => (s.id === id ? { ...s, currentAmount } : s));
    this.setSavings(items);
  },

  deleteSavings(id: string) {
    const items = this.getSavings().filter(s => s.id !== id);
    this.setSavings(items);
  },

  addSavingsGoal(item: Omit<SavingsGoal, 'id' | 'createdAt'>): SavingsGoal {
    return this.addSavings(item);
  },

  updateSavingsGoal(id: string, currentAmount: number) {
    this.updateSavings(id, currentAmount);
  },

  deleteSavingsGoal(id: string) {
    this.deleteSavings(id);
  },

  getSeasonalPlans(): SeasonalPlan[] {
    const data = localStorage.getItem(STORAGE_KEYS.SEASONAL);
    if (!data) {
      this.setSeasonalPlans(DEMO_SEASONAL_FARMER);
      return DEMO_SEASONAL_FARMER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setSeasonalPlans(items: SeasonalPlan[]) {
    localStorage.setItem(STORAGE_KEYS.SEASONAL, JSON.stringify(items));
    notify();
  },

  addSeasonalPlan(item: Omit<SeasonalPlan, 'id' | 'createdAt'>): SeasonalPlan {
    const newItem: SeasonalPlan = {
      ...item,
      id: 'seas-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const items = [newItem, ...this.getSeasonalPlans()];
    this.setSeasonalPlans(items);
    return newItem;
  },

  deleteSeasonalPlan(id: string) {
    const items = this.getSeasonalPlans().filter(s => s.id !== id);
    this.setSeasonalPlans(items);
  },

  // Offline Sync Queue
  getSyncQueue(): SyncQueueItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    try {
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addToSyncQueue(item: SyncQueueItem) {
    const queue = [...this.getSyncQueue(), item];
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    notify();
  },

  clearSyncQueue() {
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    notify();
  },

  async processSyncQueue(): Promise<{ syncedCount: number }> {
    const queue = this.getSyncQueue();
    if (queue.length === 0) return { syncedCount: 0 };
    // Simulate or post to backend
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: queue }),
      });
    } catch (err) {
      console.warn('Sync to backend deferred, network offline');
    }
    const count = queue.length;
    this.clearSyncQueue();
    return { syncedCount: count };
  },

  // Preload Demo Profiles
  loadDemoProfile(type: 'farmer' | 'shop' | 'artisan') {
    const currentLang = this.getLanguage();
    this.setLoggedIn(true);
    if (type === 'farmer') {
      this.setUser({ ...DEMO_USER_FARMER, preferredLanguage: currentLang });
      this.setIncomes(DEMO_INCOMES_FARMER);
      this.setExpenses(DEMO_EXPENSES_FARMER);
      this.setLoans(DEMO_LOANS_FARMER);
      this.setSavings(DEMO_SAVINGS_FARMER);
      this.setSeasonalPlans(DEMO_SEASONAL_FARMER);
    } else if (type === 'artisan') {
      const artisanUser: UserProfile = {
        id: 'user-demo-artisan',
        name: 'Kishore Kumar',
        mobile: '+91 97654 32109',
        email: '',
        userType: 'daily_wage_earner',
        preferredLanguage: currentLang,
        location: 'Solapur, Maharashtra',
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
      };
      this.setUser(artisanUser);
      this.setIncomes([
        {
          id: 'inc-art-1',
          userId: 'user-demo-artisan',
          amount: 18000,
          category: 'daily_wage',
          date: '2026-09-04',
          source: 'Weaving & Handloom cooperative payment',
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'inc-art-2',
          userId: 'user-demo-artisan',
          amount: 8000,
          category: 'livestock',
          date: '2026-09-12',
          source: 'Goat milk & livestock sales',
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      this.setExpenses([
        {
          id: 'exp-art-1',
          userId: 'user-demo-artisan',
          amount: 8500,
          category: 'business',
          date: '2026-09-06',
          notes: 'Yarn, dyes, and loom maintenance materials',
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'exp-art-2',
          userId: 'user-demo-artisan',
          amount: 5500,
          category: 'food',
          date: '2026-09-10',
          notes: 'Household ration, cooking oil, and vegetables',
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      this.setLoans([
        {
          id: 'loan-art-1',
          userId: 'user-demo-artisan',
          loanName: 'SHG Mahila / Artisan Group Loan',
          loanType: 'personal_loan',
          principal: 25000,
          remainingAmount: 14000,
          interestRate: 7.0,
          emiAmount: 1200,
          dueDate: '2026-09-25',
          lender: 'Village Self Help Group (SHG)',
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      this.setSavings([
        {
          id: 'sav-art-1',
          userId: 'user-demo-artisan',
          name: 'Festival & Child Education Fund',
          category: 'education',
          targetAmount: 20000,
          currentAmount: 8500,
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      this.setSeasonalPlans([]);
    } else {
      this.setUser({ ...DEMO_USER_SHOP, preferredLanguage: currentLang });
      this.setIncomes([
        {
          id: 'inc-shop-1',
          userId: 'user-demo-shop',
          amount: 42000,
          category: 'shop',
          date: '2026-09-05',
          source: 'Kirana Store Daily Sales & Dry Goods',
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      this.setExpenses([
        {
          id: 'exp-shop-1',
          userId: 'user-demo-shop',
          amount: 28000,
          category: 'business',
          date: '2026-09-07',
          notes: 'Wholesale inventory restocking (Rice bags, oil, spices)',
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'exp-shop-2',
          userId: 'user-demo-shop',
          amount: 5000,
          category: 'utilities',
          date: '2026-09-09',
          notes: 'Shop commercial electricity & refrigerator cooling',
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      this.setLoans([
        {
          id: 'loan-shop-1',
          userId: 'user-demo-shop',
          loanName: 'Mudra Shishu Micro-enterprise Loan',
          loanType: 'business_loan',
          principal: 50000,
          remainingAmount: 32000,
          interestRate: 8.5,
          emiAmount: 1800,
          dueDate: '2026-09-30',
          lender: 'Andhra Pradesh Grameena Vikas Bank',
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      this.setSavings([
        {
          id: 'sav-shop-1',
          userId: 'user-demo-shop',
          name: 'Store Working Capital Reserve',
          category: 'business',
          targetAmount: 30000,
          currentAmount: 12000,
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      this.setSeasonalPlans([]);
    }
    notify();
  },

  resetToBlank() {
    this.setIncomes([]);
    this.setExpenses([]);
    this.setLoans([]);
    this.setSavings([]);
    this.setSeasonalPlans([]);
    notify();
  }
};
