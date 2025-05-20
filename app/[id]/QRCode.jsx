import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ProjectContext } from './context';

/**
 * Renders a QR code scanning interface using the camera.
 * It handles camera permissions, scans QR codes, and extracts location IDs from the scanned data. 
 * The component allows users to grant permissions and scan again after a successful scan.
 *
 * @returns {JSX.Element} The rendered QRCode component containing the camera view and scan results.
 */
export default function QRCode() {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { location_id, setScannedData } = useContext(ProjectContext);

  // Check camera permissions
  if (!permission) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Only getting the location id, ignore the text at the front
    const locationIdMatch = data.match(/Location ID: (\d+)/);
    const locationId = locationIdMatch ? locationIdMatch[1] : null; 
    setScannedData(locationId);
  };
   
  return (
    <View style={[styles.container, { flexDirection: 'column' }]}>
      <View style={styles.header}>
        <Text style={{ fontSize: 23, color: 'white' }}>Scan QR Code</Text>
      </View>

      <View style={{ flex: 8 }}>
        <CameraView 
          style={styles.camera} 
          type='front'
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        {scanned && (
          <View style={styles.scanResultContainer}>
            <Text style={styles.scanResultText}>Go to Location Content page to see your location: {location_id}</Text>
            <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#9370DB', 
    borderBottomColor: '#D3D3D3', 
    borderBottomWidth: 1 
  },
  message: { 
    textAlign: 'center', 
    paddingBottom: 10 
  },
  camera: { flex: 1 },
  scanResultContainer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'white', 
    padding: 15 
  },
  scanResultText: { fontSize: 16, marginBottom: 10 },
});
