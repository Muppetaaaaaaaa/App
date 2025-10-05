import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Plus, Target, Flame, TrendingUp, X, ScanBarcode, Search, Trash2 } from 'lucide-react-native';
import BarcodeScanner from '@/components/BarcodeScanner';
import CalorieGoalCalculator from '@/components/CalorieGoalCalculator';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
}

export default function CaloriesScreen() {
  const [showScanner, setShowScanner] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: '1',
      name: 'Oatmeal with Berries',
      calories: 320,
      protein: 12,
      carbs: 54,
      fat: 8,
      meal: 'breakfast',
      time: '08:30',
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      calories: 450,
      protein: 42,
      carbs: 28,
      fat: 16,
      meal: 'lunch',
      time: '12:45',
    },
  ]);

  const [manualFood, setManualFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
  });

  const [calorieGoal] = useState(2400);

  const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = foodItems.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = foodItems.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = foodItems.reduce((sum, item) => sum + item.fat, 0);

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
    return foodItems.filter(item => item.meal === meal);
  };

  const getMealCalories = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    return getMealItems(meal).reduce((sum, item) => sum + item.calories, 0);
  };

  const MealSection = ({ meal, title }: { meal: 'breakfast' | 'lunch' | 'dinner' | 'snack', title: string }) => {
    const items = getMealItems(meal);
    const calories = getMealCalories(meal);

    return (
      <View style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>{title}</Text>
          <Text style={styles.mealCalories}>{calories} cal</Text>
        </View>
        {items.length > 0 ? (
          items.map((item) => (
            <View key={item.id} style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDetails}>
                  {item.calories} cal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                </Text>
                <Text style={styles.foodTime}>{item.time}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMeal}>No items logged</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calories</Text>
        <Text style={styles.subtitle}>Track your daily nutrition</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.summaryCard}>
            <View style={styles.calorieProgress}>
              <View style={styles.calorieHeader}>
                <Flame size={24} color="#f59e0b" />
                <Text style={styles.calorieCount}>{totalCalories}</Text>
                <Text style={styles.calorieLabel}>/ {calorieGoal} cal</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }]} />
              </View>
              <TouchableOpacity style={styles.goalButton} onPress={() => setShowCalculator(true)}>
                <Target size={16} color="#10b981" />
                <Text style={styles.goalButtonText}>Adjust Goal</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.macrosCard}>
            <Text style={styles.cardTitle}>Macronutrients</Text>
            <View style={styles.macrosGrid}>
              <View style={styles.macroItem}>
                <View style={[styles.macroCircle, { backgroundColor: '#fef3c7' }]}>
                  <Text style={styles.macroValue}>{totalProtein}g</Text>
                </View>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroCircle, { backgroundColor: '#dbeafe' }]}>
                  <Text style={styles.macroValue}>{totalCarbs}g</Text>
                </View>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroCircle, { backgroundColor: '#fce7f3' }]}>
                  <Text style={styles.macroValue}>{totalFat}g</Text>
                </View>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowScanner(true)}>
              <ScanBarcode size={24} color="#10b981" />
              <Text style={styles.actionButtonText}>Scan Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowManualEntry(true)}>
              <Plus size={24} color="#10b981" />
              <Text style={styles.actionButtonText}>Add Food</Text>
            </TouchableOpacity>
          </View>

          <MealSection meal="breakfast" title="Breakfast" />
          <MealSection meal="lunch" title="Lunch" />
          <MealSection meal="dinner" title="Dinner" />
          <MealSection meal="snack" title="Snacks" />
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food</Text>
              <TouchableOpacity onPress={() => setShowManualEntry(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Food Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Grilled Chicken"
                  value={manualFood.name}
                  onChangeText={(text) => setManualFood({ ...manualFood, name: text })}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Meal</Text>
                <View style={styles.mealSelector}>
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal) => (
                    <TouchableOpacity
                      key={meal}
                      style={[
                        styles.mealOption,
                        manualFood.meal === meal && styles.mealOptionActive,
                      ]}
                      onPress={() => setManualFood({ ...manualFood, meal })}>
                      <Text
                        style={[
                          styles.mealOptionText,
                          manualFood.meal === meal && styles.mealOptionTextActive,
                        ]}>
                        {meal.charAt(0).toUpperCase() + meal.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Calories</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={manualFood.calories}
                  onChangeText={(text) => setManualFood({ ...manualFood, calories: text })}
                  keyboardType="number-pad"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.smallInput]}>
                  <Text style={styles.label}>Protein (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={manualFood.protein}
                    onChangeText={(text) => setManualFood({ ...manualFood, protein: text })}
                    keyboardType="number-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={[styles.inputGroup, styles.smallInput]}>
                  <Text style={styles.label}>Carbs (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={manualFood.carbs}
                    onChangeText={(text) => setManualFood({ ...manualFood, carbs: text })}
                    keyboardType="number-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={[styles.inputGroup, styles.smallInput]}>
                  <Text style={styles.label}>Fat (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={manualFood.fat}
                    onChangeText={(text) => setManualFood({ ...manualFood, fat: text })}
                    keyboardType="number-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.saveButton, (!manualFood.name || !manualFood.calories) && styles.saveButtonDisabled]}
                onPress={addManualFood}
                disabled={!manualFood.name || !manualFood.calories}>
                <Text style={styles.saveButtonText}>Add Food</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showCalculator && (
        <CalorieGoalCalculator onClose={() => setShowCalculator(false)} />
      )}
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
    gap: 8,
  },
  macroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  macroLabel: {
    fontSize: 14,
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
