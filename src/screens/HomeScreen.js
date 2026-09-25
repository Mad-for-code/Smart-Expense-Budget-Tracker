import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import { DEFAULT_CATEGORIES } from '../constants/categories';

export default function HomeScreen({ navigation }) {
  const { transactions, deleteTransaction, colors } = useApp();
  
  // React State Hooks for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all'); // 'all' | 'expense' | 'income'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Filter logic
  const filteredTransactions = transactions.filter(t => {
    // Type check
    if (selectedTypeFilter !== 'all' && t.type !== selectedTypeFilter) return false;
    
    // Category check
    if (selectedCategoryFilter !== 'all' && t.categoryId !== selectedCategoryFilter) return false;

    // Search query check
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title ? t.title.toLowerCase().includes(q) : false;
      const matchNotes = t.notes ? t.notes.toLowerCase().includes(q) : false;
      const matchAmount = t.amount ? t.amount.toString().includes(q) : false;
      return matchTitle || matchNotes || matchAmount;
    }

    return true;
  });

  const handleAddPress = () => {
    navigation.navigate('AddExpense');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header title="Smart Expenses" subtitle="Dashboard" />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            item={item}
            onDelete={deleteTransaction}
            onPress={(tx) => {
              // Open edit screen
              navigation.navigate('AddExpense', { editItem: tx });
            }}
          />
        )}
        ListHeaderComponent={
          <View>
            <SummaryCard onAddPress={handleAddPress} />

            {/* Search and Filters Section */}
            <View style={styles.filterSection}>
              {/* Search Bar */}
              <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.textPrimary }]}
                  placeholder="Search expenses, income, notes..."
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Type Filters (All, Expenses, Income) */}
              <View style={styles.typeFilterRow}>
                {['all', 'expense', 'income'].map((type) => {
                  const isActive = selectedTypeFilter === type;
                  let label = 'All';
                  if (type === 'expense') label = '💸 Expenses';
                  if (type === 'income') label = '💰 Income';

                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isActive ? colors.primary : colors.surface,
                          borderColor: isActive ? colors.primary : colors.surfaceBorder,
                        }
                      ]}
                      onPress={() => setSelectedTypeFilter(type)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          { color: isActive ? '#FFFFFF' : colors.textSecondary, fontWeight: isActive ? '700' : '600' }
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Category Horizontal Pills */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categoryPillsScroll}
              >
                <TouchableOpacity
                  style={[
                    styles.catPill,
                    {
                      backgroundColor: selectedCategoryFilter === 'all' ? colors.secondary : colors.surface,
                      borderColor: selectedCategoryFilter === 'all' ? colors.secondary : colors.surfaceBorder,
                    }
                  ]}
                  onPress={() => setSelectedCategoryFilter('all')}
                >
                  <Text style={[styles.catPillText, { color: selectedCategoryFilter === 'all' ? '#FFF' : colors.textSecondary }]}>
                    All Categories
                  </Text>
                </TouchableOpacity>

                {DEFAULT_CATEGORIES.map(cat => {
                  const isActive = selectedCategoryFilter === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catPill,
                        {
                          backgroundColor: isActive ? cat.color : colors.surface,
                          borderColor: isActive ? cat.color : colors.surfaceBorder,
                        }
                      ]}
                      onPress={() => setSelectedCategoryFilter(cat.id)}
                    >
                      <Ionicons name={cat.icon} size={14} color={isActive ? '#FFF' : cat.color} style={{ marginRight: 6 }} />
                      <Text style={[styles.catPillText, { color: isActive ? '#FFF' : colors.textPrimary }]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Recent Activity ({filteredTransactions.length})
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBg, { backgroundColor: colors.surfaceLight }]}>
              <Ionicons name="receipt-outline" size={40} color={colors.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No transactions found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {searchQuery || selectedCategoryFilter !== 'all' || selectedTypeFilter !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'Tap "+ Add" to log your first income or expense item!'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  filterSection: {
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  typeFilterRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipText: {
    fontSize: 12,
  },
  categoryPillsScroll: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 12,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyIconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  }
});
