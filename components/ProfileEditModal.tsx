import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { X, User, FileText } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ProfileEditModal({ visible, onClose, onSave }: ProfileEditModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (visible) {
      loadProfile();
    }
  }, [visible]);

  const loadProfile = async () => {
    try {
      const savedName = await storage.getItem('profile_name');
      const savedDescription = await storage.getItem('profile_description');
      
      if (savedName) setName(savedName);
      if (savedDescription) setDescription(savedDescription);
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await storage.setItem('profile_name', name.trim());
      await storage.setItem('profile_description', description.trim());
      Alert.alert('Success', 'Profile updated successfully');
      onSave();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <User size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text style={[styles.label, isDark && styles.textDark]}>Name</Text>
              </View>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Enter your name"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <FileText size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text style={[styles.label, isDark && styles.textDark]}>Description</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea, isDark && styles.inputDark]}
                placeholder="Tell us about yourself..."
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={[styles.modalFooter, isDark && styles.modalFooterDark]}>
            <TouchableOpacity
              style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
              onPress={onClose}>
              <Text style={[styles.cancelButtonText, isDark && styles.textDark]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}>
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalContentDark: {
    backgroundColor: '#1f2937',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  textDark: {
    color: '#f9fafb',
  },
  modalBody: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
    color: '#f9fafb',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalFooterDark: {
    borderTopColor: '#374151',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  cancelButtonDark: {
    backgroundColor: '#374151',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#10b981',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
