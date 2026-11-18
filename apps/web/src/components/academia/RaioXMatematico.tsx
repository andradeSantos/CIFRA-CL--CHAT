'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Card } from '@/components/ui/Card';

function MathBlock({ tex, display = true }: { tex: string; display?: boolean }) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
      }),
    [tex, display]
  );

  return (
    <div
      className="overflow-x-auto py-2 text-espresso dark:text-sand-light"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const PARAMS = [
  {
    symbol: 'M',
    name: 'Módulo do Alfabeto',
    detail:
      'M = 26 para validação acadêmica (A–Z) e M = 95 para o Chat Clã (todos os caracteres ASCII imprimíveis de 32 a 126).',
  },
  {
    symbol: 'a',
    name: 'Multiplicador de Dispersão',
    detail:
      'Deve ser coprimo de M, ou seja, mdc(a, M) = 1. Para M = 95 (5 × 19), a = 7 é válido; a = 5 não possui inverso modular.',
  },
  {
    symbol: 'b',
    name: 'Deslocamento Base',
    detail: 'Deslocamento constante da sala/conselho (ex.: b = 8).',
  },
  {
    symbol: 's',
    name: 'Passo Tático Posicional',
    detail:
      'Incrementa o deslocamento em s · i para cada posição i, impedindo que letras repetidas gerem o mesmo ciphertext.',
  },
];

export function RaioXMatematico() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-espresso dark:text-sand-light">
          Raio-X Matemático da CCG
        </h2>
        <p className="text-sm text-umber dark:text-ochre">
          Fundamentação em aritmética modular e inverso multiplicativo no anel{' '}
          <span className="font-mono">ℤ_M</span>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5 space-y-3">
          <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
            Função de Cifragem E(pᵢ, i)
          </h3>
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
            <MathBlock tex="c_i = (a \cdot p_i + b + s \cdot i) \bmod M" />
          </div>
          <p className="text-xs text-umber dark:text-ochre">
            Onde <span className="font-mono">pᵢ</span> é o índice do caractere na posição{' '}
            <span className="font-mono">i ∈ [0, n-1]</span>.
          </p>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
            Função de Decifragem D(cᵢ, i)
          </h3>
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
            <MathBlock tex="p_i = a^{-1} \cdot (c_i - b - s \cdot i) \bmod M" />
          </div>
          <p className="text-xs text-umber dark:text-ochre">
            Aplicando módulo seguro para valores negativos:{' '}
            <span className="font-mono">((x % M) + M) % M</span>.
          </p>
        </Card>
      </div>

      <Card className="p-5 space-y-3">
        <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
          Condição de Existência da Inversa
        </h3>
        <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
          <MathBlock tex="\gcd(a, M) = 1 \iff \exists\, a^{-1} \in \mathbb{Z}_M \text{ tal que } (a \cdot a^{-1}) \equiv 1 \pmod{M}" />
        </div>
        <p className="text-sm text-umber dark:text-sand-light/80">
          O inverso modular <span className="font-mono">a⁻¹</span> é calculado pelo{' '}
          <strong>Algoritmo de Euclides Estendido</strong>. Exemplo: para{' '}
          <span className="font-mono">a = 7, M = 95</span>, temos{' '}
          <span className="font-mono">7 × 68 = 476 = 5 × 95 + 1 ≡ 1 (mod 95)</span>, logo{' '}
          <span className="font-mono">a⁻¹ = 68</span>.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {PARAMS.map((param) => (
          <Card key={param.symbol} className="p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-terracotta/15 dark:bg-ochre/20 font-mono font-bold text-terracotta dark:text-ochre">
                {param.symbol}
              </span>
              <h4 className="font-semibold text-sm text-espresso dark:text-sand-light">
                {param.name}
              </h4>
            </div>
            <p className="text-xs text-umber dark:text-sand-light/80 leading-relaxed">
              {param.detail}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
