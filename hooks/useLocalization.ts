import { useState, useEffect, useCallback } from 'react';
import { getDeviceLanguage, getDeviceCurrency, getCurrencySymbol, t as translate, formatCurrency as formatCurrencyUtil, translations } from '../utils/localization';
import { storage } from '../utils/storage';

// Global state to trigger re-renders across all components
let globalLanguage: keyof typeof translations = getDeviceLanguage();
let globalCurrency: string = getDeviceCurrency();
const listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useLocalization() {
  const [language, setLanguageState] = useState<keyof typeof translations>(globalLanguage);
  const [currency, setCurrencyState] = useState(globalCurrency);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Load saved preferences or use device defaults
    loadPreferences();
    
    // Register listener for global updates
    const listener = () => {
      setLanguageState(globalLanguage);
      setCurrencyState(globalCurrency);
      forceUpdate({});
    };
    
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const loadPreferences = async () => {
    try {
      const savedLanguage = await storage.getItem('language');
      const savedCurrency = await storage.getItem('currency');
      
      if (savedLanguage) {
        globalLanguage = savedLanguage as keyof typeof translations;
        setLanguageState(globalLanguage);
      } else {
        globalLanguage = getDeviceLanguage();
        setLanguageState(globalLanguage);
      }
      
      if (savedCurrency) {
        globalCurrency = savedCurrency;
        setCurrencyState(globalCurrency);
      } else {
        globalCurrency = getDeviceCurrency();
        setCurrencyState(globalCurrency);
      }
    } catch (error) {
      console.log('Error loading localization preferences:', error);
      globalLanguage = getDeviceLanguage();
      globalCurrency = getDeviceCurrency();
      setLanguageState(globalLanguage);
      setCurrencyState(globalCurrency);
    }
  };

  const setLanguage = useCallback(async (newLanguage: keyof typeof translations) => {
    globalLanguage = newLanguage;
    setLanguageState(newLanguage);
    
    try {
      await storage.setItem('language', newLanguage);
    } catch (error) {
      console.log('Error saving language preference:', error);
    }
    
    // Notify all components to re-render
    notifyListeners();
  }, []);

  const setCurrency = useCallback(async (newCurrency: string) => {
    globalCurrency = newCurrency;
    setCurrencyState(newCurrency);
    
    try {
      await storage.setItem('currency', newCurrency);
    } catch (error) {
      console.log('Error saving currency preference:', error);
    }
    
    // Notify all components to re-render
    notifyListeners();
  }, []);

  const t = useCallback((key: keyof typeof translations.en) => translate(key, language), [language]);
  
  const formatCurrency = useCallback((amount: number) => formatCurrencyUtil(amount, currency), [currency]);
  
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
