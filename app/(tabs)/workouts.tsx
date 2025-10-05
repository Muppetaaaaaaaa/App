import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Plus, Dumbbell, Clock, TrendingUp, Calendar, CheckCircle } from 'lucide-react-native';
import WorkoutCreator from '@/components/WorkoutCreator';
import * as SecureStore from 'expo-secure-store';

interface Workout {
  id: string;
  name: string;
  exercises: number;
  duration: string;
  completed: boolean;
  date: string;
}

export default function WorkoutsScreen() {
  const [showCreator, setShowCreator] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const saved = await SecureStore.getItemAsync('workouts');
      if (saved) {
        setWorkouts(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading workouts:', error);
    }
  };

  const saveWorkout = async (workout: any) => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: workout.name,
      exercises: workout.exercises.length,
      duration: formatDuration(workout.duration),
      completed: true,
      date: new Date().toISOString(),
    };

    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    
    try {
      await SecureStore.setItemAsync('workouts', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving workout:', error);
    }

    setShowCreator(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return `${daysAgo} days ago`;
    }
  };

  const todayWorkouts = workouts.filter(w => getRelativeDate(w.date) === 'Today');
  const recentWorkouts = workouts.filter(w => getRelativeDate(w.date) !== 'Today').slice(0, 5);

  const totalThisMonth = workouts.filter(w => {
    const date = new Date(w.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasWorkout = workouts.some(w => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === checkDate.getTime();
      });
      
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const totalTime = workouts.reduce((acc, w) => {
    const mins = parseInt(w.duration);
    return acc + (isNaN(mins) ? 0 : mins);
  }, 0);

  const WorkoutCard = ({ workout }: { workout: Workout }) => (
    <TouchableOpacity style={[styles.workoutCard, isDark && styles.workoutCardDark]}>
      <View style={styles.workoutHeader}>
        <View style={[styles.workoutIcon, workout.completed && styles.workoutIconCompleted, isDark && styles.workoutIconDark]}>
          {workout.completed ? (
            <CheckCircle size={24} color="#10b981" />
          ) : (
            <Dumbbell size={24} color="#10b981" />
          )}
        </View>
        <View style={styles.workoutInfo}>
          <Text style={[styles.workoutName, isDark && styles.textDark]}>{workout.name}</Text>
          <Text style={[styles.workoutDate, isDark && styles.textSecondaryDark]}>{getRelativeDate(workout.date)}</Text>
        </View>
      </View>

      <View style={styles.workoutStats}>
        <View style={styles.workoutStat}>
          <Dumbbell size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text style={[styles.workoutStatText, isDark && styles.textSecondaryDark]}>
            {workout.exercises} exercises
          </Text>
        </View>
        <View style={styles.workoutStat}>
          <Clock size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text style={[styles.workoutStatText, isDark && styles.textSecondaryDark]}>
            {workout.duration}
          </Text>
        </View>
      </View>

      {workout.completed && (
        <View style={styles.completedBadge}>
          <CheckCircle size={14} color="#10b981" />
          <Text style={styles.completedText}>Completed</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View>
          <Text style={[styles.title, isDark && styles.textDark]}>Workouts</Text>
          <Text style={[styles.subtitle, isDark && styles.textSecondaryDark]}>Track your training sessions</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreator(true)}>
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.statsCard, isDark && styles.statsCardDark]}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: isDark ? '#065f46' : '#d1fae5' }]}>
                <TrendingUp size={20} color="#10b981" />
              </View>
              <Text style={[styles.statValue, isDark && styles.textDark]}>{totalThisMonth}</Text>
              <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>This Month</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}>
                <Calendar size={20} color="#f59e0b" />
              </View>
              <Text style={[styles.statValue, isDark && styles.textDark]}>{calculateStreak()}</Text>
              <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: isDark ? '#1e3a8a' : '#dbeafe' }]}>
                <Clock size={20} color="#3b82f6" />
              </View>
              <Text style={[styles.statValue, isDark && styles.textDark]}>{Math.floor(totalTime / 60)}h</Text>
              <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>Total Time</Text>
            </View>
          </View>

          {todayWorkouts.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Today's Workouts</Text>
              {todayWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </View>
          )}

          {recentWorkouts.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Recent Activity</Text>
              {recentWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </View>
          )}

          {workouts.length === 0 && (
            <View style={styles.emptyState}>
              <Dumbbell size={48} color={isDark ? '#4b5563' : '#d1d5db'} />
              <Text style={[styles.emptyStateTitle, isDark && styles.textDark]}>No Workouts Yet</Text>
              <Text style={[styles.emptyStateText, isDark && styles.textSecondaryDark]}>
                Tap the + button to create your first workout
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {showCreator && (
        <WorkoutCreator
          onClose={() => setShowCreator(false)}
          onSave={saveWorkout}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statsCardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutIconDark: {
    backgroundColor: '#064e3b',
  },
  workoutIconCompleted: {
    backgroundColor: '#d1fae5',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  workoutDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workoutStatText: {
    fontSize: 13,
    color: '#6b7280',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  completedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
