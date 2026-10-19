'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AIChatProvider, AIChatPanel, AIChatTrigger, useAIChat } from '@fumadocs/ai-chat';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
const transport = new DefaultChatTransport({ api: '/api/chat' });
export function DocsAI({ children, ...props }: DocsLayoutProps) {
  const chat = useChat({ transport });
  return (
    <AIChatProvider chat={chat}>
      <LayoutWithChat {...props}>{children}</LayoutWithChat>
      <AIChatTrigger />
    </AIChatProvider>
  );
}
function LayoutWithChat(props: DocsLayoutProps) {
  const { open, setOpen } = useAIChat();
  return <DocsLayout {...props} aiChat={{ open, onOpenChange: setOpen, panel: <AIChatPanel /> }} />;
}
