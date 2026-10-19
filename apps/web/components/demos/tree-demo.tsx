'use client';

import { Tree, moveTreeNode, type TreeNodeData } from '@hextech-ui/react/tree';
import { useState } from 'react';

export function TreeDemo() {
  const [nodes, setNodes] = useState<readonly TreeNodeData[]>([
    { id: 'builds', label: 'Builds', children: [{ id: 'support', label: 'Support' }] },
    { id: 'practice', label: 'Practice' },
  ]);
  return (
    <Tree
      label="Build library"
      nodes={nodes}
      defaultExpandedKeys={['builds']}
      onMove={(move) => setNodes([...moveTreeNode(nodes, move)])}
    />
  );
}
