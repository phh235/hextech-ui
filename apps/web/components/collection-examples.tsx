'use client';
import { useState } from 'react';
import { Button, Tree, moveTreeNode, TagGroup, type TreeNodeData } from '@hextech-ui/react';
const initial: readonly TreeNodeData[] = [
  {
    id: 'builds',
    label: 'Builds',
    children: [
      { id: 'frontline', label: 'Frontline' },
      { id: 'support', label: 'Support' },
    ],
  },
  { id: 'practice', label: 'Practice', children: [{ id: 'timing', label: 'Timing drills' }] },
  {
    id: 'archive',
    label: 'Archive',
    disabled: true,
    children: [{ id: 'locked', label: 'Locked plan' }],
  },
];
const dynamicNodes: readonly TreeNodeData[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    children: [
      { id: 'draft', label: 'Draft plan' },
      { id: 'review', label: 'Review plan' },
    ],
  },
  { id: 'archive', label: 'Archive' },
];
export function DynamicTreeExample() {
  const [nodes, setNodes] = useState(dynamicNodes);
  const [expanded, setExpanded] = useState<string[]>(['workspace']);
  const [selection, setSelection] = useState<string[]>(['draft']);
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Tree
        label="Dynamic build library"
        nodes={nodes}
        expandedKeys={expanded}
        onExpandedChange={setExpanded}
        defaultSelectedKeys={['draft']}
        onSelectionChange={setSelection}
      />
      <p role="status" className="m-0 text-hx-xs text-hx-accent">
        Selected IDs: {selection.join(', ') || 'none'}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="small" variant="dimmed" onClick={() => setExpanded([])}>
          Hide branch
        </Button>
        <Button
          size="small"
          variant="dimmed"
          onClick={() =>
            setNodes((value) =>
              value.map((node) =>
                node.children
                  ? { ...node, children: node.children.filter((child) => child.id !== 'draft') }
                  : node,
              ),
            )
          }
        >
          Remove draft
        </Button>
        <Button size="small" variant="dimmed" onClick={() => setNodes([])}>
          Clear tree
        </Button>
        <Button
          size="small"
          variant="dimmed"
          onClick={() => {
            setNodes(dynamicNodes);
            setExpanded(['workspace']);
          }}
        >
          Restore tree
        </Button>
      </div>
      <p className="m-0 text-hx-xs text-hx-muted-foreground">
        Local data updates preserve focus inside the tree. Focus stays with these controls when you
        use them.
      </p>
    </div>
  );
}
const initialTags = [
  { id: 'ranked', label: 'Ranked' },
  { id: 'support', label: 'Support' },
  { id: 'practice', label: 'Practice' },
];
export function ControlledTagExample() {
  const [items, setItems] = useState(initialTags);
  const [selected, setSelected] = useState<string[]>(['ranked', 'support']);
  const [keep, setKeep] = useState(false);
  const [queue, setQueue] = useState(false);
  const [pending, setPending] = useState<string[]>([]);
  const remove = (ids: string[]) =>
    setItems((current) => current.filter((item) => !ids.includes(item.id)));
  return (
    <div className="grid w-full max-w-lg gap-3">
      <TagGroup
        label="Controlled build tags"
        items={items}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        onRemove={(ids) => {
          if (keep) return;
          if (queue) setPending(ids);
          else remove(ids);
        }}
      />
      <p role="status" className="m-0 text-hx-xs text-hx-accent">
        Selected IDs: {selected.join(', ') || 'none'}
      </p>
      <label className="flex items-center gap-2 text-hx-sm">
        <input type="checkbox" checked={keep} onChange={(event) => setKeep(event.target.checked)} />
        Preserve tags on removal
      </label>
      <label className="flex items-center gap-2 text-hx-sm">
        <input
          type="checkbox"
          checked={queue}
          onChange={(event) => setQueue(event.target.checked)}
        />
        Queue removal
      </label>
      <div className="flex flex-wrap gap-2">
        <Button
          size="small"
          variant="dimmed"
          disabled={!pending.length}
          onClick={() => {
            remove(pending);
            setPending([]);
          }}
        >
          Complete removal
        </Button>
        <Button size="small" variant="dimmed" onClick={() => setItems(initialTags)}>
          Restore tags
        </Button>
      </div>
      <p className="m-0 text-hx-xs text-hx-muted-foreground">
        Removal is a request. Selection changes after the owner actually removes the records. All
        changes stay in this local example.
      </p>
    </div>
  );
}
export function CollectionExample({
  name,
  disabled = false,
}: {
  name: string;
  disabled?: boolean;
}) {
  const [nodes, setNodes] = useState(initial);
  const [selected, setSelected] = useState<string[]>([]);
  const [tags, setTags] = useState([
    { id: 'ranked', label: 'Ranked' },
    { id: 'support', label: 'Support' },
    { id: 'practice', label: 'Practice' },
  ]);
  if (name === 'tree')
    return (
      <div className="grid w-full max-w-lg gap-3">
        <Tree
          label="Build library"
          nodes={nodes}
          defaultExpandedKeys={['builds']}
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
          disabled={disabled}
          onMove={(move) => setNodes((value) => moveTreeNode(value, move))}
        />
        <p className="m-0 text-hx-xs text-hx-muted-foreground">{selected.length} selected</p>
        <Button
          disabled={disabled}
          variant="dimmed"
          className="whitespace-normal"
          onClick={() =>
            setNodes((value) =>
              moveTreeNode(value, { id: 'frontline', targetId: 'practice', position: 'inside' }),
            )
          }
        >
          Move Frontline into Practice
        </Button>
        <Button
          disabled={disabled}
          variant="dimmed"
          onClick={() => {
            setNodes(initial);
            setSelected([]);
          }}
        >
          Reset library
        </Button>
      </div>
    );
  if (name === 'tag-group')
    return (
      <div className="grid gap-4">
        <TagGroup
          label="Build tags"
          items={tags}
          selectionMode="multiple"
          disabled={disabled}
          onRemove={(ids) => setTags((value) => value.filter((item) => !ids.includes(item.id)))}
        />
        <Button
          variant="dimmed"
          disabled={disabled}
          onClick={() =>
            setTags([
              { id: 'ranked', label: 'Ranked' },
              { id: 'support', label: 'Support' },
              { id: 'practice', label: 'Practice' },
            ])
          }
        >
          Restore tags
        </Button>
        <p className="m-0 text-hx-xs text-hx-muted-foreground">
          Arrow keys move between controls. Space selects; Delete removes selected tags.
        </p>
      </div>
    );
  return null;
}
