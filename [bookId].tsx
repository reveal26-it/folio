import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getBook, listNodes, tokensForNode, saveCheckpoint } from '../../src/ledger/queries';
import { addAnnotation, annotationsForNode, type AnnotationRow } from '../../src/ledger/annotations';
import { VerseView } from '../../src/reader/VerseView';
import { WordSheet, type ActiveWord } from '../../src/reader/WordSheet';
import type { Book, TextNode, WordToken } from '../../src/ledger/types';

interface Bundle { node: TextNode; tokens: WordToken[]; annotations: AnnotationRow[]; }

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [active, setActive] = useState<ActiveWord | null>(null);

  const load = useCallback(async () => {
    if (!bookId) return;
    setBook(await getBook(bookId));
    const nodes = await listNodes(bookId);
    const out: Bundle[] = [];
    for (const node of nodes) {
      const [tokens, annotations] = await Promise.all([
        tokensForNode(node.id), annotationsForNode(node.id),
      ]);
      out.push({ node, tokens, annotations });
    }
    setBundles(out);
  }, [bookId]);

  useEffect(() => { load().catch(console.error); }, [load]);

  const handleWordTap = (node: TextNode) => (token: WordToken) => {
    setActive({
      surface: token.surface, normalized: token.normalized,
      nodeId: node.id, posInNode: token.posInNode, context: node.text,
    });
    if (bookId) saveCheckpoint(bookId, node.id, token.posInNode).catch(console.error);
  };

  const handleHighlight = async () => {
    if (!active || !bookId) return;
    await addAnnotation({
      bookId, nodeId: active.nodeId,
      startWord: active.posInNode, endWord: active.posInNode,
      type: 'highlight', visibility: 'private',
    });
    setActive(null);
    load().catch(console.error);
  };

  if (!book) return <View style={{ flex: 1, backgroundColor: '#F4F1EA' }} />;

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F1EA' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', marginBottom: 4, color: '#1F1D1A' }}>{book.title}</Text>
        {book.author ? <Text style={{ color: '#6B665E', marginBottom: 20 }}>{book.author}</Text> : null}
        {bundles.map((b) => (
          <VerseView key={b.node.id} node={b.node} tokens={b.tokens}
            annotations={b.annotations} onWordTap={handleWordTap(b.node)} />
        ))}
      </ScrollView>
      <WordSheet active={active} onClose={() => setActive(null)} onHighlight={handleHighlight} />
    </View>
  );
}