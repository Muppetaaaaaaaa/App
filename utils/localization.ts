import * as Localization from 'expo-localization';

// Language translations
export const translations = {
  en: {
    appName: 'BetterU',
    tagline: 'Your fitness journey starts here',
    enterPassword: 'Enter Password',
    login: 'Login',
    loggingIn: 'Logging in...',
    passwordRequired: 'Password Required',
    pleaseEnterPassword: 'Please enter your password',
    incorrectPassword: 'Incorrect Password',
    incorrectPasswordMessage: 'The password you entered is incorrect. Please try again.',
    error: 'Error',
    authError: 'Failed to save authentication state',
    calories: 'Calories',
    workouts: 'Workouts',
    plans: 'Plans',
    profile: 'Profile',
  },
  es: {
    appName: 'BetterU',
    tagline: 'Tu viaje de fitness comienza aquí',
    enterPassword: 'Ingrese la contraseña',
    login: 'Iniciar sesión',
    loggingIn: 'Iniciando sesión...',
    passwordRequired: 'Contraseña requerida',
    pleaseEnterPassword: 'Por favor ingrese su contraseña',
    incorrectPassword: 'Contraseña incorrecta',
    incorrectPasswordMessage: 'La contraseña que ingresó es incorrecta. Por favor, inténtelo de nuevo.',
    error: 'Error',
    authError: 'Error al guardar el estado de autenticación',
    calories: 'Calorías',
    workouts: 'Entrenamientos',
    plans: 'Planes',
    profile: 'Perfil',
  },
  fr: {
    appName: 'BetterU',
    tagline: 'Votre parcours fitness commence ici',
    enterPassword: 'Entrez le mot de passe',
    login: 'Connexion',
    loggingIn: 'Connexion en cours...',
    passwordRequired: 'Mot de passe requis',
    pleaseEnterPassword: 'Veuillez entrer votre mot de passe',
    incorrectPassword: 'Mot de passe incorrect',
    incorrectPasswordMessage: 'Le mot de passe que vous avez entré est incorrect. Veuillez réessayer.',
    error: 'Erreur',
    authError: "Échec de l'enregistrement de l'état d'authentification",
    calories: 'Calories',
    workouts: 'Entraînements',
    plans: 'Plans',
    profile: 'Profil',
  },
  de: {
    appName: 'BetterU',
    tagline: 'Ihre Fitnessreise beginnt hier',
    enterPassword: 'Passwort eingeben',
    login: 'Anmelden',
    loggingIn: 'Anmeldung läuft...',
    passwordRequired: 'Passwort erforderlich',
    pleaseEnterPassword: 'Bitte geben Sie Ihr Passwort ein',
    incorrectPassword: 'Falsches Passwort',
    incorrectPasswordMessage: 'Das eingegebene Passwort ist falsch. Bitte versuchen Sie es erneut.',
    error: 'Fehler',
    authError: 'Fehler beim Speichern des Authentifizierungsstatus',
    calories: 'Kalorien',
    workouts: 'Workouts',
    plans: 'Pläne',
    profile: 'Profil',
  },
  pt: {
    appName: 'BetterU',
    tagline: 'Sua jornada fitness começa aqui',
    enterPassword: 'Digite a senha',
    login: 'Entrar',
    loggingIn: 'Entrando...',
    passwordRequired: 'Senha necessária',
    pleaseEnterPassword: 'Por favor, digite sua senha',
    incorrectPassword: 'Senha incorreta',
    incorrectPasswordMessage: 'A senha que você digitou está incorreta. Por favor, tente novamente.',
    error: 'Erro',
    authError: 'Falha ao salvar o estado de autenticação',
    calories: 'Calorias',
    workouts: 'Treinos',
    plans: 'Planos',
    profile: 'Perfil',
  },
  it: {
    appName: 'BetterU',
    tagline: 'Il tuo viaggio fitness inizia qui',
    enterPassword: 'Inserisci la password',
    login: 'Accedi',
    loggingIn: 'Accesso in corso...',
    passwordRequired: 'Password richiesta',
    pleaseEnterPassword: 'Inserisci la tua password',
    incorrectPassword: 'Password errata',
    incorrectPasswordMessage: 'La password inserita non è corretta. Riprova.',
    error: 'Errore',
    authError: "Impossibile salvare lo stato di autenticazione",
    calories: 'Calorie',
    workouts: 'Allenamenti',
    plans: 'Piani',
    profile: 'Profilo',
  },
  ja: {
    appName: 'BetterU',
    tagline: 'あなたのフィットネスの旅はここから始まります',
    enterPassword: 'パスワードを入力',
    login: 'ログイン',
    loggingIn: 'ログイン中...',
    passwordRequired: 'パスワードが必要です',
    pleaseEnterPassword: 'パスワードを入力してください',
    incorrectPassword: 'パスワードが正しくありません',
    incorrectPasswordMessage: '入力されたパスワードが正しくありません。もう一度お試しください。',
    error: 'エラー',
    authError: '認証状態の保存に失敗しました',
    calories: 'カロリー',
    workouts: 'ワークアウト',
    plans: 'プラン',
    profile: 'プロフィール',
  },
  zh: {
    appName: 'BetterU',
    tagline: '您的健身之旅从这里开始',
    enterPassword: '输入密码',
    login: '登录',
    loggingIn: '登录中...',
    passwordRequired: '需要密码',
    pleaseEnterPassword: '请输入您的密码',
    incorrectPassword: '密码错误',
    incorrectPasswordMessage: '您输入的密码不正确。请重试。',
    error: '错误',
    authError: '保存认证状态失败',
    calories: '卡路里',
    workouts: '锻炼',
    plans: '计划',
    profile: '个人资料',
  },
};

