import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { listBooks } from '../../src/ledger/queries';
import type { Book } from '../../src/ledger/types';

export default function LibraryScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  useFocusEffect(useCallback(() => { listBooks().then(setBooks).catch(console.error); }, []));

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(b) => b.id}
        ListEmptyComponent={<Text style={styles.empty}>No books yet. Open the Store tab.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/reader/[bookId]', params: { bookId: item.id } })}
          >
            <Text style={styles.title}>{item.title}</Text>
            {item.author ? <Text style={styles.sub}>{item.author}</Text> : null}
            <Text style={styles.meta}>{item.wordCount.toLocaleString()} words · {item.language}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F1EA' },
  empty: { padding: 24, color: '#666', textAlign: 'center' },
  card: { padding: 16, borderBottomWidth: 1, borderColor: '#E2DED5' },
  title: { fontSize: 17, fontWeight: '600', color: '#1F1D1A' },
  sub: { color: '#6B665E', marginTop: 2 },
  meta: { color: '#A8A29A', marginTop: 6, fontSize: 12 },
});