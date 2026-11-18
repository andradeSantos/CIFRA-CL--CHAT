'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { useWS } from '@/hooks/useWS';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Shield, Users, X } from 'lucide-react';

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const { messages, presence, connected, send } = useWS();
  const [mounted, setMounted] = useState(false);
  const [mobileMembersOpen, setMobileMembersOpen] = useState(false);

  const onlineCount = presence.filter((p) => p.status === 'online').length;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (authLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-light dark:bg-dark-earth">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-terracotta dark:text-ochre" />
          <p className="text-umber dark:text-ochre">Carregando Sala de Comando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-dvh min-h-screen bg-sand-light dark:bg-dark-earth flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          presence={presence}
          currentUserId={user.id}
          className="hidden md:flex"
        />

        {mobileMembersOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMembersOpen(false)}
            />
            <div className="relative z-10 w-72 max-w-[85vw] h-full bg-sand-light dark:bg-dark-earth flex flex-col shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-earth-border dark:border-border-color">
                <span className="text-sm font-semibold text-espresso dark:text-sand-light">
                  Membros Online ({onlineCount})
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMembersOpen(false)}
                  className="p-2 rounded-xl text-umber dark:text-ochre hover:bg-surface-hover"
                  aria-label="Fechar lista de membros"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar presence={presence} currentUserId={user.id} className="w-full flex-1 border-r-0" />
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="p-3 sm:p-4 border-b border-earth-border dark:border-border-color bg-sand/50 dark:bg-bark/50">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-terracotta/10 dark:bg-ochre/10 shrink-0">
                  <Shield className="w-5 h-5 text-terracotta dark:text-ochre" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-semibold text-sm sm:text-base text-espresso dark:text-sand-light truncate">
                    Sala de Comando — Clã
                  </h1>
                  <p className="text-xs text-umber dark:text-ochre truncate">
                    Mensagens protegidas pela Cifra do Conselho de Guerra
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileMembersOpen(true)}
                  className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sand dark:bg-bark border border-earth-border dark:border-border-color text-xs font-medium text-espresso dark:text-sand-light min-h-[36px]"
                  aria-label="Ver membros online"
                >
                  <Users className="w-4 h-4 text-terracotta dark:text-ochre" />
                  <span>{onlineCount}</span>
                </button>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${connected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="hidden sm:inline">{connected ? 'Conectado' : 'Conectando...'}</span>
                </span>
              </div>
            </div>
          </div>

          <MessageList messages={messages} />

          <MessageInput onSend={send} connected={connected} />
        </main>
      </div>
    </div>
  );
}