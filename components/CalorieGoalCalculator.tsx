import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, useColorScheme } from 'react-native';
import { useState } from 'react';
import { X, Check, Target } from 'lucide-react-native';

interface CalorieGoalCalculatorProps {
  onClose: () => void;
  onSave?: (goal: number) => void;
}

export default function CalorieGoalCalculator({ onClose, onSave }: CalorieGoalCalculatorProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');
  const [targetWeight, setTargetWeight] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', multiplier: 1.2, description: 'Little or no exercise' },
    { value: 'light', label: 'Light', multiplier: 1.375, description: 'Exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', multiplier: 1.55, description: 'Exercise 3-5 days/week' },
    { value: 'active', label: 'Active', multiplier: 1.725, description: 'Exercise 6-7 days/week' },
    { value: 'very', label: 'Very Active', multiplier: 1.9, description: 'Hard exercise daily' },
  ];

  const calculateCalories = () => {
    if (!age || !weight || !height || !targetWeight || !timeframe) {
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const targetWeightNum = parseFloat(targetWeight);
    const timeframeWeeks = parseInt(timeframe);

    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const activityMultiplier = activityLevels.find(level => level.value === activityLevel)?.multiplier || 1.55;
    const tdee = bmr * activityMultiplier;

    const weightDifference = targetWeightNum - weightNum;
    const totalCaloriesNeeded = weightDifference * 7700;
    const daysInTimeframe = timeframeWeeks * 7;
    const dailyCalorieAdjustment = totalCaloriesNeeded / daysInTimeframe;

    let targetCalories = tdee + dailyCalorieAdjustment;

    if (goal === 'lose') {
      targetCalories = Math.max(targetCalories, 1200);
    } else if (goal === 'gain') {
      targetCalories = Math.min(targetCalories, tdee + 500);
    }

    setCalculatedCalories(Math.round(targetCalories));
  };

  const handleSave = () => {
    if (calculatedCalories && onSave) {
      onSave(calculatedCalories);
    }
    onClose();
  };

  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
          <View style={[styles.modalHeader, isDark && styles.modalHeaderDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>Calorie Goal Calculator</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {!calculatedCalories ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Gender</Text>
                  <View style={styles.genderSelector}>
                    <TouchableOpacity
                      style={[styles.genderOption, gender === 'male' && styles.genderOptionActive, isDark && styles.genderOptionDark]}
                      onPress={() => setGender('male')}>
                      <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive, isDark && styles.textDark]}>
                        Male
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderOption, gender === 'female' && styles.genderOptionActive, isDark && styles.genderOptionDark]}
                      onPress={() => setGender('female')}>
                      <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive, isDark && styles.textDark]}>
                        Female
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.smallInput]}>
                    <Text style={[styles.label, isDark && styles.textDark]}>Age</Text>
                    <TextInput
                      style={[styles.input, isDark && styles.inputDark]}
                      placeholder="25"
                      value={age}
                      onChangeText={setAge}
                      keyboardType="number-pad"
                      placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.smallInput]}>
                    <Text style={[styles.label, isDark && styles.textDark]}>Current Weight (kg)</Text>
                    <TextInput
                      style={[styles.input, isDark && styles.inputDark]}
                      placeholder="70"
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="decimal-pad"
                      placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Height (cm)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    placeholder="175"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="number-pad"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Activity Level</Text>
                  {activityLevels.map((level) => (
                    <TouchableOpacity
                      key={level.value}
                      style={[
                        styles.activityOption,
                        activityLevel === level.value && styles.activityOptionActive,
                        isDark && styles.activityOptionDark,
                      ]}
                      onPress={() => setActivityLevel(level.value)}>
                      <View>
                        <Text
                          style={[
                            styles.activityLabel,
                            activityLevel === level.value && styles.activityLabelActive,
                            isDark && styles.textDark,
                          ]}>
                          {level.label}
                        </Text>
                        <Text style={[styles.activityDescription, isDark && styles.textSecondaryDark]}>{level.description}</Text>
                      </View>
                      {activityLevel === level.value && (
                        <Check size={20} color="#10b981" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Goal</Text>
                  <View style={styles.goalSelector}>
                    <TouchableOpacity
                      style={[styles.goalOption, goal === 'lose' && styles.goalOptionActive, isDark && styles.goalOptionDark]}
                      onPress={() => setGoal('lose')}>
                      <Text style={[styles.goalText, goal === 'lose' && styles.goalTextActive, isDark && styles.textDark]}>
                        Lose Weight
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.goalOption, goal === 'maintain' && styles.goalOptionActive, isDark && styles.goalOptionDark]}
                      onPress={() => setGoal('maintain')}>
                      <Text style={[styles.goalText, goal === 'maintain' && styles.goalTextActive, isDark && styles.textDark]}>
                        Maintain
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.goalOption, goal === 'gain' && styles.goalOptionActive, isDark && styles.goalOptionDark]}
                      onPress={() => setGoal('gain')}>
                      <Text style={[styles.goalText, goal === 'gain' && styles.goalTextActive, isDark && styles.textDark]}>
                        Gain Weight
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.smallInput]}>
                    <Text style={[styles.label, isDark && styles.textDark]}>Target Weight (kg)</Text>
                    <TextInput
                      style={[styles.input, isDark && styles.inputDark]}
                      placeholder="65"
                      value={targetWeight}
                      onChangeText={setTargetWeight}
                      keyboardType="decimal-pad"
                      placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.smallInput]}>
                    <Text style={[styles.label, isDark && styles.textDark]}>Timeframe (weeks)</Text>
                    <TextInput
                      style={[styles.input, isDark && styles.inputDark]}
                      placeholder="12"
                      value={timeframe}
                      onChangeText={setTimeframe}
                      keyboardType="number-pad"
                      placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.calculateButton,
                    (!age || !weight || !height || !targetWeight || !timeframe) && styles.calculateButtonDisabled,
                  ]}
                  onPress={calculateCalories}
                  disabled={!age || !weight || !height || !targetWeight || !timeframe}>
                  <Target size={20} color="#ffffff" />
                  <Text style={styles.calculateButtonText}>Calculate</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.resultContainer}>
                <View style={styles.resultIconContainer}>
                  <Target size={48} color="#10b981" />
                </View>
                <Text style={[styles.resultTitle, isDark && styles.textDark]}>Your Daily Calorie Goal</Text>
                <Text style={styles.resultCalories}>{calculatedCalories}</Text>
                <Text style={[styles.resultLabel, isDark && styles.textSecondaryDark]}>calories per day</Text>

                <View style={[styles.resultCard, isDark && styles.resultCardDark]}>
                  <Text style={[styles.resultCardTitle, isDark && styles.textDark]}>Based on your goals:</Text>
                  <View style={styles.resultRow}>
                    <Text style={[styles.resultRowLabel, isDark && styles.textSecondaryDark]}>Current Weight:</Text>
                    <Text style={[styles.resultRowValue, isDark && styles.textDark]}>{weight} kg</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={[styles.resultRowLabel, isDark && styles.textSecondaryDark]}>Target Weight:</Text>
                    <Text style={[styles.resultRowValue, isDark && styles.textDark]}>{targetWeight} kg</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={[styles.resultRowLabel, isDark && styles.textSecondaryDark]}>Timeframe:</Text>
                    <Text style={[styles.resultRowValue, isDark && styles.textDark]}>{timeframe} weeks</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={[styles.resultRowLabel, isDark && styles.textSecondaryDark]}>Weekly Change:</Text>
                    <Text style={[styles.resultRowValue, isDark && styles.textDark]}>
                      {((parseFloat(targetWeight) - parseFloat(weight)) / parseInt(timeframe)).toFixed(2)} kg/week
                    </Text>
                  </View>
                </View>

                <View style={[styles.infoBox, isDark && styles.infoBoxDark]}>
                  <Text style={[styles.infoText, isDark && styles.textDark]}>
                    This is an estimated average. Actual calorie needs may vary based on metabolism, genetics, and other factors.
                    Consult with a healthcare professional for personalized advice.
                  </Text>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Goal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.resetButton, isDark && styles.resetButtonDark]} onPress={() => setCalculatedCalories(null)}>
                  <Text style={[styles.resetButtonText, isDark && styles.textSecondaryDark]}>Recalculate</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
  modalHeaderDark: {
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  textDark: {
    color: '#f9fafb',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  modalScroll: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  smallInput: {
    flex: 1,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  genderOptionDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
  },
  genderOptionActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  genderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  genderTextActive: {
    color: '#ffffff',
  },
  activityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  activityOptionDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
  },
  activityOptionActive: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  activityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  activityLabelActive: {
    color: '#065f46',
  },
  activityDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  goalSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  goalOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  goalOptionDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
  },
  goalOptionActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  goalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  goalTextActive: {
    color: '#ffffff',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  calculateButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  resultCalories: {
    fontSize: 56,
    fontWeight: '700',
    color: '#10b981',
  },
  resultLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultCardDark: {
    backgroundColor: '#111827',
  },
  resultCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  resultRowLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoBoxDark: {
    backgroundColor: '#78350f',
  },
  infoText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 20,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  resetButtonDark: {
    backgroundColor: '#111827',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
});
