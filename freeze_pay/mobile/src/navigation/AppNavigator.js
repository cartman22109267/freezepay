import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen           from '../screens/LoginScreen';
import SignupScreen          from '../screens/SignupScreen';
import HomeScreen            from '../screens/HomeScreen';
import QRCodePaymentScreen   from '../screens/QRCodePaymentScreen';
import NFCPaymentScreen      from '../screens/NFCPaymentScreen';
import BTPaymentScreen       from '../screens/BTPaymentScreen';
import ContactPaymentScreen  from '../screens/ContactPaymentScreen';
import AISuggestions         from '../screens/AISuggestions';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"        component={LoginScreen} />
      <Stack.Screen name="Signup"       component={SignupScreen} />
      <Stack.Screen name="Home"         component={HomeScreen} />
      <Stack.Screen name="QRPay"        component={QRCodePaymentScreen} />
      <Stack.Screen name="NFCPay"       component={NFCPaymentScreen} />
      <Stack.Screen name="BTPay"        component={BTPaymentScreen} />
      <Stack.Screen name="ContactPay"   component={ContactPaymentScreen} />
      <Stack.Screen name="AI"           component={AISuggestions} />
    </Stack.Navigator>
  );
}
