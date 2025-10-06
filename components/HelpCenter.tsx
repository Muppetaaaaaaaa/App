import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Linking, useColorScheme } from 'react-native';
import { X, ChevronRight, Mail, MessageCircle, Book, HelpCircle } from 'lucide-react-native';
import { useLocalization } from '../utils/localization';

interface HelpCenterProps {
  visible: boolean;
  onClose: () => void;
}

export default function HelpCenter({ visible, onClose }: HelpCenterProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useLocalization();

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      items: [
        { question: 'How do I set up my profile?', answer: 'Go to the Profile tab and tap the settings icon. You can set your name, profile picture, and complete the onboarding to set your calorie goals.' },
        { question: 'How do I track my workouts?', answer: 'Navigate to the Workouts tab and tap "Start Workout". Add exercises, sets, and reps, then complete your workout to save it.' },
        { question: 'How do I log my meals?', answer: 'Go to the Calories tab and tap the "+" button. You can scan barcodes or manually enter food items.' },
      ],
    },
    {
      id: 'workouts',
      title: 'Workouts',
      icon: HelpCircle,
      items: [
        { question: 'How do I create a custom workout?', answer: 'In the Workouts tab, tap "Start Workout" and add your exercises. You can customize sets, reps, and rest times for each exercise.' },
        { question: 'Can I track my progress?', answer: 'Yes! Your workout history is automatically saved. Check your Profile tab to see your total workouts and current streak.' },
        { question: 'What are achievements?', answer: 'Achievements are rewards you earn for reaching milestones like completing your first workout, maintaining streaks, or hitting workout goals.' },
      ],
    },
    {
      id: 'nutrition',
      title: 'Nutrition & Calories',
      icon: HelpCircle,
      items: [
        { question: 'How are my calorie goals calculated?', answer: 'We use the Mifflin-St Jeor equation based on your age, weight, height, activity level, and goals to calculate personalized calorie and macro targets.' },
        { question: 'How do I scan food barcodes?', answer: 'In the Calories tab, tap the "+" button and select the barcode scanner. Point your camera at the product barcode to automatically log nutritional information.' },
        { question: 'Can I adjust my goals?', answer: 'Yes! Go to Profile > Settings and tap "Recalculate Goals" to update your calorie and macro targets.' },
      ],
    },
    {
      id: 'settings',
      title: 'Settings & Preferences',
      icon: HelpCircle,
      items: [
        { question: 'How do I change the app language?', answer: 'Go to Profile > Settings and select your preferred language from the Language option. The app supports 8 languages.' },
        { question: 'How do I change the currency?', answer: 'Go to Profile > Settings and select your preferred currency. We support 21 different currencies.' },
        { question: 'How do I enable dark mode?', answer: 'Dark mode automatically follows your device settings. Change your device theme to switch between light and dark mode.' },
      ],
    },
  ];

  const contactOptions = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Get help via email',
      icon: Mail,
      action: () => Linking.openURL('mailto:support@betteru.fitness'),
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      description: 'Share your thoughts',
      icon: MessageCircle,
      action: () => Linking.openURL('mailto:feedback@betteru.fitness?subject=App Feedback'),
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.header, isDark && styles.headerDark]}>
          <Text style={[styles.title, isDark && styles.textDark]}>Help Center</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={isDark ? '#f9fafb' : '#111827'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Frequently Asked Questions</Text>

          {helpCategories.map((category) => (
            <View key={category.id} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <category.icon size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                <Text style={[styles.categoryTitle, isDark && styles.textDark]}>{category.title}</Text>
              </View>

              {category.items.map((item, index) => (
                <View key={index} style={[styles.faqItem, isDark && styles.faqItemDark]}>
                  <Text style={[styles.question, isDark && styles.textDark]}>{item.question}</Text>
                  <Text style={[styles.answer, isDark && styles.textSecondaryDark]}>{item.answer}</Text>
                </View>
              ))}
            </View>
          ))}

          <Text style={[styles.sectionTitle, isDark && styles.textDark, { marginTop: 32 }]}>Contact Us</Text>

          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.contactOption, isDark && styles.contactOptionDark]}
              onPress={option.action}
            >
              <View style={styles.contactIconContainer}>
                <option.icon size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactTitle, isDark && styles.textDark]}>{option.title}</Text>
                <Text style={[styles.contactDescription, isDark && styles.textSecondaryDark]}>
                  {option.description}
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          ))}

          <View style={styles.footer}>
            <Text style={[styles.footerText, isDark && styles.textSecondaryDark]}>
              BetterU Fitness v1.0.0
            </Text>
            <Text style={[styles.footerText, isDark && styles.textSecondaryDark]}>
              © 2025 BetterU. All rights reserved.
            </Text>
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
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerDark: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  textDark: {
    color: '#f9fafb',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  faqItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  faqItemDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  contactOptionDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
