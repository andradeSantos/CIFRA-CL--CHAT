'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  ciphertext: string;
  cipherVersion: string;
  createdAt: string;
}

export interface Presence {
  userId: string;
  username: string;
  status: 'online' | 'offline';
}

export function useWS() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [presence, setPresence] = useState<Presence[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);

        switch (type) {
          case 'history':
            setMessages(payload);
            break;
          case 'message':
            setMessages((prev) => [...prev, payload]);
            break;
          case 'presence':
            setPresence((prev) => {
              const exists = prev.find((p) => p.userId === payload.userId);
              if (exists) {
                return prev.map((p) => (p.userId === payload.userId ? payload : p));
              }
              return [...prev, payload];
            });
            break;
          case 'error':
            console.error('WS Error:', payload);
            break;
        }
      } catch (error) {
        console.error('Failed to parse WS message:', error);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;

      // Reconnect with exponential backoff (max 30s)
      if (reconnectAttempts.current < 10) {
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        reconnectAttempts.current++;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      }
    };

    ws.onerror = (error) => {
      console.error('WS Error:', error);
    };
  }, [WS_URL]);

  useEffect(() => {
    if (user) {
      connect();
    } else {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      setConnected(false);
      setMessages([]);
      setPresence([]);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user, connect]);

  const send = useCallback((ciphertext: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'send', payload: { ciphertext } }));
    }
  }, []);

  return { messages, presence, connected, send };
}