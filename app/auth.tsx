import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

export default function AuthScreen() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    checkSetup();
    checkBiometrics();
  }, []);

  const checkSetup = async () => {
    const storedPassword = await SecureStore.getItemAsync('app_password');
    setIsSettingUp(!storedPassword);
  };

  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (compatible && enrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock BetterU',
        fallbackLabel: 'Use password',
      });
      
      if (result.success) {
        router.replace('/(tabs)/plans');
      }
    }
  };

  const handleSetupPassword = async () => {
    if (password.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    await SecureStore.setItemAsync('app_password', password);
    Alert.alert('Success', 'Password set successfully!');
    router.replace('/(tabs)/plans');
  };

  const handleLogin = async () => {
    const storedPassword = await SecureStore.getItemAsync('app_password');
    
    if (password === storedPassword) {
      router.replace('/(tabs)/plans');
    } else {
      Alert.alert('Error', 'Incorrect password');
      setPassword('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.content}>
        <View style={[styles.logoContainer, isDark && styles.logoContainerDark]}>
          <Lock size={64} color="#10b981" />
        </View>
        
        <Text style={[styles.title, isDark && styles.titleDark]}>
          {isSettingUp ? 'Set Up Password' : 'Welcome to BetterU'}
        </Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          {isSettingUp ? 'Create a password to secure your app' : 'Enter your password to continue'}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Password"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              ) : (
                <Eye size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              )}
            </TouchableOpacity>
          </View>

          {isSettingUp && (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Confirm Password"
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={isSettingUp ? handleSetupPassword : handleLogin}>
            <Text style={styles.buttonText}>
              {isSettingUp ? 'Set Password' : 'Unlock'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 32,
  },
  logoContainerDark: {
    backgroundColor: '#064e3b',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleDark: {
    color: '#f9fafb',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 48,
  },
  subtitleDark: {
    color: '#9ca3af',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    color: '#f9fafb',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  button: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
