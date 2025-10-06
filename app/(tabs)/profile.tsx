import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Settings, Trophy, TrendingUp, Calendar, Target, User, Camera, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../utils/storage';
import SettingsModal from '@/components/SettingsModal';
import { getAchievements, Achievement } from '@/utils/achievements';
import { useLocalization } from '@/utils/localization';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(0);
  const [totalGoals, setTotalGoals] = useState(5);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState('User');
  const [description, setDescription] = useState('On a journey to better health');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useLocalization();

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (!showSettings) {
      // Reload profile when settings modal closes
      loadProfile();
    }
  }, [showSettings]);

  const loadProfile = async () => {
    const savedImage = await storage.getItem('profile_image');
    const savedName = await storage.getItem('profile_name');
    const savedDescription = await storage.getItem('profile_description');
    
    if (savedImage) setProfileImage(savedImage);
    if (savedName) setUsername(savedName);
    if (savedDescription) setDescription(savedDescription);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await storage.setItem('profile_image', imageUri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need permission to access your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await storage.setItem('profile_image', imageUri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      t('changeProfilePicture'),
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLogout = async () => {
    await storage.deleteItem('isAuthenticated');
    router.replace('/auth');
  };

  const stats = [
    { label: t('workouts'), value: totalWorkouts.toString(), icon: TrendingUp, color: '#10b981' },
    { label: t('streak'), value: `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`, icon: Calendar, color: '#f59e0b' },
    { label: t('goals'), value: `${completedGoals}/${totalGoals}`, icon: Target, color: '#3b82f6' },
  ];



  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.title, isDark && styles.textDark]}>{t('profile')}</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.settingsButton}>
          <Settings size={24} color={isDark ? '#f9fafb' : '#111827'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImagePlaceholder, isDark && styles.profileImagePlaceholderDark]}>
                  <User size={48} color={isDark ? '#9ca3af' : '#6b7280'} />
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton} onPress={showImageOptions}>
                <Camera size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.username, isDark && styles.textDark]}>{username}</Text>

            <Text style={[styles.userBio, isDark && styles.textSecondaryDark]}>
              {description}
            </Text>

            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <stat.icon size={20} color={stat.color} />
                  </View>
                  <Text style={[styles.statValue, isDark && styles.textDark]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, isDark && styles.sectionDark]}>
            <View style={styles.sectionHeader}>
              <Trophy size={20} color="#f59e0b" />
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>{t('achievements')}</Text>
            </View>

            <View style={styles.achievementsList}>
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementItem,
                    !achievement.earned && styles.achievementLocked,
                    isDark && styles.achievementItemDark,
                  ]}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={[styles.achievementTitle, isDark && styles.textDark, !achievement.earned && styles.achievementTitleLocked]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDescription, isDark && styles.textSecondaryDark]}>
                      {achievement.description}
                    </Text>
                  </View>
                  {achievement.earned && (
                    <View style={styles.earnedBadge}>
                      <Check size={16} color="#ffffff" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Recent Activity</Text>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, isDark && styles.textDark]}>Completed Upper Body Workout</Text>
                  <Text style={[styles.activityTime, isDark && styles.textSecondaryDark]}>2 hours ago</Text>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, isDark && styles.textDark]}>Logged 2,150 calories</Text>
                  <Text style={[styles.activityTime, isDark && styles.textSecondaryDark]}>5 hours ago</Text>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, isDark && styles.textDark]}>Started new training plan</Text>
                  <Text style={[styles.activityTime, isDark && styles.textSecondaryDark]}>Yesterday</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {showSettings && (
        <SettingsModal 
          visible={showSettings}
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
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
  },
  textDark: {
    color: '#f9fafb',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  profileCardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImagePlaceholderDark: {
    backgroundColor: '#374151',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  achievementItemDark: {
    backgroundColor: '#111827',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: '#9ca3af',
  },
  achievementDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  earnedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
