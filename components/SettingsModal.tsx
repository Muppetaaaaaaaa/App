import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { X, User, Dumbbell, Bell, Shield, Circle as HelpCircle, Info, Palette, Globe, DollarSign, Monitor, LogOut, ChevronRight } from 'lucide-react-native';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [mealReminders, setMealReminders] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingsItem = ({
    icon: Icon,
    label,
    value,
    onPress,
    showChevron = true,
  }: {
    icon: any;
    label: string;
    value?: string;
    onPress: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color="#6b7280" />
        </View>
        <Text style={styles.settingsItemLabel}>{label}</Text>
      </View>
      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.settingsItemValue}>{value}</Text>}
        {showChevron && <ChevronRight size={20} color="#9ca3af" />}
      </View>
    </TouchableOpacity>
  );

  const SettingsToggle = ({
    icon: Icon,
    label,
    value,
    onValueChange,
  }: {
    icon: any;
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingsItem}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color="#6b7280" />
        </View>
        <Text style={styles.settingsItemLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d5db', true: '#86efac' }}
        thumbColor={value ? '#10b981' : '#f3f4f6'}
      />
    </View>
  );

  return (
    <Modal visible={true} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={28} color="#111827" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SettingsSection title="Account">
            <SettingsItem
              icon={User}
              label="Edit Profile"
              onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
            />
          </SettingsSection>

          <SettingsSection title="Preferences">
            <SettingsItem
              icon={Dumbbell}
              label="Workout Preferences"
              onPress={() => Alert.alert('Workout Preferences', 'Set your workout preferences')}
            />
          </SettingsSection>

          <SettingsSection title="Notifications">
            <SettingsToggle
              icon={Bell}
              label="Enable Notifications"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            {notificationsEnabled && (
              <>
                <SettingsToggle
                  icon={Dumbbell}
                  label="Workout Reminders"
                  value={workoutReminders}
                  onValueChange={setWorkoutReminders}
                />
                <SettingsToggle
                  icon={Bell}
                  label="Meal Reminders"
                  value={mealReminders}
                  onValueChange={setMealReminders}
                />
              </>
            )}
          </SettingsSection>

          <SettingsSection title="Privacy & Security">
            <SettingsItem
              icon={Shield}
              label="Privacy Settings"
              onPress={() => Alert.alert('Privacy', 'Manage your privacy settings')}
            />
            <SettingsItem
              icon={Shield}
              label="Security"
              onPress={() => Alert.alert('Security', 'Manage security settings')}
            />
          </SettingsSection>

          <SettingsSection title="Support">
            <SettingsItem
              icon={HelpCircle}
              label="Help & Support"
              onPress={() => Alert.alert('Help', 'Contact support at help@betteru.com')}
            />
            <SettingsItem
              icon={Info}
              label="About"
              value="v1.0.0"
              onPress={() => Alert.alert('About BetterU', 'Version 1.0.0\nMade with ❤️')}
            />
          </SettingsSection>

          <SettingsSection title="App Settings">
            <SettingsItem
              icon={Palette}
              label="Theme"
              value={theme.charAt(0).toUpperCase() + theme.slice(1)}
              onPress={() => {
                Alert.alert(
                  'Select Theme',
                  'Choose your preferred theme',
                  [
                    { text: 'Light', onPress: () => setTheme('light') },
                    { text: 'Dark', onPress: () => setTheme('dark') },
                    { text: 'System', onPress: () => setTheme('system') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            />
            <SettingsItem
              icon={Globe}
              label="Language"
              value={language}
              onPress={() => {
                Alert.alert(
                  'Select Language',
                  'Choose your preferred language',
                  [
                    { text: 'English', onPress: () => setLanguage('English') },
                    { text: 'Spanish', onPress: () => setLanguage('Spanish') },
                    { text: 'French', onPress: () => setLanguage('French') },
                    { text: 'German', onPress: () => setLanguage('German') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            />
            <SettingsItem
              icon={DollarSign}
              label="Currency"
              value={currency}
              onPress={() => {
                Alert.alert(
                  'Select Currency',
                  'Choose your preferred currency',
                  [
                    { text: 'USD', onPress: () => setCurrency('USD') },
                    { text: 'EUR', onPress: () => setCurrency('EUR') },
                    { text: 'GBP', onPress: () => setCurrency('GBP') },
                    { text: 'JPY', onPress: () => setCurrency('JPY') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            />
          </SettingsSection>

          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>BetterU Fitness</Text>
            <Text style={styles.footerSubtext}>Your journey to better health</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsItemValue: {
    fontSize: 15,
    color: '#6b7280',
  },
  logoutContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});
