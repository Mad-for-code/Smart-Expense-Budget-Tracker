import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES } from '../constants/categories';

export default function CategoryPieChart() {
  const { categoryTotals, monthlyExpense, formatAmount, colors } = useApp();

  // Filter categories with > 0 spending
  const activeCategories = DEFAULT_CATEGORIES
    .map(cat => ({
      ...cat,
      total: categoryTotals[cat.id] || 0
    }))
    .filter(cat => cat.total > 0)
    .sort((a, b) => b.total - a.total);

  const grandTotal = activeCategories.reduce((sum, c) => sum + c.total, 0);

  if (grandTotal === 0 || activeCategories.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No expense data to chart yet</Text>
      </View>
    );
  }

  // Calculate SVG pie slice arcs
  const radius = 65;
  const strokeWidth = 24;
  const center = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;
  const slices = activeCategories.map((cat) => {
    const percentage = cat.total / grandTotal;
    const strokeDashoffset = circumference - circumference * percentage;
    const angle = accumulatedAngle;
    accumulatedAngle += percentage * 360;

    return {
      ...cat,
      percentage: Math.round(percentage * 100),
      strokeDasharray: `${circumference * percentage} ${circumference}`,
      rotation: angle,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Category Breakdown</Text>

      <View style={styles.chartWrapper}>
        <View style={styles.svgContainer}>
          <Svg width={center * 2} height={center * 2}>
            <G rotation="-90" origin={`${center}, ${center}`}>
              {slices.map((slice, index) => {
                const strokeDasharray = `${circumference * (slice.total / grandTotal)} ${circumference}`;
                // Calculate rotation offset for cumulative rendering
                let prevRotation = 0;
                for (let i = 0; i < index; i++) {
                  prevRotation += (slices[i].total / grandTotal) * 360;
                }

                return (
                  <Circle
                    key={slice.id}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={slice.color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={0}
                    rotation={prevRotation}
                    origin={`${center}, ${center}`}
                  />
                );
              })}
            </G>
          </Svg>
          <View style={styles.donutCenter}>
            <Text style={[styles.donutLabel, { color: colors.textSecondary }]}>Spent</Text>
            <Text style={[styles.donutValue, { color: colors.textPrimary }]}>{formatAmount(grandTotal)}</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {activeCategories.slice(0, 5).map(cat => {
            const pct = Math.round((cat.total / grandTotal) * 100);
            return (
              <View key={cat.id} style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                <Text style={[styles.legendName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {cat.name}
                </Text>
                <Text style={[styles.legendPct, { color: colors.textSecondary }]}>{pct}%</Text>
              </View>
            );
          })}
        </View>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  svgContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  donutValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  legendContainer: {
    flex: 1,
    marginLeft: 20,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  legendPct: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  }
});
