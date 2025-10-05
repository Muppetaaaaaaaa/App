import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch, Alert, useColorScheme, Appearance } from 'react-native';
import { X, Moon, Sun, Bell, Shield, Trash2, LogOut, ChevronRight, User, Lock, HelpCircle, Info } from 'lucide-react-native';
import { storage } from '../utils/storage';
import { useState, useEffect } from 'react';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function SettingsModal({ visible, onClose, onLogout }: SettingsModalProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
    loadSettings();
  }, [colorScheme]);

  const loadSettings = async () => {
    try {
      const notifications = await storage.getItem('notifications_enabled');
      const biometrics = await storage.getItem('biometrics_enabled');
      
      if (notifications !== null) setNotificationsEnabled(notifications === 'true');
      if (biometrics !== null) setBiometricsEnabled(biometrics === 'true');
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSetting = async (key: string, value: boolean) => {
    try {
      await storage.setItem(key, value.toString());
    } catch (error) {
      console.log('Error saving setting:', error);
    }
  };

  const handleThemeToggle = (value: boolean) => {
    setIsDarkMode(value);
    Appearance.setColorScheme(value ? 'dark' : 'light');
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    saveSetting('notifications_enabled', value);
  };

  const handleBiometricsToggle = (value: boolean) => {
    setBiometricsEnabled(value);
    saveSetting('biometrics_enabled', value);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your workouts, meals, and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.deleteItem('workouts');
              await storage.deleteItem('meals');
              await storage.deleteItem('profile_picture');
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  const SettingCard = ({ 
    icon: Icon, 
    title, 
    description,
    onPress,
    rightElement,
    iconColor = '#10b981',
    iconBg,
  }: any) => (
    <TouchableOpacity 
      style={[styles.settingCard, isDarkMode && styles.settingCardDark]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg || (isDarkMode ? '#064e3b' : '#d1fae5') }]}>
        <Icon size={24} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, isDarkMode && styles.textDark]}>{title}</Text>
        {description && (
          <Text style={[styles.settingDescription, isDarkMode && styles.textSecondaryDark]}>
            {description}
          </Text>
        )}
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <View>
            <Text style={[styles.title, isDarkMode && styles.textDark]}>Settings</Text>
            <Text style={[styles.subtitle, isDarkMode && styles.textSecondaryDark]}>
              Customize your experience
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={28} color={isDarkMode ? '#f9fafb' : '#111827'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Appearance Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.textSecondaryDark]}>APPEARANCE</Text>
              
              <SettingCard
                icon={isDarkMode ? Moon : Sun}
                title="Dark Mode"
                description={isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                iconColor={isDarkMode ? '#fbbf24' : '#f59e0b'}
                iconBg={isDarkMode ? '#78350f' : '#fef3c7'}
                rightElement={
                  <Switch
                    value={isDarkMode}
                    onValueChange={handleThemeToggle}
                    trackColor={{ false: '#d1d5db', true: '#86efac' }}
                    thumbColor={isDarkMode ? '#10b981' : '#f3f4f6'}
                  />
                }
              />
            </View>

            {/* Notifications Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.textSecondaryDark]}>NOTIFICATIONS</Text>
              
              <SettingCard
                icon={Bell}
                title="Push Notifications"
                description="Get reminders for workouts and meals"
                rightElement={
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={handleNotificationsToggle}
                    trackColor={{ false: '#d1d5db', true: '#86efac' }}
                    thumbColor={notificationsEnabled ? '#10b981' : '#f3f4f6'}
                  />
                }
              />
            </View>

            {/* Security Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.textSecondaryDark]}>SECURITY</Text>
              
              <SettingCard
                icon={Shield}
                title="Biometric Login"
                description="Use fingerprint or face ID"
                iconColor="#3b82f6"
                iconBg={isDarkMode ? '#1e3a8a' : '#dbeafe'}
                rightElement={
                  <Switch
                    value={biometricsEnabled}
                    onValueChange={handleBiometricsToggle}
                    trackColor={{ false: '#d1d5db', true: '#86efac' }}
                    thumbColor={biometricsEnabled ? '#10b981' : '#f3f4f6'}
                  />
                }
              />
              
              <SettingCard
                icon={Lock}
                title="Change Password"
                description="Update your login password"
                iconColor="#3b82f6"
                iconBg={isDarkMode ? '#1e3a8a' : '#dbeafe'}
                onPress={() => Alert.alert('Change Password', 'Password change coming soon')}
                rightElement={<ChevronRight size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />}
              />
            </View>

            {/* Account Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.textSecondaryDark]}>ACCOUNT</Text>
              
              <SettingCard
                icon={User}
                title="Profile Settings"
                description="Edit your profile information"
                iconColor="#8b5cf6"
                iconBg={isDarkMode ? '#4c1d95' : '#ede9fe'}
                onPress={() => Alert.alert('Profile', 'Profile editing coming soon')}
                rightElement={<ChevronRight size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />}
              />
            </View>

            {/* Support Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.textSecondaryDark]}>SUPPORT</Text>
              
              <SettingCard
                icon={HelpCircle}
                title="Help Center"
                description="Get help and support"
                iconColor="#06b6d4"
                iconBg={isDarkMode ? '#164e63' : '#cffafe'}
                onPress={() => Alert.alert('Help', 'Help center coming soon')}
                rightElement={<ChevronRight size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />}
              />
              
              <SettingCard
                icon={Info}
                title="About"
                description="Version 1.0.0"
                iconColor="#06b6d4"
                iconBg={isDarkMode ? '#164e63' : '#cffafe'}
                onPress={() => Alert.alert('BetterU', 'Version 1.0.0\n© 2025 BetterU')}
                rightElement={<ChevronRight size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />}
              />
            </View>

            {/* Danger Zone */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>DANGER ZONE</Text>
              
              <SettingCard
                icon={Trash2}
                title="Clear All Data"
                description="Delete all workouts and meals"
                iconColor="#ef4444"
                iconBg={isDarkMode ? '#7f1d1d' : '#fee2e2'}
                onPress={handleClearData}
                rightElement={<ChevronRight size={20} color="#ef4444" />}
              />
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={[styles.logoutButton, isDarkMode && styles.logoutButtonDark]} 
              onPress={handleLogout}>
              <LogOut size={22} color="#ef4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, isDarkMode && styles.textSecondaryDark]}>
                Made with ❤️ by BetterU Team
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  headerDark: {
    backgroundColor: '#1e293b',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  closeButton: {
    padding: 4,
  },
  textDark: {
    color: '#f9fafb',
  },
  textSecondaryDark: {
    color: '#94a3b8',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingCardDark: {
    backgroundColor: '#1e293b',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    gap: 10,
  },
  logoutButtonDark: {
    backgroundColor: '#7f1d1d',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
