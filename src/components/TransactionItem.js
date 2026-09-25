import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from '../constants/categories';

export default function TransactionItem({ item, onPress, onDelete }) {
  const { colors, formatAmount } = useApp();

  const category = DEFAULT_CATEGORIES.find(c => c.id === item.categoryId) || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1];
  const paymentMethod = PAYMENT_METHODS.find(p => p.id === item.paymentMethod);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();
    if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isIncome = item.type === 'income';

  const handleDeletePrompt = () => {
    if (onDelete) {
      onDelete(item.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.bg || colors.surfaceLight }]}>
        <Ionicons name={category.icon || 'card'} size={22} color={category.color || colors.primary} />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.titleText, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {formatDate(item.date)}
          </Text>
          {paymentMethod && (
            <View style={[styles.tag, { backgroundColor: colors.surfaceLight }]}>
              <Text style={[styles.tagText, { color: colors.textMuted }]}>
                {paymentMethod.name}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[
          styles.amountText,
          { color: isIncome ? colors.income : colors.textPrimary }
        ]}>
          {isIncome ? '+' : '-'}{formatAmount(item.amount)}
        </Text>
        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={handleDeletePrompt}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailsContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
  },
  deleteBtn: {
    marginTop: 4,
    padding: 2,
  }
});
