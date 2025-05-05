import React from 'react';
import {
  View, Text, StyleSheet, Alert
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { COLORS } from '../theme/colors';
import API from '../services/api';

export default function QRCodePaymentScreen() {
  const onRead = e => {
    const data = e.data;
    API.post('/payment/qr', { data, amount:1.23, currency:'EUR' })
      .then(()=>Alert.alert('Succès','Paiement via QR effectué'))
      .catch(()=>Alert.alert('Erreur','Échec du paiement QR'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scannez le QR code</Text>
      <QRCodeScanner
        onRead={onRead}
        topContent={<Text style={styles.centerText}>Alignez le QR code</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1, backgroundColor:COLORS.background },
  title:      { textAlign:'center', margin:16, fontSize:18, color:COLORS.text },
  centerText: { textAlign:'center', color:COLORS.placeholder }
});