// Currency symbols based on locale
export const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  BRL: 'R$',
  MXN: 'MX$',
  ZAR: 'R',
  KRW: '₩',
  RUB: '₽',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  TRY: '₺',
  AED: 'د.إ',
  SAR: '﷼',
};

// Get language based on device locale
export function getDeviceLanguage(): keyof typeof translations {
  const locales = Localization.getLocales();
  const primaryLocale = locales[0];
  
  if (!primaryLocale) return 'en';
  
  const languageCode = primaryLocale.languageCode;
  
  // Map language codes to supported languages
  if (languageCode === 'es') return 'es';
  if (languageCode === 'fr') return 'fr';
  if (languageCode === 'de') return 'de';
  if (languageCode === 'pt') return 'pt';
  if (languageCode === 'it') return 'it';
  if (languageCode === 'ja') return 'ja';
  if (languageCode === 'zh') return 'zh';
  
  return 'en'; // Default to English
}

// Get currency based on device locale
export function getDeviceCurrency(): string {
  const locales = Localization.getLocales();
  const primaryLocale = locales[0];
  
  if (!primaryLocale || !primaryLocale.currencyCode) {
    return 'USD'; // Default to USD
  }
  
  return primaryLocale.currencyCode;
}

// Get currency symbol
export function getCurrencySymbol(currencyCode?: string): string {
  const currency = currencyCode || getDeviceCurrency();
  return currencySymbols[currency] || currency;
}

// Get translation
export function t(key: keyof typeof translations.en, lang?: keyof typeof translations): string {
  const language = lang || getDeviceLanguage();
  return translations[language][key] || translations.en[key];
}

// Format currency
export function formatCurrency(amount: number, currencyCode?: string): string {
  const currency = currencyCode || getDeviceCurrency();
  const symbol = getCurrencySymbol(currency);
  
  // Format with 2 decimal places
  const formatted = amount.toFixed(2);
  
  // Some currencies put symbol after the amount
  const symbolAfter = ['SEK', 'NOK', 'DKK', 'PLN'];
  
  if (symbolAfter.includes(currency)) {
    return `${formatted} ${symbol}`;
  }
  
  return `${symbol}${formatted}`;
}
