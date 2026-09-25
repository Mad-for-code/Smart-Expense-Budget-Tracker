import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { COLORS } from '../constants/theme';
import { DEFAULT_CATEGORIES } from '../constants/categories';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({ monthlyOverall: 2500, categories: {} });
  const [currency, setCurrencyState] = useState('$');
  const [themeMode, setThemeMode] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const colors = COLORS[themeMode];

  // Initial Load from AsyncStorage
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [txs, bgt, curr, thm] = await Promise.all([
        StorageService.getTransactions(),
        StorageService.getBudgets(),
        StorageService.getCurrency(),
        StorageService.getTheme()
      ]);
      setTransactions(txs || []);
      setBudgets(bgt || { monthlyOverall: 2500, categories: {} });
      setCurrencyState(curr || '$');
      setThemeMode(thm || 'dark');
    } catch (error) {
      console.error('Error initializing app state:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add Transaction
  const addTransaction = async (newTx) => {
    const item = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toISOString(),
      ...newTx,
      amount: parseFloat(newTx.amount) || 0,
    };
    const updated = [item, ...transactions];
    setTransactions(updated);
    await StorageService.saveTransactions(updated);
    showToast(`Added ${item.type === 'expense' ? 'Expense' : 'Income'}: ${item.title}`);
  };

  // Update Transaction
  const updateTransaction = async (id, updatedFields) => {
    const updated = transactions.map(t => {
      if (t.id === id) {
        return { ...t, ...updatedFields, amount: parseFloat(updatedFields.amount || t.amount) };
      }
      return t;
    });
    setTransactions(updated);
    await StorageService.saveTransactions(updated);
    showToast('Transaction updated');
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await StorageService.saveTransactions(updated);
    showToast('Transaction deleted');
  };

  // Update Budgets
  const updateBudgets = async (newBudgets) => {
    setBudgets(newBudgets);
    await StorageService.saveBudgets(newBudgets);
    showToast('Budget settings updated');
  };

  // Set Currency
  const setCurrency = async (newSymbol) => {
    setCurrencyState(newSymbol);
    await StorageService.saveCurrency(newSymbol);
    showToast(`Currency updated to ${newSymbol}`);
  };

  // Toggle Theme
  const toggleTheme = async () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
    await StorageService.saveTheme(nextTheme);
  };

  // Reset to Sample Data
  const resetToSampleData = async () => {
    const seeded = await StorageService.seedSampleData();
    const bgt = await StorageService.getBudgets();
    setTransactions(seeded);
    setBudgets(bgt);
    showToast('Demo data restored successfully!');
  };

  // Clear All Data
  const clearAllData = async () => {
    await StorageService.clearAllData();
    setTransactions([]);
    setBudgets({ monthlyOverall: 2000, categories: {} });
    showToast('All data cleared');
  };

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalBalance = totalIncome - totalExpense;

  // Monthly breakdown calculations
  const now = new Date();
  const currentMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthlyExpense = currentMonthTxs
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const monthlyIncome = currentMonthTxs
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Category totals for current month
  const categoryTotals = DEFAULT_CATEGORIES.reduce((acc, cat) => {
    const catSum = transactions
      .filter(t => t.categoryId === cat.id && t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    acc[cat.id] = catSum;
    return acc;
  }, {});

  const formatAmount = (num) => {
    const val = typeof num === 'number' ? num : parseFloat(num) || 0;
    return `${currency}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        budgets,
        currency,
        themeMode,
        colors,
        loading,
        toastMessage,
        totalBalance,
        totalIncome,
        totalExpense,
        monthlyExpense,
        monthlyIncome,
        categoryTotals,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudgets,
        setCurrency,
        toggleTheme,
        resetToSampleData,
        clearAllData,
        formatAmount,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
