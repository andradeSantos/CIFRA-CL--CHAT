'use client';

import { useState } from 'react';
import { BookOpen, Sigma, Terminal, Trophy, FlaskConical } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ManualHistorico } from '@/components/academia/ManualHistorico';
import { ResumoCifra } from '@/components/academia/ResumoCifra';
import { RaioXMatematico } from '@/components/academia/RaioXMatematico';
import { SandboxLab } from '@/components/academia/SandboxLab';
import { DesafiosRecruta } from '@/components/academia/DesafiosRecruta';
import { PainelDemo } from '@/components/academia/PainelDemo';

type TabId = 'manual' | 'resumo' | 'raiox' | 'sandbox' | 'desafios' | 'demo';

const TABS: { id: TabId; label: string; icon: typeof BookOpen }[] = [
  { id: 'manual', label: '1. Manual Histórico', icon: BookOpen },
  { id: 'resumo', label: '2. Resumo da Cifra', icon: BookOpen },
  { id: 'raiox', label: '3. Raio-X Matemático', icon: Sigma },
  { id: 'sandbox', label: '4. Laboratório Sandbox', icon: Terminal },
  { id: 'desafios', label: '5. Desafios do Recruta', icon: Trophy },
  { id: 'demo', label: '6. Painel Demo', icon: FlaskConical },
];

export default function AcademiaPage() {
  const [activeTab, setActiveTab] = useState<TabId>('manual');

  return (
    <div className="min-h-screen bg-sand-light dark:bg-dark-earth flex flex-col">
      <Header />

      <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl bg-sand dark:bg-bark border border-earth-border dark:border-bordermain p-3 space-y-1">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-umber dark:text-ochre">
                Academia da Cifra
              </p>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                      isActive
                        ? 'bg-terracotta text-white dark:bg-ochre shadow-sm'
                        : 'text-umber dark:text-ochre hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === 'manual' && <ManualHistorico />}
            {activeTab === 'resumo' && <ResumoCifra />}
            {activeTab === 'raiox' && <RaioXMatematico />}
            {activeTab === 'sandbox' && <SandboxLab />}
            {activeTab === 'desafios' && <DesafiosRecruta />}
            {activeTab === 'demo' && <PainelDemo />}
          </main>
        </div>
      </div>
    </div>
  );
}
