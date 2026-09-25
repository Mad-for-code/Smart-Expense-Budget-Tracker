import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { CURRENCIES } from '../constants/theme';

export default function SettingsScreen() {
  const {
    currency,
    setCurrency,
    themeMode,
    toggleTheme,
    resetToSampleData,
    clearAllData,
    transactions,
    colors
  } = useApp();

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState('');

  // Generate CSV data string
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      Alert.alert('No Data', 'There are no transactions to export.');
      return;
    }

    const headers = 'ID,Title,Amount,Type,Category,PaymentMethod,Date,Notes\n';
    const rows = transactions.map(t => {
      const title = `"${(t.title || '').replace(/"/g, '""')}"`;
      const notes = `"${(t.notes || '').replace(/"/g, '""')}"`;
      const date = new Date(t.date).toISOString();
      return `${t.id},${title},${t.amount},${t.type},${t.categoryId},${t.paymentMethod || ''},${date},${notes}`;
    }).join('\n');

    setCsvText(headers + rows);
    setShowCsvModal(true);
  };

  const handleResetConfirm = () => {
    Alert.alert(
      'Restore Sample Data?',
      'This will replace your current records with demo data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', style: 'destructive', onPress: () => resetToSampleData() }
      ]
    );
  };

  const handleClearConfirm = () => {
    Alert.alert(
      'Clear All Data?',
      'This will erase all your transaction logs and custom budgets permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Everything', style: 'destructive', onPress: () => clearAllData() }
      ]
    );
  };

  const currentCurrencyObj = CURRENCIES.find(c => c.symbol === currency) || CURRENCIES[0];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header title="Settings & Backup" subtitle="Preferences" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Preference Group */}
        <View style={styles.groupHeader}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>App Appearance & Units</Text>
        </View>

        <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          {/* Dark Mode Toggle */}
          <View style={[styles.settingRow, { borderBottomColor: colors.surfaceBorder }]}>
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <Ionicons name="moon-outline" size={18} color={colors.secondary} />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Dark Mode</Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  {themeMode === 'dark' ? 'Sleek dark theme active' : 'Bright light theme active'}
                </Text>
              </View>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Currency Switcher */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowCurrencyModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: colors.primaryGlow }]}>
                <Ionicons name="cash-outline" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Currency Unit</Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  Selected: {currentCurrencyObj.name}
                </Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.currBadge, { color: colors.primary }]}>{currency}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Data & Export Group */}
        <View style={styles.groupHeader}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>Data & Export Tools</Text>
        </View>

        <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          {/* Export CSV */}
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.surfaceBorder }]}
            onPress={handleExportCSV}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <Ionicons name="download-outline" size={18} color={colors.info} />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Export to CSV</Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  Download raw transaction report ({transactions.length} items)
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Seed Sample Data */}
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.surfaceBorder }]}
            onPress={handleResetConfirm}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Ionicons name="refresh-circle-outline" size={18} color={colors.warning} />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Restore Sample Demo Data</Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  Reload initial dataset & budgets
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Clear All Data */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleClearConfirm}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: colors.expenseGlow }]}>
                <Ionicons name="trash-outline" size={18} color={colors.expense} />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: colors.expense }]}>Clear All App Data</Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  Erase transactions and start fresh
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* App Info Footer */}
        <View style={styles.appInfoFooter}>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>Smart Expense Tracker</Text>
          <Text style={[styles.appVersion, { color: colors.textMuted }]}>
            React Native Expo • AsyncStorage Local Storage • Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Currency Modal */}
      <Modal visible={showCurrencyModal} animationType="slide" transparent>
        <View style={[styles.modalBackdrop, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Preferred Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 320 }}>
              {CURRENCIES.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.currencyOption,
                    {
                      backgroundColor: currency === item.symbol ? colors.primaryGlow : 'transparent',
                      borderBottomColor: colors.surfaceBorder,
                    }
                  ]}
                  onPress={() => {
                    setCurrency(item.symbol);
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text style={[styles.currOptionSymbol, { color: colors.primary }]}>{item.symbol}</Text>
                  <Text style={[styles.currOptionName, { color: colors.textPrimary }]}>{item.name}</Text>
                  {currency === item.symbol && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* CSV Export Modal */}
      <Modal visible={showCsvModal} animationType="fade" transparent>
        <View style={[styles.modalBackdrop, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>CSV Export Preview</Text>
              <TouchableOpacity onPress={() => setShowCsvModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={[styles.csvBox, { backgroundColor: colors.background, borderColor: colors.surfaceBorder }]}>
              <Text style={[styles.csvCodeText, { color: colors.textPrimary }]} selectable>
                {csvText}
              </Text>
            </ScrollView>

            <Text style={[styles.csvHint, { color: colors.textSecondary }]}>
              Tip: You can select and copy the CSV text above or save it to your spreadsheets (Excel / Google Sheets).
            </Text>

            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: colors.primary }]}
              onPress={() => setShowCsvModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  groupHeader: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardGroup: {
    borderRadius: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  currBadge: {
    fontSize: 16,
    fontWeight: '800',
  },
  appInfoFooter: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  appName: {
    fontSize: 14,
    fontWeight: '800',
  },
  appVersion: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderBottomWidth: 1,
  },
  currOptionSymbol: {
    fontSize: 18,
    fontWeight: '800',
    width: 40,
  },
  currOptionName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  csvBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 200,
    marginBottom: 12,
  },
  csvCodeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
  },
  csvHint: {
    fontSize: 11,
    marginBottom: 16,
    lineHeight: 16,
  },
  modalCloseBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  }
});
