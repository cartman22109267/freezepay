import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import API from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/logo';
import { COLORS } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    API.get('/user/profile').then(r => setUser(r.data));
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('jwt');
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Logo />
      <Text style={styles.title}>Bienvenue, {user.name}</Text>
      {[
        ['QRPay','Payer par QR code'],
        ['NFCPay','Payer par NFC'],
        ['BTPay','Payer par Bluetooth'],
        ['ContactPay','Mode contact']
      ].map(([route,label]) => (
        <TouchableOpacity key={route} style={styles.button} onPress={()=>navigation.navigate(route)}>
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.aiButton} onPress={()=>navigation.navigate('AI')}>
        <Text style={styles.aiText}>Voir suggestions IA</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={logout}>
        Se déconnecter
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems:'center', padding:24, backgroundColor:COLORS.background },
  title:     { fontSize:22, marginVertical:16, color:COLORS.text },
  button:    { width:'100%', padding:16, backgroundColor:COLORS.primary, borderRadius:8, marginVertical:8, alignItems:'center' },
  buttonText:{ color:COLORS.buttonText },
  aiButton:  { marginTop:24, padding:12, backgroundColor:COLORS.card, borderRadius:8 },
  aiText:    { color:COLORS.primary },
  link:      { marginTop:32, color:COLORS.primary }
});
