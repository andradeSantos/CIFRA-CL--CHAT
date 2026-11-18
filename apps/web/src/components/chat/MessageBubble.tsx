'use client';

import { useState, useRef, useEffect } from 'react';
import { LockOpen, Loader2 } from 'lucide-react';
import { Message } from '@/hooks/useWS';
import { useCCG } from '@/lib/ccg-client';
import { ContextMenu, ContextMenuItem } from '@/components/ui/ContextMenu';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useDecryptTimer } from '@/hooks/useDecryptTimer';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const { decrypt: decryptMessage } = useCCG();
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const { isVisible, progress, show, hide } = useDecryptTimer(10000);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (bubbleRef.current) {
      const rect = bubbleRef.current.getBoundingClientRect();
      setMenuAnchor({ x: e.clientX, y: rect.top + rect.height / 2 });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchTimerRef.current = setTimeout(() => {
      if (bubbleRef.current) {
        const rect = bubbleRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        setMenuAnchor({ x: touch.clientX, y: rect.top + rect.height / 2 });
        navigator.vibrate?.(10);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const handleDecrypt = () => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
    setMenuAnchor(null);
  };

  const displayText = isVisible ? decryptMessage(message.ciphertext) : message.ciphertext;

  return (
    <div
      ref={bubbleRef}
      className="relative group"
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchEnd}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        className={`message-bubble ${isOwn ? 'message-bubble-own' : 'message-bubble-other'} message-bubble-cipher`}
        style={{ animation: isVisible ? 'fadeIn 0.2s ease-out' : 'slideUp 0.2s ease-out' }}
      >
        <span className="select-none">{displayText}</span>
        {isVisible && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-current/20">
            <ProgressRing progress={progress} size={32} strokeWidth={3} className="text-terracotta dark:text-ochre" />
            <span className="text-xs text-umber dark:text-ochre font-mono">
              {Math.ceil(progress / 10)}s
            </span>
          </div>
        )}
      </div>

      {menuAnchor && (
        <ContextMenu anchor={menuAnchor} onClose={() => setMenuAnchor(null)}>
          <ContextMenuItem onClick={handleDecrypt}>
            <LockOpen className="w-4 h-4" />
            {isVisible ? 'Ocultar' : 'Descriptografar'}
          </ContextMenuItem>
        </ContextMenu>
      )}
    </div>
  );
}