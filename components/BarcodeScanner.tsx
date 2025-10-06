import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Alert, TextInput, useColorScheme } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalization } from '../utils/localization';
import { useState } from 'react';
import { X } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

interface BarcodeScannerProps {
  onClose: () => void;
  onScan: (data: any) => void;
}

const CircularProgress = ({ value, max, color, label }: { value: number; max: number; color: string; label: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={styles.circularProgress}>
      <Svg width="80" height="80">
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke={isDark ? '#374151' : '#e5e7eb'}
          strokeWidth="8"
          fill="none"
        />
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
      </Svg>
      <View style={styles.circularProgressText}>
        <Text style={[styles.circularProgressValue, isDark && styles.textDark]}>{Math.round(value)}g</Text>
      </View>
      <Text style={[styles.circularProgressLabel, isDark && styles.textSecondaryDark]}>{label}</Text>
    </View>
  );
};

export default function BarcodeScanner({ onClose, onScan }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [portionType, setPortionType] = useState<'portions' | 'grams'>('portions');
  const [amount, setAmount] = useState('1');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useLocalization();

  if (!permission) {
    return (
      <Modal visible={true} animationType="slide">
        <View style={[styles.container, isDark && styles.containerDark]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={[styles.loadingText, isDark && styles.textDark]}>Loading camera...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={true} animationType="slide">
        <View style={[styles.container, isDark && styles.containerDark]}>
          <View style={styles.permissionContainer}>
            <Text style={[styles.permissionTitle, isDark && styles.textDark]}>Camera Permission Required</Text>
            <Text style={[styles.permissionText, isDark && styles.textDark]}>
              We need your permission to use the camera for scanning barcodes
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!scanning || loading) return;

    setScanning(false);
    setLoading(true);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const result = await response.json();

      if (result.status === 1 && result.product) {
        setScannedProduct(result.product);
        setLoading(false);
      } else {
        Alert.alert(
          'Product Not Found',
          'This product is not in our database. Please add it manually.',
          [
            {
              text: 'OK',
              onPress: () => {
                setScanning(true);
                setLoading(false);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch product information. Please try again or add manually.',
        [
          {
            text: 'OK',
            onPress: () => {
              setScanning(true);
              setLoading(false);
            },
          },
        ]
      );
    }
  };

  const handleConfirm = () => {
    if (!scannedProduct || !amount) return;

    // OpenFoodFacts API returns nutritional values per 100g by default
    let multiplier = 1;

    if (portionType === 'portions') {
      // For portions, multiply by the serving size (in grams) divided by 100
      const servingSize = scannedProduct.serving_quantity || 100;
      multiplier = parseFloat(amount) * (servingSize / 100);
    } else {
      // For grams, divide the entered amount by 100 (since values are per 100g)
      multiplier = parseFloat(amount) / 100;
    }

    const adjustedProduct = {
      ...scannedProduct,
      nutriments: {
        'energy-kcal': (scannedProduct.nutriments?.['energy-kcal'] || 0) * multiplier,
        proteins: (scannedProduct.nutriments?.proteins || 0) * multiplier,
        carbohydrates: (scannedProduct.nutriments?.carbohydrates || 0) * multiplier,
        fat: (scannedProduct.nutriments?.fat || 0) * multiplier,
      },
      serving_info: `${amount} ${portionType === 'portions' ? 'portion(s)' : 'grams'}`,
    };

    onScan(adjustedProduct);
  };

  if (scannedProduct) {
    // OpenFoodFacts API returns nutritional values per 100g by default
    const servingSize = scannedProduct.serving_quantity || 100;
    let multiplier = 1;

    if (portionType === 'portions') {
      // For portions, multiply by the serving size (in grams) divided by 100
      multiplier = parseFloat(amount || '1') * (servingSize / 100);
    } else {
      // For grams, divide the entered amount by 100 (since values are per 100g)
      multiplier = parseFloat(amount || '100') / 100;
    }

    const calories = Math.round((scannedProduct.nutriments?.['energy-kcal'] || 0) * multiplier);
    const protein = (scannedProduct.nutriments?.proteins || 0) * multiplier;
    const carbs = (scannedProduct.nutriments?.carbohydrates || 0) * multiplier;
    const fat = (scannedProduct.nutriments?.fat || 0) * multiplier;

    return (
      <Modal visible={true} animationType="slide">
        <View style={[styles.container, isDark && styles.containerDark]}>
          <View style={[styles.header, isDark && styles.headerDark]}>
            <Text style={[styles.title, isDark && styles.textDark]}>{t('confirmServing')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={28} color={isDark ? '#f9fafb' : '#111827'} />
            </TouchableOpacity>
          </View>

          <View style={[styles.confirmContent, isDark && styles.confirmContentDark]}>
            <Text style={[styles.productName, isDark && styles.textDark]}>
              {scannedProduct.product_name || t('unknownProduct')}
            </Text>
            <Text style={[styles.servingInfo, isDark && styles.textSecondaryDark]}>
              {t('perServing')}: {servingSize}g
            </Text>

            <View style={styles.portionSelector}>
              <TouchableOpacity
                style={[
                  styles.portionOption,
                  portionType === 'portions' && styles.portionOptionActive,
                  isDark && styles.portionOptionDark,
                ]}
                onPress={() => {
                  setPortionType('portions');
                  setAmount('1');
                }}>
                <Text style={[
                  styles.portionText,
                  portionType === 'portions' && styles.portionTextActive,
                ]}>
                  {t('portions')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.portionOption,
                  portionType === 'grams' && styles.portionOptionActive,
                  isDark && styles.portionOptionDark,
                ]}
                onPress={() => {
                  setPortionType('grams');
                  setAmount(servingSize.toString());
                }}>
                <Text style={[
                  styles.portionText,
                  portionType === 'grams' && styles.portionTextActive,
                ]}>
                  {t('grams')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>
                {portionType === 'portions' ? t('numberOfPortions') : t('amountInGrams')}
              </Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder={portionType === 'portions' ? '1' : servingSize.toString()}
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.nutritionPreview, isDark && styles.nutritionPreviewDark]}>
              <Text style={[styles.previewTitle, isDark && styles.textDark]}>Nutrition Preview</Text>
              <Text style={[styles.caloriesLarge, isDark && styles.textDark]}>{calories} kcal</Text>
              
              <View style={styles.macrosContainer}>
                <CircularProgress value={protein} max={100} color="#3b82f6" label="Protein" />
                <CircularProgress value={carbs} max={100} color="#f59e0b" label="Carbs" />
                <CircularProgress value={fat} max={100} color="#ef4444" label="Fat" />
              </View>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>{t('addToDiary')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={true} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('scanBarcode')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
          }}>
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.instruction}>
              Position barcode within the frame
            </Text>
          </View>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingOverlayText}>Fetching product info...</Text>
            </View>
          )}
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerDark: {
    backgroundColor: '#1f2937',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#10b981',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instruction: {
    marginTop: 40,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  textDark: {
    color: '#f9fafb',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 280,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  confirmContent: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  confirmContentDark: {
    backgroundColor: '#111827',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  servingInfo: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  portionSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  portionOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  portionOptionDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  portionOptionActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  portionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  portionTextActive: {
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    color: '#111827',
    textAlign: 'center',
  },
  inputDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    color: '#f9fafb',
  },
  nutritionPreview: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  nutritionPreviewDark: {
    backgroundColor: '#1f2937',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  caloriesLarge: {
    fontSize: 36,
    fontWeight: '700',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 24,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  circularProgress: {
    alignItems: 'center',
  },
  circularProgressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  circularProgressLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
