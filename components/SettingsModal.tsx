import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch, Alert, useColorScheme, Linking } from 'react-native';
import { X, User, Bell, Lock, Palette, Info, HelpCircle, Mail, Shield, Trash2, LogOut, ChevronRight } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function SettingsModal({ visible, onClose, onLogout }: SettingsModalProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications = await SecureStore.getItemAsync('notifications_enabled');
      const biometrics = await SecureStore.getItemAsync('biometrics_enabled');
      const darkMode = await SecureStore.getItemAsync('dark_mode_enabled');
      
      if (notifications !== null) setNotificationsEnabled(notifications === 'true');
      if (biometrics !== null) setBiometricsEnabled(biometrics === 'true');
      if (darkMode !== null) setDarkModeEnabled(darkMode === 'true');
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSetting = async (key: string, value: boolean) => {
    try {
      await SecureStore.setItemAsync(key, value.toString());
    } catch (error) {
      console.log('Error saving setting:', error);
    }
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    saveSetting('notifications_enabled', value);
  };

  const handleBiometricsToggle = (value: boolean) => {
    setBiometricsEnabled(value);
    saveSetting('biometrics_enabled', value);
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkModeEnabled(value);
    saveSetting('dark_mode_enabled', value);
    Alert.alert('Dark Mode', 'Dark mode follows your system settings. This preference will be saved for future updates.');
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
              await SecureStore.deleteItemAsync('workouts');
              await SecureStore.deleteItemAsync('meals');
              await SecureStore.deleteItemAsync('profile_picture');
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

  const handleSupport = () => {
    Linking.openURL('mailto:support@betteru.app?subject=BetterU Support Request');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy will be available at betteru.app/privacy');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'Terms of service will be available at betteru.app/terms');
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>{title}</Text>
      <View style={[styles.sectionContent, isDark && styles.sectionContentDark]}>
        {children}
      </View>
    </View>
  );

  const SettingRow = ({ 
    icon: Icon, 
    label, 
    value, 
    onPress, 
    showChevron = false,
    toggle = false,
    toggleValue,
    onToggle,
    destructive = false,
  }: { 
    icon: any; 
    label: string; 
    value?: string; 
    onPress?: () => void;
    showChevron?: boolean;
    toggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    destructive?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.settingRow, isDark && styles.settingRowDark]}
      onPress={onPress}
      disabled={toggle}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, destructive && styles.settingIconDestructive, isDark && styles.settingIconDark]}>
          <Icon size={20} color={destructive ? '#ef4444' : '#10b981'} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, destructive && styles.settingLabelDestructive, isDark && styles.textDark]}>
            {label}
          </Text>
          {value && (
            <Text style={[styles.settingValue, isDark && styles.textSecondaryDark]}>{value}</Text>
          )}
        </View>
      </View>
      {toggle && onToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#d1d5db', true: '#86efac' }}
          thumbColor={toggleValue ? '#10b981' : '#f3f4f6'}
        />
      ) : showChevron ? (
        <ChevronRight size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.header, isDark && styles.headerDark]}>
          <Text style={[styles.title, isDark && styles.textDark]}>Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={28} color={isDark ? '#f9fafb' : '#111827'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <SettingSection title="Account">
              <SettingRow
                icon={User}
                label="Profile"
                value="Manage your profile information"
                showChevron
                onPress={() => Alert.alert('Profile', 'Profile editing coming soon')}
              />
              <SettingRow
                icon={Lock}
                label="Change Password"
                value="Update your password"
                showChevron
                onPress={() => Alert.alert('Password', 'Password change coming soon')}
              />
            </SettingSection>

            <SettingSection title="Preferences">
              <SettingRow
                icon={Bell}
                label="Notifications"
                toggle
                toggleValue={notificationsEnabled}
                onToggle={handleNotificationsToggle}
              />
              <SettingRow
                icon={Shield}
                label="Biometric Login"
                toggle
                toggleValue={biometricsEnabled}
                onToggle={handleBiometricsToggle}
              />
              <SettingRow
                icon={Palette}
                label="Dark Mode"
                value="Follows system settings"
                toggle
                toggleValue={darkModeEnabled}
                onToggle={handleDarkModeToggle}
              />
            </SettingSection>

            <SettingSection title="Support">
              <SettingRow
                icon={HelpCircle}
                label="Help Center"
                value="Get help and support"
                showChevron
                onPress={() => Alert.alert('Help', 'Help center coming soon')}
              />
              <SettingRow
                icon={Mail}
                label="Contact Support"
                value="support@betteru.app"
                showChevron
                onPress={handleSupport}
              />
            </SettingSection>

            <SettingSection title="Legal">
              <SettingRow
                icon={Info}
                label="Privacy Policy"
                showChevron
                onPress={handlePrivacy}
              />
              <SettingRow
                icon={Info}
                label="Terms of Service"
                showChevron
                onPress={handleTerms}
              />
            </SettingSection>

            <SettingSection title="Data">
              <SettingRow
                icon={Trash2}
                label="Clear All Data"
                value="Delete all workouts and meals"
                destructive
                onPress={handleClearData}
              />
            </SettingSection>

            <View style={styles.logoutSection}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, isDark && styles.textSecondaryDark]}>
                BetterU v1.0.0
              </Text>
              <Text style={[styles.footerText, isDark && styles.textSecondaryDark]}>
                © 2025 BetterU. All rights reserved.
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
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  textDark: {
    color: '#f9fafb',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionContentDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingRowDark: {
    borderBottomColor: '#374151',
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
  settingIconDestructive: {
    backgroundColor: '#fee2e2',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingLabelDestructive: {
    color: '#ef4444',
  },
  settingValue: {
    fontSize: 13,
    color: '#6b7280',
  },
  logoutSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
