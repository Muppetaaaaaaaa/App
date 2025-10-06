import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch, Alert, useColorScheme, Appearance } from 'react-native';
import { X, Moon, Sun, Bell, Trash2, LogOut, ChevronRight, User, HelpCircle, Info, Globe, DollarSign } from 'lucide-react-native';
import { storage } from '../utils/storage';
import { useState, useEffect } from 'react';
import ProfileEditModal from './ProfileEditModal';
import { useLocalization } from '../hooks/useLocalization';
import { translations, currencySymbols } from '../utils/localization';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function SettingsModal({ visible, onClose, onLogout }: SettingsModalProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const colorScheme = useColorScheme();
  const { language, currency, setLanguage, setCurrency, t } = useLocalization();

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
    loadSettings();
  }, [colorScheme]);

  const loadSettings = async () => {
    try {
      const notifications = await storage.getItem('notifications_enabled');
      const savedLanguage = await storage.getItem('language');
      const savedCurrency = await storage.getItem('currency');
      
      if (notifications !== null) setNotificationsEnabled(notifications === 'true');
      if (savedLanguage) setLanguage(savedLanguage as keyof typeof translations);
      if (savedCurrency) setCurrency(savedCurrency);
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      await storage.setItem(key, value);
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
    saveSetting('notifications_enabled', value.toString());
  };

  const handleLanguageChange = async (newLanguage: keyof typeof translations) => {
    setLanguage(newLanguage);
    await saveSetting('language', newLanguage);
    setShowLanguageSelector(false);
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrency(newCurrency);
    await saveSetting('currency', newCurrency);
    setShowCurrencySelector(false);
  };

  const handleClearData = () => {
    Alert.alert(
      t('deleteAccount'),
      'This will delete all your workouts, meals, and progress. This action cannot be undone.',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.deleteItem('workouts');
              await storage.deleteItem('meals');
              await storage.deleteItem('profile_picture');
              Alert.alert(t('success'), 'All data has been cleared');
            } catch (error) {
              Alert.alert(t('error'), t('failed'));
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      `${t('confirm')}?`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  const languageNames: { [key in keyof typeof translations]: string } = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    pt: 'Português',
    it: 'Italiano',
    ja: '日本語',
    zh: '中文',
  };

  const currencyNames: { [key: string]: string } = {
    USD: 'US Dollar ($)',
    EUR: 'Euro (€)',
    GBP: 'British Pound (£)',
    JPY: 'Japanese Yen (¥)',
    CNY: 'Chinese Yuan (¥)',
    INR: 'Indian Rupee (₹)',
    AUD: 'Australian Dollar (A$)',
    CAD: 'Canadian Dollar (C$)',
    CHF: 'Swiss Franc (CHF)',
    BRL: 'Brazilian Real (R$)',
    MXN: 'Mexican Peso (MX$)',
    ZAR: 'South African Rand (R)',
    KRW: 'South Korean Won (₩)',
    RUB: 'Russian Ruble (₽)',
    SEK: 'Swedish Krona (kr)',
    NOK: 'Norwegian Krone (kr)',
    DKK: 'Danish Krone (kr)',
    PLN: 'Polish Złoty (zł)',
    TRY: 'Turkish Lira (₺)',
    AED: 'UAE Dirham (د.إ)',
    SAR: 'Saudi Riyal (﷼)',
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

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data including workouts, meals, achievements, and profile information.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'This is your last chance. Type DELETE to confirm account deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // Clear all AsyncStorage data
                      await AsyncStorage.clear();
                      
                      // Clear all SecureStore data
                      await SecureStore.deleteItemAsync('user_name');
                      await SecureStore.deleteItemAsync('profile_image');
                      await SecureStore.deleteItemAsync('user_password');
                      
                      Alert.alert(
                        'Account Deleted',
                        'Your account and all data have been permanently deleted.',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              onClose();
                              // In a real app, you would navigate to login screen here
                            },
                          },
                        ]
                      );
                    } catch (error) {
                      console.error('Error deleting account:', error);
                      Alert.alert('Error', 'Failed to delete account. Please try again.');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
          <View style={[styles.header, isDarkMode && styles.headerDark]}>
            <View>
              <Text style={[styles.title, isDarkMode && styles.textDark]}>{t('settingsTitle')}</Text>
              <Text style={[styles.subtitle, isDarkMode && styles.textSecondaryDark]}>
                {t('preferences')}
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
                <Text style={[styles.sectionTitle, isDarkMode && styles.textSecondaryDark]}>{t('preferences').toUpperCase()}</Text>
                
                <SettingCard
                  icon={isDarkMode ? Moon : Sun}
                  title={t('darkMode')}
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

              {/* Localization Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.textSecondaryDark]}>{t('localization').toUpperCase()}</Text>
                
                <SettingCard
                  icon={Globe}
                  title={t('language')}
                  description={languageNames[language]}
                  iconColor="#3b82f6"
                  iconBg={isDarkMode ? '#1e3a8a' : '#dbeafe'}
                  onPress={() => setShowLanguageSelector(true)}
                  rightElement={<ChevronRight size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />}
                />

                <SettingCard
                  icon={DollarSign}
                  title={t('currency')}
                  description={currencyNames[currency] || currency}
                  iconColor="#10b981"
                  iconBg={isDarkMode ? '#064e3b' : '#d1fae5'}
                  onPress={() => setShowCurrencySelector(true)}
                  rightElement={<ChevronRight size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />}
                />
              </View>

              {/* Notifications Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.textSecondaryDark]}>{t('notifications').toUpperCase()}</Text>
                
                <SettingCard
                  icon={Bell}
                  title={t('enableNotifications')}
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

              {/* Account Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.textSecondaryDark]}>{t('account').toUpperCase()}</Text>
                
                <SettingCard
                  icon={User}
                  title={t('editProfile')}
                  description={t('personalInfo')}
                  iconColor="#8b5cf6"
                  iconBg={isDarkMode ? '#4c1d95' : '#ede9fe'}
                  onPress={() => setShowProfileEdit(true)}
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
                  title={t('about')}
                  description={`${t('version')} 1.0.0`}
                  iconColor="#06b6d4"
                  iconBg={isDarkMode ? '#164e63' : '#cffafe'}
                  onPress={() => Alert.alert('BetterU', `${t('version')} 1.0.0\n© 2025 BetterU`)}
                  rightElement={<ChevronRight size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />}
                />
              </View>

              {/* Danger Zone */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>DANGER ZONE</Text>
                
                <SettingCard
                  icon={Trash2}
                  title={t('deleteAccount')}
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
                <Text style={styles.logoutText}>{t('logout')}</Text>
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

      {/* Language Selector Modal */}
      <Modal visible={showLanguageSelector} animationType="slide" presentationStyle="pageSheet" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.selectorModal, isDarkMode && styles.selectorModalDark]}>
            <View style={styles.selectorHeader}>
              <Text style={[styles.selectorTitle, isDarkMode && styles.textDark]}>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setShowLanguageSelector(false)}>
                <X size={24} color={isDarkMode ? '#f9fafb' : '#111827'} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {Object.entries(languageNames).map(([code, name]) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.selectorOption,
                    isDarkMode && styles.selectorOptionDark,
                    language === code && styles.selectorOptionSelected,
                    language === code && isDarkMode && styles.selectorOptionSelectedDark,
                  ]}
                  onPress={() => handleLanguageChange(code as keyof typeof translations)}>
                  <Text style={[
                    styles.selectorOptionText,
                    isDarkMode && styles.textDark,
                    language === code && styles.selectorOptionTextSelected,
                  ]}>
                    {name}
                  </Text>
                  {language === code && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Currency Selector Modal */}
      <Modal visible={showCurrencySelector} animationType="slide" presentationStyle="pageSheet" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.selectorModal, isDarkMode && styles.selectorModalDark]}>
            <View style={styles.selectorHeader}>
              <Text style={[styles.selectorTitle, isDarkMode && styles.textDark]}>{t('selectCurrency')}</Text>
              <TouchableOpacity onPress={() => setShowCurrencySelector(false)}>
                <X size={24} color={isDarkMode ? '#f9fafb' : '#111827'} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {Object.entries(currencyNames).map(([code, name]) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.selectorOption,
                    isDarkMode && styles.selectorOptionDark,
                    currency === code && styles.selectorOptionSelected,
                    currency === code && isDarkMode && styles.selectorOptionSelectedDark,
                  ]}
                  onPress={() => handleCurrencyChange(code)}>
                  <Text style={[
                    styles.selectorOptionText,
                    isDarkMode && styles.textDark,
                    currency === code && styles.selectorOptionTextSelected,
                  ]}>
                    {name}
                  </Text>
                  {currency === code && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      
      {showHelpCenter && (
        <HelpCenter
          visible={showHelpCenter}
          onClose={() => setShowHelpCenter(false)}
        />
      )}
</Modal>

      <ProfileEditModal
        visible={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
        onSave={() => {
          // Refresh profile data if needed
        }}
      />
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  selectorModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 40,
  },
  selectorModalDark: {
    backgroundColor: '#1e293b',
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  selectorOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectorOptionDark: {
    borderBottomColor: '#334155',
  },
  selectorOptionSelected: {
    backgroundColor: '#f0fdf4',
  },
  selectorOptionSelectedDark: {
    backgroundColor: '#064e3b',
  },
  selectorOptionText: {
    fontSize: 17,
    color: '#111827',
  },
  selectorOptionTextSelected: {
    fontWeight: '600',
    color: '#10b981',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
