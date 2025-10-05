import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Plus, Clock, History, X, Check } from 'lucide-react-native';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: Exercise[];
}

export default function WorkoutsScreen() {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const [workoutHistory] = useState<Workout[]>([
    {
      id: '1',
      name: 'Upper Body Strength',
      date: '2025-10-04',
      duration: 45,
      exercises: [
        { id: '1', name: 'Bench Press', sets: 4, reps: 10, weight: 185 },
        { id: '2', name: 'Rows', sets: 4, reps: 12, weight: 135 },
        { id: '3', name: 'Shoulder Press', sets: 3, reps: 10, weight: 95 },
      ],
    },
    {
      id: '2',
      name: 'Leg Day',
      date: '2025-10-02',
      duration: 60,
      exercises: [
        { id: '1', name: 'Squats', sets: 5, reps: 8, weight: 225 },
        { id: '2', name: 'Leg Press', sets: 4, reps: 12, weight: 315 },
        { id: '3', name: 'Lunges', sets: 3, reps: 10 },
      ],
    },
  ]);

  const addExercise = () => {
    if (exerciseName && sets && reps) {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: exerciseName,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : undefined,
      };
      setExercises([...exercises, newExercise]);
      setExerciseName('');
      setSets('');
      setReps('');
      setWeight('');
    }
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const saveWorkout = () => {
    if (workoutName && exercises.length > 0) {
      setShowCreateModal(false);
      setWorkoutName('');
      setExercises([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <Text style={styles.subtitle}>Track your training sessions</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}>
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Create
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}>
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'create' ? (
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.createCard}
              onPress={() => setShowCreateModal(true)}>
              <View style={styles.createIconContainer}>
                <Plus size={32} color="#10b981" />
              </View>
              <Text style={styles.createTitle}>Create New Workout</Text>
              <Text style={styles.createSubtitle}>Log your exercises, sets, and reps</Text>
            </TouchableOpacity>

            <View style={styles.quickStats}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>45</Text>
                <Text style={styles.statLabel}>Avg Minutes</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.historyContainer}>
            {workoutHistory.map((workout) => (
              <TouchableOpacity key={workout.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View>
                    <Text style={styles.historyName}>{workout.name}</Text>
                    <View style={styles.historyInfo}>
                      <Clock size={14} color="#6b7280" />
                      <Text style={styles.historyInfoText}>
                        {workout.duration} min
                      </Text>
                      <Text style={styles.historyDate}>{workout.date}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.exercisesList}>
                  {workout.exercises.map((exercise) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDetails}>
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight && ` @ ${exercise.weight} lbs`}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Workout</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Workout Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Upper Body Day"
                  value={workoutName}
                  onChangeText={setWorkoutName}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Add Exercises</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Exercise Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Bench Press"
                  value={exerciseName}
                  onChangeText={setExerciseName}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.smallInput]}>
                  <Text style={styles.label}>Sets</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={sets}
                    onChangeText={setSets}
                    keyboardType="number-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={[styles.inputGroup, styles.smallInput]}>
                  <Text style={styles.label}>Reps</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="number-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={[styles.inputGroup, styles.smallInput]}>
                  <Text style={styles.label}>Weight (lbs)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.addButton} onPress={addExercise}>
                <Plus size={20} color="#ffffff" />
                <Text style={styles.addButtonText}>Add Exercise</Text>
              </TouchableOpacity>

              {exercises.length > 0 && (
                <View style={styles.exercisesPreview}>
                  <Text style={styles.previewTitle}>Exercises ({exercises.length})</Text>
                  {exercises.map((exercise) => (
                    <View key={exercise.id} style={styles.previewItem}>
                      <View style={styles.previewInfo}>
                        <Text style={styles.previewName}>{exercise.name}</Text>
                        <Text style={styles.previewDetails}>
                          {exercise.sets}×{exercise.reps}
                          {exercise.weight && ` @ ${exercise.weight}lbs`}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                        <X size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!workoutName || exercises.length === 0) && styles.saveButtonDisabled,
                ]}
                onPress={saveWorkout}
                disabled={!workoutName || exercises.length === 0}>
                <Check size={20} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  createCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  createIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  createTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  createSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  historyContainer: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  historyHeader: {
    marginBottom: 12,
  },
  historyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  historyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyInfoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  historyDate: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 8,
  },
  exercisesList: {
    gap: 8,
  },
  exerciseItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#6b7280',
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
    maxHeight: '90%',
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
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  smallInput: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  exercisesPreview: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  previewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  previewDetails: {
    fontSize: 13,
    color: '#6b7280',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    gap: 8,
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
