import {
  $applyNodeReplacement,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isElementNode,
  $isLineBreakNode,
  $isTextNode,
  TextNode,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
} from 'lexical';
import { TokenFieldValue, type TokenSegment, type TokenSegmentValue } from '@/lib/token-value';

export interface SerializedInlineToken extends SerializedTextNode {
  token: TokenSegment;
}
/** Original atomic token node; editing, IME, clipboard and undo are handled by Lexical. */
export class InlineTokenNode extends TextNode {
  __token: TokenSegment;
  static getType(): string {
    return 'hextech-inline-token';
  }
  static clone(node: InlineTokenNode): InlineTokenNode {
    return new InlineTokenNode({ ...node.__token, text: node.__text }, node.__key);
  }
  constructor(token: TokenSegment, key?: NodeKey) {
    super(token.text, key);
    this.__token = { ...token };
  }
  static importJSON(serialized: Parameters<typeof TextNode.importJSON>[0]): InlineTokenNode {
    const raw = serialized.token;
    if (
      !raw ||
      typeof raw !== 'object' ||
      !('id' in raw) ||
      !('text' in raw) ||
      typeof raw.id !== 'string' ||
      typeof raw.text !== 'string'
    )
      throw new TypeError('Invalid serialized inline token.');
    return $createInlineToken({
      type: 'token',
      id: raw.id,
      text: raw.text,
      ...('value' in raw && typeof raw.value === 'string' ? { value: raw.value } : {}),
    });
  }
  exportJSON(): SerializedInlineToken {
    return {
      ...super.exportJSON(),
      type: 'hextech-inline-token',
      version: 1,
      token: { ...this.getToken() },
    };
  }
  getToken(): TokenSegment {
    return { ...this.getLatest().__token, text: this.getTextContent() };
  }
  isTextEntity(): true {
    return true;
  }
  canInsertTextBefore(): false {
    return false;
  }
  canInsertTextAfter(): false {
    return false;
  }
  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.classList.add('hx-inline-token');
    element.dataset.tokenId = this.__token.id;
    element.dataset.tone = this.__token.tone || 'teal';
    return element;
  }
  updateDOM(previous: this, element: HTMLElement, config: EditorConfig): boolean {
    element.dataset.tokenId = this.__token.id;
    element.dataset.tone = this.__token.tone || 'teal';
    return super.updateDOM(previous, element, config);
  }
}
export function $createInlineToken(token: TokenSegment): InlineTokenNode {
  return $applyNodeReplacement(new InlineTokenNode(token)).setMode('token');
}
export function $isInlineToken(node: LexicalNode | null | undefined): node is InlineTokenNode {
  return node instanceof InlineTokenNode;
}
export function $readTokenValue(): TokenFieldValue {
  const segments: TokenSegmentValue[] = [];
  function visit(node: LexicalNode) {
    if ($isInlineToken(node)) segments.push(node.getToken());
    else if ($isTextNode(node)) segments.push({ type: 'text', text: node.getTextContent() });
    else if ($isLineBreakNode(node)) segments.push({ type: 'text', text: '\n' });
    else if ($isElementNode(node)) node.getChildren().forEach(visit);
  }
  $getRoot()
    .getChildren()
    .forEach((node, index) => {
      if (index) segments.push({ type: 'text', text: '\n' });
      visit(node);
    });
  return new TokenFieldValue(segments);
}
export function $writeTokenValue(value: TokenFieldValue): void {
  const root = $getRoot();
  root.clear();
  let paragraph = $createParagraphNode();
  root.append(paragraph);
  for (const segment of value.segments) {
    if (segment.type === 'token') paragraph.append($createInlineToken(segment));
    else {
      segment.text.split('\n').forEach((text, index) => {
        if (index) {
          paragraph = $createParagraphNode();
          root.append(paragraph);
        }
        if (text) paragraph.append($createTextNode(text));
      });
    }
  }
}
export function insertToken(editor: LexicalEditor, token: TokenSegment): void {
  if (!editor.getRootElement() || !editor.isEditable()) return;
  editor.update(
    () => {
      if (!$isRangeSelection($getSelection())) $getRoot().selectEnd();
      $insertNodes([$createInlineToken(token), $createTextNode(' ')]);
    },
    { tag: 'hextech-insert-token' },
  );
  editor.focus();
}
