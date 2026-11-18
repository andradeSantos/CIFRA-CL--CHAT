'use client';

import { User, Users, Shield, Activity } from 'lucide-react';
import { Presence } from '@/hooks/useWS';
import { Badge } from '@/components/ui/Badge';

interface SidebarProps {
  presence: Presence[];
  currentUserId?: string;
  className?: string;
}

export function Sidebar({ presence, currentUserId, className = '' }: SidebarProps) {
  const onlineMembers = presence.filter((p) => p.status === 'online');
  const offlineMembers = presence.filter((p) => p.status === 'offline');

  return (
    <aside className={`w-64 flex-shrink-0 bg-sand/50 dark:bg-bark/50 border-r border-earth-border dark:border-border-color flex flex-col ${className}`}>
      <div className="p-4 border-b border-earth-border dark:border-border-color">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-terracotta/10 dark:bg-ochre/10">
            <Users className="w-5 h-5 text-terracotta dark:text-ochre" />
          </div>
          <div>
            <h2 className="font-semibold text-espresso dark:text-sand-light">Membros do Clã</h2>
            <p className="text-xs text-umber dark:text-ochre">
              {onlineMembers.length} online · {presence.length} total
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {onlineMembers.length > 0 && (
          <>
            <h3 className="px-2 py-1 text-xs font-medium text-umber dark:text-ochre uppercase tracking-wider">
              Online
            </h3>
            {onlineMembers.map((member) => (
              <div
                key={member.userId}
                className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-hover dark:hover:bg-surface-hover transition-colors"
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium text-sm ${
                      member.userId === currentUserId
                        ? 'bg-terracotta text-white'
                        : 'bg-ochre/20 text-ochre dark:bg-ochre/30'
                    }`}
                  >
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  {member.userId === currentUserId && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-sand-light dark:border-dark-earth flex items-center justify-center">
                      <Activity className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-espresso dark:text-sand-light truncate">
                    {member.username}
                    {member.userId === currentUserId && <span className="ml-1 text-xs text-umber dark:text-ochre">(você)</span>}
                  </p>
                  <p className="text-xs text-umber dark:text-ochre">Online</p>
                </div>
                <Badge variant="success" className="text-[10px]">●</Badge>
              </div>
            ))}
          </>
        )}

        {offlineMembers.length > 0 && (
          <>
            <h3 className="px-2 py-1 text-xs font-medium text-umber dark:text-ochre uppercase tracking-wider">
              Offline
            </h3>
            {offlineMembers.map((member) => (
              <div
                key={member.userId}
                className="flex items-center gap-3 px-2 py-2 rounded-xl opacity-60"
              >
                <div className="w-10 h-10 rounded-xl bg-earth-border/50 dark:bg-border-color/50 flex items-center justify-center font-medium text-sm text-umber dark:text-ochre">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-espresso dark:text-sand-light truncate">{member.username}</p>
                  <p className="text-xs text-umber dark:text-ochre">Offline</p>
                </div>
              </div>
            ))}
          </>
        )}

        {presence.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-umber dark:text-ochre">
            <Shield className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-center">Nenhum membro conectado</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-earth-border dark:border-border-color">
        <div className="flex items-center gap-2 text-xs text-umber dark:text-ochre">
          <Shield className="w-4 h-4 text-terracotta dark:text-ochre" />
          <span>Cifra do Conselho de Guerra ativa</span>
        </div>
      </div>
    </aside>
  );
}