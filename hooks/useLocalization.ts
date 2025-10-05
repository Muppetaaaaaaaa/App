import { useState, useEffect } from 'react';
import { getDeviceLanguage, getDeviceCurrency, getCurrencySymbol, t as translate, formatCurrency as formatCurrencyUtil, translations } from '../utils/localization';
import { storage } from '../utils/storage';

export function useLocalization() {
  const [language, setLanguageState] = useState<keyof typeof translations>(getDeviceLanguage());
  const [currency, setCurrencyState] = useState(getDeviceCurrency());

  useEffect(() => {
    // Load saved preferences or use device defaults
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedLanguage = await storage.getItem('language');
      const savedCurrency = await storage.getItem('currency');
      
      if (savedLanguage) {
        setLanguageState(savedLanguage as keyof typeof translations);
      } else {
        setLanguageState(getDeviceLanguage());
      }
      
      if (savedCurrency) {
        setCurrencyState(savedCurrency);
      } else {
        setCurrencyState(getDeviceCurrency());
      }
    } catch (error) {
      console.log('Error loading localization preferences:', error);
      setLanguageState(getDeviceLanguage());
      setCurrencyState(getDeviceCurrency());
    }
  };

  const setLanguage = async (newLanguage: keyof typeof translations) => {
    setLanguageState(newLanguage);
    try {
      await storage.setItem('language', newLanguage);
    } catch (error) {
      console.log('Error saving language preference:', error);
    }
  };

  const setCurrency = async (newCurrency: string) => {
    setCurrencyState(newCurrency);
    try {
      await storage.setItem('currency', newCurrency);
    } catch (error) {
      console.log('Error saving currency preference:', error);
    }
  };

  const t = (key: keyof typeof translations.en) => translate(key, language);
  
  const formatCurrency = (amount: number) => formatCurrencyUtil(amount, currency);
  
  const currencySymbol = getCurrencySymbol(currency);

  return {
    language,
    currency,
    currencySymbol,
    t,
    formatCurrency,
    setLanguage,
    setCurrency,
  };
}
