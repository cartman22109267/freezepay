import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { COLORS } from '../theme/colors';
import API from '../services/api';

export default function NFCPaymentScreen() {
  useEffect(() => { NfcManager.start(); }, []);

  const handleScan = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      await API.post('/payment/nfc', { tag, amount:1.23, currency:'EUR' });
      Alert.alert('Succès','Paiement NFC effectué');
    } catch {
      Alert.alert('Erreur','Échec paiement NFC');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approchez votre carte NFC</Text>
      <TouchableOpacity style={styles.button} onPress={handleScan}>
        <Text style={styles.buttonText}>Scanner NFC</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:COLORS.background },
  title:     { fontSize:18, marginBottom:24, color:COLORS.text },
  button:    { padding:16, backgroundColor:COLORS.primary, borderRadius:8 },
  buttonText:{ color:COLORS.buttonText }
});
