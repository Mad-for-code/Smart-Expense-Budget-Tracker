import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useApp } from '../context/AppContext';

export default function SpendingBarChart() {
  const { transactions, colors, currency } = useApp();

  // Compute last 7 days spending
  const getLast7DaysData = () => {
    const days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Sum expenses for this date
      const total = transactions
        .filter(t => {
          if (t.type !== 'expense') return false;
          const tDateStr = new Date(t.date).toISOString().split('T')[0];
          return tDateStr === dateStr;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const dayName = i === 0 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' });
      days.push({ dayName, dateStr, total });
    }

    return days;
  };

  const chartData = getLast7DaysData();
  const maxExpense = Math.max(...chartData.map(d => d.total), 50);

  const containerHeight = 140;
  const barWidth = 24;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>7-Day Spending Trend</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Daily Expenses</Text>
      </View>

      <View style={styles.chartArea}>
        {chartData.map((item, index) => {
          const barHeight = maxExpense > 0 ? (item.total / maxExpense) * (containerHeight - 30) : 4;
          const displayHeight = Math.max(barHeight, 4);
          const isToday = index === 6;

          return (
            <View key={item.dateStr || index} style={styles.barColumn}>
              <Text style={[styles.barValueText, { color: colors.textMuted }]}>
                {item.total > 0 ? `${currency}${Math.round(item.total)}` : ''}
              </Text>
              
              <View style={[styles.barTrack, { height: containerHeight - 30 }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: displayHeight,
                      backgroundColor: isToday ? colors.primary : colors.secondary,
                      borderRadius: 6,
                    }
                  ]}
                />
              </View>

              <Text style={[
                styles.dayLabel, 
                { color: isToday ? colors.primary : colors.textSecondary, fontWeight: isToday ? '800' : '600' }
              ]}>
                {item.dayName}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValueText: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 4,
    height: 12,
  },
  barTrack: {
    justifyContent: 'flex-end',
    width: 24,
  },
  barFill: {
    width: '100%',
  },
  dayLabel: {
    fontSize: 11,
    marginTop: 8,
  }
});
