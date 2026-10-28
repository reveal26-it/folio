import { useEffect, useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { concordance } from '../ledger/concordance';
import type { ConcordanceHit } from '../ledger/types';

export interface ActiveWord {
  surface: string;
  normalized: string;
  nodeId: string;
  posInNode: number;
  context: string;
}

export function WordSheet({
  active, onClose, onHighlight,
}: {
  active: ActiveWord | null;
  onClose: () => void;
  onHighlight: () => void;
}) {
  const [hits, setHits] = useState<ConcordanceHit[]>([]);
  useEffect(() => {
    if (active) concordance(active.normalized).then(setHits).catch(console.error);
    else setHits([]);
  }, [active]);

  if (!active) return null;

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: '#0007' }} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          style={{ backgroundColor: '#FBFAF6', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '75%', padding: 16 }}
        >
          <Text style={{ fontSize: 22, fontWeight: '700' }}>{active.surface}</Text>
          <Text style={{ color: '#666', marginTop: 6 }}>{active.context}</Text>

          <Text style={{ fontWeight: '600', marginTop: 16 }}>
            Occurrences in this book ({hits.length})
          </Text>

          <ScrollView style={{ marginTop: 8 }}>
            {hits.map((h, i) => (
              <View key={i} style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text style={{ fontWeight: '600', fontSize: 12, color: '#999' }}>{h.ref}</Text>
                <Text style={{ marginTop: 2 }}>{h.context}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            <TouchableOpacity
              onPress={onHighlight}
              style={{ flex: 1, backgroundColor: '#F2E5B6', padding: 14, borderRadius: 10 }}
            >
              <Text style={{ textAlign: 'center', fontWeight: '600' }}>Highlight word</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              style={{ flex: 1, backgroundColor: '#E2DED5', padding: 14, borderRadius: 10 }}
            >
              <Text style={{ textAlign: 'center', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}