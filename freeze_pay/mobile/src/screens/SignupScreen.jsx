import React, { useState } from 'react';
import {
  View, TextInput, Text,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import Logo from '../components/logo';
import { COLORS } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export default function SignupScreen({ navigation }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await API.post('/auth/register', { name, email, password });
      const { data } = await API.post('/auth/login', { email, password });
      await AsyncStorage.setItem('jwt', data.token);
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Erreur', e.response?.data.error || 'Inscription échouée');
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        placeholderTextColor={COLORS.placeholder}
        value={name} onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.placeholder}
        value={email} onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor={COLORS.placeholder}
        secureTextEntry
        value={password} onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>S’inscrire</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.goBack()}>
        Déjà un compte ? Connecte-toi
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
