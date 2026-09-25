import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES, PAYMENT_METHODS, QUICK_PRESETS } from '../constants/categories';

export default function AddExpenseScreen({ navigation, route }) {
  const { addTransaction, updateTransaction, currency, colors } = useApp();
  const editItem = route?.params?.editItem;

  // React State Hooks (useState) managing form inputs
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [categoryId, setCategoryId] = useState('food');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title || '');
      setAmount(editItem.amount ? editItem.amount.toString() : '');
      setType(editItem.type || 'expense');
      setCategoryId(editItem.categoryId || 'food');
      setPaymentMethod(editItem.paymentMethod || 'credit');
      setNotes(editItem.notes || '');
    }
  }, [editItem]);

  const filteredCategories = DEFAULT_CATEGORIES.filter(c => c.type === type || c.type === 'expense');

  // Quick Preset Selection
  const applyPreset = (preset) => {
    setTitle(preset.title);
    setAmount(preset.amount.toString());
    setCategoryId(preset.categoryId);
    setPaymentMethod(preset.paymentMethod || 'credit');
    setType('expense');
  };

  // Validation & Save Handler
  const handleSave = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title / Merchant is required';
    }
    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount > 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      categoryId,
      paymentMethod,
      notes: notes.trim(),
    };

    if (editItem) {
      updateTransaction(editItem.id, payload);
    } else {
      addTransaction(payload);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {editItem ? 'Edit Record' : 'Log New Transaction'}
          </Text>
          <TouchableOpacity
            style={[styles.saveHeaderBtn, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveHeaderBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Type Toggle Switcher */}
          <View style={[styles.typeSwitcher, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === 'expense' && { backgroundColor: colors.expense }
              ]}
              onPress={() => {
                setType('expense');
                if (categoryId === 'salary' || categoryId === 'freelance' || categoryId === 'investment') {
                  setCategoryId('food');
                }
              }}
            >
              <Ionicons name="arrow-up-circle-outline" size={18} color={type === 'expense' ? '#FFF' : colors.textSecondary} />
              <Text style={[styles.typeBtnText, { color: type === 'expense' ? '#FFF' : colors.textSecondary }]}>
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === 'income' && { backgroundColor: colors.income }
              ]}
              onPress={() => {
                setType('income');
                setCategoryId('salary');
              }}
            >
              <Ionicons name="arrow-down-circle-outline" size={18} color={type === 'income' ? '#FFF' : colors.textSecondary} />
              <Text style={[styles.typeBtnText, { color: type === 'income' ? '#FFF' : colors.textSecondary }]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Big Amount Input */}
          <View style={[styles.amountCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Transaction Amount</Text>
            <View style={styles.amountInputRow}>
              <Text style={[styles.currencyPrefix, { color: type === 'expense' ? colors.expense : colors.income }]}>
                {currency}
              </Text>
              <TextInput
                style={[styles.amountInput, { color: colors.textPrimary }]}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={(val) => {
                  setAmount(val);
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                autoFocus={!editItem}
              />
            </View>
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>

          {/* Title Input */}
          <View style={styles.formGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Title / Merchant / Description</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: errors.title ? colors.expense : colors.surfaceBorder }]}>
              <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary }]}
                placeholder="e.g. Starbucks Coffee, Supermarket, Rent"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(val) => {
                  setTitle(val);
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
              />
            </View>
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Quick Presets Shortcuts */}
          {type === 'expense' && !editItem && (
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Quick Presets</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {QUICK_PRESETS.map((preset, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.presetChip, { backgroundColor: colors.surfaceLight, borderColor: colors.surfaceBorder }]}
                    onPress={() => applyPreset(preset)}
                  >
                    <Text style={[styles.presetChipText, { color: colors.textPrimary }]}>{preset.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Category Selector */}
          <View style={styles.formGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Category</Text>
            <View style={styles.categoryGrid}>
              {filteredCategories.map(cat => {
                const isSelected = categoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: isSelected ? cat.bg : colors.surface,
                        borderColor: isSelected ? cat.color : colors.surfaceBorder,
                      }
                    ]}
                    onPress={() => setCategoryId(cat.id)}
                  >
                    <View style={[styles.catIconCircle, { backgroundColor: cat.color }]}>
                      <Ionicons name={cat.icon} size={16} color="#FFFFFF" />
                    </View>
                    <Text
                      style={[
                        styles.catName,
                        { color: isSelected ? colors.textPrimary : colors.textSecondary, fontWeight: isSelected ? '700' : '500' }
                      ]}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Payment Method Selector */}
          <View style={styles.formGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Payment Method</Text>
            <View style={styles.paymentRow}>
              {PAYMENT_METHODS.map(pm => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <TouchableOpacity
                    key={pm.id}
                    style={[
                      styles.pmChip,
                      {
                        backgroundColor: isSelected ? colors.secondary : colors.surface,
                        borderColor: isSelected ? colors.secondary : colors.surfaceBorder,
                      }
                    ]}
                    onPress={() => setPaymentMethod(pm.id)}
                  >
                    <Ionicons name={pm.icon} size={14} color={isSelected ? '#FFF' : colors.textSecondary} />
                    <Text style={[styles.pmText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                      {pm.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Additional Notes */}
          <View style={styles.formGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Notes / Memo (Optional)</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, height: 80, alignItems: 'flex-start', paddingTop: 10 }]}>
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary, height: '100%', textAlignVertical: 'top' }]}
                placeholder="Add receipt details, tags, or extra information..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: type === 'expense' ? colors.expense : colors.income }]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-done" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.submitButtonText}>
              {editItem ? 'Save Changes' : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  saveHeaderBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveHeaderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  typeSwitcher: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    marginVertical: 12,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  amountCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: '900',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '900',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#F43F5E',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '31%',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catName: {
    fontSize: 11,
    textAlign: 'center',
  },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pmChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  pmText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  }
});
