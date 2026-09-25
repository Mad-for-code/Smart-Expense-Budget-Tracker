import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function SummaryCard({ onAddPress }) {
  const { totalBalance, totalIncome, totalExpense, monthlyExpense, budgets, formatAmount, colors } = useApp();

  const monthlyLimit = budgets.monthlyOverall || 2500;
  const budgetPercentage = Math.min(Math.round((monthlyExpense / monthlyLimit) * 100), 100);

  const getProgressColor = () => {
    if (budgetPercentage >= 100) return colors.expense;
    if (budgetPercentage >= 80) return colors.warning;
    return colors.primary;
  };

  return (
    <View style={styles.container}>
      {/* Hero Glass Card */}
      <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Total Net Balance</Text>
            <Text style={[styles.balanceValue, { color: totalBalance >= 0 ? colors.textPrimary : colors.expense }]}>
              {formatAmount(totalBalance)}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.quickAddBtn, { backgroundColor: colors.primary }]}
            onPress={onAddPress}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
            <Text style={styles.quickAddText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

        {/* Income vs Expense Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: colors.primaryGlow }]}>
              <Ionicons name="arrow-down-outline" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Income</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>{formatAmount(totalIncome)}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: colors.expenseGlow }]}>
              <Ionicons name="arrow-up-outline" size={16} color={colors.expense} />
            </View>
            <View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Spent</Text>
              <Text style={[styles.statValue, { color: colors.expense }]}>{formatAmount(totalExpense)}</Text>
            </View>
          </View>
        </View>

        {/* Budget Progress Meter */}
        <View style={[styles.budgetBox, { backgroundColor: colors.background }]}>
          <View style={styles.budgetHeader}>
            <Text style={[styles.budgetText, { color: colors.textSecondary }]}>
              Monthly Budget ({budgetPercentage}% spent)
            </Text>
            <Text style={[styles.budgetAmount, { color: colors.textPrimary }]}>
              {formatAmount(monthlyExpense)} / {formatAmount(monthlyLimit)}
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.surfaceBorder }]}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${budgetPercentage}%`, backgroundColor: getProgressColor() }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    marginTop: 4,
  },
  quickAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 4,
  },
  quickAddText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#334155',
    marginHorizontal: 12,
  },
  budgetBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  budgetAmount: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  }
});
