import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch, Alert, useColorScheme } from 'react-native';
import { X, Moon, Sun, Bell, Lock, Shield, HelpCircle, LogOut, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [notifications, setNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [mealReminders, setMealReminders] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const handleChangePassword = async () => {
    Alert.alert(
      'Change Password',
      'This will allow you to set a new password for app access',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: async () => {
            await SecureStore.deleteItemAsync('app_password');
            Alert.alert('Success', 'Password reset. You will be asked to set a new password on next launch.');
            onClose();
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your data including workouts, meals, and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await SecureStore.deleteItemAsync('profile_image');
            await SecureStore.deleteItemAsync('username');
            await SecureStore.deleteItemAsync('app_password');
            Alert.alert('Success', 'All data has been cleared');
            onClose();
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    danger = false 
  }: { 
    icon: any; 
    title: string; 
    subtitle?: string; 
    onPress?: () => void; 
    rightElement?: React.ReactNode;
    danger?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, isDark && styles.settingItemDark]} 
      onPress={onPress}
      disabled={!onPress && !rightElement}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, danger && styles.settingIconDanger, isDark && styles.settingIconDark]}>
          <Icon size={20} color={danger ? '#ef4444' : '#10b981'} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.settingTitleDanger, isDark && styles.textDark]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, isDark && styles.textSecondaryDark]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
          <View style={[styles.modalHeader, isDark && styles.modalHeaderDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>APPEARANCE</Text>
              <SettingItem
                icon={isDark ? Moon : Sun}
                title="Theme"
                subtitle={`Currently using ${isDark ? 'dark' : 'light'} mode (Auto)`}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>NOTIFICATIONS</Text>
              <SettingItem
                icon={Bell}
                title="Push Notifications"
                subtitle="Receive app notifications"
                rightElement={
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: '#d1d5db', true: '#86efac' }}
                    thumbColor={notifications ? '#10b981' : '#f3f4f6'}
                  />
                }
              />
              <SettingItem
                icon={Bell}
                title="Workout Reminders"
                subtitle="Daily workout reminders"
                rightElement={
                  <Switch
                    value={workoutReminders}
                    onValueChange={setWorkoutReminders}
                    trackColor={{ false: '#d1d5db', true: '#86efac' }}
                    thumbColor={workoutReminders ? '#10b981' : '#f3f4f6'}
                  />
                }
              />
              <SettingItem
                icon={Bell}
                title="Meal Reminders"
                subtitle="Reminders to log meals"
                rightElement={
                  <Switch
                    value={mealReminders}
                    onValueChange={setMealReminders}
                    trackColor={{ false: '#d1d5db', true: '#86efac' }}
                    thumbColor={mealReminders ? '#10b981' : '#f3f4f6'}
                  />
                }
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>SECURITY</Text>
              <SettingItem
                icon={Lock}
                title="Change Password"
                subtitle="Update your app password"
                onPress={handleChangePassword}
              />
              <SettingItem
                icon={Shield}
                title="Privacy Policy"
                subtitle="View our privacy policy"
                onPress={() => Alert.alert('Privacy Policy', 'Privacy policy would be displayed here')}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>SUPPORT</Text>
              <SettingItem
                icon={HelpCircle}
                title="Help & Support"
                subtitle="Get help with the app"
                onPress={() => Alert.alert('Help & Support', 'Support information would be displayed here')}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}>DANGER ZONE</Text>
              <SettingItem
                icon={Trash2}
                title="Clear All Data"
                subtitle="Delete all your data"
                onPress={handleClearData}
                danger
              />
            </View>

            <View style={styles.appInfo}>
              <Text style={[styles.appInfoText, isDark && styles.textSecondaryDark]}>BetterU</Text>
              <Text style={[styles.appInfoText, isDark && styles.textSecondaryDark]}>Version 1.0.0</Text>
            </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingItemDark: {
    backgroundColor: '#111827',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconDark: {
    backgroundColor: '#064e3b',
  },
  settingIconDanger: {
    backgroundColor: '#fee2e2',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingTitleDanger: {
    color: '#ef4444',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
