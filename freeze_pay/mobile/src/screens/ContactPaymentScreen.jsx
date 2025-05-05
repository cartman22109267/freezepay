import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity,
  Text, StyleSheet, Alert
} from 'react-native';
import { COLORS } from '../theme/colors';
import API from '../services/api';

export default function ContactPaymentScreen() {
  const [account, setAccount] = useState('');
  const [amount, setAmount]   = useState('');

  const handleContactPay = async () => {
    try {
      await API.post('/payment/contact', {
        accountNumber: account,
        amount: parseFloat(amount),
        currency: 'EUR'
      });
      Alert.alert('Succès','Paiement contact enregistré');
    } catch {
      Alert.alert('Erreur','Échec paiement contact');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Numéro de compte"
        placeholderTextColor={COLORS.placeholder}
        value={account}
        onChangeText={setAccount}
      />
      <TextInput
        style={styles.input}
        placeholder="Montant (€)"
        placeholderTextColor={COLORS.placeholder}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleContactPay}>
        <Text style={styles.buttonText}>Payer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1, justifyContent:'center', padding:24, backgroundColor:COLORS.background },
  input:      { height:48, borderColor:COLORS.primary, borderWidth:1, borderRadius:8, padding:12, marginVertical:8 },
  button:     { padding:16, backgroundColor:COLORS.primary, borderRadius:8, alignItems:'center', marginTop:16 },
  buttonText: { color:COLORS.buttonText, fontSize:16 }
});
