'use client';

import { useState } from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { encrypt } from '@cifra/ccg-core';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface Challenge {
  id: string;
  level: string;
  title: string;
  description: string;
  ciphertext: string;
  expectedPlaintext: string;
  hint: string;
  badge: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'iniciante',
    level: 'Nível 1 — Iniciante',
    title: 'Interceptação no Flanco (M = 26)',
    description: 'Decifre a ordem interceptada usando M = 26, a = 5, b = 8, s = 3.',
    ciphertext: 'ICOTQR',
    expectedPlaintext: 'ATAQUE',
    hint: 'Use a⁻¹ = 21 (pois 5 × 21 = 105 ≡ 1 mod 26) na fórmula pᵢ = 21·(cᵢ - 8 - 3i) mod 26.',
    badge: 'Batedor',
  },
  {
    id: 'estrategista',
    level: 'Nível 2 — Estrategista',
    title: 'Canal Tático do Clã (M = 95)',
    description: 'Decifre a mensagem ASCII usando a chave de produção: M = 95, a = 7, b = 8, s = 3.',
    ciphertext: encrypt('AVANCAR', { M: 95, a: 7, b: 8, s: 3 }),
    expectedPlaintext: 'AVANCAR',
    hint: 'Para M = 95 e a = 7, o inverso modular é a⁻¹ = 68. Pode conferir no Sandbox!',
    badge: 'Estrategista',
  },
  {
    id: 'general',
    level: 'Nível 3 — General',
    title: 'Quebra de Cifra sem Chave (M = 26)',
    description:
      'Interceptamos "ZSGOUJ" em M = 26. Sabemos que b = 8, s = 3 e "a" é um primo menor que 10.',
    ciphertext: 'ZSGOUJ',
    expectedPlaintext: 'TROPAS',
    hint: 'Teste os primos coprimos de 26 menores que 10: a ∈ {3, 5, 7}.',
    badge: 'General do Conselho',
  },
];

export function DesafiosRecruta() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, 'correct' | 'wrong' | null>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const checkAnswer = (challenge: Challenge) => {
    const attempt = (answers[challenge.id] || '').trim().toUpperCase();
    const isCorrect = attempt === challenge.expectedPlaintext;
    setResults((prev) => ({ ...prev, [challenge.id]: isCorrect ? 'correct' : 'wrong' }));
  };

  const completedCount = Object.values(results).filter((r) => r === 'correct').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-espresso dark:text-sand-light">
            Desafios do Recruta
          </h2>
          <p className="text-sm text-umber dark:text-ochre">
            Resolva os três níveis de decifragem para conquistar insígnias do Conselho.
          </p>
        </div>

        <Badge variant="default" className="px-3 py-1.5 text-xs flex items-center gap-1.5">
          <Award className="w-4 h-4 text-terracotta dark:text-ochre" />
          {completedCount}/3 concluídos
        </Badge>
      </div>

      <div className="space-y-4">
        {CHALLENGES.map((ch) => {
          const status = results[ch.id];
          return (
            <Card key={ch.id} className="p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-terracotta dark:text-ochre">
                    {ch.level}
                  </span>
                  <h3 className="text-lg font-semibold text-espresso dark:text-sand-light">
                    {ch.title}
                  </h3>
                </div>
                {status === 'correct' && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Insígnia: {ch.badge}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-umber dark:text-sand-light/80">{ch.description}</p>

              <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
                <span className="text-xs text-umber dark:text-ochre block mb-1">
                  Ciphertext interceptado:
                </span>
                <code className="font-mono text-base font-bold text-terracotta dark:text-ochre">
                  {ch.ciphertext}
                </code>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={answers[ch.id] || ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [ch.id]: e.target.value }))}
                  placeholder="Digite o plaintext decifrado..."
                  className="flex-1"
                />
                <Button type="button" onClick={() => checkAnswer(ch)}>
                  Validar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowHint((prev) => ({ ...prev, [ch.id]: !prev[ch.id] }))}
                >
                  <HelpCircle className="w-4 h-4" />
                  Dica
                </Button>
              </div>

              {showHint[ch.id] && (
                <p className="text-xs text-umber dark:text-ochre bg-sand-light dark:bg-dark-earth p-3 rounded-xl border border-earth-border dark:border-bordermain">
                  {ch.hint}
                </p>
              )}

              {status === 'correct' && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Resposta correta! Missão cumprida.
                </p>
              )}
              {status === 'wrong' && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-400">
                  <XCircle className="w-4 h-4" />
                  Ainda não confere. Verifique o inverso modular ou use o Sandbox.
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
