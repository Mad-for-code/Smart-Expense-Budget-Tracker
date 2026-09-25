import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import CategoryPieChart from '../components/CategoryPieChart';
import SpendingBarChart from '../components/SpendingBarChart';
import { DEFAULT_CATEGORIES } from '../constants/categories';

export default function AnalyticsScreen() {
  const { transactions, categoryTotals, monthlyExpense, monthlyIncome, formatAmount, colors } = useApp();
  const [timeRange, setTimeRange] = useState('month'); // 'week' | 'month' | 'all'

  // Calculated Stats
  const activeExpenseTxs = transactions.filter(t => t.type === 'expense');
  const netSavings = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round((netSavings / monthlyIncome) * 100)) : 0;
  const dailyAverage = monthlyExpense > 0 ? (monthlyExpense / 30).toFixed(2) : 0;

  // Find top spending category
  let topCategory = null;
  let maxSpent = 0;
  DEFAULT_CATEGORIES.forEach(cat => {
    const total = categoryTotals[cat.id] || 0;
    if (total > maxSpent) {
      maxSpent = total;
      topCategory = cat;
    }
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header title="Spending Insights" subtitle="Analytics" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Time Filter Pills */}
        <View style={styles.filterContainer}>
          {[
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.timeTab,
                {
                  backgroundColor: timeRange === tab.id ? colors.primary : colors.surface,
                  borderColor: timeRange === tab.id ? colors.primary : colors.surfaceBorder,
                }
              ]}
              onPress={() => setTimeRange(tab.id)}
            >
              <Text style={[styles.timeTabText, { color: timeRange === tab.id ? '#FFF' : colors.textSecondary }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Insights Cards Row */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={[styles.statIconCircle, { backgroundColor: colors.primaryGlow }]}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Daily Average</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{formatAmount(dailyAverage)}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
              <Ionicons name="pie-chart-outline" size={18} color={colors.secondary} />
            </View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Top Category</Text>
            <Text style={[styles.statValue, { color: topCategory ? topCategory.color : colors.textPrimary }]} numberOfLines={1}>
              {topCategory ? topCategory.name : 'N/A'}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="leaf-outline" size={18} color={colors.warning} />
            </View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Savings Rate</Text>
            <Text style={[styles.statValue, { color: colors.warning }]}>{savingsRate}%</Text>
          </View>
        </View>

        {/* Spending Bar Chart */}
        <SpendingBarChart />

        {/* Category Pie Chart */}
        <CategoryPieChart />

        {/* Detailed Category Rankings */}
        <View style={[styles.rankingCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <Text style={[styles.rankingTitle, { color: colors.textPrimary }]}>Category Spend Rankings</Text>
          {DEFAULT_CATEGORIES
            .map(cat => ({ ...cat, total: categoryTotals[cat.id] || 0 }))
            .filter(cat => cat.total > 0)
            .sort((a, b) => b.total - a.total)
            .map(cat => {
              const pct = monthlyExpense > 0 ? Math.round((cat.total / monthlyExpense) * 100) : 0;
              return (
                <View key={cat.id} style={styles.rankItem}>
                  <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
                    <Ionicons name={cat.icon} size={18} color={cat.color} />
                  </View>
                  <View style={styles.rankDetails}>
                    <View style={styles.rankHeader}>
                      <Text style={[styles.rankName, { color: colors.textPrimary }]}>{cat.name}</Text>
                      <Text style={[styles.rankAmount, { color: colors.textPrimary }]}>{formatAmount(cat.total)}</Text>
                    </View>
                    <View style={[styles.rankTrack, { backgroundColor: colors.surfaceBorder }]}>
                      <View style={[styles.rankBar, { width: `${pct}%`, backgroundColor: cat.color }]} />
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 12,
    gap: 8,
  },
  timeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  rankingCard: {
    padding: 20,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  rankingTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  catIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankDetails: {
    flex: 1,
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rankName: {
    fontSize: 13,
    fontWeight: '700',
  },
  rankAmount: {
    fontSize: 13,
    fontWeight: '800',
  },
  rankTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  rankBar: {
    height: '100%',
    borderRadius: 3,
  }
});
