export const COLORS = {
  dark: {
    background: '#090D16',
    surface: '#131C2E',
    surfaceLight: '#1E293B',
    surfaceBorder: '#2E3B52',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#10B981', // Emerald
    primaryGlow: 'rgba(16, 185, 129, 0.15)',
    secondary: '#6366F1', // Indigo
    expense: '#F43F5E', // Rose
    expenseGlow: 'rgba(244, 63, 94, 0.15)',
    income: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    info: '#3B82F6', // Blue
    card: '#111827',
    modalOverlay: 'rgba(0, 0, 0, 0.75)',
  },
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceLight: '#F1F5F9',
    surfaceBorder: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    primary: '#059669', // Emerald
    primaryGlow: 'rgba(5, 150, 105, 0.12)',
    secondary: '#4F46E5', // Indigo
    expense: '#E11D48', // Rose
    expenseGlow: 'rgba(225, 29, 72, 0.12)',
    income: '#059669', // Emerald
    warning: '#D97706', // Amber
    info: '#2563EB', // Blue
    card: '#FFFFFF',
    modalOverlay: 'rgba(15, 23, 42, 0.6)',
  }
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (C$)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
];

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  })
};
