import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, useColorScheme } from 'react-native';
import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react-native';
import { useLocalization } from '../utils/localization';

interface UserOnboardingProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (data: UserProfile) => void;
}

export interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  goal: 'lose' | 'maintain' | 'gain';
  targetWeight: number;
  timeframe: number;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

export default function UserOnboarding({ visible, onClose, onComplete }: UserOnboardingProps) {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');
  const [targetWeight, setTargetWeight] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useLocalization();

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', multiplier: 1.2, description: 'Little or no exercise' },
    { value: 'light', label: 'Light', multiplier: 1.375, description: 'Exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', multiplier: 1.55, description: 'Exercise 3-5 days/week' },
    { value: 'active', label: 'Active', multiplier: 1.725, description: 'Exercise 6-7 days/week' },
    { value: 'very', label: 'Very Active', multiplier: 1.9, description: 'Hard exercise daily' },
  ];

  const calculateMacros = () => {
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const targetWeightNum = parseFloat(targetWeight);
    const timeframeWeeks = parseInt(timeframe);

    // Calculate BMR using Mifflin-St Jeor equation
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

    // Calculate macros based on goal
    let proteinPerKg = 2.0; // Default for muscle gain/maintenance
    let fatPercentage = 0.25; // 25% of calories from fat
    
    if (goal === 'lose') {
      proteinPerKg = 2.2; // Higher protein for muscle preservation
      fatPercentage = 0.25;
    } else if (goal === 'maintain') {
      proteinPerKg = 1.8;
      fatPercentage = 0.30;
    }

    const proteinGoal = Math.round(weightNum * proteinPerKg);
    const fatCalories = targetCalories * fatPercentage;
    const fatGoal = Math.round(fatCalories / 9); // 9 calories per gram of fat
    
    const proteinCalories = proteinGoal * 4; // 4 calories per gram of protein
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbsGoal = Math.round(carbCalories / 4); // 4 calories per gram of carbs

    return {
      calorieGoal: Math.round(targetCalories),
      proteinGoal,
      carbsGoal,
      fatGoal,
    };
  };

  const handleComplete = () => {
    const macros = calculateMacros();
    const profile: UserProfile = {
      gender,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      activityLevel,
      goal,
      targetWeight: parseFloat(targetWeight),
      timeframe: parseInt(timeframe),
      ...macros,
    };
    onComplete(profile);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return age && parseInt(age) > 0 && parseInt(age) < 120;
      case 2:
        return weight && parseFloat(weight) > 0;
      case 3:
        return height && parseFloat(height) > 0;
      case 4:
        return true; // Activity level always has a default
      case 5:
        return true; // Goal always has a default
      case 6:
        return targetWeight && parseFloat(targetWeight) > 0 && timeframe && parseInt(timeframe) > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, isDark && styles.textDark]}>What's your gender?</Text>
            <Text style={[styles.stepDescription, isDark && styles.textSecondaryDark]}>
              This helps us calculate your calorie needs more accurately
            </Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  gender === 'male' && styles.optionButtonActive,
                  isDark && styles.optionButtonDark,
                ]}
                onPress={() => setGender('male')}
              >
                <Text style={[styles.optionText, gender === 'male' && styles.optionTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  gender === 'female' && styles.optionButtonActive,
                  isDark && styles.optionButtonDark,
                ]}
                onPress={() => setGender('female')}
              >
                <Text style={[styles.optionText, gender === 'female' && styles.optionTextActive]}>Female</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.stepTitle, isDark && styles.textDark, { marginTop: 32 }]}>How old are you?</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              keyboardType="numeric"
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, isDark && styles.textDark]}>What's your current weight?</Text>
            <Text style={[styles.stepDescription, isDark && styles.textSecondaryDark]}>
              Enter your weight in kilograms
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g., 75"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              keyboardType="decimal-pad"
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, isDark && styles.textDark]}>What's your height?</Text>
            <Text style={[styles.stepDescription, isDark && styles.textSecondaryDark]}>
              Enter your height in centimeters
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={height}
              onChangeText={setHeight}
              placeholder="e.g., 175"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              keyboardType="decimal-pad"
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, isDark && styles.textDark]}>What's your activity level?</Text>
            <Text style={[styles.stepDescription, isDark && styles.textSecondaryDark]}>
              This helps us calculate your daily calorie needs
            </Text>
            <View style={styles.activityContainer}>
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.activityOption,
                    activityLevel === level.value && styles.activityOptionActive,
                    isDark && styles.activityOptionDark,
                  ]}
                  onPress={() => setActivityLevel(level.value)}
                >
                  <Text style={[styles.activityLabel, activityLevel === level.value && styles.activityLabelActive]}>
                    {level.label}
                  </Text>
                  <Text style={[styles.activityDescription, isDark && styles.textSecondaryDark]}>
                    {level.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, isDark && styles.textDark]}>What's your goal?</Text>
            <Text style={[styles.stepDescription, isDark && styles.textSecondaryDark]}>
              Choose what you want to achieve
            </Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.goalOption,
                  goal === 'lose' && styles.goalOptionActive,
                  isDark && styles.goalOptionDark,
                ]}
                onPress={() => setGoal('lose')}
              >
                <Text style={[styles.goalTitle, goal === 'lose' && styles.goalTitleActive]}>Lose Weight</Text>
                <Text style={[styles.goalDescription, isDark && styles.textSecondaryDark]}>
                  Burn fat and get leaner
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.goalOption,
                  goal === 'maintain' && styles.goalOptionActive,
                  isDark && styles.goalOptionDark,
                ]}
                onPress={() => setGoal('maintain')}
              >
                <Text style={[styles.goalTitle, goal === 'maintain' && styles.goalTitleActive]}>Maintain Weight</Text>
                <Text style={[styles.goalDescription, isDark && styles.textSecondaryDark]}>
                  Stay at your current weight
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.goalOption,
                  goal === 'gain' && styles.goalOptionActive,
                  isDark && styles.goalOptionDark,
                ]}
                onPress={() => setGoal('gain')}
              >
                <Text style={[styles.goalTitle, goal === 'gain' && styles.goalTitleActive]}>Gain Weight</Text>
                <Text style={[styles.goalDescription, isDark && styles.textSecondaryDark]}>
                  Build muscle and strength
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, isDark && styles.textDark]}>
              {goal === 'maintain' ? 'Almost done!' : 'Set your target'}
            </Text>
            {goal !== 'maintain' && (
              <>
                <Text style={[styles.stepDescription, isDark && styles.textSecondaryDark]}>
                  What's your target weight? (kg)
                </Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  placeholder="e.g., 70"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  keyboardType="decimal-pad"
                />
                <Text style={[styles.stepDescription, isDark && styles.textSecondaryDark, { marginTop: 24 }]}>
                  In how many weeks?
                </Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={timeframe}
                  onChangeText={setTimeframe}
                  placeholder="e.g., 12"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  keyboardType="numeric"
                />
              </>
            )}
            {goal === 'maintain' && (
              <>
                <Text style={[styles.stepDescription, isDark && styles.textSecondaryDark]}>
                  We'll calculate your maintenance calories to help you stay at your current weight
                </Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={targetWeight || weight}
                  onChangeText={setTargetWeight}
                  placeholder="Target weight (same as current)"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  keyboardType="decimal-pad"
                />
                <TextInput
                  style={[styles.input, isDark && styles.inputDark, { marginTop: 16 }]}
                  value={timeframe || '1'}
                  onChangeText={setTimeframe}
                  placeholder="Timeframe (weeks)"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  keyboardType="numeric"
                />
              </>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.header, isDark && styles.headerDark]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={isDark ? '#f9fafb' : '#111827'} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.textDark]}>Set Up Your Profile</Text>
          <View style={styles.progressContainer}>
            <Text style={[styles.progressText, isDark && styles.textSecondaryDark]}>
              Step {step} of 6
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>

        <View style={[styles.footer, isDark && styles.footerDark]}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.backButton, isDark && styles.backButtonDark]}
              onPress={() => setStep(step - 1)}
            >
              <ChevronLeft size={20} color={isDark ? '#f9fafb' : '#111827'} />
              <Text style={[styles.backButtonText, isDark && styles.textDark]}>Back</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          {step < 6 ? (
            <TouchableOpacity
              style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
              onPress={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <ChevronRight size={20} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.completeButton, !canProceed() && styles.nextButtonDisabled]}
              onPress={handleComplete}
              disabled={!canProceed()}
            >
              <Check size={20} color="#ffffff" />
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerDark: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  textDark: {
    color: '#f9fafb',
  },
  progressContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContent: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    color: '#f9fafb',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  optionButtonDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  optionButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  optionTextActive: {
    color: '#3b82f6',
  },
  activityContainer: {
    gap: 12,
  },
  activityOption: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  activityOptionDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  activityOptionActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  activityLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  activityLabelActive: {
    color: '#3b82f6',
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  goalOption: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
  },
  goalOptionDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  goalOptionActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  goalTitleActive: {
    color: '#3b82f6',
  },
  goalDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerDark: {
    backgroundColor: '#1f2937',
    borderTopColor: '#374151',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  backButtonDark: {
    backgroundColor: '#374151',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
