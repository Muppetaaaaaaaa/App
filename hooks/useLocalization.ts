import { useState, useEffect } from 'react';
import { getDeviceLanguage, getDeviceCurrency, getCurrencySymbol, t as translate, formatCurrency as formatCurrencyUtil, translations } from '../utils/localization';

export function useLocalization() {
  const [language, setLanguage] = useState<keyof typeof translations>(getDeviceLanguage());
  const [currency, setCurrency] = useState(getDeviceCurrency());

  useEffect(() => {
    // Initialize with device settings
    setLanguage(getDeviceLanguage());
    setCurrency(getDeviceCurrency());
  }, []);

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
