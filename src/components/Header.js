import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function Header({ title = 'Expense Tracker', subtitle }) {
  const { themeMode, toggleTheme, colors } = useApp();

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
      <View style={styles.titleWrapper}>
        <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
          {subtitle || 'Smart Personal Finance'}
        </Text>
        <Text style={[styles.titleText, { color: colors.textPrimary }]}>
          {title}
        </Text>
      </View>
      <View style={styles.actionsWrapper}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]} 
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={themeMode === 'dark' ? 'sunny' : 'moon'} 
            size={20} 
            color={themeMode === 'dark' ? '#F59E0B' : '#6366F1'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleWrapper: {
    flex: 1,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  actionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  }
});
