'use client';

import { motion } from 'framer-motion';
import { Scroll, Shield, BarChart3, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const TIMELINE_EVENTS = [
  {
    era: 'Antiguidade — Roma (c. 50 a.C.)',
    title: 'A Cifra de César e o Problema da Previsibilidade',
    description:
      'Júlio César protegia ordens militares deslocando cada letra por um valor fixo (b = 3). Embora eficiente para mensageiros a cavalo, possuía apenas 25 chaves possíveis.',
    weakness: 'Vulnerável à força bruta e à análise de frequência simples.',
    icon: Scroll,
  },
  {
    era: 'Idade Média — Bagdá (Século IX)',
    title: 'Al-Kindi e a Análise de Frequência',
    description:
      'O polímata Al-Kindi demonstrou que cifras monoalfabéticas preservam a distribuição estatística do idioma. Em português, letras como "A", "E" e "O" aparecem com frequência previsível.',
    weakness: 'Qualquer substituição estática (mesmo afim: a·p + b) mapeia a mesma letra para o mesmo símbolo.',
    icon: BarChart3,
  },
  {
    era: 'Conceito Tático — Cifra Afim',
    title: 'Dispersão Multiplicativa (a · p + b mod M)',
    description:
      'A adição de um multiplicador coprimo "a" embaralha a ordem alfabética antes do deslocamento "b", exigindo o inverso modular a⁻¹ para decifrar.',
    weakness: 'Ainda estática por posição: letras repetidas (como "A" em "ATAQUE") geram o mesmo caractere cifrado.',
    icon: Shield,
  },
  {
    era: 'Cifra do Conselho de Guerra (CCG)',
    title: 'Evolução Posicional com Passo Tático (s · i)',
    description:
      'A CCG resolve a repetição adicionando o termo posicional s·i à cifra afim: cᵢ = (a·pᵢ + b + s·i) mod M. Em "ATAQUE", o primeiro "A" (i=0) e o segundo "A" (i=2) produzem cifras completamente distintas.',
    weakness: 'Uso didático: demonstra confusão, difusão posicional e aritmética modular em Z_M.',
    icon: Lock,
  },
];

export function ManualHistorico() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-espresso dark:text-sand-light">
          Manual Histórico da Cifra
        </h2>
        <p className="text-sm text-umber dark:text-ochre">
          Da substituição clássica de César até a evolução posicional da Cifra do Conselho de Guerra.
        </p>
      </div>

      <div className="relative pl-6 border-l-2 border-earth-border dark:border-bordermain space-y-6">
        {TIMELINE_EVENTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative"
            >
              <span className="absolute -left-[33px] top-4 flex h-6 w-6 items-center justify-center rounded-full bg-terracotta dark:bg-ochre text-white shadow-sm">
                <Icon className="w-3.5 h-3.5" />
              </span>

              <Card className="p-5 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-terracotta dark:text-ochre">
                  {item.era}
                </span>
                <h3 className="text-lg font-semibold text-espresso dark:text-sand-light">
                  {item.title}
                </h3>
                <p className="text-sm text-umber dark:text-sand-light/80 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 border-t border-earth-border/60 dark:border-bordermain text-xs text-umber dark:text-ochre">
                  <strong className="text-espresso dark:text-sand-light">Nota técnica:</strong>{' '}
                  {item.weakness}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
