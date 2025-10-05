import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Search, Filter, Clock, TrendingUp, Dumbbell, Target, Star, Lock, Download, Eye } from 'lucide-react-native';
import { useLocalization } from '@/hooks/useLocalization';

type PlanCategory = 'all' | 'strength' | 'cardio' | 'flexibility' | 'beginner' | 'intermediate' | 'advanced';
type PlanDuration = 'all' | 'short' | 'medium' | 'long';

interface Plan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  workouts: number;
  rating: number;
  owned?: boolean;
  price?: number;
}

export default function PlansScreen() {
  const [activeTab, setActiveTab] = useState<'browse' | 'my'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory>('all');
  const [selectedDuration, setSelectedDuration] = useState<PlanDuration>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const colorScheme = useColorScheme();
  const { formatCurrency } = useLocalization();
  const isDark = colorScheme === 'dark';

  const allPlans: Plan[] = [
    {
      id: '1',
      title: 'Full Body Strength',
      description: 'Build overall strength with compound movements',
      duration: '8 weeks',
      difficulty: 'Intermediate',
      category: 'strength',
      workouts: 24,
      rating: 4.8,
      owned: true,
    },
    {
      id: '2',
      title: 'Beginner Fitness',
      description: 'Perfect for those starting their fitness journey',
      duration: '4 weeks',
      difficulty: 'Beginner',
      category: 'beginner',
      workouts: 12,
      rating: 4.9,
      price: 29.99,
    },
    {
      id: '3',
      title: 'HIIT Cardio Blast',
      description: 'High-intensity interval training for fat loss',
      duration: '6 weeks',
      difficulty: 'Advanced',
      category: 'cardio',
      workouts: 18,
      rating: 4.7,
      owned: true,
    },
    {
      id: '4',
      title: 'Yoga & Flexibility',
      description: 'Improve flexibility and reduce stress',
      duration: '12 weeks',
      difficulty: 'Beginner',
      category: 'flexibility',
      workouts: 36,
      rating: 4.6,
      price: 39.99,
    },
    {
      id: '5',
      title: 'Advanced Powerlifting',
      description: 'Master the big three lifts',
      duration: '12 weeks',
      difficulty: 'Advanced',
      category: 'strength',
      workouts: 36,
      rating: 4.9,
      price: 49.99,
    },
    {
      id: '6',
      title: 'Running Program',
      description: 'Build endurance and speed',
      duration: '8 weeks',
      difficulty: 'Intermediate',
      category: 'cardio',
      workouts: 24,
      rating: 4.5,
      price: 34.99,
    },
  ];

  const categories = [
    { value: 'all', label: 'All', icon: Target },
    { value: 'strength', label: 'Strength', icon: Dumbbell },
    { value: 'cardio', label: 'Cardio', icon: TrendingUp },
    { value: 'flexibility', label: 'Flexibility', icon: Star },
    { value: 'beginner', label: 'Beginner', icon: Target },
    { value: 'intermediate', label: 'Intermediate', icon: TrendingUp },
    { value: 'advanced', label: 'Advanced', icon: Dumbbell },
  ];

  const durations = [
    { value: 'all', label: 'Any Duration' },
    { value: 'short', label: '1-4 weeks' },
    { value: 'medium', label: '5-8 weeks' },
    { value: 'long', label: '9+ weeks' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  const filterPlans = (plans: Plan[]) => {
    return plans.filter(plan => {
      const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plan.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             plan.category === selectedCategory ||
                             plan.difficulty.toLowerCase() === selectedCategory;
      
      const matchesDifficulty = selectedDifficulty === 'all' || plan.difficulty === selectedDifficulty;
      
      let matchesDuration = true;
      if (selectedDuration !== 'all') {
        const weeks = parseInt(plan.duration);
        if (selectedDuration === 'short') matchesDuration = weeks <= 4;
        else if (selectedDuration === 'medium') matchesDuration = weeks >= 5 && weeks <= 8;
        else if (selectedDuration === 'long') matchesDuration = weeks >= 9;
      }

      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
    });
  };

  const browsePlans = filterPlans(allPlans);
  const myPlans = allPlans.filter(plan => plan.owned);

  const handleViewPlan = (plan: Plan) => {
    if (plan.owned) {
      Alert.alert(
        plan.title,
        `View plan details and workouts.\n\nDuration: ${plan.duration}\nWorkouts: ${plan.workouts}\nDifficulty: ${plan.difficulty}`,
        [
          { text: 'Close', style: 'cancel' },
          { 
            text: 'Download PDF', 
            onPress: () => handleDownloadPDF(plan)
          },
        ]
      );
    } else {
      Alert.alert(
        'Purchase Required',
        `This plan costs ${formatCurrency(plan.price)}. Would you like to purchase it?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => handlePurchase(plan) },
        ]
      );
    }
  };

  const handleDownloadPDF = (plan: Plan) => {
    Alert.alert('Download PDF', `PDF download for "${plan.title}" will be available soon!`);
  };

  const handlePurchase = (plan: Plan) => {
    Alert.alert('Purchase', `Payment integration for "${plan.title}" will be added soon!`);
  };

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <TouchableOpacity 
      style={[styles.planCard, isDark && styles.planCardDark]}
      onPress={() => handleViewPlan(plan)}>
      <View style={styles.planHeader}>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>{plan.difficulty}</Text>
        </View>
        <View style={styles.planHeaderRight}>
          {!plan.owned && plan.price && (
            <View style={styles.priceTag}>
              <Lock size={12} color="#f59e0b" />
              <Text style={styles.priceText}>{formatCurrency(plan.price)}</Text>
            </View>
          )}
          <View style={styles.ratingContainer}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <Text style={[styles.ratingText, isDark && styles.textDark]}>{plan.rating}</Text>
          </View>
        </View>
      </View>
      
      <Text style={[styles.planTitle, isDark && styles.textDark]}>{plan.title}</Text>
      <Text style={[styles.planDescription, isDark && styles.textSecondaryDark]}>{plan.description}</Text>
      
      <View style={styles.planFooter}>
        <View style={styles.planStat}>
          <Clock size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text style={[styles.planStatText, isDark && styles.textSecondaryDark]}>{plan.duration}</Text>
        </View>
        <View style={styles.planStat}>
          <Dumbbell size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text style={[styles.planStatText, isDark && styles.textSecondaryDark]}>{plan.workouts} workouts</Text>
        </View>
      </View>

      <View style={styles.planActions}>
        {plan.owned ? (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => handleViewPlan(plan)}>
              <Eye size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>View Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.downloadButton]}
              onPress={() => handleDownloadPDF(plan)}>
              <Download size={16} color="#10b981" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.purchaseButton]}
            onPress={() => handlePurchase(plan)}>
            <Lock size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>Purchase {formatCurrency(plan.price)}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View>
          <Text style={[styles.title, isDark && styles.textDark]}>Training Plans</Text>
          <Text style={[styles.subtitle, isDark && styles.textSecondaryDark]}>Find your perfect workout program</Text>
        </View>
      </View>

      <View style={[styles.tabContainer, isDark && styles.tabContainerDark]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.tabActive]}
          onPress={() => setActiveTab('browse')}>
          <Text style={[styles.tabText, activeTab === 'browse' && styles.tabTextActive]}>
            Browse Plans
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.tabActive]}
          onPress={() => setActiveTab('my')}>
          <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
            My Plans ({myPlans.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'browse' && (
        <>
          <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
            <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
              <Search size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              <TextInput
                style={[styles.searchInput, isDark && styles.searchInputDark]}
                placeholder="Search plans..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              />
            </View>
            <TouchableOpacity 
              style={[styles.filterButton, showFilters && styles.filterButtonActive, isDark && styles.filterButtonDark]}
              onPress={() => setShowFilters(!showFilters)}>
              <Filter size={20} color={showFilters ? '#ffffff' : (isDark ? '#f9fafb' : '#111827')} />
            </TouchableOpacity>
          </View>

          {showFilters && (
            <View style={[styles.filtersContainer, isDark && styles.filtersContainerDark]}>
              <Text style={[styles.filterLabel, isDark && styles.textDark]}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.filterChip,
                      selectedCategory === cat.value && styles.filterChipActive,
                      isDark && styles.filterChipDark,
                    ]}
                    onPress={() => setSelectedCategory(cat.value as PlanCategory)}>
                    <cat.icon size={16} color={selectedCategory === cat.value ? '#ffffff' : (isDark ? '#9ca3af' : '#6b7280')} />
                    <Text style={[
                      styles.filterChipText,
                      selectedCategory === cat.value && styles.filterChipTextActive,
                      isDark && styles.textDark,
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.filterLabel, isDark && styles.textDark]}>Duration</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {durations.map((dur) => (
                  <TouchableOpacity
                    key={dur.value}
                    style={[
                      styles.filterChip,
                      selectedDuration === dur.value && styles.filterChipActive,
                      isDark && styles.filterChipDark,
                    ]}
                    onPress={() => setSelectedDuration(dur.value as PlanDuration)}>
                    <Text style={[
                      styles.filterChipText,
                      selectedDuration === dur.value && styles.filterChipTextActive,
                      isDark && styles.textDark,
                    ]}>
                      {dur.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.filterLabel, isDark && styles.textDark]}>Difficulty</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {difficulties.map((diff) => (
                  <TouchableOpacity
                    key={diff.value}
                    style={[
                      styles.filterChip,
                      selectedDifficulty === diff.value && styles.filterChipActive,
                      isDark && styles.filterChipDark,
                    ]}
                    onPress={() => setSelectedDifficulty(diff.value as any)}>
                    <Text style={[
                      styles.filterChipText,
                      selectedDifficulty === diff.value && styles.filterChipTextActive,
                      isDark && styles.textDark,
                    ]}>
                      {diff.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {activeTab === 'browse' ? (
            browsePlans.length > 0 ? (
              browsePlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, isDark && styles.textSecondaryDark]}>
                  No plans match your filters
                </Text>
              </View>
            )
          ) : (
            myPlans.length > 0 ? (
              myPlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, isDark && styles.textSecondaryDark]}>
                  You haven't purchased any plans yet
                </Text>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerDark: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
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
  textDark: {
    color: '#f9fafb',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  tabContainerDark: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
  },
  tabActive: {
    backgroundColor: '#10b981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainerDark: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchBarDark: {
    backgroundColor: '#111827',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  searchInputDark: {
    color: '#f9fafb',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonDark: {
    backgroundColor: '#111827',
  },
  filterButtonActive: {
    backgroundColor: '#10b981',
  },
  filtersContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersContainerDark: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    marginTop: 8,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    marginRight: 8,
    gap: 6,
  },
  filterChipDark: {
    backgroundColor: '#111827',
  },
  filterChipActive: {
    backgroundColor: '#10b981',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  planCardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planBadge: {
    backgroundColor: '#dbeafe',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  planFooter: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  planStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planStatText: {
    fontSize: 13,
    color: '#6b7280',
  },
  planActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  viewButton: {
    backgroundColor: '#10b981',
  },
  downloadButton: {
    backgroundColor: '#d1fae5',
    flex: 0,
    paddingHorizontal: 12,
  },
  purchaseButton: {
    backgroundColor: '#f59e0b',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});
