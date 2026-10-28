import { memo } from 'react';
import { Text } from 'react-native';
import type { TextNode, WordToken } from '../ledger/types';
import type { AnnotationRow } from '../ledger/annotations';

export const VerseView = memo(function VerseView({
  node, tokens, annotations, onWordTap,
}: {
  node: TextNode;
  tokens: WordToken[];
  annotations: AnnotationRow[];
  onWordTap: (token: WordToken) => void;
}) {
  const highlighted = new Set<number>();
  for (const a of annotations) {
    for (let p = a.startWord; p <= a.endWord; p++) highlighted.add(p);
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  tokens.forEach((tok, i) => {
    if (tok.charStart > cursor) {
      parts.push(<Text key={`g-${i}`}>{node.text.slice(cursor, tok.charStart)}</Text>);
    }
    const isHi = highlighted.has(tok.posInNode);
    parts.push(
      <Text
        key={`w-${tok.id}`}
        onPress={() => onWordTap(tok)}
        style={isHi ? { backgroundColor: '#F2E5B6' } : undefined}
      >
        {tok.surface}
      </Text>,
    );
    cursor = tok.charEnd;
  });
  if (cursor < node.text.length) {
    parts.push(<Text key="tail">{node.text.slice(cursor)}</Text>);
  }

  return (
    <Text style={{ fontSize: 17, lineHeight: 26, marginBottom: 12 }}>
      {node.ref ? (
        <Text style={{ fontWeight: '700', color: '#888', fontSize: 12 }}>{node.ref}  </Text>
      ) : null}
      {parts}
    </Text>
  );
});