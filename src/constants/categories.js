export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'fast-food', color: '#F59E0B', bg: '#FEF3C7', type: 'expense' },
  { id: 'transport', name: 'Transport & Fuel', icon: 'car', color: '#3B82F6', bg: '#DBEAFE', type: 'expense' },
  { id: 'housing', name: 'Housing & Rent', icon: 'home', color: '#8B5CF6', bg: '#EDE9FE', type: 'expense' },
  { id: 'utilities', name: 'Utilities & Bills', icon: 'flash', color: '#EC4899', bg: '#FCE7F3', type: 'expense' },
  { id: 'shopping', name: 'Shopping & Apparel', icon: 'bag-handle', color: '#10B981', bg: '#D1FAE5', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film', color: '#6366F1', bg: '#E0E7FF', type: 'expense' },
  { id: 'health', name: 'Health & Fitness', icon: 'fitness', color: '#14B8A6', bg: '#CCFBF1', type: 'expense' },
  { id: 'travel', name: 'Travel & Trips', icon: 'airplane', color: '#06B6D4', bg: '#CFFAFE', type: 'expense' },
  { id: 'education', name: 'Education & Courses', icon: 'school', color: '#F97316', bg: '#FFEDD5', type: 'expense' },
  { id: 'salary', name: 'Salary / Wages', icon: 'wallet', color: '#10B981', bg: '#D1FAE5', type: 'income' },
  { id: 'freelance', name: 'Freelance / Side Gig', icon: 'code-working', color: '#3B82F6', bg: '#DBEAFE', type: 'income' },
  { id: 'investment', name: 'Investments / Returns', icon: 'trending-up', color: '#8B5CF6', bg: '#EDE9FE', type: 'income' },
  { id: 'other', name: 'Other / Misc', icon: 'ellipsis-horizontal-circle', color: '#64748B', bg: '#F1F5F9', type: 'expense' },
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: 'cash-outline' },
  { id: 'credit', name: 'Credit Card', icon: 'card-outline' },
  { id: 'debit', name: 'Debit Card', icon: 'subway-outline' },
  { id: 'upi', name: 'UPI / Online', icon: 'qr-code-outline' },
  { id: 'bank', name: 'Bank Transfer', icon: 'business-outline' },
];

export const QUICK_PRESETS = [
  { title: '☕ Morning Coffee', amount: 4.50, categoryId: 'food', paymentMethod: 'credit' },
  { title: '🍔 Lunch Special', amount: 14.99, categoryId: 'food', paymentMethod: 'credit' },
  { title: '⛽ Fuel / Gas Fill-up', amount: 45.00, categoryId: 'transport', paymentMethod: 'debit' },
  { title: '🛒 Weekly Groceries', amount: 85.50, categoryId: 'shopping', paymentMethod: 'credit' },
  { title: '🎬 Cinema / Movie Ticket', amount: 18.00, categoryId: 'entertainment', paymentMethod: 'upi' },
  { title: '💡 Electric Bill', amount: 95.00, categoryId: 'utilities', paymentMethod: 'bank' },
];
