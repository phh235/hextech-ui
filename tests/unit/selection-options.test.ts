import { describe, it, expect } from 'vitest';
import { createOptionModel } from '../../packages/react/src/lib/selection-options';
describe('selection record identity', () => {
  it('distinguishes equal labels by stable identity and resolves refreshed records', () => {
    const old = { id: 'a', name: 'Avery' };
    const refreshed = { id: 'a', name: 'Avery updated' };
    const model = createOptionModel([refreshed, { id: 'b', name: 'Avery updated' }], {
      getOptionLabel: (item) => item.name,
    });
    expect(model.equal(old, refreshed)).toBe(true);
    expect(model.label(old)).toBe('Avery updated');
    expect(model.resolve(old)).toBe(refreshed);
    expect(model.equal(old, { id: 'b', name: 'Avery' })).toBe(false);
    expect(model.key(old)).toBe('a');
  });
  it('accepts string options and value/label objects with predictable form keys', () => {
    expect(createOptionModel(['Support']).label('Support')).toBe('Support');
    const item = { value: 7, label: 'Support' };
    expect(createOptionModel([item]).key(item)).toBe('7');
  });
  it('rejects ambiguous IDs and unreadable object labels', () => {
    expect(() =>
      createOptionModel([
        { id: 'x', label: 'One' },
        { id: 'x', label: 'Two' },
      ]),
    ).toThrow('Duplicate option key');
    expect(() => createOptionModel([{ id: 'x' }])).toThrow('readable label');
    expect(() => createOptionModel([{ label: 'Missing ID' }])).toThrow('getOptionKey');
  });
});
