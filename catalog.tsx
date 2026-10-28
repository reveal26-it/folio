import { View, Text, StyleSheet } from 'react-native';

export default function CatalogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Folio Store</Text>
      <Text style={styles.p}>
        The Store is where readers download vetted books. In Phase 1 this connects to the
        Folio server, where only approved publisher submissions appear here with their specs.
      </Text>
      <Text style={styles.p}>
        For now, a sample Bible is bundled locally so the reader core can be tested.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F1EA', padding: 24 },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#1F1D1A' },
  p: { color: '#6B665E', marginBottom: 12, lineHeight: 20 },
});