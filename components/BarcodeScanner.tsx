import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Alert, TextInput, useColorScheme } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { X } from 'lucide-react-native';

interface BarcodeScannerProps {
  onClose: () => void;
  onScan: (data: any) => void;
}

export default function BarcodeScanner({ onClose, onScan }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [portionType, setPortionType] = useState<'portions' | 'grams'>('portions');
  const [amount, setAmount] = useState('1');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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

    const multiplier = portionType === 'portions' 
      ? parseFloat(amount) 
      : parseFloat(amount) / 100;

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
    return (
      <Modal visible={true} animationType="slide">
        <View style={[styles.container, isDark && styles.containerDark]}>
          <View style={[styles.header, isDark && styles.headerDark]}>
            <Text style={styles.title}>Confirm Serving</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.confirmContent}>
            <Text style={[styles.productName, isDark && styles.textDark]}>
              {scannedProduct.product_name || 'Unknown Product'}
            </Text>

            <View style={styles.portionSelector}>
              <TouchableOpacity
                style={[
                  styles.portionOption,
                  portionType === 'portions' && styles.portionOptionActive,
                  isDark && styles.portionOptionDark,
                ]}
                onPress={() => setPortionType('portions')}>
                <Text style={[
                  styles.portionText,
                  portionType === 'portions' && styles.portionTextActive,
                  isDark && styles.textDark,
                ]}>
                  Portions
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.portionOption,
                  portionType === 'grams' && styles.portionOptionActive,
                  isDark && styles.portionOptionDark,
                ]}
                onPress={() => setPortionType('grams')}>
                <Text style={[
                  styles.portionText,
                  portionType === 'grams' && styles.portionTextActive,
                  isDark && styles.textDark,
                ]}>
                  Grams
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>
                {portionType === 'portions' ? 'Number of Portions' : 'Amount in Grams'}
              </Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder={portionType === 'portions' ? '1' : '100'}
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.nutritionPreview, isDark && styles.nutritionPreviewDark]}>
              <Text style={[styles.previewTitle, isDark && styles.textDark]}>Nutrition Preview</Text>
              <Text style={[styles.previewText, isDark && styles.textDark]}>
                Calories: {Math.round((scannedProduct.nutriments?.['energy-kcal'] || 0) * (portionType === 'portions' ? parseFloat(amount || '1') : parseFloat(amount || '100') / 100))} kcal
              </Text>
              <Text style={[styles.previewText, isDark && styles.textDark]}>
                Protein: {Math.round((scannedProduct.nutriments?.proteins || 0) * (portionType === 'portions' ? parseFloat(amount || '1') : parseFloat(amount || '100') / 100))}g
              </Text>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Add to Diary</Text>
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
          <Text style={styles.title}>Scan Barcode</Text>
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
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
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
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  nutritionPreviewDark: {
    backgroundColor: '#1f2937',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
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
