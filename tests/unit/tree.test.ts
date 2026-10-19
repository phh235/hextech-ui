import { describe, expect, it } from 'vitest';
import {
  moveTreeNode,
  treeIndex,
  type TreeNodeData,
} from '../../packages/react/src/lib/tree-utils';
const data: readonly TreeNodeData[] = [
  { id: 'a', label: 'A', children: [{ id: 'b', label: 'B' }] },
  { id: 'c', label: 'C' },
];
describe('immutable tree moves', () => {
  it('reorders siblings without mutating input', () => {
    const next = moveTreeNode(data, { id: 'c', targetId: 'a', position: 'before' });
    expect(next.map((item) => item.id)).toEqual(['c', 'a']);
    expect(data[0]?.id).toBe('a');
  });
  it('moves nodes between parents and retains descendants', () => {
    const next = moveTreeNode(data, { id: 'b', targetId: 'c', position: 'inside' });
    expect(next[0]?.children).toEqual([]);
    expect(next[1]?.children?.[0]?.id).toBe('b');
    expect(data[0]?.children?.[0]?.id).toBe('b');
  });
  it('rejects cyclic moves and duplicate node identities', () => {
    expect(() => moveTreeNode(data, { id: 'a', targetId: 'b', position: 'inside' })).toThrow(
      /subtree/,
    );
    expect(() =>
      treeIndex([
        { id: 'x', label: 'X' },
        { id: 'x', label: 'Y' },
      ]),
    ).toThrow(/unique/);
  });
});
