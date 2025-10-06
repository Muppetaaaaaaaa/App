import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, useColorScheme } from 'react-native';
import { X, Calendar, Dumbbell, Clock, TrendingUp } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalization } from '../utils/localization';

interface WorkoutHistoryProps {
  visible: boolean;
  onClose: () => void;
}

interface WorkoutData {
  date: string;
  exercises: any[];
  completedSets: number;
  totalSets: number;
  duration?: number;
}

export default function WorkoutHistory({ visible, onClose }: WorkoutHistoryProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useLocalization();
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutData | null>(null);

  useEffect(() => {
    if (visible) {
      loadWorkouts();
    }
  }, [visible]);

  const loadWorkouts = async () => {
    try {
      const workoutsData = await AsyncStorage.getItem('completed_workouts');
      if (workoutsData) {
        const parsed = JSON.parse(workoutsData);
        // Sort by date, most recent first
        const sorted = parsed.sort((a: WorkoutData, b: WorkoutData) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setWorkouts(sorted);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getWorkoutStats = () => {
    const totalWorkouts = workouts.length;
    const totalSets = workouts.reduce((sum, w) => sum + w.completedSets, 0);
    const avgSetsPerWorkout = totalWorkouts > 0 ? Math.round(totalSets / totalWorkouts) : 0;
    
    return { totalWorkouts, totalSets, avgSetsPerWorkout };
  };

  const stats = getWorkoutStats();

  if (selectedWorkout) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={[styles.container, isDark && styles.containerDark]}>
          <View style={[styles.header, isDark && styles.headerDark]}>
            <TouchableOpacity onPress={() => setSelectedWorkout(null)} style={styles.backButton}>
              <Text style={[styles.backText, isDark && styles.textDark]}>← Back</Text>
            </TouchableOpacity>
            <Text style={[styles.title, isDark && styles.textDark]}>Workout Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={isDark ? '#f9fafb' : '#111827'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.detailCard, isDark && styles.detailCardDark]}>
              <Text style={[styles.detailDate, isDark && styles.textDark]}>
                {formatDate(selectedWorkout.date)}
              </Text>
              <Text style={[styles.detailTime, isDark && styles.textSecondaryDark]}>
                {formatTime(selectedWorkout.date)}
              </Text>

              <View style={styles.detailStats}>
                <View style={styles.detailStatItem}>
                  <Text style={[styles.detailStatValue, isDark && styles.textDark]}>
                    {selectedWorkout.completedSets}/{selectedWorkout.totalSets}
                  </Text>
                  <Text style={[styles.detailStatLabel, isDark && styles.textSecondaryDark]}>
                    Sets Completed
                  </Text>
                </View>
                <View style={styles.detailStatItem}>
                  <Text style={[styles.detailStatValue, isDark && styles.textDark]}>
                    {selectedWorkout.exercises.length}
                  </Text>
                  <Text style={[styles.detailStatLabel, isDark && styles.textSecondaryDark]}>
                    Exercises
                  </Text>
                </View>
                <View style={styles.detailStatItem}>
                  <Text style={[styles.detailStatValue, isDark && styles.textDark]}>
                    {formatDuration(selectedWorkout.duration)}
                  </Text>
                  <Text style={[styles.detailStatLabel, isDark && styles.textSecondaryDark]}>
                    Duration
                  </Text>
                </View>
              </View>
            </View>

            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Exercises</Text>
            {selectedWorkout.exercises.map((exercise, index) => (
              <View key={index} style={[styles.exerciseCard, isDark && styles.exerciseCardDark]}>
                <Text style={[styles.exerciseName, isDark && styles.textDark]}>
                  {exercise.name}
                </Text>
                <View style={styles.exerciseSets}>
                  {exercise.sets.map((set: any, setIndex: number) => (
                    <View key={setIndex} style={[styles.setItem, isDark && styles.setItemDark]}>
                      <Text style={[styles.setText, isDark && styles.textDark]}>
                        Set {setIndex + 1}: {set.reps} reps
                        {set.weight ? ` @ ${set.weight}kg` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.header, isDark && styles.headerDark]}>
          <Text style={[styles.title, isDark && styles.textDark]}>Workout History</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={isDark ? '#f9fafb' : '#111827'} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, isDark && styles.statCardDark]}>
            <Dumbbell size={24} color="#3b82f6" />
            <Text style={[styles.statValue, isDark && styles.textDark]}>{stats.totalWorkouts}</Text>
            <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>Total Workouts</Text>
          </View>
          <View style={[styles.statCard, isDark && styles.statCardDark]}>
            <TrendingUp size={24} color="#10b981" />
            <Text style={[styles.statValue, isDark && styles.textDark]}>{stats.totalSets}</Text>
            <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>Total Sets</Text>
          </View>
          <View style={[styles.statCard, isDark && styles.statCardDark]}>
            <Calendar size={24} color="#f59e0b" />
            <Text style={[styles.statValue, isDark && styles.textDark]}>{stats.avgSetsPerWorkout}</Text>
            <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>Avg Sets/Workout</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {workouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Dumbbell size={64} color={isDark ? '#4b5563' : '#d1d5db'} />
              <Text style={[styles.emptyText, isDark && styles.textSecondaryDark]}>
                No workouts yet
              </Text>
              <Text style={[styles.emptySubtext, isDark && styles.textSecondaryDark]}>
                Complete your first workout to see it here
              </Text>
            </View>
          ) : (
            workouts.map((workout, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.workoutCard, isDark && styles.workoutCardDark]}
                onPress={() => setSelectedWorkout(workout)}
              >
                <View style={styles.workoutHeader}>
                  <View>
                    <Text style={[styles.workoutDate, isDark && styles.textDark]}>
                      {formatDate(workout.date)}
                    </Text>
                    <Text style={[styles.workoutTime, isDark && styles.textSecondaryDark]}>
                      {formatTime(workout.date)}
                    </Text>
                  </View>
                  <View style={[styles.completionBadge, isDark && styles.completionBadgeDark]}>
                    <Text style={styles.completionText}>
                      {workout.completedSets}/{workout.totalSets} sets
                    </Text>
                  </View>
                </View>
                <View style={styles.workoutInfo}>
                  <View style={styles.infoItem}>
                    <Dumbbell size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                    <Text style={[styles.infoText, isDark && styles.textSecondaryDark]}>
                      {workout.exercises.length} exercises
                    </Text>
                  </View>
                  {workout.duration && (
                    <View style={styles.infoItem}>
                      <Clock size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                      <Text style={[styles.infoText, isDark && styles.textSecondaryDark]}>
                        {formatDuration(workout.duration)}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  textDark: {
    color: '#f9fafb',
  },
  closeButton: {
    padding: 4,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#3b82f6',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statCardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  workoutCardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  workoutTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  completionBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completionBadgeDark: {
    backgroundColor: '#1e3a8a',
  },
  completionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
  },
  workoutInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailCardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  detailDate: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  detailTime: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailStatItem: {
    alignItems: 'center',
  },
  detailStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  detailStatLabel: {
    fontSize: 12,
    color: '#6b7280',
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
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  exerciseSets: {
    gap: 8,
  },
  setItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
  },
  setItemDark: {
    backgroundColor: '#111827',
  },
  setText: {
    fontSize: 14,
    color: '#111827',
  },
});
