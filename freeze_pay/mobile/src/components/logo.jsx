import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.icon} />
      <Text style={styles.text}>FreezePay</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  icon:      { width: 48, height: 48, backgroundColor: COLORS.primary, borderRadius: 12 },
  text:      { fontSize: 30, fontWeight: '700', color: COLORS.text, marginLeft: 12 }
});
