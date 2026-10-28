const WORD_RE = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;

export interface RawToken {
  posInNode: number;
  charStart: number;
  charEnd: number;
  surface: string;
  normalized: string;
}

export function tokenize(text: string): RawToken[] {
  const out: RawToken[] = [];
  WORD_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  let pos = 0;
  while ((m = WORD_RE.exec(text))) {
    out.push({
      posInNode: pos++,
      charStart: m.index,
      charEnd: m.index + m[0].length,
      surface: m[0],
      normalized: m[0].toLowerCase().normalize('NFKC'),
    });
  }
  return out;
}