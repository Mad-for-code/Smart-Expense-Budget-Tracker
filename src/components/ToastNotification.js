import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ToastNotification() {
  const { toastMessage, colors } = useApp();

  if (!toastMessage) return null;

  return (
    <View style={styles.toastWrapper} pointerEvents="none">
      <View style={[styles.toastBox, { backgroundColor: colors.surfaceLight, borderColor: colors.primary }]}>
        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        <Text style={[styles.toastText, { color: colors.textPrimary }]}>
          {toastMessage}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1.5,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '700',
  }
});
