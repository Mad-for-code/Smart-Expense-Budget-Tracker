import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { DEFAULT_CATEGORIES } from '../constants/categories';

export default function BudgetScreen() {
  const { budgets, updateBudgets, monthlyExpense, categoryTotals, formatAmount, currency, colors } = useApp();

  const [overallLimit, setOverallLimit] = useState(budgets.monthlyOverall ? budgets.monthlyOverall.toString() : '2500');
  const [categoryBudgets, setCategoryBudgets] = useState(budgets.categories || {});
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveBudgets = () => {
    const parsedOverall = parseFloat(overallLimit) || 2500;
    const updated = {
      monthlyOverall: parsedOverall,
      categories: categoryBudgets
    };
    updateBudgets(updated);
    setIsEditing(false);
  };

  const updateCategoryLimit = (catId, val) => {
    const num = parseFloat(val) || 0;
    setCategoryBudgets({
      ...categoryBudgets,
      [catId]: num
    });
  };

  const totalOverallLimit = parseFloat(overallLimit) || 2500;
  const overallPercentage = Math.min(Math.round((monthlyExpense / totalOverallLimit) * 100), 100);
  const isOverBudget = monthlyExpense > totalOverallLimit;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header title="Budget Limits" subtitle="Financial Planning" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Overall Budget Hero Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isOverBudget ? colors.expense : colors.surfaceBorder }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardSubTitle, { color: colors.textSecondary }]}>Monthly Expense Target</Text>
              <Text style={[styles.cardTitleAmount, { color: colors.textPrimary }]}>
                {formatAmount(monthlyExpense)} / {formatAmount(totalOverallLimit)}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: isEditing ? colors.primary : colors.surfaceLight }]}
              onPress={() => {
                if (isEditing) {
                  handleSaveBudgets();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <Ionicons name={isEditing ? 'checkmark' : 'create-outline'} size={18} color={isEditing ? '#FFF' : colors.textPrimary} />
              <Text style={[styles.editBtnText, { color: isEditing ? '#FFF' : colors.textPrimary }]}>
                {isEditing ? 'Save' : 'Edit Limits'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Alert Banner if Over Budget */}
          {isOverBudget && (
            <View style={[styles.alertBanner, { backgroundColor: colors.expenseGlow, borderColor: colors.expense }]}>
              <Ionicons name="warning-outline" size={20} color={colors.expense} />
              <Text style={[styles.alertText, { color: colors.expense }]}>
                Warning: You have exceeded your monthly target by {formatAmount(monthlyExpense - totalOverallLimit)}!
              </Text>
            </View>
          )}

          {/* Edit Inputs if editing mode */}
          {isEditing ? (
            <View style={styles.editBox}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Set Overall Monthly Limit ({currency})</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.surfaceBorder }]}>
                <Text style={[styles.currPrefix, { color: colors.primary }]}>{currency}</Text>
                <TextInput
                  style={[styles.inputField, { color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={overallLimit}
                  onChangeText={setOverallLimit}
                />
              </View>
            </View>
          ) : (
            <View style={styles.progressSection}>
              <View style={[styles.progressTrack, { backgroundColor: colors.surfaceBorder }]}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${overallPercentage}%`,
                      backgroundColor: isOverBudget ? colors.expense : overallPercentage > 80 ? colors.warning : colors.primary
                    }
                  ]}
                />
              </View>
              <Text style={[styles.progressFooterText, { color: colors.textSecondary }]}>
                {100 - overallPercentage}% remaining ({formatAmount(Math.max(0, totalOverallLimit - monthlyExpense))})
              </Text>
            </View>
          )}
        </View>

        {/* Category Specific Budgets */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Category Budget Allocations</Text>
        </View>

        {DEFAULT_CATEGORIES
          .filter(c => c.type === 'expense')
          .map(cat => {
            const spent = categoryTotals[cat.id] || 0;
            const limit = categoryBudgets[cat.id] || 300;
            const pct = Math.min(Math.round((spent / limit) * 100), 100);
            const isCatOver = spent > limit;

            return (
              <View key={cat.id} style={[styles.categoryBudgetCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                <View style={styles.catBudgetHeader}>
                  <View style={styles.catTitleLeft}>
                    <View style={[styles.catIconBox, { backgroundColor: cat.bg }]}>
                      <Ionicons name={cat.icon} size={18} color={cat.color} />
                    </View>
                    <View>
                      <Text style={[styles.catName, { color: colors.textPrimary }]}>{cat.name}</Text>
                      <Text style={[styles.catSub, { color: isCatOver ? colors.expense : colors.textSecondary }]}>
                        Spent: {formatAmount(spent)}
                      </Text>
                    </View>
                  </View>

                  {isEditing ? (
                    <View style={[styles.catInputWrapper, { backgroundColor: colors.background, borderColor: colors.surfaceBorder }]}>
                      <Text style={[styles.catCurrPrefix, { color: colors.textSecondary }]}>{currency}</Text>
                      <TextInput
                        style={[styles.catInputField, { color: colors.textPrimary }]}
                        keyboardType="numeric"
                        value={limit.toString()}
                        onChangeText={(val) => updateCategoryLimit(cat.id, val)}
                      />
                    </View>
                  ) : (
                    <Text style={[styles.catLimitText, { color: colors.textPrimary }]}>
                      Limit: {formatAmount(limit)}
                    </Text>
                  )}
                </View>

                {!isEditing && (
                  <View style={{ marginTop: 10 }}>
                    <View style={[styles.catProgressTrack, { backgroundColor: colors.surfaceBorder }]}>
                      <View
                        style={[
                          styles.catProgressBar,
                          {
                            width: `${pct}%`,
                            backgroundColor: isCatOver ? colors.expense : pct > 80 ? colors.warning : cat.color
                          }
                        ]}
                      />
                    </View>
                    <View style={styles.catProgressFooter}>
                      <Text style={[styles.catPctText, { color: isCatOver ? colors.expense : colors.textMuted }]}>
                        {isCatOver ? 'OVER BUDGET' : `${pct}% used`}
                      </Text>
                      <Text style={[styles.catRemText, { color: colors.textMuted }]}>
                        {isCatOver ? `+${formatAmount(spent - limit)}` : `${formatAmount(limit - spent)} left`}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardSubTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardTitleAmount: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 16,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  progressSection: {
    marginTop: 4,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressFooterText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'right',
  },
  editBox: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  currPrefix: {
    fontSize: 18,
    fontWeight: '800',
    marginRight: 6,
  },
  inputField: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  categoryBudgetCard: {
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
  },
  catBudgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  catIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
  },
  catSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  catLimitText: {
    fontSize: 13,
    fontWeight: '800',
  },
  catInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    width: 100,
  },
  catCurrPrefix: {
    fontSize: 14,
    fontWeight: '700',
  },
  catInputField: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  catProgressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  catProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  catProgressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  catPctText: {
    fontSize: 10,
    fontWeight: '700',
  },
  catRemText: {
    fontSize: 10,
    fontWeight: '600',
  }
});
