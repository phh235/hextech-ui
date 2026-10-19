import { describe, expect, it } from 'vitest';
import { TokenFieldValue } from '../../packages/utils/src/token-value';
describe('inline token data', () => {
  it('normalizes adjacent text without mutating caller data', () => {
    const segments = [
      { type: 'text' as const, text: 'Hello ' },
      { type: 'text' as const, text: 'world' },
    ];
    const value = new TokenFieldValue(segments);
    expect(value.text).toBe('Hello world');
    expect(value.segments).toHaveLength(1);
    expect(segments[0]?.text).toBe('Hello ');
    expect(Object.isFrozen(value.segments[0])).toBe(true);
  });
  it('treats a token as one atomic editing unit', () => {
    const value = new TokenFieldValue([
      { type: 'text', text: 'Hi ' },
      { type: 'token', id: 'mention-1', text: '@Avery' },
      { type: 'text', text: '!' },
    ]);
    expect(value.logicalLength).toBe(5);
    expect(value.replace(3, 4, '').text).toBe('Hi !');
    expect(value.replace(3, 3, 'dear ').text).toBe('Hi dear @Avery!');
    expect(value.text).toBe('Hi @Avery!');
  });
  it('tokenizes only text while retaining existing token identities', () => {
    const value = TokenFieldValue.fromText('Ask @Avery and @Rowan').tokenize(
      /@\w+/,
      (match, index) => ({ type: 'token', id: `mention-${index}`, text: match[0] }),
    );
    expect(value.text).toBe('Ask @Avery and @Rowan');
    expect(value.segments.filter((segment) => segment.type === 'token')).toHaveLength(2);
    expect(
      value.tokenize(/@\w+/, () => {
        throw new Error('Existing tokens should not be re-tokenized');
      }).segments,
    ).toEqual(value.segments);
  });
  it('permits repeated entities, rejects missing identities and invalid offsets', () => {
    expect(
      new TokenFieldValue([
        { type: 'token', id: 'x', text: '@Avery' },
        { type: 'token', id: 'x', text: '@Avery' },
      ]).logicalLength,
    ).toBe(2);
    expect(() => new TokenFieldValue([{ type: 'token', id: '', text: 'one' }])).toThrow(/nonempty/);
    expect(() => TokenFieldValue.fromText('abc').replace(-1, 2, '')).toThrow(RangeError);
  });
});
