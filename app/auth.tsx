import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { storage } from '../utils/storage';
import { Lock } from 'lucide-react-native';
import { useLocalization } from '../hooks/useLocalization';

const REQUIRED_PASSWORD = 'FIT2025';

export default function AuthScreen() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useLocalization();

  const handlePasswordLogin = async () => {
    if (!password) {
      Alert.alert(t('passwordRequired'), t('pleaseEnterPassword'));
      return;
    }

    setLoading(true);

    // Simulate a small delay for better UX
    setTimeout(async () => {
      if (password === REQUIRED_PASSWORD) {
        try {
          await storage.setItem('isAuthenticated', 'true');
          router.replace('/(tabs)/calories');
        } catch (error) {
          Alert.alert(t('error'), t('authError'));
        }
      } else {
        Alert.alert(t('incorrectPassword'), t('incorrectPasswordMessage'));
        setPassword('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/BetterUlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.appName, isDark && styles.textDark]}>{t('appName')}</Text>
            <Text style={[styles.tagline, isDark && styles.textSecondaryDark]}>
              {t('tagline')}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <Lock size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder={t('enterPassword')}
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                onSubmitEditing={handlePasswordLogin}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handlePasswordLogin}
              disabled={loading}>
              <Text style={styles.loginButtonText}>
                {loading ? t('loggingIn') : t('login')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  textDark: {
    color: '#f9fafb',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputContainerDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputDark: {
    color: '#f9fafb',
  },
  loginButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
});
