import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, FlatList
} from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { COLORS } from '../theme/colors';
import API from '../services/api';

export default function BTPaymentScreen() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    BluetoothSerial.list().then(setDevices);
  }, []);

  const connectAndPay = async id => {
    try {
      await BluetoothSerial.connect(id);
      await API.post('/payment/bluetooth', { deviceId:id, amount:1.23, currency:'EUR' });
      Alert.alert('Succès','Paiement Bluetooth effectué');
    } catch {
      Alert.alert('Erreur','Échec BT');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionnez un appareil</Text>
      <FlatList
        data={devices}
        keyExtractor={d => d.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.device} onPress={()=>connectAndPay(item.id)}>
            <Text style={styles.deviceText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1, padding:24, backgroundColor:COLORS.background },
  title:      { fontSize:18, marginBottom:16, color:COLORS.text },
  device:     { padding:12, backgroundColor:COLORS.card, borderRadius:8, marginVertical:4 },
  deviceText: { color:COLORS.text }
});
