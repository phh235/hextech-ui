export interface TreeNodeData {
  id: string;
  label: string;
  disabled?: boolean;
  children?: readonly TreeNodeData[];
}
export interface TreeMove {
  id: string;
  targetId: string;
  position: 'before' | 'after' | 'inside';
}
export function treeIndex(nodes: readonly TreeNodeData[]): {
  nodes: Map<string, TreeNodeData>;
  parents: Map<string, string | null>;
} {
  const map = new Map<string, TreeNodeData>();
  const parents = new Map<string, string | null>();
  function visit(items: readonly TreeNodeData[], parent: string | null) {
    for (const item of items) {
      if (!item.id || map.has(item.id)) throw new Error('Tree ids must be nonempty and unique.');
      map.set(item.id, item);
      parents.set(item.id, parent);
      if (item.children) visit(item.children, item.id);
    }
  }
  visit(nodes, null);
  return { nodes: map, parents };
}
export function moveTreeNode(
  nodes: readonly TreeNodeData[],
  move: TreeMove,
): readonly TreeNodeData[] {
  const index = treeIndex(nodes);
  const source = index.nodes.get(move.id);
  if (!source || !index.nodes.has(move.targetId)) throw new Error('Unknown tree move target.');
  if (move.id === move.targetId) return nodes;
  let parent: string | null | undefined = move.targetId;
  while (parent) {
    if (parent === move.id) throw new Error('Cannot move a tree node into its own subtree.');
    parent = index.parents.get(parent);
  }
  function remove(items: readonly TreeNodeData[]): TreeNodeData[] {
    return items
      .filter((item) => item.id !== move.id)
      .map((item) => (item.children ? { ...item, children: remove(item.children) } : item));
  }
  function insert(items: readonly TreeNodeData[]): TreeNodeData[] {
    const next: TreeNodeData[] = [];
    for (const item of items) {
      if (item.id === move.targetId) {
        if (move.position === 'before') next.push(source!);
        next.push(
          move.position === 'inside'
            ? { ...item, children: [...(item.children || []), source!] }
            : item,
        );
        if (move.position === 'after') next.push(source!);
      } else next.push(item.children ? { ...item, children: insert(item.children) } : item);
    }
    return next;
  }
  return insert(remove(nodes));
}
