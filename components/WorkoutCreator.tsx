import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import { X, Plus, Play, Pause, Check, Clock, Dumbbell } from 'lucide-react-native';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  completedSets: number;
}

interface WorkoutCreatorProps {
  onClose: () => void;
  onSave: (workout: any) => void;
}

export default function WorkoutCreator({ onClose, onSave }: WorkoutCreatorProps) {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [restingExerciseId, setRestingExerciseId] = useState<string | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Workout timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (workoutStarted && !isPaused) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutStarted, isPaused]);

  // Rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setRestingExerciseId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addExercise = (name: string, sets: number, reps: number, restTime: number) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name,
      sets,
      reps,
      restTime,
      completedSets: 0,
    };
    setExercises([...exercises, newExercise]);
    setShowAddExercise(false);
  };

  const startWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert('Workout Name Required', 'Please enter a name for your workout');
      return;
    }
    if (exercises.length === 0) {
      Alert.alert('Add Exercises', 'Please add at least one exercise to start');
      return;
    }
    setWorkoutStarted(true);
  };

  const completeSet = (exerciseId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId && ex.completedSets < ex.sets) {
        const newCompletedSets = ex.completedSets + 1;
        if (newCompletedSets < ex.sets) {
          setRestTimer(ex.restTime);
          setRestingExerciseId(exerciseId);
        }
        return { ...ex, completedSets: newCompletedSets };
      }
      return ex;
    }));
  };

  const finishWorkout = () => {
    const workout = {
      name: workoutName,
      exercises,
      duration: workoutTime,
      date: new Date().toISOString(),
    };
    onSave(workout);
  };

  const AddExerciseModal = () => {
    const [name, setName] = useState('');
    const [sets, setSets] = useState('3');
    const [reps, setReps] = useState('10');
    const [rest, setRest] = useState('60');

    return (
      <Modal visible={showAddExercise} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.addExerciseModal, isDark && styles.addExerciseModalDark]}>
            <View style={styles.addExerciseHeader}>
              <Text style={[styles.addExerciseTitle, isDark && styles.textDark]}>Add Exercise</Text>
              <TouchableOpacity onPress={() => setShowAddExercise(false)}>
                <X size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>

            <View style={styles.addExerciseForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDark && styles.textDark]}>Exercise Name</Text>
                <TextInput
                  style={[styles.formInput, isDark && styles.formInputDark]}
                  placeholder="e.g., Bench Press"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, isDark && styles.textDark]}>Sets</Text>
                  <TextInput
                    style={[styles.formInput, isDark && styles.formInputDark]}
                    placeholder="3"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    value={sets}
                    onChangeText={setSets}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, isDark && styles.textDark]}>Reps</Text>
                  <TextInput
                    style={[styles.formInput, isDark && styles.formInputDark]}
                    placeholder="10"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDark && styles.textDark]}>Rest Time (seconds)</Text>
                <TextInput
                  style={[styles.formInput, isDark && styles.formInputDark]}
                  placeholder="60"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  value={rest}
                  onChangeText={setRest}
                  keyboardType="number-pad"
                />
              </View>

              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => {
                  if (name.trim()) {
                    addExercise(name, parseInt(sets) || 3, parseInt(reps) || 10, parseInt(rest) || 60);
                  }
                }}>
                <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Modal visible={true} animationType="slide">
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.header, isDark && styles.headerDark]}>
          <Text style={[styles.title, isDark && styles.textDark]}>
            {workoutStarted ? 'Workout in Progress' : 'Create Workout'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={28} color={isDark ? '#f9fafb' : '#111827'} />
          </TouchableOpacity>
        </View>

        {workoutStarted && (
          <View style={[styles.timerContainer, isDark && styles.timerContainerDark]}>
            <View style={styles.timerContent}>
              <Clock size={32} color="#10b981" />
              <Text style={[styles.timerText, isDark && styles.textDark]}>{formatTime(workoutTime)}</Text>
              <TouchableOpacity onPress={() => setIsPaused(!isPaused)} style={styles.pauseButton}>
                {isPaused ? <Play size={24} color="#10b981" /> : <Pause size={24} color="#10b981" />}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {restTimer > 0 && (
          <View style={styles.restTimerContainer}>
            <Text style={styles.restTimerText}>Rest Time</Text>
            <Text style={styles.restTimerValue}>{formatTime(restTimer)}</Text>
          </View>
        )}

        <ScrollView style={styles.content}>
          {!workoutStarted && (
            <View style={styles.workoutNameContainer}>
              <Text style={[styles.label, isDark && styles.textDark]}>Workout Name</Text>
              <TextInput
                style={[styles.workoutNameInput, isDark && styles.workoutNameInputDark]}
                placeholder="e.g., Upper Body Day"
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={workoutName}
                onChangeText={setWorkoutName}
              />
            </View>
          )}

          <View style={styles.exercisesSection}>
            <View style={styles.exercisesHeader}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Exercises</Text>
              {!workoutStarted && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddExercise(true)}>
                  <Plus size={20} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>

            {exercises.map((exercise) => (
              <View key={exercise.id} style={[styles.exerciseCard, isDark && styles.exerciseCardDark]}>
                <View style={styles.exerciseHeader}>
                  <Dumbbell size={20} color="#10b981" />
                  <Text style={[styles.exerciseName, isDark && styles.textDark]}>{exercise.name}</Text>
                </View>

                <View style={styles.exerciseDetails}>
                  <Text style={[styles.exerciseInfo, isDark && styles.textSecondaryDark]}>
                    {exercise.sets} sets × {exercise.reps} reps
                  </Text>
                  <Text style={[styles.exerciseInfo, isDark && styles.textSecondaryDark]}>
                    Rest: {exercise.restTime}s
                  </Text>
                </View>

                {workoutStarted && (
                  <View style={styles.setsContainer}>
                    {Array.from({ length: exercise.sets }).map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.setButton,
                          index < exercise.completedSets && styles.setButtonCompleted,
                          isDark && styles.setButtonDark,
                        ]}
                        onPress={() => {
                          if (index === exercise.completedSets) {
                            completeSet(exercise.id);
                          }
                        }}
                        disabled={index !== exercise.completedSets}>
                        {index < exercise.completedSets ? (
                          <Check size={16} color="#ffffff" />
                        ) : (
                          <Text style={[styles.setButtonText, isDark && styles.textDark]}>
                            {index + 1}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {restingExerciseId === exercise.id && (
                  <View style={styles.restingBadge}>
                    <Text style={styles.restingText}>Resting...</Text>
                  </View>
                )}
              </View>
            ))}

            {exercises.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, isDark && styles.textSecondaryDark]}>
                  No exercises added yet
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, isDark && styles.footerDark]}>
          {!workoutStarted ? (
            <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
              <Play size={20} color="#ffffff" />
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
              <Check size={20} color="#ffffff" />
              <Text style={styles.finishButtonText}>Finish Workout</Text>
            </TouchableOpacity>
          )}
        </View>

        <AddExerciseModal />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  title: {
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
  timerContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  timerContainerDark: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  timerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  pauseButton: {
    padding: 8,
  },
  restTimerContainer: {
    backgroundColor: '#fef3c7',
    padding: 16,
    alignItems: 'center',
  },
  restTimerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  restTimerValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#92400e',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  workoutNameContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  workoutNameInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  workoutNameInputDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    color: '#f9fafb',
  },
  exercisesSection: {
    flex: 1,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exerciseCardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  exerciseInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  setsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  setButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  setButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  setButtonCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  setButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  restingBadge: {
    marginTop: 8,
    backgroundColor: '#fef3c7',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  restingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerDark: {
    backgroundColor: '#1f2937',
    borderTopColor: '#374151',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  addExerciseModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  addExerciseModalDark: {
    backgroundColor: '#1f2937',
  },
  addExerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  addExerciseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  addExerciseForm: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  formInputDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
    color: '#f9fafb',
  },
  addExerciseButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addExerciseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
