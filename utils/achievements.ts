import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: 'workout' | 'streak' | 'nutrition' | 'milestone';
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_workout',
    title: 'First Workout',
    description: 'Complete your first workout',
    icon: '🎯',
    earned: false,
    category: 'workout',
  },
  {
    id: 'week_streak',
    title: '7 Day Streak',
    description: 'Log activity for 7 days straight',
    icon: '🔥',
    earned: false,
    category: 'streak',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a workout before 7am',
    icon: '🌅',
    earned: false,
    category: 'workout',
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Log 30 days in a row',
    icon: '👑',
    earned: false,
    category: 'streak',
  },
  {
    id: 'ten_workouts',
    title: '10 Workouts',
    description: 'Complete 10 workouts',
    icon: '💪',
    earned: false,
    category: 'workout',
  },
  {
    id: 'fifty_workouts',
    title: '50 Workouts',
    description: 'Complete 50 workouts',
    icon: '🏆',
    earned: false,
    category: 'workout',
  },
  {
    id: 'hundred_workouts',
    title: '100 Workouts',
    description: 'Complete 100 workouts',
    icon: '⭐',
    earned: false,
    category: 'milestone',
  },
  {
    id: 'nutrition_tracker',
    title: 'Nutrition Tracker',
    description: 'Log meals for 7 days',
    icon: '🥗',
    earned: false,
    category: 'nutrition',
  },
  {
    id: 'goal_crusher',
    title: 'Goal Crusher',
    description: 'Hit your calorie goal 5 days in a row',
    icon: '🎖️',
    earned: false,
    category: 'nutrition',
  },
  {
    id: 'month_streak',
    title: '30 Day Streak',
    description: 'Log activity for 30 days straight',
    icon: '🌟',
    earned: false,
    category: 'streak',
  },
];

export async function checkAndUnlockAchievements(): Promise<Achievement[]> {
  try {
    const [workoutsData, achievementsData] = await Promise.all([
      AsyncStorage.getItem('completed_workouts'),
      AsyncStorage.getItem('achievements'),
    ]);

    const workouts = workoutsData ? JSON.parse(workoutsData) : [];
    const savedAchievements = achievementsData ? JSON.parse(achievementsData) : ACHIEVEMENTS;
    
    const newlyUnlocked: Achievement[] = [];

    // Check each achievement
    for (const achievement of savedAchievements) {
      if (achievement.earned) continue;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_workout':
          shouldUnlock = workouts.length >= 1;
          break;

        case 'ten_workouts':
          shouldUnlock = workouts.length >= 10;
          break;

        case 'fifty_workouts':
          shouldUnlock = workouts.length >= 50;
          break;

        case 'hundred_workouts':
          shouldUnlock = workouts.length >= 100;
          break;

        case 'week_streak':
          shouldUnlock = calculateStreak(workouts) >= 7;
          break;

        case 'consistency_king':
        case 'month_streak':
          shouldUnlock = calculateStreak(workouts) >= 30;
          break;

        case 'early_bird':
          shouldUnlock = workouts.some((w: any) => {
            const hour = new Date(w.date).getHours();
            return hour < 7;
          });
          break;

        // Add more achievement checks as needed
      }

      if (shouldUnlock) {
        achievement.earned = true;
        achievement.earnedDate = new Date().toISOString();
        newlyUnlocked.push(achievement);
      }
    }

    // Save updated achievements
    await AsyncStorage.setItem('achievements', JSON.stringify(savedAchievements));

    return newlyUnlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

function calculateStreak(workouts: any[]): number {
  if (workouts.length === 0) return 0;
  
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const lastWorkoutDate = new Date(sortedWorkouts[0].date);
  lastWorkoutDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((currentDate.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > 1) {
    return 0;
  }
  
  let checkDate = new Date(currentDate);
  if (daysDiff === 1) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    
    if (workoutDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (workoutDate.getTime() < checkDate.getTime()) {
      break;
    }
  }
  
  return streak;
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const achievementsData = await AsyncStorage.getItem('achievements');
    if (achievementsData) {
      return JSON.parse(achievementsData);
    }
    // Initialize with default achievements
    await AsyncStorage.setItem('achievements', JSON.stringify(ACHIEVEMENTS));
    return ACHIEVEMENTS;
  } catch (error) {
    console.error('Error getting achievements:', error);
    return ACHIEVEMENTS;
  }
}
