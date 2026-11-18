'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ContextMenuProps {
  anchor: { x: number; y: number } | null;
  onClose: () => void;
  children: React.ReactNode;
}

export function ContextMenu({ anchor, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (anchor) {
      const padding = 96;
      const clampedX =
        typeof window !== 'undefined'
          ? Math.min(Math.max(anchor.x, padding), window.innerWidth - padding)
          : anchor.x;
      setPosition({ x: clampedX, y: anchor.y });
    }
  }, [anchor]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!anchor) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      role="menu"
    >
      <div className="py-1">{children}</div>
    </div>,
    document.body
  );
}

interface ContextMenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function ContextMenuItem({ onClick, children, disabled = false }: ContextMenuItemProps) {
  return (
    <button
      onClick={() => {
        if (!disabled) onClick();
      }}
      disabled={disabled}
      className={`context-menu-item ${disabled ? 'opacity-50 cursor-not-allowed' : ''} w-full text-left`}
      role="menuitem"
    >
      {children}
    </button>
  );
}