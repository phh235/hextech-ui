export interface TextSegment {
  type: 'text';
  text: string;
}
export interface TokenSegment {
  type: 'token';
  id: string;
  text: string;
  value?: string;
  tone?: 'gold' | 'teal' | 'muted';
}
export type TokenSegmentValue = Readonly<TextSegment | TokenSegment>;

/** Immutable inline text/token data. An application entity may be mentioned more than once. */
export class TokenFieldValue {
  readonly segments: readonly TokenSegmentValue[];
  constructor(segments: readonly TokenSegmentValue[] = []) {
    const normalized: (TextSegment | TokenSegment)[] = [];
    for (const segment of segments) {
      if (!segment || typeof segment.text !== 'string' || !['text', 'token'].includes(segment.type))
        throw new TypeError('Invalid inline token segment.');
      if (segment.type === 'token') {
        if (typeof segment.id !== 'string' || !segment.id)
          throw new Error('Inline token ids must be nonempty.');
        normalized.push({ ...segment });
      } else if (segment.text) {
        const previous = normalized.at(-1);
        if (previous?.type === 'text') previous.text += segment.text;
        else normalized.push({ type: 'text', text: segment.text });
      }
    }
    this.segments = Object.freeze(normalized.map((segment) => Object.freeze(segment)));
    Object.freeze(this);
  }
  static fromText(text: string): TokenFieldValue {
    return new TokenFieldValue([{ type: 'text', text }]);
  }
  get text(): string {
    return this.segments.map((segment) => segment.text).join('');
  }
  get logicalLength(): number {
    return this.segments.reduce(
      (length, segment) => length + (segment.type === 'token' ? 1 : segment.text.length),
      0,
    );
  }
  toJSON(): readonly TokenSegmentValue[] {
    return this.segments;
  }
  replace(
    start: number,
    end: number,
    replacement: string | readonly TokenSegmentValue[],
  ): TokenFieldValue {
    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 0 ||
      start > end ||
      end > this.logicalLength
    )
      throw new RangeError('Token replacement offsets must describe an ordered valid range.');
    const before: TokenSegmentValue[] = [];
    const after: TokenSegmentValue[] = [];
    let cursor = 0;
    for (const segment of this.segments) {
      const length = segment.type === 'token' ? 1 : segment.text.length;
      const finish = cursor + length;
      if (finish <= start) before.push(segment);
      else if (cursor >= end) after.push(segment);
      else if (segment.type === 'text') {
        if (cursor < start)
          before.push({ type: 'text', text: segment.text.slice(0, start - cursor) });
        if (finish > end) after.push({ type: 'text', text: segment.text.slice(end - cursor) });
      }
      cursor = finish;
    }
    const inserted =
      typeof replacement === 'string'
        ? [{ type: 'text' as const, text: replacement }]
        : replacement;
    return new TokenFieldValue([...before, ...inserted, ...after]);
  }
  tokenize(
    pattern: RegExp,
    create: (match: RegExpMatchArray, occurrence: number) => TokenSegment,
  ): TokenFieldValue {
    const expression = new RegExp(
      pattern.source,
      pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g',
    );
    const result: TokenSegmentValue[] = [];
    let occurrence = 0;
    for (const segment of this.segments) {
      if (segment.type === 'token') {
        result.push(segment);
        continue;
      }
      let cursor = 0;
      for (const match of segment.text.matchAll(expression)) {
        if (!match[0].length) continue;
        const index = match.index;
        if (index > cursor) result.push({ type: 'text', text: segment.text.slice(cursor, index) });
        result.push(create(match, occurrence++));
        cursor = index + match[0].length;
      }
      if (cursor < segment.text.length)
        result.push({ type: 'text', text: segment.text.slice(cursor) });
    }
    return new TokenFieldValue(result);
  }
}
