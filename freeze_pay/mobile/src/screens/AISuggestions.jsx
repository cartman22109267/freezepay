import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList,
  StyleSheet, Alert
} from 'react-native';
import { COLORS } from '../theme/colors';
import API from '../services/api';

export default function AISuggestions() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get('/ai/suggestions')
      .then(r => setItems(r.data.suggestions))
      .catch(() => Alert.alert('Erreur','Chargement IA échoué'));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggestions IA</Text>
      <FlatList
        data={items}
        keyExtractor={(_,i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:24, backgroundColor:COLORS.background },
  title:     { fontSize:24, fontWeight:'700', marginBottom:16, color:COLORS.text },
  card:      { padding:16, backgroundColor:COLORS.card, borderRadius:8, marginVertical:8 },
  cardText:  { color:COLORS.text }
});
