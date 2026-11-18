'use client';

import { useRef, useEffect } from 'react';
import { Message } from '@/hooks/useWS';
import { MessageBubble } from './MessageBubble';
import { useAuth } from '@/hooks/useAuth';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const { user } = useAuth();
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-3"
      onWheel={(e) => {
        // Auto-scroll to bottom when user scrolls down near bottom
        if (containerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
          if (isNearBottom && e.deltaY > 0) {
            scrollToBottom();
          }
        }
      }}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-umber dark:text-ochre">
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-center">Nenhuma mensagem ainda</p>
          <p className="text-sm mt-1">Seja o primeiro a transmitir!</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={user?.id === message.senderId}
          />
        ))
      )}
      <div ref={endRef} />
    </div>
  );
}