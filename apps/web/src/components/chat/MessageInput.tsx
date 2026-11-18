'use client';

import { useState, useRef, useCallback, FormEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useCCG } from '@/lib/ccg-client';
import { Button } from '@/components/ui/Button';

interface MessageInputProps {
  onSend: (ciphertext: string) => void;
  connected: boolean;
}

export function MessageInput({ onSend, connected }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { encrypt } = useCCG();

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !connected) return;

    const ciphertext = encrypt(text.trim());
    onSend(ciphertext);
    setText('');
    textareaRef.current?.focus();
  }, [text, connected, encrypt, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize textarea
    textareaRef.current!.style.height = 'auto';
    textareaRef.current!.style.height = `${Math.min(textareaRef.current!.scrollHeight, 120)}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-earth-border dark:border-border-color bg-sand/50 dark:bg-bark/50">
      <div className="flex items-end gap-3">
        <button
          type="button"
          className="p-2 text-umber dark:text-ochre hover:text-terracotta dark:hover:text-ochre transition-colors rounded-xl hover:bg-surface-hover dark:hover:bg-surface-hover"
          aria-label="Anexar arquivo"
          disabled
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="input resize-none pr-14 min-h-[48px] max-h-[120px]"
            rows={1}
            disabled={!connected}
            aria-label="Mensagem"
          />
        </div>

        <Button
          type="submit"
          disabled={!text.trim() || !connected}
          className="h-10 w-10 p-0 rounded-xl"
          aria-label="Enviar mensagem"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {!connected && (
        <p className="text-xs text-umber dark:text-ochre text-center mt-2 flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Conectando...
        </p>
      )}
    </form>
  );
}