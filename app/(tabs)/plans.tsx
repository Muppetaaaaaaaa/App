import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Search, Clock, TrendingUp, Zap, Target, Calendar } from 'lucide-react-native';

export default function PlansScreen() {
  const [activeTab, setActiveTab] = useState<'my' | 'browse'>('my');
  const [searchQuery, setSearchQuery] = useState('');

  const myPlans = [
    { id: 1, name: 'Strength Builder', duration: '8 weeks', progress: 65, type: 'Strength' },
    { id: 2, name: 'Cardio Blast', duration: '4 weeks', progress: 30, type: 'Cardio' },
  ];

  const browsePlans = [
    { id: 1, name: 'Full Body Transformation', duration: '12 weeks', price: 49.99, rating: 4.8, type: 'Strength' },
    { id: 2, name: 'HIIT Master', duration: '6 weeks', price: 29.99, rating: 4.9, type: 'Cardio' },
    { id: 3, name: 'Lean & Toned', duration: '8 weeks', price: 39.99, rating: 4.7, type: 'Mixed' },
    { id: 4, name: 'Powerlifting Pro', duration: '16 weeks', price: 59.99, rating: 4.9, type: 'Strength' },
    { id: 5, name: 'Endurance Builder', duration: '10 weeks', price: 34.99, rating: 4.6, type: 'Cardio' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Strength':
        return <Target size={16} color="#10b981" />;
      case 'Cardio':
        return <Zap size={16} color="#f59e0b" />;
      default:
        return <TrendingUp size={16} color="#8b5cf6" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Plans</Text>
        <Text style={styles.subtitle}>Choose your fitness journey</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}>
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            My Plans
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => setActiveTab('browse')}>
          <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>
            Browse Plans
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'browse' && (
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search plans..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'my' ? (
          <View style={styles.plansContainer}>
            {myPlans.length > 0 ? (
              myPlans.map((plan) => (
                <TouchableOpacity key={plan.id} style={styles.planCard}>
                  <View style={styles.planHeader}>
                    <View style={styles.planTitleRow}>
                      {getTypeIcon(plan.type)}
                      <Text style={styles.planName}>{plan.name}</Text>
                    </View>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{plan.type}</Text>
                    </View>
                  </View>
                  <View style={styles.planInfo}>
                    <View style={styles.infoRow}>
                      <Clock size={14} color="#6b7280" />
                      <Text style={styles.infoText}>{plan.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${plan.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{plan.progress}% complete</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Calendar size={48} color="#d1d5db" />
                <Text style={styles.emptyText}>No active plans</Text>
                <Text style={styles.emptySubtext}>Browse and start a new plan to begin your journey</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {browsePlans.map((plan) => (
              <TouchableOpacity key={plan.id} style={styles.browsePlanCard}>
                <View style={styles.planHeader}>
                  <View style={styles.planTitleRow}>
                    {getTypeIcon(plan.type)}
                    <Text style={styles.planName}>{plan.name}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{plan.type}</Text>
                  </View>
                </View>
                <View style={styles.planInfo}>
                  <View style={styles.infoRow}>
                    <Clock size={14} color="#6b7280" />
                    <Text style={styles.infoText}>{plan.duration}</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>⭐ {plan.rating}</Text>
                  </View>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${plan.price}</Text>
                  <TouchableOpacity style={styles.purchaseButton}>
                    <Text style={styles.purchaseButtonText}>Get Plan</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeTab: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  plansContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  browsePlanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  badge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  planInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
  },
  purchaseButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  purchaseButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
