import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Plus, Dumbbell, Clock, TrendingUp, Calendar, CheckCircle } from 'lucide-react-native';

interface Workout {
  id: string;
  name: string;
  exercises: number;
  duration: string;
  completed: boolean;
  date: string;
}

export default function WorkoutsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const todayWorkouts: Workout[] = [
    {
      id: '1',
      name: 'Upper Body Strength',
      exercises: 8,
      duration: '45 min',
      completed: false,
      date: 'Today',
    },
    {
      id: '2',
      name: 'Core & Abs',
      exercises: 6,
      duration: '20 min',
      completed: false,
      date: 'Today',
    },
  ];

  const recentWorkouts: Workout[] = [
    {
      id: '3',
      name: 'Leg Day',
      exercises: 7,
      duration: '50 min',
      completed: true,
      date: 'Yesterday',
    },
    {
      id: '4',
      name: 'Cardio HIIT',
      exercises: 5,
      duration: '30 min',
      completed: true,
      date: '2 days ago',
    },
  ];

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
          <Text style={[styles.workoutDate, isDark && styles.textSecondaryDark]}>{workout.date}</Text>
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
        <TouchableOpacity style={styles.addButton}>
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
              <Text style={[styles.statValue, isDark && styles.textDark]}>24</Text>
              <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>This Month</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}>
                <Calendar size={20} color="#f59e0b" />
              </View>
              <Text style={[styles.statValue, isDark && styles.textDark]}>7</Text>
              <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: isDark ? '#1e3a8a' : '#dbeafe' }]}>
                <Clock size={20} color="#3b82f6" />
              </View>
              <Text style={[styles.statValue, isDark && styles.textDark]}>18h</Text>
              <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>Total Time</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Today's Workouts</Text>
            {todayWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Recent Activity</Text>
            {recentWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </View>
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
});
