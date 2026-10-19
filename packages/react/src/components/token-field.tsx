'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState, type HTMLAttributes } from 'react';
import { createEditor, type LexicalEditor } from 'lexical';
import { registerPlainText } from '@lexical/plain-text';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import { cn } from '@/lib/cn';
import { TokenFieldValue } from '@/lib/token-value';
import { InlineTokenNode, $readTokenValue, $writeTokenValue } from '@/lib/inline-token-node';

export interface TokenFieldProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'onInput' | 'contentEditable' | 'onError'
> {
  label: string;
  value?: TokenFieldValue;
  defaultValue?: TokenFieldValue;
  onValueChange?: (value: TokenFieldValue) => void;
  onReady?: (editor: LexicalEditor | null) => void;
  onError?: (error: Error) => void;
  name?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  serialization?: 'text' | 'json';
}
export function TokenField({
  label,
  value,
  defaultValue,
  onValueChange,
  onReady,
  onError,
  name,
  placeholder = 'Write a message…',
  description,
  error,
  required = false,
  maxLength,
  disabled = false,
  readOnly = false,
  serialization = 'text',
  className,
  ...props
}: TokenFieldProps) {
  const id = useId();
  const element = useRef<HTMLDivElement>(null);
  const bridge = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<LexicalEditor | null>(null);
  const latest = useRef({
    value,
    defaultValue,
    onValueChange,
    onReady,
    onError,
    disabled,
    readOnly,
  });
  const [ready, setReady] = useState(false);
  const [text, setText] = useState((value || defaultValue)?.text || '');
  const [json, setJson] = useState(() => JSON.stringify((value || defaultValue)?.toJSON() || []));
  const [requiredError, setRequiredError] = useState('');
  const message =
    error ||
    (maxLength !== undefined && text.length > maxLength
      ? `Use at most ${maxLength} characters.`
      : '') ||
    requiredError;
  useLayoutEffect(() => {
    latest.current = { value, defaultValue, onValueChange, onReady, onError, disabled, readOnly };
  }, [value, defaultValue, onValueChange, onReady, onError, disabled, readOnly]);
  useEffect(() => {
    const root = element.current;
    if (!root) return;
    const editor = createEditor({
      namespace: `hextech-token-${id}`,
      nodes: [InlineTokenNode],
      editable: !latest.current.disabled && !latest.current.readOnly,
      theme: { paragraph: 'm-0' },
      onError: (failure) => {
        if (latest.current.onError) latest.current.onError(failure);
        else throw failure;
      },
    });
    editorRef.current = editor;
    editor.setRootElement(root);
    const plain = registerPlainText(editor);
    const history = registerHistory(
      editor,
      createEmptyHistoryState(),
      300,
      undefined,
      undefined,
      100,
    );
    const update = editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves, tags }) => {
        if (!dirtyElements.size && !dirtyLeaves.size) return;
        const next = editorState.read($readTokenValue);
        setText(next.text);
        setJson(JSON.stringify(next.toJSON()));
        if (next.text) setRequiredError('');
        if (!tags.has('hextech-external')) latest.current.onValueChange?.(next);
      },
    );
    editor.update(
      () =>
        $writeTokenValue(
          latest.current.value || latest.current.defaultValue || new TokenFieldValue(),
        ),
      { tag: 'hextech-external', discrete: true },
    );
    setReady(true);
    latest.current.onReady?.(editor);
    return () => {
      latest.current.onReady?.(null);
      update();
      history();
      plain();
      editor.setRootElement(null);
      editorRef.current = null;
    };
  }, [id]);
  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor || !value) return;
    const current = editor.getEditorState().read($readTokenValue);
    if (JSON.stringify(current.toJSON()) !== JSON.stringify(value.toJSON()))
      editor.update(() => $writeTokenValue(value), { tag: 'hextech-external', discrete: true });
  }, [value, ready]);
  useLayoutEffect(() => {
    editorRef.current?.setEditable(!disabled && !readOnly);
  }, [disabled, readOnly, ready]);
  useLayoutEffect(() => {
    bridge.current?.setCustomValidity(
      error ||
        (maxLength !== undefined && text.length > maxLength
          ? `Use at most ${maxLength} characters.`
          : ''),
    );
  }, [error, maxLength, text]);
  const described =
    [
      description ? `${id}-description` : '',
      message ? `${id}-error` : '',
      props['aria-describedby'],
    ]
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <div className="grid w-full">
      <span
        id={`${id}-label`}
        className="font-sans text-sm font-normal leading-[1.1025rem] tracking-[0.02em] text-muted-foreground"
      >
        {label}
      </span>
      <div className="relative">
        <div
          {...props}
          ref={element}
          role="textbox"
          aria-labelledby={`${id}-label`}
          aria-describedby={described}
          aria-errormessage={message ? `${id}-error` : undefined}
          aria-invalid={Boolean(message) || undefined}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          aria-multiline="true"
          aria-busy={!ready}
          aria-placeholder={placeholder}
          tabIndex={ready && !disabled ? 0 : -1}
          contentEditable={ready && !disabled && !readOnly}
          suppressContentEditableWarning
          className={cn(
            'hx-token-editor hx-input min-h-9 whitespace-pre-wrap break-words border border-transparent px-3 py-1.5 font-sans text-xs font-normal leading-5 tracking-[0.025em] outline-none',
            className,
          )}
        />
        {!text && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1.5 left-3 font-sans text-xs text-muted-foreground"
          >
            {ready ? placeholder : 'Loading editor…'}
          </span>
        )}
      </div>
      {description && (
        <p id={`${id}-description`} className="m-0 text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {message && (
        <p id={`${id}-error`} aria-live="polite" className="m-0 text-xs text-destructive">
          {message}
        </p>
      )}
      <textarea
        ref={bridge}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        {...(name && serialization === 'text' ? { name } : {})}
        value={text}
        onChange={() => undefined}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        onInvalid={(event) => {
          event.preventDefault();
          if (required && !text) setRequiredError('Enter a value.');
          element.current?.focus();
        }}
      />
      {name && serialization === 'json' && (
        <input type="hidden" name={name} value={json} disabled={disabled} />
      )}
    </div>
  );
}
export { TokenFieldValue } from '@/lib/token-value';
export type { TokenSegment, TextSegment, TokenSegmentValue } from '@/lib/token-value';
export { insertToken } from '@/lib/inline-token-node';
export type { LexicalEditor } from 'lexical';
