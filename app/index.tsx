import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { storage } from '../utils/storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const hasPassword = await storage.getItem('app_password');
    if (hasPassword) {
      router.replace('/auth');
    } else {
      router.replace('/auth');
    }
  };

  return null;
}
