import React, { useState } from 'react';
import {
  View, TextInput, Text,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import Logo from '../components/logo';
import { COLORS } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      await AsyncStorage.setItem('jwt', data.token);
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Erreur', e.response?.data.error || 'Connexion échouée');
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.placeholder}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor={COLORS.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
        Pas de compte ? Inscris-toi
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1, justifyContent:'center', alignItems:'center', padding:24, backgroundColor:COLORS.background },
  input:      { width:'100%', height:48, borderColor:COLORS.primary, borderWidth:1, borderRadius:8, paddingHorizontal:12, marginVertical:8 },
  button:     { width:'100%', height:48, backgroundColor:COLORS.primary, borderRadius:8, justifyContent:'center', alignItems:'center', marginTop:16 },
  buttonText: { color:COLORS.buttonText, fontSize:16, fontWeight:'600' },
  link:       { color:COLORS.primary, marginTop:12 }
});
