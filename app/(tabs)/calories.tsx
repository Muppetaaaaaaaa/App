import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Plus, Target, Flame, TrendingUp, X, ScanBarcode, Search, Trash2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import BarcodeScanner from '@/components/BarcodeScanner';
import CalorieGoalCalculator from '@/components/CalorieGoalCalculator';
import UserOnboarding, { UserProfile } from '@/components/UserOnboarding';
import CircularProgress from '@/components/CircularProgress';
import { useLocalization } from '../../hooks/useLocalization';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  date: string;
}

export default function CaloriesScreen() {
  const [showScanner, setShowScanner] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(150);
  const [carbsGoal, setCarbsGoal] = useState(200);
  const [fatGoal, setFatGoal] = useState(65);
  const [showGoalPrompt, setShowGoalPrompt] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useLocalization();

  const [manualFood, setManualFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
  });

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboarding_completed');
      if (!completed && calorieGoal === 0 && showGoalPrompt) {
        setTimeout(() => {
          Alert.alert(
            'Welcome to BetterU!',
            'Let\'s set up your profile to calculate your personalized calorie and macro goals.',
            [
              { text: 'Skip', style: 'cancel', onPress: () => setShowGoalPrompt(false) },
              { text: 'Get Started', onPress: () => setShowOnboarding(true) },
            ]
          );
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
    }
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    try {
      setCalorieGoal(profile.calorieGoal);
      setProteinGoal(profile.proteinGoal);
      setCarbsGoal(profile.carbsGoal);
      setFatGoal(profile.fatGoal);
      
      // Save profile data
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      await AsyncStorage.setItem('onboarding_completed', 'true');
      await AsyncStorage.setItem('calorie_goal', profile.calorieGoal.toString());
      await AsyncStorage.setItem('protein_goal', profile.proteinGoal.toString());
      await AsyncStorage.setItem('carbs_goal', profile.carbsGoal.toString());
      await AsyncStorage.setItem('fat_goal', profile.fatGoal.toString());
      
      setHasCompletedOnboarding(true);
      setShowOnboarding(false);
      
      Alert.alert(
        'Profile Complete!',
        `Your daily goals:\n\nCalories: ${profile.calorieGoal}\nProtein: ${profile.proteinGoal}g\nCarbs: ${profile.carbsGoal}g\nFat: ${profile.fatGoal}g`,
        [{ text: 'Got it!' }]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const todaysFoodItems = foodItems.filter(item => item.date === selectedDate);
  const totalCalories = todaysFoodItems.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = todaysFoodItems.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = todaysFoodItems.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = todaysFoodItems.reduce((sum, item) => sum + item.fat, 0);

  const handleBarcodeScan = (data: any) => {
    setShowScanner(false);
    if (data) {
      const newItem: FoodItem = {
        id: Date.now().toString(),
        name: data.product_name || 'Unknown Product',
        calories: Math.round(data.nutriments?.['energy-kcal'] || 0),
        protein: Math.round(data.nutriments?.proteins || 0),
        carbs: Math.round(data.nutriments?.carbohydrates || 0),
        fat: Math.round(data.nutriments?.fat || 0),
        meal: 'snack',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        date: selectedDate,
      };
      setFoodItems([...foodItems, newItem]);
    }
  };

  const addManualFood = () => {
    if (manualFood.name && manualFood.calories) {
      const newItem: FoodItem = {
        id: Date.now().toString(),
        name: manualFood.name,
        calories: parseInt(manualFood.calories),
        protein: parseInt(manualFood.protein) || 0,
        carbs: parseInt(manualFood.carbs) || 0,
        fat: parseInt(manualFood.fat) || 0,
        meal: manualFood.meal,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        date: selectedDate,
      };
      setFoodItems([...foodItems, newItem]);
      setManualFood({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        meal: 'breakfast',
      });
      setShowManualEntry(false);
    }
  };

  const removeItem = (id: string) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  const getMealItems = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    return todaysFoodItems.filter(item => item.meal === meal);
  };

  const getMealCalories = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    return getMealItems(meal).reduce((sum, item) => sum + item.calories, 0);
  };

  const changeDate = (days: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) return t('today');
    if (dateString === yesterday.toISOString().split('T')[0]) return t('yesterday');
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const MealSection = ({ meal, title }: { meal: 'breakfast' | 'lunch' | 'dinner' | 'snack', title: string }) => {
    const items = getMealItems(meal);
    const calories = getMealCalories(meal);

    return (
      <View style={[styles.mealSection, isDark && styles.mealSectionDark]}>
        <View style={styles.mealHeader}>
          <Text style={[styles.mealTitle, isDark && styles.textDark]}>{title}</Text>
          <Text style={styles.mealCalories}>{calories} {t('calories_lower')}</Text>
        </View>
        {items.length > 0 ? (
          items.map((item) => (
            <View key={item.id} style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={[styles.foodName, isDark && styles.textDark]}>{item.name}</Text>
                <Text style={[styles.foodDetails, isDark && styles.textSecondaryDark]}>
                  {item.calories} {t('calories_lower')} • {t('protein')}: {item.protein}g • {t('carbs')}: {item.carbs}g • {t('fats')}: {item.fat}g
                </Text>
                <Text style={[styles.foodTime, isDark && styles.textSecondaryDark]}>{item.time}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyMeal, isDark && styles.textSecondaryDark]}>{t('noMealsLogged')}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View>
          <Text style={[styles.title, isDark && styles.textDark]}>{t('calorieTracker')}</Text>
          <Text style={[styles.subtitle, isDark && styles.textSecondaryDark]}>{t('trackYourNutrition')}</Text>
        </View>
      </View>

      <View style={[styles.dateSelector, isDark && styles.dateSelectorDark]}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateButton}>
          <ChevronLeft size={24} color={isDark ? '#f9fafb' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.dateText, isDark && styles.textDark]}>{formatDate(selectedDate)}</Text>
        <TouchableOpacity 
          onPress={() => changeDate(1)} 
          style={styles.dateButton}
          disabled={isToday}>
          <ChevronRight size={24} color={isToday ? '#d1d5db' : (isDark ? '#f9fafb' : '#111827')} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.summaryCard, isDark && styles.summaryCardDark]}>
            <View style={styles.calorieProgress}>
              <View style={styles.calorieHeader}>
                <Flame size={24} color="#f59e0b" />
                <Text style={[styles.calorieCount, isDark && styles.textDark]}>{totalCalories}</Text>
                <Text style={[styles.calorieLabel, isDark && styles.textSecondaryDark]}>
                  {calorieGoal > 0 ? `/ ${calorieGoal} ${t('calories_lower')}` : t('calories_lower')}
                </Text>
              </View>
              {calorieGoal > 0 && (
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }]} />
                </View>
              )}
              <TouchableOpacity style={styles.goalButton} onPress={() => setShowCalculator(true)}>
                <Target size={16} color="#10b981" />
                <Text style={styles.goalButtonText}>
                  {calorieGoal > 0 ? `${t('edit')} ${t('goal')}` : `${t('dailyGoal')}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.macrosCard, isDark && styles.macrosCardDark]}>
            <Text style={[styles.cardTitle, isDark && styles.textDark]}>Macronutrients</Text>
            <View style={styles.macrosGrid}>
              <View style={styles.macroItem}>
                <CircularProgress
                  size={100}
                  strokeWidth={8}
                  progress={Math.min(totalProtein / proteinGoal, 1)}
                  color="#fbbf24"
                  backgroundColor={isDark ? '#374151' : '#e5e7eb'}>
                  <View style={styles.circularContent}>
                    <Text style={[styles.macroValue, isDark && styles.textDark]}>{totalProtein}g</Text>
                    <Text style={[styles.macroGoal, isDark && styles.textSecondaryDark]}>/ {proteinGoal}g</Text>
                  </View>
                </CircularProgress>
                <Text style={[styles.macroLabel, isDark && styles.textSecondaryDark]}>{t('protein')}</Text>
              </View>
              <View style={styles.macroItem}>
                <CircularProgress
                  size={100}
                  strokeWidth={8}
                  progress={Math.min(totalCarbs / carbsGoal, 1)}
                  color="#60a5fa"
                  backgroundColor={isDark ? '#374151' : '#e5e7eb'}>
                  <View style={styles.circularContent}>
                    <Text style={[styles.macroValue, isDark && styles.textDark]}>{totalCarbs}g</Text>
                    <Text style={[styles.macroGoal, isDark && styles.textSecondaryDark]}>/ {carbsGoal}g</Text>
                  </View>
                </CircularProgress>
                <Text style={[styles.macroLabel, isDark && styles.textSecondaryDark]}>{t('carbs')}</Text>
              </View>
              <View style={styles.macroItem}>
                <CircularProgress
                  size={100}
                  strokeWidth={8}
                  progress={Math.min(totalFat / fatGoal, 1)}
                  color="#f472b6"
                  backgroundColor={isDark ? '#374151' : '#e5e7eb'}>
                  <View style={styles.circularContent}>
                    <Text style={[styles.macroValue, isDark && styles.textDark]}>{totalFat}g</Text>
                    <Text style={[styles.macroGoal, isDark && styles.textSecondaryDark]}>/ {fatGoal}g</Text>
                  </View>
                </CircularProgress>
                <Text style={[styles.macroLabel, isDark && styles.textSecondaryDark]}>{t('fats')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => setShowScanner(true)}>
              <ScanBarcode size={24} color="#10b981" />
              <Text style={styles.actionButtonText}>Scan Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={() => setShowManualEntry(true)}>
              <Plus size={24} color="#10b981" />
              <Text style={styles.actionButtonText}>{t('addMeal')}</Text>
            </TouchableOpacity>
          </View>

          <MealSection meal="breakfast" title={t('breakfast')} />
          <MealSection meal="lunch" title={t('lunch')} />
          <MealSection meal="dinner" title={t('dinner')} />
          <MealSection meal="snack" title={t('snacks')} />
        </View>
      </ScrollView>

      {showScanner && (
        <BarcodeScanner
          onClose={() => setShowScanner(false)}
          onScan={handleBarcodeScan}
        />
      )}

      <Modal
        visible={showManualEntry}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowManualEntry(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.textDark]}>{t('addMeal')}</Text>
              <TouchableOpacity onPress={() => setShowManualEntry(false)}>
                <X size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.textDark]}>{t('name')}</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder="e.g., Grilled Chicken"
                  value={manualFood.name}
                  onChangeText={(text) => setManualFood({ ...manualFood, name: text })}
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.textDark]}>Meal</Text>
                <View style={styles.mealSelector}>
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal) => (
                    <TouchableOpacity
                      key={meal}
                      style={[
                        styles.mealOption,
                        manualFood.meal === meal && styles.mealOptionActive,
                        isDark && styles.mealOptionDark,
                      ]}
                      onPress={() => setManualFood({ ...manualFood, meal })}>
                      <Text
                        style={[
                          styles.mealOptionText,
                          manualFood.meal === meal && styles.mealOptionTextActive,
                          isDark && styles.textDark,
                        ]}>
                        {t(meal)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.textDark]}>{t('calories_lower')}</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder="0"
                  value={manualFood.calories}
                  onChangeText={(text) => setManualFood({ ...manualFood, calories: text })}
                  keyboardType="number-pad"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.smallInput]}>
                  <Text style={[styles.label, isDark && styles.textDark]}>{t('protein')} (g)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    placeholder="0"
                    value={manualFood.protein}
                    onChangeText={(text) => setManualFood({ ...manualFood, protein: text })}
                    keyboardType="number-pad"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                </View>
                <View style={[styles.inputGroup, styles.smallInput]}>
                  <Text style={[styles.label, isDark && styles.textDark]}>{t('carbs')} (g)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    placeholder="0"
                    value={manualFood.carbs}
                    onChangeText={(text) => setManualFood({ ...manualFood, carbs: text })}
                    keyboardType="number-pad"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                </View>
                <View style={[styles.inputGroup, styles.smallInput]}>
                  <Text style={[styles.label, isDark && styles.textDark]}>{t('fats')} (g)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    placeholder="0"
                    value={manualFood.fat}
                    onChangeText={(text) => setManualFood({ ...manualFood, fat: text })}
                    keyboardType="number-pad"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, isDark && styles.modalFooterDark]}>
              <TouchableOpacity
                style={[styles.saveButton, (!manualFood.name || !manualFood.calories) && styles.saveButtonDisabled]}
                onPress={addManualFood}
                disabled={!manualFood.name || !manualFood.calories}>
                <Text style={styles.saveButtonText}>{t('addMeal')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showCalculator && (
        <CalorieGoalCalculator 
          onClose={() => setShowCalculator(false)}
          onSave={(goal) => {
            setCalorieGoal(goal);
            setShowGoalPrompt(false);
          }}
        />
      )}
    
      {showOnboarding && (
        <UserOnboarding
          visible={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />
      )}
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
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dateSelectorDark: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  dateButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryCardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  calorieProgress: {
    gap: 12,
  },
  calorieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calorieCount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  macrosCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  macrosCardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
    gap: 12,
  },
  circularContent: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  macroGoal: {
    fontSize: 11,
    color: '#6b7280',
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  actionButtonDark: {
    backgroundColor: '#1f2937',
    borderColor: '#10b981',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10b981',
  },
  mealSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mealSectionDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f9fafb',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  foodDetails: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  foodTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyMeal: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalContentDark: {
    backgroundColor: '#1f2937',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalScroll: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
    color: '#f9fafb',
  },
  mealSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  mealOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  mealOptionDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
  },
  mealOptionActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  mealOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  mealOptionTextActive: {
    color: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  smallInput: {
    flex: 1,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalFooterDark: {
    borderTopColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
