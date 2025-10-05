import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const hasPassword = await SecureStore.getItemAsync('app_password');
    if (hasPassword) {
      router.replace('/auth');
    } else {
      router.replace('/auth');
    }
  };

  return null;
}
