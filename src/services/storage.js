import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TRANSACTIONS: '@smart_tracker_transactions_v2',
  BUDGETS: '@smart_tracker_budgets_v2',
  CURRENCY: '@smart_tracker_currency_v2',
  THEME: '@smart_tracker_theme_v2',
  CUSTOM_CATEGORIES: '@smart_tracker_categories_v2',
};

// Initial Seed Data if app opens for first time
const SAMPLE_TRANSACTIONS = [
  {
    id: 'tx_seed_1',
    title: 'Monthly Salary',
    amount: 3850.00,
    type: 'income',
    categoryId: 'salary',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    paymentMethod: 'bank',
    notes: 'Direct deposit into main checking account'
  },
  {
    id: 'tx_seed_2',
    title: 'Whole Foods Grocery',
    amount: 124.50,
    type: 'expense',
    categoryId: 'shopping',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    paymentMethod: 'credit',
    notes: 'Organic groceries & weekly essentials'
  },
  {
    id: 'tx_seed_3',
    title: 'Apartment Rent',
    amount: 1450.00,
    type: 'expense',
    categoryId: 'housing',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    paymentMethod: 'bank',
    notes: 'Monthly apartment rent transfer'
  },
  {
    id: 'tx_seed_4',
    title: 'Shell Fuel / Gas',
    amount: 48.00,
    type: 'expense',
    categoryId: 'transport',
    date: new Date(Date.now() - 12 * 3600000).toISOString(),
    paymentMethod: 'debit',
    notes: 'Full tank of premium gasoline'
  },
  {
    id: 'tx_seed_5',
    title: 'Artisan Coffee & Bakery',
    amount: 8.75,
    type: 'expense',
    categoryId: 'food',
    date: new Date(Date.now() - 4 * 3600000).toISOString(),
    paymentMethod: 'credit',
    notes: 'Cappuccino & croissant'
  },
  {
    id: 'tx_seed_6',
    title: 'Freelance Design Work',
    amount: 650.00,
    type: 'income',
    categoryId: 'freelance',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    paymentMethod: 'bank',
    notes: 'Logo & branding project completed'
  },
  {
    id: 'tx_seed_7',
    title: 'Netflix & Spotify Subs',
    amount: 24.99,
    type: 'expense',
    categoryId: 'entertainment',
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    paymentMethod: 'credit',
    notes: 'Monthly streaming subscriptions'
  },
  {
    id: 'tx_seed_8',
    title: 'Gym Membership',
    amount: 55.00,
    type: 'expense',
    categoryId: 'health',
    date: new Date(Date.now() - 6 * 86400000).toISOString(),
    paymentMethod: 'credit',
    notes: 'Fitness club access'
  }
];

const DEFAULT_BUDGETS = {
  monthlyOverall: 2500,
  categories: {
    food: 400,
    transport: 250,
    housing: 1500,
    utilities: 200,
    shopping: 350,
    entertainment: 150,
    health: 100,
  }
};

export const StorageService = {
  // Transactions
  getTransactions: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      } else {
        // First run, seed data
        await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SAMPLE_TRANSACTIONS));
        return SAMPLE_TRANSACTIONS;
      }
    } catch (e) {
      console.error('Error reading transactions from AsyncStorage', e);
      return [];
    }
  },

  saveTransactions: async (transactions) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      return true;
    } catch (e) {
      console.error('Error saving transactions to AsyncStorage', e);
      return false;
    }
  },

  clearAllData: async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.BUDGETS,
        STORAGE_KEYS.CURRENCY,
        STORAGE_KEYS.THEME,
      ]);
      return true;
    } catch (e) {
      console.error('Error resetting AsyncStorage', e);
      return false;
    }
  },

  seedSampleData: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SAMPLE_TRANSACTIONS));
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(DEFAULT_BUDGETS));
      return SAMPLE_TRANSACTIONS;
    } catch (e) {
      console.error('Error seeding data', e);
      return [];
    }
  },

  // Budgets
  getBudgets: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(DEFAULT_BUDGETS));
        return DEFAULT_BUDGETS;
      }
    } catch (e) {
      console.error('Error reading budgets', e);
      return DEFAULT_BUDGETS;
    }
  },

  saveBudgets: async (budgets) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
      return true;
    } catch (e) {
      console.error('Error saving budgets', e);
      return false;
    }
  },

  // Currency
  getCurrency: async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.CURRENCY);
      return value || '$';
    } catch (e) {
      return '$';
    }
  },

  saveCurrency: async (symbol) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, symbol);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Theme
  getTheme: async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return value || 'dark';
    } catch (e) {
      return 'dark';
    }
  },

  saveTheme: async (theme) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
      return true;
    } catch (e) {
      return false;
    }
  }
};
